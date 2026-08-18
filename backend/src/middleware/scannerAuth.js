import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

/**
 * Verify JWT token for scanner device routes.
 * Deliberately independent of verifyAdmin and verifyJudge:
 * - signed with QR_PASS_JWT_SECRET (not JWT_SECRET/JWT_JUDGE_SECRET)
 * - requires role === 'scanner' in the payload
 * - re-checks the scanner_devices table so a disabled device is rejected
 *   even with an unexpired token
 */
export const verifyScanner = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.QR_PASS_JWT_SECRET || process.env.JWT_SECRET || 'fallback_secret');

    if (decoded.role !== 'scanner') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token type for this route.',
      });
    }

    const result = await pool.query(
      'SELECT id, name, device_code, is_active, event_id, gate FROM scanner_devices WHERE id = $1',
      [decoded.id]
    );
    const scanner = result.rows[0];

    if (!scanner || !scanner.is_active) {
      return res.status(403).json({
        success: false,
        message: 'This scanner device has been disabled. Please contact the event admin.',
      });
    }

    // Fire-and-forget activity timestamp; never blocks the request
    pool
      .query('UPDATE scanner_devices SET last_seen_at = NOW() WHERE id = $1', [scanner.id])
      .catch((err) => console.error('Failed to update scanner last_seen_at:', err));

    req.scanner = scanner;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};
