import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Admin login
 */
export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM admins WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
    }

    const admin = result.rows[0];

    const isValidPassword = await bcrypt.compare(
      password,
      admin.password_hash
    );

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

/**
 * Get all participants (with has_submitted flag from column)
 */
export const getAllParticipants = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        participant_id,
        full_name,
        email,
        phone,
        category,
        college_name,
        course,
        year_of_study,
        city,
        state,
        payment_status,
        has_submitted,
        registration_date
      FROM participants
      ORDER BY registration_date DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch participants',
      error: error.message,
    });
  }
};

/**
 * Update "has_submitted" flag for a participant
 */
export const updateSubmissionStatus = async (req, res) => {
  const { participantId } = req.params;
  const { hasSubmitted } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE participants
      SET has_submitted = $1
      WHERE participant_id = $2
      RETURNING participant_id, full_name, has_submitted;
    `,
      [!!hasSubmitted, participantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found',
      });
    }

    res.json({
      success: true,
      message: 'Submission status updated',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update submission status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update submission status',
      error: error.message,
    });
  }
};

/**
 * Get dashboard statistics (registrations + submission status)
 */
export const getDashboardStats = async (req, res) => {
  try {
    const totalRegistrations = await pool.query(
      'SELECT COUNT(*) FROM participants'
    );

    const totalSubmitted = await pool.query(
      'SELECT COUNT(*) FROM participants WHERE has_submitted = true'
    );

    const categoryBreakdown = await pool.query(`
      SELECT category, COUNT(*) AS count
      FROM participants
      GROUP BY category
      ORDER BY category;
    `);

    const submissionsByCategory = await pool.query(`
      SELECT category, COUNT(*) AS count
      FROM participants
      WHERE has_submitted = true
      GROUP BY category
      ORDER BY category;
    `);

    const recentRegistrations = await pool.query(`
      SELECT COUNT(*) 
      FROM participants 
      WHERE registration_date >= NOW() - INTERVAL '7 days';
    `);

    const recentSubmissions = await pool.query(`
      SELECT COUNT(*) 
      FROM participants 
      WHERE has_submitted = true
        AND registration_date >= NOW() - INTERVAL '7 days';
    `);

    const totalReg = parseInt(totalRegistrations.rows[0].count, 10);
    const totalSub = parseInt(totalSubmitted.rows[0].count, 10);

    res.json({
      success: true,
      data: {
        totalRegistrations: totalReg,
        totalSubmissions: totalSub,
        pendingSubmissions: totalReg - totalSub,
        categoryBreakdown: categoryBreakdown.rows,
        submissionsByCategory: submissionsByCategory.rows,
        recentRegistrations: parseInt(
          recentRegistrations.rows[0].count,
          10
        ),
        recentSubmissions: parseInt(
          recentSubmissions.rows[0].count,
          10
        ),
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message,
    });
  }
};

/**
 * Send bulk email
 * recipients: 'all' | 'submitted' | 'pending'
 */
export const sendBulkEmail = async (req, res) => {
  const { subject, message, recipients } = req.body;

  try {
    let query =
      'SELECT email, full_name, participant_id, has_submitted FROM participants';

    if (recipients === 'submitted') {
      query += ' WHERE has_submitted = true';
    } else if (recipients === 'pending') {
      query += ' WHERE has_submitted = false';
    }

    const result = await pool.query(query);
    const participants = result.rows;

    if (!participants.length) {
      return res.json({
        success: true,
        message: 'No participants matched the selected filter',
        count: 0,
      });
    }

    // You said emails are temporarily disabled in this project.
    // If ENABLE_EMAILS is false, skip sending but report count.
    if (process.env.ENABLE_EMAILS !== 'true') {
      return res.json({
        success: true,
        message: `Emails are disabled. ${participants.length} participants would have received this email.`,
        count: participants.length,
      });
    }

    const { sendEmail } = await import('../config/email.js');

    const emailPromises = participants.map((participant) => {
      const personalizedMessage = message
        .replace('{name}', participant.full_name)
        .replace('{participantId}', participant.participant_id);

      return sendEmail({
        to: participant.email,
        subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a7c29;">SNPC 2026</h2>
            <p>Dear ${participant.full_name},</p>
            ${personalizedMessage
              .split('\n')
              .map((line) => `<p>${line}</p>`)
              .join('')}
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
            <p style="font-size: 12px; color: #666;">
              Swadhyay Seva Foundation<br>
              Email: swadhyaysevafoundation@gmail.com<br>
              WhatsApp: +91 9599224323
            </p>
          </div>
        `,
        text: `Dear ${participant.full_name},\n\n${personalizedMessage}`,
      });
    });

    await Promise.all(emailPromises);

    res.json({
      success: true,
      message: `Bulk email sent to ${participants.length} participants`,
      count: participants.length,
    });
  } catch (error) {
    console.error('Bulk email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send bulk email',
      error: error.message,
    });
  }
};
