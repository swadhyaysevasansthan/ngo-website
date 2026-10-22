import pool from '../config/database.js';

/**
 * GET /api/admin/quiz-settings
 * Returns all quizzes + question bank access code.
 * Admin-protected.
 */
export const getQuizSettings = async (req, res) => {
  try {
    const quizzesResult = await pool.query(
      'SELECT * FROM quiz_entries ORDER BY sort_order ASC, id ASC'
    );

    const settingResult = await pool.query(
      "SELECT value FROM app_settings WHERE key = 'question_bank_access_code'"
    );

    const questionBankCode = settingResult.rows[0]?.value ?? '';

    return res.json({
      success: true,
      data: {
        quizzes: quizzesResult.rows,
        questionBankCode,
      },
    });
  } catch (error) {
    console.error('getQuizSettings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz settings',
      error: error.message,
    });
  }
};

/**
 * GET /api/quiz-settings  (public — no admin auth)
 * Returns quiz list with access-code → quiz mapping for use on the Quiz page.
 * We intentionally return access codes here because the frontend needs them
 * to match user input; however this endpoint is only fetched at page load and
 * does not expose any sensitive personal data.
 */
export const getPublicQuizSettings = async (req, res) => {
  try {
    const quizzesResult = await pool.query(
      'SELECT id, title, description, url, duration, questions, access_code, sort_order FROM quiz_entries ORDER BY sort_order ASC, id ASC'
    );

    const settingResult = await pool.query(
      "SELECT value FROM app_settings WHERE key = 'question_bank_access_code'"
    );

    const questionBankCode = settingResult.rows[0]?.value ?? '';

    return res.json({
      success: true,
      data: {
        quizzes: quizzesResult.rows,
        questionBankCode,
      },
    });
  } catch (error) {
    console.error('getPublicQuizSettings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz settings',
      error: error.message,
    });
  }
};

/**
 * PUT /api/admin/quiz-settings
 * Body: { quizzes: [{id?, title, description, url, duration, questions, access_code, sort_order}], questionBankCode: string }
 * Replaces all quiz rows (delete + re-insert strategy) and updates question bank code.
 * Admin-protected.
 */
export const updateQuizSettings = async (req, res) => {
  const { quizzes, questionBankCode } = req.body;

  if (!Array.isArray(quizzes)) {
    return res.status(400).json({
      success: false,
      message: 'quizzes must be an array',
    });
  }

  if (typeof questionBankCode !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'questionBankCode must be a string',
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Delete all existing quizzes
    await client.query('DELETE FROM quiz_entries');

    // 2. Re-insert quizzes in submitted order
    for (let i = 0; i < quizzes.length; i++) {
      const q = quizzes[i];
      if (!q.url || !q.access_code) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          message: `Quiz at index ${i} is missing url or access_code`,
        });
      }

      await client.query(
        `INSERT INTO quiz_entries (title, description, url, duration, questions, access_code, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          q.title || 'Environmental Awareness Quiz',
          q.description || '',
          q.url,
          q.duration || '10 minutes',
          q.questions || '25 questions',
          q.access_code,
          i,
        ]
      );
    }

    // 3. Upsert question bank code
    await client.query(
      `INSERT INTO app_settings (key, value, updated_at)
       VALUES ('question_bank_access_code', $1, NOW())
       ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
      [questionBankCode]
    );

    await client.query('COMMIT');

    return res.json({
      success: true,
      message: 'Quiz settings updated successfully',
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('updateQuizSettings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update quiz settings',
      error: error.message,
    });
  } finally {
    client.release();
  }
};
