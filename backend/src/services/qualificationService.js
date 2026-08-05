import pool from '../config/database.js';
import { calculateConflictLevel } from './conflictDetectionService.js';

/**
 * PURE READ — total score + conflict level for every relevant entry
 * in a given round. No writes.
 *
 * Round 1 scope: every active entry in the competition.
 * Round 2 scope: only entries that qualified out of Round 1 and were
 * not disqualified during verification — matching exactly what
 * judges themselves are allowed to see/score in Round 2.
 */
export const computeRoundResults = async (competitionId, round = 1) => {
  const settingsRes = await pool.query(
    'SELECT max_score FROM evaluation_settings WHERE competition_id = $1',
    [competitionId]
  );
  const maxScore = settingsRes.rows[0]?.max_score ?? 5;

  const entriesQuery =
    round === 2
      ? `SELECT
            e.id AS entry_id,
            e.entry_number,
            e.participant_id,
            e.status,
            COALESCE(
              json_agg(s.score ORDER BY s.judge_id) FILTER (WHERE s.score IS NOT NULL),
              '[]'
            ) AS scores
         FROM evaluation_entries e
         JOIN evaluation_qualifications q ON q.entry_id = e.id
         LEFT JOIN evaluation_scores s
           ON s.entry_id = e.id AND s.round = 2
         WHERE e.competition_id = $1
           AND q.qualified = true
           AND q.verification_status != 'disqualified'
         GROUP BY e.id
         ORDER BY e.entry_number`
      : `SELECT
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
         ORDER BY e.entry_number`;

  const entriesRes = await pool.query(entriesQuery, [competitionId]);

  return entriesRes.rows.map((row) => {
    const scores = row.scores || [];
    const total = scores.reduce((sum, s) => sum + s, 0);
    const conflict = calculateConflictLevel(scores, maxScore);
    return {
      entryId: row.entry_id,
      entryNumber: row.entry_number,
      participantId: row.participant_id,
      status: row.status,
      scores,
      total,
      conflict,
      scoreCount: scores.length,
    };
  });
};

/**
 * Kept for backward compatibility — Round 1 specifically. Everything
 * below (qualification, promotion) is deliberately Round-1-only:
 * qualifying out of Round 1 is what Round 2 eligibility is based on,
 * so these never need to run against Round 2 data.
 */
export const computeRound1Results = async (competitionId) => computeRoundResults(competitionId, 1);

/**
 * Persist a results snapshot into evaluation_qualifications in a
 * single batched query (UNNEST), instead of one query per entry.
 * Only called from applyQualification / promoteNextQualifiers —
 * i.e. only when an admin explicitly triggers qualification, not on
 * every page view.
 */
const persistSnapshot = async (results) => {
  if (results.length === 0) return;
  await pool.query(
    `INSERT INTO evaluation_qualifications (entry_id, total_score, conflict_level, updated_at)
     SELECT entry_id, total_score, conflict_level, NOW()
     FROM UNNEST($1::int[], $2::int[], $3::text[]) AS t(entry_id, total_score, conflict_level)
     ON CONFLICT (entry_id)
     DO UPDATE SET total_score = EXCLUDED.total_score,
                    conflict_level = EXCLUDED.conflict_level,
                    updated_at = NOW()`,
    [results.map((r) => r.entryId), results.map((r) => r.total), results.map((r) => r.conflict)]
  );
};

/**
 * Kept for backward compatibility with any caller that wants the old
 * "compute AND persist" behavior explicitly and deliberately (not on
 * a hot read path).
 */
export const recomputeRound1Results = async (competitionId) => {
  const results = await computeRoundResults(competitionId, 1);
  await persistSnapshot(results);
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

  const results = await computeRoundResults(competitionId, 1);
  await persistSnapshot(results);

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

  const allIds = results.map((r) => r.entryId);
  const qualifiedFlags = results.map((r) => qualifiedIds.has(r.entryId));

  // Single batched update instead of one UPDATE per entry.
  await pool.query(
    `UPDATE evaluation_qualifications q
     SET qualified = t.qualified,
         verification_status = CASE
           WHEN t.qualified AND q.verification_status = 'not_applicable' THEN 'pending_verification'
           ELSE q.verification_status
         END,
         updated_at = NOW()
     FROM UNNEST($1::int[], $2::boolean[]) AS t(entry_id, qualified)
     WHERE q.entry_id = t.entry_id`,
    [allIds, qualifiedFlags]
  );

  return { qualifiedCount: qualifiedIds.size, totalEligible: eligible.length };
};

/**
 * Called after an admin marks a qualified entry as 'disqualified'
 * during verification. Backfills open slots from the next-highest
 * scoring, not-yet-qualified entries. Only meaningful for the
 * top_n qualification method (min_score has no fixed slot count).
 * neededSlots is always small (a handful), so a small per-candidate
 * loop here is fine — unlike the all-104-entries case above.
 */
export const promoteNextQualifiers = async (competitionId) => {
  const settingsRes = await pool.query(
    'SELECT * FROM evaluation_settings WHERE competition_id = $1',
    [competitionId]
  );
  const settings = settingsRes.rows[0];
  if (!settings || settings.qualification_method !== 'top_n') return { promoted: 0 };

  const results = await computeRoundResults(competitionId, 1);
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