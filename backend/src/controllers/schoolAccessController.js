import pool from '../config/database.js';
import { sendSneacEmail as sendEmail } from '../config/sneacEmail.js';
import {
  generateRawToken,
  hashToken,
  calculateTokenExpiry,
  buildRegistrationLink,
} from '../utils/tokenService.js';
import {
  schoolAccessRequestReceivedTemplate,
  schoolAccessApprovedTemplate,
  schoolAccessRejectedTemplate,
} from '../utils/emailTemplates.js';

// ─── Shared helper ──────────────────────────────────────────

/**
 * Build deduplicated recipient list from multiple emails.
 */
const getRecipients = (...emails) =>
  [...new Set(emails.flat().filter(Boolean))];

// ─── Public ────────────────────────────────────────────────

/**
 * POST /api/school-access/request
 */
export const createAccessRequest = async (req, res) => {
  const {
    schoolName,
    landlineNumber,
    mobileNumber,
    schoolEmail1,
    schoolEmail2,
    schoolAddress,
    city,
    state,
    boardOfEducation,
    hasEcoClub,
    principalName,
    principalEmail,
    principalPhone,
    notes,
  } = req.body;

  try {
    const primaryEmail = schoolEmail1.toLowerCase().trim();

    const existing = await pool.query(
      `SELECT id, status FROM school_access_requests
       WHERE school_email = $1 AND status IN ('pending', 'approved')`,
      [primaryEmail]
    );

    if (existing.rows.length > 0) {
      const status = existing.rows[0].status;
      return res.status(400).json({
        success: false,
        message:
          status === 'approved'
            ? 'This school email already has an approved access request. Please check your inbox for the registration link.'
            : 'An access request for this school email is already pending review.',
      });
    }

    const result = await pool.query(
      `INSERT INTO school_access_requests
        (
          school_name,
          school_email,
          school_email_2,
          school_address,
          city,
          state,
          board_of_education,
          landline_number,
          mobile_number,
          has_eco_club,
          principal_name,
          principal_email,
          principal_phone,
          notes,
          status
        )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'pending')
       RETURNING *`,
      [
        schoolName.trim(),
        primaryEmail,
        schoolEmail2?.toLowerCase().trim(),
        schoolAddress.trim(),
        city.trim(),
        state.trim(),
        boardOfEducation.trim(),
        landlineNumber.trim(),
        mobileNumber.trim(),
        hasEcoClub === true || hasEcoClub === 'true',
        principalName.trim(),
        principalEmail?.toLowerCase().trim() || null,
        principalPhone?.trim() || null,
        notes?.trim() || null,
      ]
    );

    const request = result.rows[0];

    if (process.env.ENABLE_EMAILS === 'true') {
      try {
        const template = schoolAccessRequestReceivedTemplate({
          schoolName: request.school_name,
          teacherName: request.principal_name,
        });

        const recipients = getRecipients(
          request.school_email,
          request.school_email_2,
          request.principal_email
        );

        const emailResult = await sendEmail({
          to: recipients,
          subject: template.subject,
          html: template.html,
          text: template.text,
        });

        await pool.query(
          `INSERT INTO email_logs
             (participant_id, email_type, recipient_email, subject, status, error_message)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            null,
            'school_access_request_received',
            recipients.join(', '),
            template.subject,
            emailResult.success ? 'sent' : 'failed',
            emailResult.error || null,
          ]
        );
      } catch (err) {
        console.error('Access request acknowledgement email error (skipped):', err);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Access request submitted successfully. You will receive an email once reviewed.',
      data: { id: request.id, schoolName: request.school_name },
    });
  } catch (error) {
    console.error('Create access request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit access request. Please try again.',
      error: error.message,
    });
  }
};

// ─── Admin ─────────────────────────────────────────────────

/**
 * GET /api/admin/school-access/requests
 */
export const listAccessRequests = async (req, res) => {
  const { status, city, state, search } = req.query;

  try {
    const conditions = [];
    const values = [];
    let idx = 1;

    if (status) {
      conditions.push(`status = $${idx++}`);
      values.push(status);
    }
    if (city) {
      conditions.push(`LOWER(city) = LOWER($${idx++})`);
      values.push(city);
    }
    if (state) {
      conditions.push(`LOWER(state) = LOWER($${idx++})`);
      values.push(state);
    }
    if (search) {
      conditions.push(
        `(LOWER(school_name) LIKE $${idx} OR LOWER(school_email) LIKE $${idx} OR LOWER(school_email_2) LIKE $${idx})`
      );
      values.push(`%${search.toLowerCase()}%`);
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await pool.query(
      `SELECT
         id, school_name, school_email, school_email_2, landline_number,
         mobile_number, city, state,
         board_of_education, has_eco_club,
         principal_name, principal_email, principal_phone,
         notes, status, rejection_reason,
         created_at, updated_at
       FROM school_access_requests
       ${where}
       ORDER BY created_at DESC`,
      values
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('List access requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch access requests.',
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/school-access/requests/:id
 */
export const getAccessRequestById = async (req, res) => {
  const { id } = req.params;

  try {
    const requestResult = await pool.query(
      `SELECT * FROM school_access_requests WHERE id = $1`,
      [id]
    );

    if (requestResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Access request not found.',
      });
    }

    const tokenResult = await pool.query(
      `SELECT id, expires_at, is_used, created_at
       FROM school_access_tokens
       WHERE request_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [id]
    );

    const registrationResult = await pool.query(
      `SELECT id, competition_type, total_participants, allotted_date,
              confirmation_sent, submitted_at
       FROM school_competition_registrations
       WHERE request_id = $1`,
      [id]
    );

    res.json({
      success: true,
      data: {
        request: requestResult.rows[0],
        latestToken: tokenResult.rows[0] || null,
        registrations: registrationResult.rows,
      },
    });
  } catch (error) {
    console.error('Get access request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch access request.',
      error: error.message,
    });
  }
};

/**
 * PATCH /api/admin/school-access/requests/:id/approve
 */
export const approveAccessRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const requestResult = await pool.query(
      `SELECT * FROM school_access_requests WHERE id = $1`,
      [id]
    );

    if (requestResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Access request not found.',
      });
    }

    const request = requestResult.rows[0];

    if (request.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'This request is already approved.',
      });
    }

    await pool.query(
      `UPDATE school_access_requests
       SET status = 'approved', rejection_reason = NULL, updated_at = NOW()
       WHERE id = $1`,
      [id]
    );

    await pool.query(
      `UPDATE school_access_tokens SET is_used = true WHERE request_id = $1`,
      [id]
    );

    const rawToken = generateRawToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = calculateTokenExpiry();
    const registrationLink = buildRegistrationLink(rawToken);

    await pool.query(
      `INSERT INTO school_access_tokens
         (request_id, token_hash, expires_at, is_used)
       VALUES ($1, $2, $3, false)`,
      [id, tokenHash, expiresAt]
    );

    if (process.env.ENABLE_EMAILS === 'true') {
      try {
        const template = schoolAccessApprovedTemplate({
          schoolName: request.school_name,
          teacherName: request.principal_name,
          registrationLink,
          expiresAt,
        });

        const recipients = getRecipients(
          request.school_email,
          request.school_email_2,
          request.principal_email
        );

        const emailResult = await sendEmail({
          to: recipients,
          subject: template.subject,
          html: template.html,
          text: template.text,
        });

        await pool.query(
          `INSERT INTO email_logs
             (participant_id, email_type, recipient_email, subject, status, error_message)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            null,
            'school_access_approved',
            recipients.join(', '),
            template.subject,
            emailResult.success ? 'sent' : 'failed',
            emailResult.error || null,
          ]
        );
      } catch (err) {
        console.error('Approval email error (skipped):', err);
      }
    }

    res.json({
      success: true,
      message: 'Request approved and registration link sent.',
      data: {
        requestId: id,
        expiresAt,
        ...(process.env.ENABLE_EMAILS !== 'true' && { registrationLink }),
      },
    });
  } catch (error) {
    console.error('Approve access request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve access request.',
      error: error.message,
    });
  }
};

/**
 * PATCH /api/admin/school-access/requests/:id/reject
 */
export const rejectAccessRequest = async (req, res) => {
  const { id } = req.params;
  const { rejectionReason } = req.body;

  try {
    const requestResult = await pool.query(
      `SELECT * FROM school_access_requests WHERE id = $1`,
      [id]
    );

    if (requestResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Access request not found.',
      });
    }

    const request = requestResult.rows[0];

    await pool.query(
      `UPDATE school_access_requests
       SET status = 'rejected', rejection_reason = $1, updated_at = NOW()
       WHERE id = $2`,
      [rejectionReason?.trim() || null, id]
    );

    await pool.query(
      `UPDATE school_access_tokens SET is_used = true WHERE request_id = $1`,
      [id]
    );

    if (process.env.ENABLE_EMAILS === 'true') {
      try {
        const template = schoolAccessRejectedTemplate({
          schoolName: request.school_name,
          teacherName: request.principal_name,
          rejectionReason: rejectionReason?.trim() || null,
        });

        const recipients = getRecipients(
          request.school_email,
          request.school_email_2,
          request.principal_email
        );

        const emailResult = await sendEmail({
          to: recipients,
          subject: template.subject,
          html: template.html,
          text: template.text,
        });

        await pool.query(
          `INSERT INTO email_logs
             (participant_id, email_type, recipient_email, subject, status, error_message)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            null,
            'school_access_rejected',
            recipients.join(', '),
            template.subject,
            emailResult.success ? 'sent' : 'failed',
            emailResult.error || null,
          ]
        );
      } catch (err) {
        console.error('Rejection email error (skipped):', err);
      }
    }

    res.json({
      success: true,
      message: 'Request rejected.',
      data: { requestId: id },
    });
  } catch (error) {
    console.error('Reject access request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject access request.',
      error: error.message,
    });
  }
};

/**
 * POST /api/admin/school-access/requests/:id/resend-link
 */
export const resendMagicLink = async (req, res) => {
  const { id } = req.params;

  try {
    const requestResult = await pool.query(
      `SELECT * FROM school_access_requests WHERE id = $1`,
      [id]
    );

    if (requestResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Access request not found.',
      });
    }

    const request = requestResult.rows[0];

    if (request.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Only approved requests can have their link resent.',
      });
    }

    await pool.query(
      `UPDATE school_access_tokens SET is_used = true WHERE request_id = $1`,
      [id]
    );

    const rawToken = generateRawToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = calculateTokenExpiry();
    const registrationLink = buildRegistrationLink(rawToken);

    await pool.query(
      `INSERT INTO school_access_tokens
         (request_id, token_hash, expires_at, is_used)
       VALUES ($1, $2, $3, false)`,
      [id, tokenHash, expiresAt]
    );

    if (process.env.ENABLE_EMAILS === 'true') {
      try {
        const template = schoolAccessApprovedTemplate({
          schoolName: request.school_name,
          teacherName: request.principal_name,
          registrationLink,
          expiresAt,
        });

        const recipients = getRecipients(
          request.school_email,
          request.school_email_2,
          request.principal_email
        );

        const emailResult = await sendEmail({
          to: recipients,
          subject: template.subject,
          html: template.html,
          text: template.text,
        });

        await pool.query(
          `INSERT INTO email_logs
             (participant_id, email_type, recipient_email, subject, status, error_message)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            null,
            'school_access_link_resent',
            recipients.join(', '),
            template.subject,
            emailResult.success ? 'sent' : 'failed',
            emailResult.error || null,
          ]
        );
      } catch (err) {
        console.error('Resend link email error (skipped):', err);
      }
    }

    res.json({
      success: true,
      message: 'New registration link generated and sent.',
      data: {
        requestId: id,
        expiresAt,
        ...(process.env.ENABLE_EMAILS !== 'true' && { registrationLink }),
      },
    });
  } catch (error) {
    console.error('Resend magic link error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend registration link.',
      error: error.message,
    });
  }
};