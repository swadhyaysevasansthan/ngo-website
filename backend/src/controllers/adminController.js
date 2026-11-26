import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { submissionReminderTemplate, } from '../utils/emailTemplates.js';

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
 * Get all participants (paginated — avoids full-table fetch on large datasets)
 * Query params: ?page=1&limit=50
 */
export const getAllParticipants = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page, 10)  || 1);
    const limit = Math.min(200, parseInt(req.query.limit, 10) || 50);
    const offset = (page - 1) * limit;

    const [dataRes, countRes] = await Promise.all([
      pool.query(
        `SELECT
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
        LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
      pool.query('SELECT COUNT(*) FROM participants'),
    ]);

    const total = parseInt(countRes.rows[0].count, 10);

    res.json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      count: dataRes.rows.length,
      data: dataRes.rows,
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
 * Single CTE query instead of 6 sequential round-trips — drastically reduces
 * per-request connection hold time and DB memory pressure.
 */
export const getDashboardStats = async (req, res) => {
  try {
    const result = await pool.query(`
      WITH base AS (
        SELECT category, has_submitted, registration_date FROM participants
      ),
      totals AS (
        SELECT
          COUNT(*)                                                        AS total_reg,
          COUNT(*) FILTER (WHERE has_submitted)                           AS total_sub,
          COUNT(*) FILTER (WHERE registration_date >= NOW() - INTERVAL '7 days')
                                                                          AS recent_reg,
          COUNT(*) FILTER (WHERE has_submitted
                             AND registration_date >= NOW() - INTERVAL '7 days')
                                                                          AS recent_sub
        FROM base
      ),
      cat_breakdown AS (
        SELECT category, COUNT(*) AS count
        FROM base
        GROUP BY category
        ORDER BY category
      ),
      sub_cat_breakdown AS (
        SELECT category, COUNT(*) AS count
        FROM base
        WHERE has_submitted
        GROUP BY category
        ORDER BY category
      )
      SELECT
        (SELECT row_to_json(totals) FROM totals)                          AS totals,
        (SELECT json_agg(cat_breakdown ORDER BY category) FROM cat_breakdown)   AS category_breakdown,
        (SELECT json_agg(sub_cat_breakdown ORDER BY category) FROM sub_cat_breakdown) AS submissions_by_category
    `);

    const { totals, category_breakdown, submissions_by_category } = result.rows[0];

    const totalReg = parseInt(totals.total_reg, 10);
    const totalSub = parseInt(totals.total_sub, 10);

    res.json({
      success: true,
      data: {
        totalRegistrations: totalReg,
        totalSubmissions: totalSub,
        pendingSubmissions: totalReg - totalSub,
        categoryBreakdown: category_breakdown || [],
        submissionsByCategory: submissions_by_category || [],
        recentRegistrations: parseInt(totals.recent_reg, 10),
        recentSubmissions: parseInt(totals.recent_sub, 10),
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
  const {
    recipients,
    templateType,
    subject,
    message,
  } = req.body;

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

    if (process.env.ENABLE_EMAILS !== 'true') {
      return res.json({
        success: true,
        message: `Emails are disabled. ${participants.length} participants would have received this email.`,
        count: participants.length,
      });
    }

    const { sendEmail } = await import('../config/email.js');

    let successCount = 0;
    let failedCount = 0;

    const batchSize = 5;

    for (let i = 0; i < participants.length; i += batchSize) {
      const batch = participants.slice(i, i + batchSize);

      const batchResults = await Promise.allSettled(
        batch.map(async (participant) => {
          let emailContent;

          switch (templateType) {
            case 'submission-reminder':
              emailContent = submissionReminderTemplate({
                fullName: participant.full_name,
                participantId: participant.participant_id,
              });
              break;

            case 'custom':
            default: {
              const personalizedMessage = message
                .replace('{name}', participant.full_name)
                .replace(
                  '{participantId}',
                  participant.participant_id
                );

              emailContent = {
                subject,
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4a7c29;">SNPC 2026</h2>

                    <p>Dear ${participant.full_name},</p>

                    ${personalizedMessage
                      .split('\n')
                      .map((line) => `<p>${line}</p>`)
                      .join('')}

                    <hr style="margin:20px 0;border:none;border-top:1px solid #ddd;">

                    <p style="font-size:12px;color:#666;">
                      Swadhyay Seva Foundation<br/>
                      Email: swadhyaysevafoundation@gmail.com<br/>
                      WhatsApp: +91 9599224323
                    </p>
                  </div>
                `,
                text: `Dear ${participant.full_name}\n\n${personalizedMessage}`,
              };
            }
          }

          console.log(
            `Sending email to ${participant.email}`
          );

          return sendEmail({
            to: participant.email,
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text,
          });
        })
      );

      batchResults.forEach((result, index) => {
        const participant = batch[index];

        if (result.status === 'fulfilled') {
          successCount++;

          console.log(
            `✓ Email sent to ${participant.email}`
          );
        } else {
          failedCount++;

          console.error(
            `✗ Failed for ${participant.email}:`,
            result.reason
          );
        }
      });

      // Resend limit = 5 requests/second
      if (i + batchSize < participants.length) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000)
        );
      }
    }

    return res.json({
      success: true,
      message: `Emails processed successfully`,
      sent: successCount,
      failed: failedCount,
      total: participants.length,
    });
  } catch (error) {
    console.error('Bulk email error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to send bulk email',
      error: error.message,
    });
  }
};

export const getEmailPreview = async (req, res) => {
  try {
    const { templateType } = req.query;

    // Get one participant for preview
    const result = await pool.query(`
      SELECT full_name, participant_id
      FROM participants
      WHERE has_submitted = false
      ORDER BY id ASC
      LIMIT 1
    `);

    const participant = result.rows[0];

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'No participants found',
      });
    }

    let template;

    switch (templateType) {
      case 'submission-reminder':
        template = submissionReminderTemplate({
          fullName: participant.full_name,
          participantId: participant.participant_id,
        });
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid template',
        });
    }

    return res.json({
      success: true,
      subject: template.subject,
      html: template.html,
    });
  } catch (error) {
    console.error('Preview error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to generate preview',
    });
  }
};