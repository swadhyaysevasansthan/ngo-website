import pool from '../config/database.js';
import { sendEmail } from '../config/email.js';
import { generateParticipantId } from '../utils/idGenerator.js';
import { registrationEmailTemplate } from '../utils/emailTemplates.js';

export const registerParticipant = async (req, res) => {
  const {
    fullName,
    email,
    phone,
    dateOfBirth,
    age,
    city,
    state,
    collegeName,
    course,
    yearOfStudy,
    category,
    gender,
    declarationAccepted,
  } = req.body;

  try {
    // Check if email already exists
    const existingUser = await pool.query(
      'SELECT email FROM participants WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered',
      });
    }

    // Recompute age as on 1 Feb 2026 for safety
    const dob = new Date(dateOfBirth);
    const refDate = new Date('2026-02-01');
    let computedAge = refDate.getFullYear() - dob.getFullYear();
    const m = refDate.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && refDate.getDate() < dob.getDate())) {
      computedAge--;
    }
    if (computedAge < 17 || computedAge > 23) {
      return res.status(400).json({
        success: false,
        message:
          'Age must be between 17 and 23 years as on 1 February 2026',
      });
    }

    // Generate unique participant ID
    let participantId;
    let isUnique = false;

    while (!isUnique) {
      participantId = generateParticipantId();
      const checkId = await pool.query(
        'SELECT participant_id FROM participants WHERE participant_id = $1',
        [participantId]
      );
      if (checkId.rows.length === 0) {
        isUnique = true;
      }
    }

    // Insert participant into database (extended fields)
    const result = await pool.query(
      `INSERT INTO participants 
       (participant_id, full_name, email, phone, date_of_birth, age,
        gender, city, state, college_name, course, year_of_study,
        category, payment_status, declaration_accepted, has_submitted) 
       VALUES ($1, $2, $3, $4, $5, $6,
               $7, $8, $9, $10, $11, $12,
               $13, $14, $15, $16)
       RETURNING *`,
      [
        participantId,
        fullName,
        email,
        phone,
        dateOfBirth,
        computedAge,        // store computed age
        gender,
        city,
        state,
        collegeName,
        course,
        yearOfStudy,
        category?.toLowerCase(),
        true,               // payment_status = true (mock / will be true after payment)
        declarationAccepted === true || declarationAccepted === 'true',
        false,
      ]
    );

    const participant = result.rows[0];

    // EMAILS TEMPORARILY DISABLED
    // Use ENABLE_EMAILS flag to optionally send + log registration email
    let emailSuccess = false;

    if (process.env.ENABLE_EMAILS === 'true') {
      try {
        const emailTemplate = registrationEmailTemplate({
          fullName,
          participantId,
          email,
          category,
        });

        const emailResult = await sendEmail({
          to: email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          text: emailTemplate.text,
        });

        emailSuccess = !!emailResult.success;

        await pool.query(
          `INSERT INTO email_logs 
           (participant_id, email_type, recipient_email, subject, status, error_message) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            participantId,
            'registration',
            email,
            emailTemplate.subject,
            emailResult.success ? 'sent' : 'failed',
            emailResult.error || null,
          ]
        );
      } catch (err) {
        console.error('Registration email error (skipped):', err);
        // Do not fail registration if email fails
      }
    }

    res.status(201).json({
      success: true,
      message: emailSuccess
        ? 'Registration successful! Check your email for details.'
        : 'Registration successful! (Emails are currently disabled; please save your Participant ID shown on screen.)',
      data: {
        participantId,
        fullName,
        email,
        category,
        registrationDate: participant.registration_date,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
      error: error.message,
    });
  }
};

/**
 * Get participant by ID
 */
export const getParticipantById = async (req, res) => {
  const { participantId } = req.params;

  try {
    const result = await pool.query(
      `SELECT participant_id, full_name, email, phone, category, 
              registration_date, payment_status 
       FROM participants 
       WHERE participant_id = $1`,
      [participantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching participant:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch participant details',
      error: error.message,
    });
  }
};

/**
 * Verify participant login (using ID and email)
 */
export const verifyParticipant = async (req, res) => {
  const { participantId, email } = req.body;

  try {
    const result = await pool.query(
      `SELECT participant_id, full_name, email, category 
       FROM participants 
       WHERE participant_id = $1 AND email = $2`,
      [participantId, email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid participant ID or email',
      });
    }

    res.json({
      success: true,
      message: 'Verification successful',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Verification failed',
      error: error.message,
    });
  }
};
