import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

/**
 * Verify JWT token for judge routes.
 * Deliberately independent of verifyAdmin:
 * - signed with JWT_JUDGE_SECRET (not JWT_SECRET)
 * - requires role === 'judge' in the payload
 * - re-checks the judges table so a disabled judge is rejected
 *   even with an unexpired token
 */
export const verifyJudge = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_JUDGE_SECRET);

    if (decoded.role !== 'judge') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token type for this route.',
      });
    }

    const result = await pool.query(
      'SELECT id, username, full_name, is_active FROM judges WHERE id = $1',
      [decoded.id]
    );
    const judge = result.rows[0];

    if (!judge || !judge.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Your judge access has been disabled. Please contact the admin.',
      });
    }

    // Fire-and-forget activity timestamp; never blocks the request
    pool
      .query('UPDATE judges SET last_activity = NOW() WHERE id = $1', [judge.id])
      .catch((err) => console.error('Failed to update judge last_activity:', err));

    req.judge = judge;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};
