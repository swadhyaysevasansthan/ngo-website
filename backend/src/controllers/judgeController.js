import pool from '../config/database.js';
import { getDefaultCompetition, getEntrySourceData } from './evaluationController.js';

const ROUND1 = 1;
const ROUND2 = 2;

/**
 * Entries visible to a judge for a given round:
 * - Round 1: every active entry in the competition
 * - Round 2: only entries qualified in Round 1 and not disqualified
 *   during verification
 */
const getVisibleEntries = async (competitionId, round) => {
  if (round === ROUND1) {
    const result = await pool.query(
      `SELECT id, entry_number FROM evaluation_entries
       WHERE competition_id = $1 AND status = 'active'
       ORDER BY entry_number ASC`,
      [competitionId]
    );
    return result.rows;
  }

  const result = await pool.query(
    `SELECT e.id, e.entry_number
     FROM evaluation_entries e
     JOIN evaluation_qualifications q ON q.entry_id = e.id
     WHERE e.competition_id = $1
       AND e.status = 'active'
       AND q.qualified = true
       AND q.verification_status != 'disqualified'
     ORDER BY e.entry_number ASC`,
    [competitionId]
  );
  return result.rows;
};

export const getDashboard = async (req, res) => {
  try {
    const judgeId = req.judge.id;
    const competition = await getDefaultCompetition();
    if (!competition) {
      return res.status(404).json({ success: false, message: 'No competition configured' });
    }

    const settingsRes = await pool.query(
      'SELECT * FROM evaluation_settings WHERE competition_id = $1',
      [competition.id]
    );
    const settings = settingsRes.rows[0];

    const activeRound = settings.round2_status === 'open' ? ROUND2 : ROUND1;
    const entries = await getVisibleEntries(competition.id, activeRound);

    const scoredRes = await pool.query(
      `SELECT COUNT(*) FROM evaluation_scores
       WHERE judge_id = $1 AND round = $2 AND entry_id = ANY($3::int[])`,
      [judgeId, activeRound, entries.map((e) => e.id)]
    );

    const total = entries.length;
    const reviewed = parseInt(scoredRes.rows[0].count, 10);
    const pending = total - reviewed;
    const completionPct = total > 0 ? Math.round((reviewed / total) * 100) : 0;

    res.json({
      success: true,
      data: {
        fullName: req.judge.full_name,
        round: activeRound,
        totalEntries: total,
        reviewed,
        pending,
        completionPct,
        frozen: settings.frozen,
        roundOpen: activeRound === ROUND1 ? settings.round1_status === 'open' : settings.round2_status === 'open',
        round2ScoringEnabled: settings.round2_scoring_enabled,
      },
    });
  } catch (error) {
    console.error('Judge dashboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to load dashboard', error: error.message });
  }
};

export const getEntries = async (req, res) => {
  try {
    const judgeId = req.judge.id;
    const round = parseInt(req.query.round, 10) === ROUND2 ? ROUND2 : ROUND1;
    const { status, search } = req.query;

    const competition = await getDefaultCompetition();
    if (!competition) {
      return res.status(404).json({ success: false, message: 'No competition configured' });
    }

    let entries = await getVisibleEntries(competition.id, round);

    if (search) {
      const needle = search.trim().replace(/^entry\s*#?/i, '').padStart(3, '0');
      entries = entries.filter((e) => e.entry_number.includes(needle) || e.entry_number.includes(search.trim()));
    }

    const scoresRes = await pool.query(
      `SELECT entry_id, score FROM evaluation_scores WHERE judge_id = $1 AND round = $2`,
      [judgeId, round]
    );
    const scoreMap = new Map(scoresRes.rows.map((r) => [r.entry_id, r.score]));

    let data = entries.map((e) => ({
      entryId: e.id,
      entryNumber: e.entry_number,
      myScore: scoreMap.has(e.id) ? scoreMap.get(e.id) : null,
      status: scoreMap.has(e.id) ? 'evaluated' : 'pending',
    }));

    if (status === 'pending') data = data.filter((e) => e.status === 'pending');
    if (status === 'evaluated') data = data.filter((e) => e.status === 'evaluated');

    res.json({ success: true, data, round });
  } catch (error) {
    console.error('Get entries error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch entries', error: error.message });
  }
};

export const getNextPendingEntry = async (req, res) => {
  try {
    const judgeId = req.judge.id;
    const round = parseInt(req.query.round, 10) === ROUND2 ? ROUND2 : ROUND1;

    const competition = await getDefaultCompetition();
    if (!competition) {
      return res.status(404).json({ success: false, message: 'No competition configured' });
    }
    const entries = await getVisibleEntries(competition.id, round);

    const scoresRes = await pool.query(
      `SELECT entry_id FROM evaluation_scores WHERE judge_id = $1 AND round = $2`,
      [judgeId, round]
    );
    const scoredIds = new Set(scoresRes.rows.map((r) => r.entry_id));

    const next = entries.find((e) => !scoredIds.has(e.id));

    if (!next) {
      return res.json({ success: true, data: null, message: 'All entries reviewed for this round' });
    }

    res.json({ success: true, data: { entryId: next.id, entryNumber: next.entry_number } });
  } catch (error) {
    console.error('Get next pending entry error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch next entry', error: error.message });
  }
};

export const getEntryDetail = async (req, res) => {
  try {
    const judgeId = req.judge.id;
    const { entryId } = req.params;
    const round = parseInt(req.query.round, 10) === ROUND2 ? ROUND2 : ROUND1;

    const competition = await getDefaultCompetition();
    if (!competition) {
      return res.status(404).json({ success: false, message: 'No competition configured' });
    }
    const entryRes = await pool.query(
      `SELECT * FROM evaluation_entries WHERE id = $1 AND competition_id = $2`,
      [entryId, competition.id]
    );
    const entry = entryRes.rows[0];
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }

    // Round 2 gate: entry must actually be qualified & not disqualified
    if (round === ROUND2) {
      const qualRes = await pool.query(
        `SELECT qualified, verification_status FROM evaluation_qualifications WHERE entry_id = $1`,
        [entryId]
      );
      const qual = qualRes.rows[0];
      if (!qual || !qual.qualified || qual.verification_status === 'disqualified') {
        return res.status(403).json({ success: false, message: 'This entry is not part of Round 2' });
      }
    }

    const sourceData = await getEntrySourceData(competition, entry);

    const myScoreRes = await pool.query(
      `SELECT score FROM evaluation_scores WHERE entry_id = $1 AND judge_id = $2 AND round = $3`,
      [entryId, judgeId, round]
    );
    const myScore = myScoreRes.rows[0]?.score ?? null;

    const settingsRes = await pool.query(
      'SELECT * FROM evaluation_settings WHERE competition_id = $1',
      [competition.id]
    );
    const settings = settingsRes.rows[0];

    // Determine, up front, whether this judge can currently score this
    // entry — and why not, if not — so the UI can show it before the
    // judge tries to save rather than only finding out on rejection.
    let canScore = true;
    let lockReason = null;

    if (settings.frozen) {
      canScore = false;
      lockReason = 'frozen';
    } else if (round === ROUND1 && settings.round1_status !== 'open') {
      canScore = false;
      lockReason = 'round_closed';
    } else if (round === ROUND2 && settings.round2_status !== 'open') {
      canScore = false;
      lockReason = 'round_closed';
    } else if (round === ROUND2 && !settings.round2_scoring_enabled) {
      canScore = false;
      lockReason = 'discussion_only';
    } else if (round === ROUND1 && myScore !== null && !settings.allow_reevaluation) {
      canScore = false;
      lockReason = 'reevaluation_disabled';
    }

    res.json({
      success: true,
      data: {
        entryId: entry.id,
        entryNumber: entry.entry_number,
        round,
        imageUrl: sourceData?.imageUrl || null,
        fullImageUrl: sourceData?.fullImageUrl || null,
        captureLocation: sourceData?.captureLocation || null,
        captureDate: sourceData?.captureDate || null,
        cameraModel: sourceData?.cameraModel || null,
        environmentalMessage: sourceData?.environmentalMessage || null,
        myScore,
        canScore,
        lockReason,
      },
    });
  } catch (error) {
    console.error('Get entry detail error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch entry', error: error.message });
  }
};

export const submitScore = async (req, res) => {
  try {
    const judgeId = req.judge.id;
    const { entryId } = req.params;
    const { round, score } = req.body;

    const roundNum = parseInt(round, 10);
    const scoreNum = parseInt(score, 10);

    if (![ROUND1, ROUND2].includes(roundNum)) {
      return res.status(400).json({ success: false, message: 'Invalid round' });
    }
    if (!Number.isInteger(scoreNum) || scoreNum < 0 || scoreNum > 5) {
      return res.status(400).json({ success: false, message: 'Score must be a whole number between 0 and 5' });
    }

    const competition = await getDefaultCompetition();
    if (!competition) {
      return res.status(404).json({ success: false, message: 'No competition configured' });
    }
    const settingsRes = await pool.query(
      'SELECT * FROM evaluation_settings WHERE competition_id = $1',
      [competition.id]
    );
    const settings = settingsRes.rows[0];

    if (settings.frozen) {
      return res.status(403).json({ success: false, message: 'The competition is frozen. Scoring is closed.' });
    }

    if (roundNum === ROUND1 && settings.round1_status !== 'open') {
      return res.status(403).json({ success: false, message: 'Round 1 is not currently open for scoring.' });
    }
    if (roundNum === ROUND2) {
      if (settings.round2_status !== 'open') {
        return res.status(403).json({ success: false, message: 'Round 2 is not currently open.' });
      }
      if (!settings.round2_scoring_enabled) {
        return res.status(403).json({ success: false, message: 'Round 2 is discussion-only; scoring is disabled.' });
      }
    }

    const entryRes = await pool.query(
      `SELECT * FROM evaluation_entries WHERE id = $1 AND competition_id = $2`,
      [entryId, competition.id]
    );
    const entry = entryRes.rows[0];
    if (!entry || entry.status !== 'active') {
      return res.status(404).json({ success: false, message: 'Entry not found or not active' });
    }

    const existingRes = await pool.query(
      `SELECT * FROM evaluation_scores WHERE entry_id = $1 AND judge_id = $2 AND round = $3`,
      [entryId, judgeId, roundNum]
    );
    const existing = existingRes.rows[0];

    if (existing) {
      if (roundNum === ROUND1 && !settings.allow_reevaluation) {
        return res.status(403).json({
          success: false,
          message: 'Re-evaluation is disabled. You cannot change a Round 1 score you already submitted.',
        });
      }

      await pool.query(
        `UPDATE evaluation_scores SET score = $1, updated_at = NOW() WHERE id = $2`,
        [scoreNum, existing.id]
      );
      await pool.query(
        `INSERT INTO evaluation_score_audit (entry_id, judge_id, round, old_score, new_score)
         VALUES ($1, $2, $3, $4, $5)`,
        [entryId, judgeId, roundNum, existing.score, scoreNum]
      );
    } else {
      await pool.query(
        `INSERT INTO evaluation_scores (entry_id, judge_id, round, score) VALUES ($1, $2, $3, $4)`,
        [entryId, judgeId, roundNum, scoreNum]
      );
      await pool.query(
        `INSERT INTO evaluation_score_audit (entry_id, judge_id, round, old_score, new_score)
         VALUES ($1, $2, $3, NULL, $4)`,
        [entryId, judgeId, roundNum, scoreNum]
      );
    }

    res.json({ success: true, message: 'Score saved', data: { entryId: entry.id, round: roundNum, score: scoreNum } });
  } catch (error) {
    console.error('Submit score error:', error);
    res.status(500).json({ success: false, message: 'Failed to save score', error: error.message });
  }
};

export const getProfile = async (req, res) => {
  res.json({
    success: true,
    data: { id: req.judge.id, fullName: req.judge.full_name, username: req.judge.username },
  });
};