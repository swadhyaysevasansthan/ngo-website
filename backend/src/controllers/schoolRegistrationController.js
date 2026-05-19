import pool from '../config/database.js';
import { sendSneacEmail as sendEmail } from '../config/sneacEmail.js';
import { hashToken, verifyTokenRecord } from '../utils/tokenService.js';
import {
  schoolCompetitionRegistrationTemplate,
  schoolDateAllotmentTemplate,
} from '../utils/emailTemplates.js';

// ─── Shared helper ──────────────────────────────────────────

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

export const validateToken = async (req, res) => {
  const { token } = req.query;

  try {
    const row = await resolveToken(token, res);
    if (!row) return;

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

export const submitPaintingRegistration = async (req, res) => {
  const { token } = req.query;

  const {
    primaryTeacher1Name,
    primaryTeacher1Email,
    primaryTeacher1Phone,
    primaryTeacher1Designation,
    primaryTeacher2Name,
    primaryTeacher2Email,
    primaryTeacher2Phone,
    primaryTeacher2Designation,
    secondaryTeacher1Name,
    secondaryTeacher1Email,
    secondaryTeacher1Phone,
    secondaryTeacher1Designation,
    secondaryTeacher2Name,
    secondaryTeacher2Email,
    secondaryTeacher2Phone,
    secondaryTeacher2Designation,
    classCounts,
    totalParticipants,
    primaryCategoryTotal,
    secondaryCategoryTotal,
    preferredDates,
  } = req.body;

  try {
    const row = await resolveToken(token, res);
    if (!row) return;

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

    const primaryTotal =
      (parseInt(classCounts?.[3]) || 0) +
      (parseInt(classCounts?.[4]) || 0) +
      (parseInt(classCounts?.[5]) || 0);

    const secondaryTotal =
      (parseInt(classCounts?.[6]) || 0) +
      (parseInt(classCounts?.[7]) || 0) +
      (parseInt(classCounts?.[8]) || 0);

    const grandTotal = primaryTotal + secondaryTotal;

    if (primaryTotal > 150) {
      return res.status(400).json({
        success: false,
        message: 'Primary category participants cannot exceed 150.',
      });
    }

    if (secondaryTotal > 150) {
      return res.status(400).json({
        success: false,
        message: 'Secondary category participants cannot exceed 150.',
      });
    }

    if (grandTotal > 300) {
      return res.status(400).json({
        success: false,
        message: 'Total participants for the painting competition cannot exceed 300.',
      });
    }

    if (Number(totalParticipants) !== grandTotal) {
      return res.status(400).json({
        success: false,
        message: 'Total participants does not match class-wise counts.',
      });
    }

    if (Number(primaryCategoryTotal) !== primaryTotal) {
      return res.status(400).json({
        success: false,
        message: 'Primary category total does not match class-wise counts.',
      });
    }

    if (Number(secondaryCategoryTotal) !== secondaryTotal) {
      return res.status(400).json({
        success: false,
        message: 'Secondary category total does not match class-wise counts.',
      });
    }

    const result = await pool.query(
      `INSERT INTO school_competition_registrations
        (request_id, competition_type,
         primary_teacher1_name, primary_teacher1_email, primary_teacher1_phone, primary_teacher1_designation,
         primary_teacher2_name, primary_teacher2_email, primary_teacher2_phone, primary_teacher2_designation,
         secondary_teacher1_name, secondary_teacher1_email, secondary_teacher1_phone, secondary_teacher1_designation,
         secondary_teacher2_name, secondary_teacher2_email, secondary_teacher2_phone, secondary_teacher2_designation,
         class_counts, primary_category_total, secondary_category_total, total_participants, preferred_dates)
       VALUES
        ($1, 'painting',
         $2, $3, $4, $5,
         $6, $7, $8, $9,
         $10, $11, $12, $13,
         $14, $15, $16, $17,
         $18, $19, $20, $21, $22)
       RETURNING *`,
      [
        row.request_id,
        primaryTeacher1Name.trim(),
        primaryTeacher1Email.toLowerCase().trim(),
        primaryTeacher1Phone.trim(),
        primaryTeacher1Designation.trim(),
        primaryTeacher2Name.trim(),
        primaryTeacher2Email.toLowerCase().trim(),
        primaryTeacher2Phone.trim(),
        primaryTeacher2Designation.trim(),
        secondaryTeacher1Name.trim(),
        secondaryTeacher1Email.toLowerCase().trim(),
        secondaryTeacher1Phone.trim(),
        secondaryTeacher1Designation.trim(),
        secondaryTeacher2Name.trim(),
        secondaryTeacher2Email.toLowerCase().trim(),
        secondaryTeacher2Phone.trim(),
        secondaryTeacher2Designation.trim(),
        JSON.stringify(classCounts),
        primaryTotal,
        secondaryTotal,
        grandTotal,
        JSON.stringify(preferredDates),
      ]
    );

    const registration = result.rows[0];

    if (process.env.ENABLE_EMAILS === 'true') {
      const recipients = [
        row.school_email,
        primaryTeacher1Email?.toLowerCase().trim(),
        primaryTeacher2Email?.toLowerCase().trim(),
        secondaryTeacher1Email?.toLowerCase().trim(),
        secondaryTeacher2Email?.toLowerCase().trim(),
      ].filter(Boolean);

      const uniqueRecipients = [...new Set(recipients)];

      try {
        const template = schoolCompetitionRegistrationTemplate({
          schoolName: row.school_name,
          teacherName: primaryTeacher1Name,
          competitionType: 'painting',
          classCounts,
          totalParticipants: grandTotal,
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
        totalParticipants: grandTotal,
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

export const submitQuizRegistration = async (req, res) => {
  const { token } = req.query;

  const {
    primaryTeacherName,
    primaryTeacherEmail,
    primaryTeacherPhone,
    altTeacherName,
    altTeacherEmail,
    altTeacherPhone,
    classCounts,
    totalParticipants,
    availableComputers,
    preferredDates,
  } = req.body;

  try {
    const row = await resolveToken(token, res);
    if (!row) return;

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

export const listRegistrations = async (req, res) => {
  const { competitionType } = req.params;

  try {
    const result = await pool.query(
      `SELECT
         scr.id, scr.competition_type,
         scr.primary_teacher1_name, scr.primary_teacher1_email, scr.primary_teacher1_phone, scr.primary_teacher1_designation,
         scr.primary_teacher2_name, scr.primary_teacher2_email, scr.primary_teacher2_phone, scr.primary_teacher2_designation,
         scr.secondary_teacher1_name, scr.secondary_teacher1_email, scr.secondary_teacher1_phone, scr.secondary_teacher1_designation,
         scr.secondary_teacher2_name, scr.secondary_teacher2_email, scr.secondary_teacher2_phone, scr.secondary_teacher2_designation,
         scr.class_counts, scr.primary_category_total, scr.secondary_category_total,
         scr.total_participants, scr.available_computers,
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

    const recipients = [
      reg.school_email,
      reg.primary_teacher1_email,
      reg.primary_teacher2_email,
      reg.secondary_teacher1_email,
      reg.secondary_teacher2_email,
    ].filter(Boolean);

    const uniqueRecipients = [...new Set(recipients)];

    const template = schoolDateAllotmentTemplate({
      schoolName: reg.school_name,
      teacherName: reg.primary_teacher1_name,
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