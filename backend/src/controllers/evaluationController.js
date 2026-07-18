import pool from '../config/database.js';
import { computeRound1Results, applyQualification } from '../services/qualificationService.js';
import { buildResultsCSV, buildResultsExcel, buildResultsPDF } from '../services/reportService.js';

/**
 * Single-tenant helper for now: the module is architected to support
 * multiple evaluation_competitions rows (see migration), but the
 * frontend only drives one competition today. Falls back to the
 * seeded 'snpc2026-photography' competition if none is specified.
 */
export const getDefaultCompetition = async () => {
  const result = await pool.query(
    `SELECT * FROM evaluation_competitions ORDER BY id ASC LIMIT 1`
  );
  return result.rows[0] || null;
};

/**
 * Insert a Cloudinary transformation into an /upload/ URL.
 * Camera-original photos are frequently 5-20MB; serving them
 * untouched was the actual cause of slow image loads in both the
 * judge evaluation modal and the admin photo viewer. w_*,q_auto,f_auto
 * caps dimensions and lets Cloudinary pick optimal format/quality —
 * usually a 90%+ size reduction with no visible quality loss on screen.
 */
const applyCloudinaryTransform = (url, transform) => {
  if (!url || !url.includes('/upload/')) return url;
  return url.replace('/upload/', `/upload/${transform}/`);
};

/**
 * Adapter: given a competition + entry, fetch the raw source data
 * (image URL, capture metadata) from whichever table the competition
 * declares as its source_table. Only 'submissions' (photography) is
 * implemented today; add a branch here for future competition types
 * (e.g. painting) without touching any evaluation_* table.
 *
 * Returns two image URLs: `imageUrl` (capped ~1600px, for inline
 * display) and `fullImageUrl` (capped ~2400px, for the fullscreen
 * viewer) — both far smaller than the untouched original but still
 * plenty sharp on any screen.
 */
export const getEntrySourceData = async (competition, entry) => {
  if (competition.source_table === 'submissions') {
    const result = await pool.query(
      `SELECT s.capture_location, s.capture_date, s.camera_model, s.cloudinary_url,
              s.file_path, p.category
       FROM submissions s
       JOIN participants p ON p.participant_id = s.participant_id
       WHERE s.id = $1`,
      [entry.source_id]
    );
    const row = result.rows[0];
    if (!row) return null;
    return {
      imageUrl: row.cloudinary_url ? applyCloudinaryTransform(row.cloudinary_url, 'w_1600,q_auto,f_auto') : null,
      fullImageUrl: row.cloudinary_url ? applyCloudinaryTransform(row.cloudinary_url, 'w_2400,q_auto,f_auto') : null,
      captureLocation: row.capture_location,
      captureDate: row.capture_date,
      cameraModel: row.camera_model,
      category: row.category || null,
      environmentalMessage: row.environmental_message || null,
    };
  }
  return null;
};

/**
 * Create evaluation_entries for any submissions not yet mapped into
 * the anonymized layer. Idempotent — safe to call repeatedly.
 * Entry numbers continue sequentially from the current max.
 */
/**
 * Admin-only: fetch the photo + full (unmasked) context for a single
 * entry. Powers the "View" button in the Round 1 Results grid.
 */
export const getEntryPhoto = async (req, res) => {
  try {
    const { entryId } = req.params;
    const competition = await getDefaultCompetition();
    if (!competition) {
      return res.status(404).json({ success: false, message: 'No competition configured' });
    }

    const entryRes = await pool.query(
      `SELECT e.*, p.full_name, p.email, p.phone
       FROM evaluation_entries e
       JOIN participants p ON p.participant_id = e.participant_id
       WHERE e.id = $1 AND e.competition_id = $2`,
      [entryId, competition.id]
    );
    const entry = entryRes.rows[0];
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }

    const sourceData = await getEntrySourceData(competition, entry);

    res.json({
      success: true,
      data: {
        entryId: entry.id,
        entryNumber: entry.entry_number,
        participantId: entry.participant_id,
        fullName: entry.full_name,
        email: entry.email,
        phone: entry.phone,
        imageUrl: sourceData?.imageUrl || null,
        fullImageUrl: sourceData?.fullImageUrl || null,
        captureLocation: sourceData?.captureLocation || null,
        captureDate: sourceData?.captureDate || null,
        cameraModel: sourceData?.cameraModel || null,
        category: sourceData?.category || null,
        environmentalMessage: sourceData?.environmentalMessage || null,
      },
    });
  } catch (error) {
    console.error('Get entry photo error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch photo', error: error.message });
  }
};

export const syncEntries = async (req, res) => {
  try {
    const competition = await getDefaultCompetition();
    if (!competition) {
      return res.status(400).json({ success: false, message: 'No competition configured' });
    }

    const maxRes = await pool.query(
      `SELECT COALESCE(MAX(entry_number::int), 0) AS max_num
       FROM evaluation_entries WHERE competition_id = $1`,
      [competition.id]
    );
    let nextNum = maxRes.rows[0].max_num + 1;

    const unmapped = await pool.query(
      `SELECT s.id, s.participant_id
       FROM submissions s
       WHERE NOT EXISTS (
         SELECT 1 FROM evaluation_entries e
         WHERE e.competition_id = $1 AND e.source_id = s.id
       )
       ORDER BY s.submission_date ASC, s.id ASC`,
      [competition.id]
    );

    const created = [];
    for (const row of unmapped.rows) {
      const entryNumber = String(nextNum).padStart(3, '0');
      const inserted = await pool.query(
        `INSERT INTO evaluation_entries (competition_id, entry_number, source_id, participant_id)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [competition.id, entryNumber, row.id, row.participant_id]
      );
      created.push(inserted.rows[0]);
      nextNum++;
    }

    res.json({
      success: true,
      message: `${created.length} new entr${created.length === 1 ? 'y' : 'ies'} created`,
      data: created,
    });
  } catch (error) {
    console.error('Sync entries error:', error);
    res.status(500).json({ success: false, message: 'Failed to sync entries', error: error.message });
  }
};

export const getSettings = async (req, res) => {
  try {
    const competition = await getDefaultCompetition();
    if (!competition) {
      return res.status(404).json({ success: false, message: 'No competition configured' });
    }
    const result = await pool.query(
      'SELECT * FROM evaluation_settings WHERE competition_id = $1',
      [competition.id]
    );
    res.json({ success: true, data: { competition, settings: result.rows[0] } });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch settings', error: error.message });
  }
};

const SETTINGS_FIELDS = [
  'round1_status',
  'allow_reevaluation',
  'qualification_method',
  'qualification_value',
  'verification_status',
  'round2_status',
  'round2_scoring_enabled',
  'frozen',
  'results_published',
  'max_score',
];

export const updateSettings = async (req, res) => {
  try {
    const competition = await getDefaultCompetition();
    if (!competition) {
      return res.status(404).json({ success: false, message: 'No competition configured' });
    }

    const updates = [];
    const values = [];
    let i = 1;
    for (const field of SETTINGS_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates.push(`${field} = $${i}`);
        values.push(req.body[field]);
        i++;
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid settings fields provided' });
    }

    values.push(competition.id);
    const result = await pool.query(
      `UPDATE evaluation_settings SET ${updates.join(', ')}, updated_at = NOW()
       WHERE competition_id = $${i} RETURNING *`,
      values
    );

    res.json({ success: true, message: 'Settings updated', data: result.rows[0] });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ success: false, message: 'Failed to update settings', error: error.message });
  }
};

/**
 * Round 1 results grid for admin: every entry, every judge's score,
 * total, conflict level, participant identity (unmasked here only —
 * judges never see this endpoint).
 */
export const getResults = async (req, res) => {
  try {
    const competition = await getDefaultCompetition();
    if (!competition) {
      return res.status(404).json({ success: false, message: 'No competition configured' });
    }

    const results = await computeRound1Results(competition.id);

    const judgesRes = await pool.query(
      'SELECT id, full_name FROM judges ORDER BY id ASC'
    );
    const judges = judgesRes.rows;

    const scoresRes = await pool.query(
      `SELECT s.entry_id, s.judge_id, s.score
       FROM evaluation_scores s
       JOIN evaluation_entries e ON e.id = s.entry_id
       WHERE e.competition_id = $1 AND s.round = 1`,
      [competition.id]
    );
    const scoreMap = new Map(); // entryId -> { judgeId: score }
    for (const row of scoresRes.rows) {
      if (!scoreMap.has(row.entry_id)) scoreMap.set(row.entry_id, {});
      scoreMap.get(row.entry_id)[row.judge_id] = row.score;
    }

    const participantsRes = await pool.query(
      `SELECT participant_id, full_name, category FROM participants`
    );
    const participantMap = new Map(
      participantsRes.rows.map((p) => [p.participant_id, { fullName: p.full_name, category: p.category }])
    );

    const qualRes = await pool.query(
      `SELECT q.entry_id, q.qualified, q.verification_status
       FROM evaluation_qualifications q
       JOIN evaluation_entries e ON e.id = q.entry_id
       WHERE e.competition_id = $1`,
      [competition.id]
    );
    const qualMap = new Map(qualRes.rows.map((r) => [r.entry_id, r]));

    const data = results.map((r) => {
      const perJudge = scoreMap.get(r.entryId) || {};
      const qual = qualMap.get(r.entryId);
      const participant = participantMap.get(r.participantId);
      return {
        entryId: r.entryId,
        entryNumber: r.entryNumber,
        participantId: r.participantId,
        fullName: participant?.fullName || '',
        category: participant?.category || null,
        judgeScores: judges.map((j) => ({
          judgeId: j.id,
          judgeName: j.full_name,
          score: perJudge[j.id] ?? null,
        })),
        total: r.total,
        conflict: r.conflict,
        status: r.status,
        qualified: qual?.qualified || false,
        verificationStatus: qual?.verification_status || 'not_applicable',
      };
    });

    const settingsRes = await pool.query(
      'SELECT max_score FROM evaluation_settings WHERE competition_id = $1',
      [competition.id]
    );
    const maxScore = settingsRes.rows[0]?.max_score ?? 5;

    res.json({ success: true, data, judges, maxScore, maxTotal: maxScore * judges.length });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch results', error: error.message });
  }
};

export const getConflicts = async (req, res) => {
  try {
    const { level } = req.query;
    const competition = await getDefaultCompetition();
    if (!competition) {
      return res.status(404).json({ success: false, message: 'No competition configured' });
    }

    const results = await computeRound1Results(competition.id);
    const filtered = level ? results.filter((r) => r.conflict === level.toUpperCase()) : results;

    res.json({ success: true, data: filtered });
  } catch (error) {
    console.error('Get conflicts error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch conflicts', error: error.message });
  }
};

export const runQualification = async (req, res) => {
  try {
    const competition = await getDefaultCompetition();
    if (!competition) {
      return res.status(404).json({ success: false, message: 'No competition configured' });
    }
    const outcome = await applyQualification(competition.id);
    res.json({ success: true, message: 'Qualification applied', data: outcome });
  } catch (error) {
    console.error('Run qualification error:', error);
    res.status(500).json({ success: false, message: 'Failed to run qualification', error: error.message });
  }
};

export const getAuditLog = async (req, res) => {
  try {
    const { search } = req.query;
    const competition = await getDefaultCompetition();
    if (!competition) {
      return res.status(404).json({ success: false, message: 'No competition configured' });
    }

    const params = [competition.id];
    let searchClause = '';
    if (search) {
      params.push(`%${search}%`);
      searchClause = `AND (e.entry_number ILIKE $2 OR j.full_name ILIKE $2)`;
    }

    const result = await pool.query(
      `SELECT a.id, a.round, a.old_score, a.new_score, a.changed_at,
              e.entry_number, j.full_name AS judge_name
       FROM evaluation_score_audit a
       JOIN evaluation_entries e ON e.id = a.entry_id
       JOIN judges j ON j.id = a.judge_id
       WHERE e.competition_id = $1 ${searchClause}
       ORDER BY a.changed_at DESC
       LIMIT 500`,
      params
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get audit log error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch audit log', error: error.message });
  }
};

/**
 * Builds the same flat row shape used by all three export formats.
 */
const buildExportRows = async (competitionId) => {
  const results = await computeRound1Results(competitionId);

  const judgesRes = await pool.query('SELECT id, full_name FROM judges ORDER BY id ASC');
  const judges = judgesRes.rows;

  const scoresRes = await pool.query(
    `SELECT s.entry_id, s.judge_id, s.score
     FROM evaluation_scores s
     JOIN evaluation_entries e ON e.id = s.entry_id
     WHERE e.competition_id = $1 AND s.round = 1`,
    [competitionId]
  );
  const scoreMap = new Map();
  for (const row of scoresRes.rows) {
    if (!scoreMap.has(row.entry_id)) scoreMap.set(row.entry_id, {});
    scoreMap.get(row.entry_id)[row.judge_id] = row.score;
  }

  const participantsRes = await pool.query(`SELECT participant_id, full_name, category FROM participants`);
  const participantMap = new Map(
    participantsRes.rows.map((p) => [p.participant_id, { fullName: p.full_name, category: p.category }])
  );

  return results.map((r) => {
    const perJudge = scoreMap.get(r.entryId) || {};
    const participant = participantMap.get(r.participantId);
    const row = {
      entryNumber: r.entryNumber,
      participantId: r.participantId,
      fullName: participant?.fullName || '',
      category: participant?.category || '',
      total: r.total,
      conflict: r.conflict,
      status: r.status,
    };
    judges.forEach((j, idx) => {
      row[`judge${idx + 1}`] = perJudge[j.id] ?? '';
    });
    return row;
  });
};

/**
 * TESTING / RE-RUN TOOL — clears evaluation data so an admin can
 * re-test the judging flow without touching entries, judges, or
 * settings. Never touches evaluation_score_audit unless clearAudit
 * is explicitly true (audit history should normally never be erased;
 * this exception exists purely for pre-launch testing).
 *
 * scope:
 *  - 'scores'  : delete evaluation_scores only (optionally filtered
 *                by round and/or judgeId)
 *  - 'full'    : also clears evaluation_qualifications and
 *                evaluation_winners for the competition — a full
 *                return to the pre-Round-1 state
 */
export const resetEvaluationData = async (req, res) => {
  const { scope = 'scores', round, judgeId, clearAudit = false } = req.body;

  if (!['scores', 'full'].includes(scope)) {
    return res.status(400).json({ success: false, message: 'scope must be "scores" or "full"' });
  }

  try {
    const competition = await getDefaultCompetition();
    if (!competition) {
      return res.status(404).json({ success: false, message: 'No competition configured' });
    }

    const conditions = ['e.competition_id = $1'];
    const params = [competition.id];
    let i = 2;

    if (round) {
      conditions.push(`s.round = $${i}`);
      params.push(round);
      i++;
    }
    if (judgeId) {
      conditions.push(`s.judge_id = $${i}`);
      params.push(judgeId);
      i++;
    }

    const deletedScores = await pool.query(
      `DELETE FROM evaluation_scores s
       USING evaluation_entries e
       WHERE s.entry_id = e.id AND ${conditions.join(' AND ')}
       RETURNING s.id`,
      params
    );

    let deletedAudit = { rowCount: 0 };
    if (clearAudit) {
      const auditConditions = ['e.competition_id = $1'];
      const auditParams = [competition.id];
      let j = 2;
      if (round) {
        auditConditions.push(`a.round = $${j}`);
        auditParams.push(round);
        j++;
      }
      if (judgeId) {
        auditConditions.push(`a.judge_id = $${j}`);
        auditParams.push(judgeId);
        j++;
      }
      deletedAudit = await pool.query(
        `DELETE FROM evaluation_score_audit a
         USING evaluation_entries e
         WHERE a.entry_id = e.id AND ${auditConditions.join(' AND ')}`,
        auditParams
      );
    }

    let qualificationsReset = 0;
    let winnersReset = 0;
    if (scope === 'full') {
      const qRes = await pool.query(
        `UPDATE evaluation_qualifications q
         SET qualified = false, verification_status = 'not_applicable', total_score = 0,
             conflict_level = 'LOW', updated_at = NOW()
         FROM evaluation_entries e
         WHERE q.entry_id = e.id AND e.competition_id = $1
         RETURNING q.id`,
        [competition.id]
      );
      qualificationsReset = qRes.rowCount;

      const wRes = await pool.query(
        `DELETE FROM evaluation_winners WHERE competition_id = $1 RETURNING id`,
        [competition.id]
      );
      winnersReset = wRes.rowCount;
    }

    res.json({
      success: true,
      message: `Reset complete: ${deletedScores.rowCount} score(s) cleared${
        clearAudit ? `, ${deletedAudit.rowCount} audit row(s) cleared` : ''
      }${scope === 'full' ? `, ${qualificationsReset} qualification(s) reset, ${winnersReset} winner assignment(s) removed` : ''}.`,
      data: {
        scoresCleared: deletedScores.rowCount,
        auditCleared: clearAudit ? deletedAudit.rowCount : 0,
        qualificationsReset,
        winnersReset,
      },
    });
  } catch (error) {
    console.error('Reset evaluation data error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset evaluation data', error: error.message });
  }
};

export const exportResults = async (req, res) => {
  try {
    const { format } = req.params;
    const competition = await getDefaultCompetition();
    if (!competition) {
      return res.status(404).json({ success: false, message: 'No competition configured' });
    }

    const rows = await buildExportRows(competition.id);
    const settingsRes = await pool.query(
      'SELECT max_score FROM evaluation_settings WHERE competition_id = $1',
      [competition.id]
    );
    const maxScore = settingsRes.rows[0]?.max_score ?? 5;
    const maxTotal = maxScore * 5; // 5 judges, fixed
    const filenameBase = `Round1_Results_${Date.now()}`;

    if (format === 'csv') {
      const csv = buildResultsCSV(rows, { maxTotal });
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filenameBase}.csv`);
      return res.send(csv);
    }

    if (format === 'excel') {
      const buffer = await buildResultsExcel(rows, { maxTotal });
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=${filenameBase}.xlsx`);
      return res.send(buffer);
    }

    if (format === 'pdf') {
      const buffer = await buildResultsPDF(rows, { title: competition.name, maxTotal });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${filenameBase}.pdf`);
      return res.send(buffer);
    }

    return res.status(400).json({ success: false, message: 'Invalid export format. Use csv, excel, or pdf.' });
  } catch (error) {
    console.error('Export results error:', error);
    res.status(500).json({ success: false, message: 'Failed to export results', error: error.message });
  }
};