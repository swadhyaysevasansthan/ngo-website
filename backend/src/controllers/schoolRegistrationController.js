import pool from '../config/database.js';
import { sendSneacEmail as sendEmail } from '../config/sneacEmail.js';
import { hashToken, verifyTokenRecord } from '../utils/tokenService.js';
import {
  schoolCompetitionRegistrationTemplate,
  schoolDateAllotmentTemplate,
} from '../utils/emailTemplates.js';

// ─── Shared helper ──────────────────────────────────────────

/**
 * Fetch and validate a token from the DB.
 * Returns { valid, tokenRow, requestRow } or sends error response.
 */
const resolveToken = async (rawToken, res) => {
  if (!rawToken) {
    res.status(400).json({ success: false, message: 'Registration token is required.' });
    return null;
  }

  const tokenHash = hashToken(rawToken);

  const tokenResult = await pool.query(
    `SELECT t.*, r.id AS request_id, r.school_name, r.school_email,
            r.school_address, r.city, r.state, r.board_of_education,
            r.has_eco_club, r.teacher_name, r.teacher_email,
            r.teacher_phone, r.status AS request_status
     FROM school_access_tokens t
     JOIN school_access_requests r ON r.id = t.request_id
     WHERE t.token_hash = $1`,
    [tokenHash]
  );

  if (tokenResult.rows.length === 0) {
    res.status(404).json({ success: false, message: 'Invalid registration link.' });
    return null;
  }

  const row = tokenResult.rows[0];
  const verification = verifyTokenRecord(row);

  if (!verification.valid) {
    res.status(400).json({ success: false, message: verification.reason });
    return null;
  }

  if (row.request_status !== 'approved') {
    res.status(403).json({ success: false, message: 'This school access request is not approved.' });
    return null;
  }

  return row;
};

// ─── Public ────────────────────────────────────────────────

/**
 * GET /api/school-registration/validate?token=...
 * Public — validate token and return school info + registration statuses
 */
export const validateToken = async (req, res) => {
  const { token } = req.query;

  try {
    const row = await resolveToken(token, res);
    if (!row) return;

    // Fetch existing registrations for this school
    const regResult = await pool.query(
      `SELECT competition_type, total_participants, submitted_at, allotted_date, confirmation_sent
       FROM school_competition_registrations
       WHERE request_id = $1`,
      [row.request_id]
    );

    const registrations = {};
    for (const reg of regResult.rows) {
      registrations[reg.competition_type] = reg;
    }

    res.json({
      success: true,
      data: {
        school: {
          schoolName: row.school_name,
          schoolEmail: row.school_email,
          schoolAddress: row.school_address,
          city: row.city,
          state: row.state,
          boardOfEducation: row.board_of_education,
          hasEcoClub: row.has_eco_club,
          teacherName: row.teacher_name,
          teacherEmail: row.teacher_email,
          teacherPhone: row.teacher_phone,
        },
        tokenExpiresAt: row.expires_at,
        registrations: {
          painting: registrations['painting'] || null,
          quiz: registrations['quiz'] || null,
        },
      },
    });
  } catch (error) {
    console.error('Validate token error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate registration link.',
      error: error.message,
    });
  }
};

/**
 * POST /api/school-registration/painting?token=...
 * Public — submit painting competition registration
 */
export const submitPaintingRegistration = async (req, res) => {
  const { token } = req.query;

  const {
    primaryTeacherName,
    primaryTeacherEmail,
    primaryTeacherPhone,
    altTeacherName,
    altTeacherEmail,
    altTeacherPhone,
    classCounts,       // { "3": n, "4": n, "5": n }
    totalParticipants,
    preferredDates,    // ["2026-10-15", "2026-11-02", "2026-12-10", "2027-01-20"]
  } = req.body;

  try {
    const row = await resolveToken(token, res);
    if (!row) return;

    // Check not already registered
    const existing = await pool.query(
      `SELECT id FROM school_competition_registrations
       WHERE request_id = $1 AND competition_type = 'painting'`,
      [row.request_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Your school has already submitted the painting competition registration.',
      });
    }

    // Validate total <= 200
    if (totalParticipants > 200) {
      return res.status(400).json({
        success: false,
        message: 'Total participants for the painting competition cannot exceed 200.',
      });
    }

    const result = await pool.query(
      `INSERT INTO school_competition_registrations
         (request_id, competition_type,
          primary_teacher_name, primary_teacher_email, primary_teacher_phone,
          alt_teacher_name, alt_teacher_email, alt_teacher_phone,
          class_counts, total_participants, preferred_dates)
       VALUES ($1, 'painting', $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        row.request_id,
        primaryTeacherName.trim(),
        primaryTeacherEmail.toLowerCase().trim(),
        primaryTeacherPhone.trim(),
        altTeacherName?.trim() || null,
        altTeacherEmail?.toLowerCase().trim() || null,
        altTeacherPhone?.trim() || null,
        JSON.stringify(classCounts),
        totalParticipants,
        JSON.stringify(preferredDates),
      ]
    );

    const registration = result.rows[0];

    // Send confirmation emails
    if (process.env.ENABLE_EMAILS === 'true') {
      const recipients = [
        row.school_email,
        primaryTeacherEmail.toLowerCase().trim(),
        altTeacherEmail?.toLowerCase().trim(),
      ].filter(Boolean);

      const uniqueRecipients = [...new Set(recipients)];

      try {
        const template = schoolCompetitionRegistrationTemplate({
          schoolName: row.school_name,
          teacherName: primaryTeacherName,
          competitionType: 'painting',
          classCounts,
          totalParticipants,
          availableComputers: null,
          preferredDates,
          submittedAt: registration.submitted_at,
        });

        for (const to of uniqueRecipients) {
          const emailResult = await sendEmail({
            to,
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
              'school_painting_registration',
              to,
              template.subject,
              emailResult.success ? 'sent' : 'failed',
              emailResult.error || null,
            ]
          );
        }
      } catch (err) {
        console.error('Painting registration email error (skipped):', err);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Painting competition registration submitted successfully.',
      data: {
        registrationId: registration.id,
        schoolName: row.school_name,
        competitionType: 'painting',
        totalParticipants,
        submittedAt: registration.submitted_at,
      },
    });
  } catch (error) {
    console.error('Submit painting registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit painting registration.',
      error: error.message,
    });
  }
};

/**
 * POST /api/school-registration/quiz?token=...
 * Public — submit quiz competition registration
 */
export const submitQuizRegistration = async (req, res) => {
  const { token } = req.query;

  const {
    primaryTeacherName,
    primaryTeacherEmail,
    primaryTeacherPhone,
    altTeacherName,
    altTeacherEmail,
    altTeacherPhone,
    classCounts,         // { "6": n, "7": n, "8": n }
    totalParticipants,
    availableComputers,
    preferredDates,
  } = req.body;

  try {
    const row = await resolveToken(token, res);
    if (!row) return;

    // Check not already registered
    const existing = await pool.query(
      `SELECT id FROM school_competition_registrations
       WHERE request_id = $1 AND competition_type = 'quiz'`,
      [row.request_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Your school has already submitted the quiz competition registration.',
      });
    }

    // Validate total <= 50
    if (totalParticipants > 50) {
      return res.status(400).json({
        success: false,
        message: 'Total participants for the quiz cannot exceed 50.',
      });
    }

    const result = await pool.query(
      `INSERT INTO school_competition_registrations
         (request_id, competition_type,
          primary_teacher_name, primary_teacher_email, primary_teacher_phone,
          alt_teacher_name, alt_teacher_email, alt_teacher_phone,
          class_counts, total_participants, available_computers, preferred_dates)
       VALUES ($1, 'quiz', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        row.request_id,
        primaryTeacherName.trim(),
        primaryTeacherEmail.toLowerCase().trim(),
        primaryTeacherPhone.trim(),
        altTeacherName?.trim() || null,
        altTeacherEmail?.toLowerCase().trim() || null,
        altTeacherPhone?.trim() || null,
        JSON.stringify(classCounts),
        totalParticipants,
        availableComputers,
        JSON.stringify(preferredDates),
      ]
    );

    const registration = result.rows[0];

    // Send confirmation emails
    if (process.env.ENABLE_EMAILS === 'true') {
      const recipients = [
        row.school_email,
        primaryTeacherEmail.toLowerCase().trim(),
        altTeacherEmail?.toLowerCase().trim(),
      ].filter(Boolean);

      const uniqueRecipients = [...new Set(recipients)];

      try {
        const template = schoolCompetitionRegistrationTemplate({
          schoolName: row.school_name,
          teacherName: primaryTeacherName,
          competitionType: 'quiz',
          classCounts,
          totalParticipants,
          availableComputers,
          preferredDates,
          submittedAt: registration.submitted_at,
        });

        for (const to of uniqueRecipients) {
          const emailResult = await sendEmail({
            to,
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
              'school_quiz_registration',
              to,
              template.subject,
              emailResult.success ? 'sent' : 'failed',
              emailResult.error || null,
            ]
          );
        }
      } catch (err) {
        console.error('Quiz registration email error (skipped):', err);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Quiz competition registration submitted successfully.',
      data: {
        registrationId: registration.id,
        schoolName: row.school_name,
        competitionType: 'quiz',
        totalParticipants,
        submittedAt: registration.submitted_at,
      },
    });
  } catch (error) {
    console.error('Submit quiz registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit quiz registration.',
      error: error.message,
    });
  }
};

// ─── Admin ─────────────────────────────────────────────────

/**
 * GET /api/admin/school-registration/painting
 * GET /api/admin/school-registration/quiz
 * Admin — list all registrations for a competition type
 */
export const listRegistrations = async (req, res) => {
  const { competitionType } = req.params;

  try {
    const result = await pool.query(
      `SELECT
         scr.id, scr.competition_type,
         scr.primary_teacher_name, scr.primary_teacher_email, scr.primary_teacher_phone,
         scr.alt_teacher_name, scr.alt_teacher_email, scr.alt_teacher_phone,
         scr.class_counts, scr.total_participants, scr.available_computers,
         scr.preferred_dates, scr.allotted_date,
         scr.confirmation_sent, scr.confirmation_sent_at,
         scr.submitted_at,
         r.school_name, r.school_email, r.city, r.state,
         r.board_of_education, r.has_eco_club
       FROM school_competition_registrations scr
       JOIN school_access_requests r ON r.id = scr.request_id
       WHERE scr.competition_type = $1
       ORDER BY scr.submitted_at DESC`,
      [competitionType]
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('List registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registrations.',
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/school-registration/:id
 * Admin — get full details of a single registration
 */
export const getRegistrationById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT
         scr.*,
         r.school_name, r.school_email, r.school_address,
         r.city, r.state, r.board_of_education, r.has_eco_club
       FROM school_competition_registrations scr
       JOIN school_access_requests r ON r.id = scr.request_id
       WHERE scr.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found.',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registration.',
      error: error.message,
    });
  }
};

/**
 * PATCH /api/admin/school-registration/:id/allot-date
 * Admin — save an allotted date for a registration
 */
export const allotDate = async (req, res) => {
  const { id } = req.params;
  const { allottedDate } = req.body;

  try {
    const result = await pool.query(
      `UPDATE school_competition_registrations
       SET allotted_date = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, competition_type, allotted_date`,
      [allottedDate, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found.',
      });
    }

    res.json({
      success: true,
      message: 'Date allotted successfully.',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Allot date error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to allot date.',
      error: error.message,
    });
  }
};

/**
 * POST /api/admin/school-registration/:id/send-confirmation
 * Admin — send date confirmation email to school + teachers
 */
export const sendConfirmationEmail = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT
         scr.*,
         r.school_name, r.school_email
       FROM school_competition_registrations scr
       JOIN school_access_requests r ON r.id = scr.request_id
       WHERE scr.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found.',
      });
    }

    const reg = result.rows[0];

    if (!reg.allotted_date) {
      return res.status(400).json({
        success: false,
        message: 'Please allot a date before sending the confirmation email.',
      });
    }

    // Build recipient list: school email + primary teacher + alt teacher (deduplicated)
    const recipients = [
      reg.school_email,
      reg.primary_teacher_email,
      reg.alt_teacher_email,
    ].filter(Boolean);

    const uniqueRecipients = [...new Set(recipients)];

    const template = schoolDateAllotmentTemplate({
      schoolName: reg.school_name,
      teacherName: reg.primary_teacher_name,
      competitionType: reg.competition_type,
      allottedDate: reg.allotted_date,
      totalParticipants: reg.total_participants,
    });

    let allSent = true;

    for (const to of uniqueRecipients) {
      try {
        const emailResult = await sendEmail({
          to,
          subject: template.subject,
          html: template.html,
          text: template.text,
        });

        if (!emailResult.success) allSent = false;

        await pool.query(
          `INSERT INTO email_logs
             (participant_id, email_type, recipient_email, subject, status, error_message)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            null,
            'school_date_confirmation',
            to,
            template.subject,
            emailResult.success ? 'sent' : 'failed',
            emailResult.error || null,
          ]
        );
      } catch (err) {
        allSent = false;
        console.error(`Confirmation email error for ${to} (skipped):`, err);
      }
    }

    // Mark confirmation sent
    await pool.query(
      `UPDATE school_competition_registrations
       SET confirmation_sent = true, confirmation_sent_at = NOW(), updated_at = NOW()
       WHERE id = $1`,
      [id]
    );

    res.json({
      success: true,
      message: allSent
        ? `Confirmation email sent to ${uniqueRecipients.length} recipient(s).`
        : 'Confirmation email sent with some failures. Check email logs.',
      data: {
        registrationId: id,
        recipients: uniqueRecipients,
        allottedDate: reg.allotted_date,
      },
    });
  } catch (error) {
    console.error('Send confirmation email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send confirmation email.',
      error: error.message,
    });
  }
};