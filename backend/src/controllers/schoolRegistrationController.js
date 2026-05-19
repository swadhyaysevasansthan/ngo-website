
import pool from '../config/database.js';
import { sendSneacEmail as sendEmail } from '../config/sneacEmail.js';
import { hashToken, verifyTokenRecord } from '../utils/tokenService.js';
import {
  schoolCompetitionRegistrationTemplate,
  schoolDateAllotmentTemplate,
} from '../utils/emailTemplates.js';

const resolveToken = async (rawToken, res) => {
  if (!rawToken) {
    res.status(400).json({
      success: false,
      message: 'Registration token is required.',
    });

    return null;
  }

  const tokenHash = hashToken(rawToken);

  const tokenResult = await pool.query(
    `SELECT
      t.*,
      r.id AS request_id,
      r.school_name,
      r.school_email,
      r.school_address,
      r.city,
      r.state,
      r.board_of_education,
      r.has_eco_club,
      r.principal_name,
      r.principal_email,
      r.principal_phone,
      r.status AS request_status

     FROM school_access_tokens t

     JOIN school_access_requests r
     ON r.id = t.request_id

     WHERE t.token_hash = $1`,
    [tokenHash]
  );

  if (tokenResult.rows.length === 0) {
    res.status(404).json({
      success: false,
      message: 'Invalid registration link.',
    });

    return null;
  }

  const row = tokenResult.rows[0];

  const verification = verifyTokenRecord(row);

  if (!verification.valid) {
    res.status(400).json({
      success: false,
      message: verification.reason,
    });

    return null;
  }

  if (row.request_status !== 'approved') {
    res.status(403).json({
      success: false,
      message: 'This school access request is not approved.',
    });

    return null;
  }

  return row;
};

const insertTeachers = async (client, registrationId, teachers = []) => {
  for (const teacher of teachers) {
    await client.query(
      `INSERT INTO competition_registration_teachers (
        registration_id,
        category,
        role,
        teacher_name,
        teacher_email,
        teacher_phone,
        designation
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        registrationId,
        teacher.category || null,
        teacher.role || null,
        teacher.name?.trim(),
        teacher.email?.toLowerCase().trim() || null,
        teacher.phone?.trim() || null,
        teacher.designation?.trim() || null,
      ]
    );
  }
};

const getRegistrationTeachers = async (registrationId) => {
  const result = await pool.query(
    `SELECT *
     FROM competition_registration_teachers
     WHERE registration_id = $1
     ORDER BY id ASC`,
    [registrationId]
  );

  return result.rows;
};

export const validateToken = async (req, res) => {
  const { token } = req.query;

  try {
    const row = await resolveToken(token, res);

    if (!row) return;

    const regResult = await pool.query(
      `SELECT
        competition_type,
        total_participants,
        submitted_at,
        allotted_date,
        confirmation_sent

       FROM school_competition_registrations
       WHERE request_id = $1`,
      [row.request_id]
    );

    const registrations = {};

    for (const reg of regResult.rows) {
      registrations[reg.competition_type] = reg;
    }

    return res.json({
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
          principalName: row.principal_name,
          principalEmail: row.principal_email,
          principalPhone: row.principal_phone,
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

    return res.status(500).json({
      success: false,
      message: 'Failed to validate registration link.',
      error: error.message,
    });
  }
};

export const submitPaintingRegistration = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { token } = req.query;

    const {
      teachers,
      classCounts,
      totalParticipants,
      primaryCategoryTotal,
      secondaryCategoryTotal,
      preferredDates,
    } = req.body;

    const row = await resolveToken(token, res);

    if (!row) {
      await client.query('ROLLBACK');
      return;
    }

    const existing = await client.query(
      `SELECT id
       FROM school_competition_registrations
       WHERE request_id = $1
       AND competition_type = 'painting'`,
      [row.request_id]
    );

    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');

      return res.status(400).json({
        success: false,
        message: 'Your school has already submitted the painting competition registration.',
      });
    }

    const registrationResult = await client.query(
      `INSERT INTO school_competition_registrations (
        request_id,
        competition_type,
        class_counts,
        primary_category_total,
        secondary_category_total,
        total_participants,
        preferred_dates
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [
        row.request_id,
        'painting',
        JSON.stringify(classCounts),
        primaryCategoryTotal,
        secondaryCategoryTotal,
        totalParticipants,
        JSON.stringify(preferredDates),
      ]
    );

    const registration = registrationResult.rows[0];

    await insertTeachers(client, registration.id, teachers);

    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      message: 'Painting competition registration submitted successfully.',
      data: registration,
    });
  } catch (error) {
    await client.query('ROLLBACK');

    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Failed to submit painting registration.',
      error: error.message,
    });
  } finally {
    client.release();
  }
};

export const submitQuizRegistration = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { token } = req.query;

    const {
      teachers,
      classCounts,
      totalParticipants,
      availableComputers,
      preferredDates,
    } = req.body;

    const row = await resolveToken(token, res);

    if (!row) {
      await client.query('ROLLBACK');
      return;
    }

    const existing = await client.query(
      `SELECT id
       FROM school_competition_registrations
       WHERE request_id = $1
       AND competition_type = 'quiz'`,
      [row.request_id]
    );

    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');

      return res.status(400).json({
        success: false,
        message: 'Your school has already submitted the quiz competition registration.',
      });
    }

    const registrationResult = await client.query(
      `INSERT INTO school_competition_registrations (
        request_id,
        competition_type,
        class_counts,
        total_participants,
        available_computers,
        preferred_dates
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [
        row.request_id,
        'quiz',
        JSON.stringify(classCounts),
        totalParticipants,
        availableComputers,
        JSON.stringify(preferredDates),
      ]
    );

    const registration = registrationResult.rows[0];

    await insertTeachers(client, registration.id, teachers);

    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      message: 'Quiz competition registration submitted successfully.',
      data: registration,
    });
  } catch (error) {
    await client.query('ROLLBACK');

    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Failed to submit quiz registration.',
      error: error.message,
    });
  } finally {
    client.release();
  }
};

export const listRegistrations = async (req, res) => {
  const { competitionType } = req.params;

  try {
    const result = await pool.query(
      `SELECT
        scr.*,
        r.school_name,
        r.school_email,
        r.city,
        r.state,
        r.board_of_education

       FROM school_competition_registrations scr

       JOIN school_access_requests r
       ON r.id = scr.request_id

       WHERE scr.competition_type = $1

       ORDER BY scr.submitted_at DESC`,
      [competitionType]
    );

    const registrations = [];

    for (const registration of result.rows) {
      const teachers = await getRegistrationTeachers(registration.id);

      registrations.push({
        ...registration,
        teachers,
      });
    }

    return res.json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch registrations.',
      error: error.message,
    });
  }
};
