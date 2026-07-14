import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Judge login. Fully separate from adminLogin — own table, own secret.
 */
export const judgeLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM judges WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const judge = result.rows[0];

    if (!judge.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Your access has been disabled. Please contact the competition admin.',
      });
    }

    const isValidPassword = await bcrypt.compare(password, judge.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: judge.id, username: judge.username, role: 'judge' },
      process.env.JWT_JUDGE_SECRET,
      { expiresIn: '12h' }
    );

    await pool.query('UPDATE judges SET last_login = NOW(), last_activity = NOW() WHERE id = $1', [judge.id]);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      judge: {
        id: judge.id,
        fullName: judge.full_name,
        username: judge.username,
      },
    });
  } catch (error) {
    console.error('Judge login error:', error);
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};
