import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Scanner device login. Separate table and secret from admin/judge logins.
 */
export const scannerLogin = async (req, res) => {
  const { deviceCode, password } = req.body;

  if (!deviceCode || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Device code and password are required' 
    });
  }

  try {
    const result = await pool.query('SELECT * FROM scanner_devices WHERE device_code = $1', [deviceCode]);

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid device code or password' });
    }

    const scanner = result.rows[0];

    if (!scanner.is_active) {
      return res.status(403).json({
        success: false,
        message: 'This scanner device has been disabled. Please contact the event admin.',
      });
    }

    const isValidPassword = await bcrypt.compare(password, scanner.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid device code or password' });
    }

    const token = jwt.sign(
      { id: scanner.id, deviceCode: scanner.device_code, role: 'scanner' },
      process.env.QR_PASS_JWT_SECRET || process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '12h' }
    );

    await pool.query(
      'UPDATE scanner_devices SET last_seen_at = NOW() WHERE id = $1', 
      [scanner.id]
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      scanner: {
        id: scanner.id,
        name: scanner.name,
        deviceCode: scanner.device_code,
        eventId: scanner.event_id,
        gate: scanner.gate
      },
    });
  } catch (error) {
    console.error('Scanner login error:', error);
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};

/**
 * Get current scanner device profile details.
 */
export const scannerMe = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT sd.id, sd.name, sd.device_code, sd.event_id, sd.gate, e.name as event_name, e.status as event_status
       FROM scanner_devices sd
       LEFT JOIN events e ON sd.event_id = e.id
       WHERE sd.id = $1`,
      [req.scanner.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Scanner device not found' });
    }

    res.json({
      success: true,
      scanner: result.rows[0]
    });
  } catch (error) {
    console.error('Scanner me error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve scanner profile' });
  }
};
