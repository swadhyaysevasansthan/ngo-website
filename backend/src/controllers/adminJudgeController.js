import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import { generateJudgeUsername, generateJudgePassword } from '../utils/judgeCredentials.js';
import { getDefaultCompetition } from './evaluationController.js';
import { promoteNextQualifiers, recomputeRound1Results } from '../services/qualificationService.js';

const MAX_JUDGES = 5;

/**
 * Create a judge. Auto-generates username + password (shown once in
 * the response — admin is responsible for sharing it with the judge).
 */
export const createJudge = async (req, res) => {
  const { fullName } = req.body;

  if (!fullName || !fullName.trim()) {
    return res.status(400).json({ success: false, message: 'Full name is required' });
  }

  try {
    const countRes = await pool.query('SELECT COUNT(*) FROM judges');
    if (parseInt(countRes.rows[0].count, 10) >= MAX_JUDGES) {
      return res.status(400).json({
        success: false,
        message: `Only ${MAX_JUDGES} judges are allowed. Delete or disable an existing judge first.`,
      });
    }

    let username;
    let attempts = 0;
    do {
      username = generateJudgeUsername(fullName);
      attempts++;
      const existing = await pool.query('SELECT id FROM judges WHERE username = $1', [username]);
      if (existing.rows.length === 0) break;
    } while (attempts < 5);

    const rawPassword = generateJudgePassword();
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    const result = await pool.query(
      `INSERT INTO judges (full_name, username, password_hash) VALUES ($1, $2, $3)
       RETURNING id, full_name, username, is_active, created_at`,
      [fullName.trim(), username, passwordHash]
    );

    res.status(201).json({
      success: true,
      message: 'Judge created. Share these credentials with the judge now — the password will not be shown again.',
      data: { ...result.rows[0], password: rawPassword },
    });
  } catch (error) {
    console.error('Create judge error:', error);
    res.status(500).json({ success: false, message: 'Failed to create judge', error: error.message });
  }
};

export const listJudges = async (req, res) => {
  try {
    const competition = await getDefaultCompetition();

    let totalEntries = 0;
    if (competition) {
      const totalRes = await pool.query(
        `SELECT COUNT(*) FROM evaluation_entries WHERE competition_id = $1 AND status = 'active'`,
        [competition.id]
      );
      totalEntries = parseInt(totalRes.rows[0].count, 10);
    }

    // Single aggregated query instead of one query per judge (N+1).
    const judgesRes = await pool.query(
      `SELECT
          j.id, j.full_name, j.username, j.is_active, j.last_login, j.last_activity, j.created_at,
          COUNT(s.id) FILTER (WHERE s.round = 1 AND e.competition_id = $1) AS reviewed
       FROM judges j
       LEFT JOIN evaluation_scores s ON s.judge_id = j.id
       LEFT JOIN evaluation_entries e ON e.id = s.entry_id
       GROUP BY j.id
       ORDER BY j.id ASC`,
      [competition?.id ?? null]
    );

    const data = judgesRes.rows.map((judge) => {
      const reviewed = parseInt(judge.reviewed, 10);
      return {
        ...judge,
        reviewed,
        pending: totalEntries - reviewed,
        completionPct: totalEntries > 0 ? Math.round((reviewed / totalEntries) * 100) : 0,
      };
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error('List judges error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch judges', error: error.message });
  }
};

export const updateJudge = async (req, res) => {
  const { id } = req.params;
  const { fullName } = req.body;

  if (!fullName || !fullName.trim()) {
    return res.status(400).json({ success: false, message: 'Full name is required' });
  }

  try {
    const result = await pool.query(
      `UPDATE judges SET full_name = $1, updated_at = NOW() WHERE id = $2
       RETURNING id, full_name, username, is_active`,
      [fullName.trim(), id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Judge not found' });
    }
    res.json({ success: true, message: 'Judge updated', data: result.rows[0] });
  } catch (error) {
    console.error('Update judge error:', error);
    res.status(500).json({ success: false, message: 'Failed to update judge', error: error.message });
  }
};

export const deleteJudge = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM judges WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Judge not found' });
    }
    res.json({ success: true, message: 'Judge deleted' });
  } catch (error) {
    console.error('Delete judge error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete judge', error: error.message });
  }
};

export const toggleJudgeActive = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  try {
    const result = await pool.query(
      `UPDATE judges SET is_active = $1, updated_at = NOW() WHERE id = $2
       RETURNING id, full_name, username, is_active`,
      [!!isActive, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Judge not found' });
    }
    res.json({ success: true, message: isActive ? 'Judge enabled' : 'Judge disabled', data: result.rows[0] });
  } catch (error) {
    console.error('Toggle judge active error:', error);
    res.status(500).json({ success: false, message: 'Failed to update judge status', error: error.message });
  }
};

export const resetJudgePassword = async (req, res) => {
  const { id } = req.params;
  try {
    const rawPassword = generateJudgePassword();
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    const result = await pool.query(
      `UPDATE judges SET password_hash = $1, updated_at = NOW() WHERE id = $2
       RETURNING id, full_name, username`,
      [passwordHash, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Judge not found' });
    }

    res.json({
      success: true,
      message: 'Password reset. Share the new password with the judge now — it will not be shown again.',
      data: { ...result.rows[0], password: rawPassword },
    });
  } catch (error) {
    console.error('Reset judge password error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset password', error: error.message });
  }
};

/**
 * Verification queue: qualified entries awaiting identity verification.
 */
export const getVerificationQueue = async (req, res) => {
  try {
    const competition = await getDefaultCompetition();
    if (!competition) {
      return res.status(404).json({ success: false, message: 'No competition configured' });
    }

    const result = await pool.query(
      `SELECT e.id AS entry_id, e.entry_number, e.participant_id, p.full_name, p.email, p.phone,
              q.total_score, q.conflict_level, q.verification_status
       FROM evaluation_qualifications q
       JOIN evaluation_entries e ON e.id = q.entry_id
       JOIN participants p ON p.participant_id = e.participant_id
       WHERE e.competition_id = $1 AND q.qualified = true
       ORDER BY q.total_score DESC`,
      [competition.id]
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get verification queue error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch verification queue', error: error.message });
  }
};

const VALID_VERIFICATION_STATUSES = ['pending_verification', 'verified', 'disqualified', 'needs_clarification'];

export const updateVerificationStatus = async (req, res) => {
  const { entryId } = req.params;
  const { status } = req.body;

  if (!VALID_VERIFICATION_STATUSES.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid verification status' });
  }

  try {
    const competition = await getDefaultCompetition();
    if (!competition) {
      return res.status(404).json({ success: false, message: 'No competition configured' });
    }
    const settingsRes = await pool.query(
      'SELECT verification_status FROM evaluation_settings WHERE competition_id = $1',
      [competition.id]
    );
    if (settingsRes.rows[0]?.verification_status !== 'open') {
      return res.status(403).json({
        success: false,
        message: 'Verification is currently closed. Open it from Settings before updating verification status.',
      });
    }

    const result = await pool.query(
      `UPDATE evaluation_qualifications SET verification_status = $1, updated_at = NOW()
       WHERE entry_id = $2 RETURNING *`,
      [status, entryId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Entry not found in qualification list' });
    }

    let promoted = { promoted: 0 };
    if (status === 'disqualified') {
      promoted = await promoteNextQualifiers(competition.id);
    }

    res.json({
      success: true,
      message: 'Verification status updated',
      data: result.rows[0],
      autoPromoted: promoted.promoted,
    });
  } catch (error) {
    console.error('Update verification status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update verification status', error: error.message });
  }
};

/**
 * Round 1 Results panel "Disqualify" button — marks the entry itself
 * disqualified (excluded from totals/qualification entirely), distinct
 * from a post-verification identity disqualification.
 */
export const disqualifyEntry = async (req, res) => {
  const { entryId } = req.params;
  try {
    const result = await pool.query(
      `UPDATE evaluation_entries SET status = 'disqualified' WHERE id = $1 RETURNING *`,
      [entryId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }

    const competition = await getDefaultCompetition();
    await recomputeRound1Results(competition.id);
    const promoted = await promoteNextQualifiers(competition.id);

    res.json({ success: true, message: 'Entry disqualified', autoPromoted: promoted.promoted });
  } catch (error) {
    console.error('Disqualify entry error:', error);
    res.status(500).json({ success: false, message: 'Failed to disqualify entry', error: error.message });
  }
};

export const requalifyEntry = async (req, res) => {
  const { entryId } = req.params;
  try {
    const result = await pool.query(
      `UPDATE evaluation_entries SET status = 'active' WHERE id = $1 RETURNING *`,
      [entryId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }
    res.json({ success: true, message: 'Entry reinstated' });
  } catch (error) {
    console.error('Requalify entry error:', error);
    res.status(500).json({ success: false, message: 'Failed to reinstate entry', error: error.message });
  }
};

/**
 * Winners — manual only, ever. First/Second/Third are singletons;
 * Consolation must total exactly 5 (enforced here, not in the DB,
 * since Postgres can't easily express "exactly N of this value").
 */
export const getWinners = async (req, res) => {
  try {
    const competition = await getDefaultCompetition();
    if (!competition) {
      return res.status(404).json({ success: false, message: 'No competition configured' });
    }
    const result = await pool.query(
      `SELECT w.id, w.prize_type, w.assigned_at, w.entry_id, e.entry_number, e.participant_id, p.full_name
       FROM evaluation_winners w
       JOIN evaluation_entries e ON e.id = w.entry_id
       JOIN participants p ON p.participant_id = e.participant_id
       WHERE w.competition_id = $1
       ORDER BY CASE w.prize_type
         WHEN 'first' THEN 1 WHEN 'second' THEN 2 WHEN 'third' THEN 3 ELSE 4 END, w.assigned_at ASC`,
      [competition.id]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get winners error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch winners', error: error.message });
  }
};

const SINGLETON_PRIZES = ['first', 'second', 'third'];
const MAX_CONSOLATION = 5;

export const assignWinner = async (req, res) => {
  const { entryId, prizeType } = req.body;

  if (!['first', 'second', 'third', 'consolation'].includes(prizeType)) {
    return res.status(400).json({ success: false, message: 'Invalid prize type' });
  }

  try {
    const competition = await getDefaultCompetition();
    if (!competition) {
      return res.status(404).json({ success: false, message: 'No competition configured' });
    }

    if (SINGLETON_PRIZES.includes(prizeType)) {
      const existing = await pool.query(
        `SELECT id FROM evaluation_winners WHERE competition_id = $1 AND prize_type = $2`,
        [competition.id, prizeType]
      );
      if (existing.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: `${prizeType} prize is already assigned. Remove it first to reassign.`,
        });
      }
    } else {
      const countRes = await pool.query(
        `SELECT COUNT(*) FROM evaluation_winners WHERE competition_id = $1 AND prize_type = 'consolation'`,
        [competition.id]
      );
      if (parseInt(countRes.rows[0].count, 10) >= MAX_CONSOLATION) {
        return res.status(400).json({
          success: false,
          message: `Exactly ${MAX_CONSOLATION} consolation prizes are allowed. Remove one first to reassign.`,
        });
      }
    }

    const result = await pool.query(
      `INSERT INTO evaluation_winners (competition_id, entry_id, prize_type) VALUES ($1, $2, $3)
       ON CONFLICT (competition_id, entry_id) DO UPDATE SET prize_type = $3, assigned_at = NOW()
       RETURNING *`,
      [competition.id, entryId, prizeType]
    );

    res.json({ success: true, message: 'Winner assigned', data: result.rows[0] });
  } catch (error) {
    console.error('Assign winner error:', error);
    res.status(500).json({ success: false, message: 'Failed to assign winner', error: error.message });
  }
};

export const removeWinner = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM evaluation_winners WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Winner assignment not found' });
    }
    res.json({ success: true, message: 'Winner assignment removed' });
  } catch (error) {
    console.error('Remove winner error:', error);
    res.status(500).json({ success: false, message: 'Failed to remove winner', error: error.message });
  }
};