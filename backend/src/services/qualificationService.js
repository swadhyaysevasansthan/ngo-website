import pool from '../config/database.js';
import { calculateConflictLevel } from './conflictDetectionService.js';

/**
 * PURE READ — total score + conflict level for every entry in a
 * competition's Round 1. No writes. Two queries total regardless of
 * entry count, safe to call on every page load (Results, Conflicts,
 * dashboards). This used to also UPSERT a row per entry inside the
 * loop, which meant every read caused N sequential round trips to
 * the DB (104 entries = 104 queries just to render a table) — that
 * was the actual cause of the multi-second load times.
 */
export const computeRound1Results = async (competitionId) => {
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

  return entriesRes.rows.map((row) => {
    const scores = row.scores || [];
    const total = scores.reduce((sum, s) => sum + s, 0);
    const conflict = calculateConflictLevel(scores);
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
  const results = await computeRound1Results(competitionId);
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

  const results = await computeRound1Results(competitionId);
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

  const results = await computeRound1Results(competitionId);
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