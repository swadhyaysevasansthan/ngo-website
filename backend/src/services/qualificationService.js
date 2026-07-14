import pool from '../config/database.js';
import { calculateConflictLevel } from './conflictDetectionService.js';

/**
 * Recompute total score + conflict level for every active entry in a
 * competition's Round 1, and persist into evaluation_qualifications.
 * Returns the computed rows (entry_id, entry_number, participant_id,
 * status, total, conflict, scoreCount) for callers that need them
 * immediately (e.g. applyQualification, results endpoint).
 */
export const recomputeRound1Results = async (competitionId) => {
  const entriesRes = await pool.query(
    `SELECT
        e.id AS entry_id,
        e.entry_number,
        e.participant_id,
        e.status,
        COALESCE(
          json_agg(s.score ORDER BY s.judge_id) FILTER (WHERE s.score IS NOT NULL),
          '[]'
        ) AS scores
     FROM evaluation_entries e
     LEFT JOIN evaluation_scores s
       ON s.entry_id = e.id AND s.round = 1
     WHERE e.competition_id = $1
     GROUP BY e.id
     ORDER BY e.entry_number`,
    [competitionId]
  );

  const results = [];

  for (const row of entriesRes.rows) {
    const scores = row.scores || [];
    const total = scores.reduce((sum, s) => sum + s, 0);
    const conflict = calculateConflictLevel(scores);

    results.push({
      entryId: row.entry_id,
      entryNumber: row.entry_number,
      participantId: row.participant_id,
      status: row.status,
      scores,
      total,
      conflict,
      scoreCount: scores.length,
    });

    await pool.query(
      `INSERT INTO evaluation_qualifications (entry_id, total_score, conflict_level, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (entry_id)
       DO UPDATE SET total_score = $2, conflict_level = $3, updated_at = NOW()`,
      [row.entry_id, total, conflict]
    );
  }

  return results;
};

/**
 * Apply the competition's qualification method (top_n or min_score)
 * to Round 1 results. Marks qualifying entries as qualified +
 * pending_verification. Disqualified entries (status='disqualified')
 * are always excluded regardless of score.
 */
export const applyQualification = async (competitionId) => {
  const settingsRes = await pool.query(
    'SELECT * FROM evaluation_settings WHERE competition_id = $1',
    [competitionId]
  );
  const settings = settingsRes.rows[0];
  if (!settings) throw new Error('Competition settings not found');

  const results = await recomputeRound1Results(competitionId);
  const eligible = results
    .filter((r) => r.status !== 'disqualified')
    .sort((a, b) => b.total - a.total);

  let qualifiedIds;
  if (settings.qualification_method === 'top_n') {
    qualifiedIds = new Set(
      eligible.slice(0, settings.qualification_value).map((r) => r.entryId)
    );
  } else {
    qualifiedIds = new Set(
      eligible.filter((r) => r.total >= settings.qualification_value).map((r) => r.entryId)
    );
  }

  for (const r of results) {
    const qualified = qualifiedIds.has(r.entryId);
    await pool.query(
      `UPDATE evaluation_qualifications
       SET qualified = $1,
           verification_status = CASE
             WHEN $1 AND verification_status = 'not_applicable' THEN 'pending_verification'
             ELSE verification_status
           END,
           updated_at = NOW()
       WHERE entry_id = $2`,
      [qualified, r.entryId]
    );
  }

  return { qualifiedCount: qualifiedIds.size, totalEligible: eligible.length };
};

/**
 * Called after an admin marks a qualified entry as 'disqualified'
 * during verification. Backfills open slots from the next-highest
 * scoring, not-yet-qualified entries. Only meaningful for the
 * top_n qualification method (min_score has no fixed slot count).
 */
export const promoteNextQualifiers = async (competitionId) => {
  const settingsRes = await pool.query(
    'SELECT * FROM evaluation_settings WHERE competition_id = $1',
    [competitionId]
  );
  const settings = settingsRes.rows[0];
  if (!settings || settings.qualification_method !== 'top_n') return { promoted: 0 };

  const results = await recomputeRound1Results(competitionId);
  const eligible = results
    .filter((r) => r.status !== 'disqualified')
    .sort((a, b) => b.total - a.total);

  const qualRes = await pool.query(
    `SELECT q.entry_id, q.qualified, q.verification_status
     FROM evaluation_qualifications q
     JOIN evaluation_entries e ON e.id = q.entry_id
     WHERE e.competition_id = $1`,
    [competitionId]
  );
  const qualMap = new Map(qualRes.rows.map((r) => [r.entry_id, r]));

  const activeQualifiedCount = eligible.filter((r) => {
    const q = qualMap.get(r.entryId);
    return q && q.qualified && q.verification_status !== 'disqualified';
  }).length;

  const neededSlots = settings.qualification_value - activeQualifiedCount;
  if (neededSlots <= 0) return { promoted: 0 };

  const candidates = eligible.filter((r) => {
    const q = qualMap.get(r.entryId);
    return !q || !q.qualified;
  });

  let promoted = 0;
  for (let i = 0; i < neededSlots && i < candidates.length; i++) {
    const candidate = candidates[i];
    await pool.query(
      `INSERT INTO evaluation_qualifications (entry_id, total_score, conflict_level, qualified, verification_status, updated_at)
       VALUES ($1, $2, $3, true, 'pending_verification', NOW())
       ON CONFLICT (entry_id)
       DO UPDATE SET qualified = true, verification_status = 'pending_verification', updated_at = NOW()`,
      [candidate.entryId, candidate.total, candidate.conflict]
    );
    promoted++;
  }

  return { promoted };
};
