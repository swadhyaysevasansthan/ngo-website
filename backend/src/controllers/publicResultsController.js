import pool from '../config/database.js';
import { getDefaultCompetition, applyCloudinaryTransform } from './evaluationController.js';
import { computeRoundResults } from '../services/qualificationService.js';

/**
 * Public, unauthenticated endpoint powering the results gallery page.
 * Deliberately separate from evaluationController.js's admin-facing
 * getResults — this never requires a token and never exposes numeric
 * scores, rank, entry numbers, or winner/consolation badges. It's a
 * plain top-X exhibition: photo, name, place, category only.
 *
 * Ranking rule: always Round 1 totals, regardless of whether Round 2
 * scoring is enabled — this page reflects Round 1 standing only.
 * Disqualified entries are always excluded.
 */
export const getGallery = async (req, res) => {
  try {
    const competition = await getDefaultCompetition();
    if (!competition) {
      return res.json({ success: true, published: false });
    }

    const settingsRes = await pool.query(
      'SELECT results_published, gallery_top_n FROM evaluation_settings WHERE competition_id = $1',
      [competition.id]
    );
    const settings = settingsRes.rows[0];

    if (!settings || !settings.results_published) {
      return res.json({ success: true, published: false, competitionName: competition.name });
    }

    const topN = settings.gallery_top_n || 60;

    let results = await computeRoundResults(competition.id, 1);
    // Round 1's query covers every active entry, so filter out
    // disqualified entries explicitly here.
    results = results.filter((r) => r.status !== 'disqualified');

    results.sort((a, b) => b.total - a.total);
    const topResults = results.slice(0, topN);

    if (topResults.length === 0) {
      return res.json({ success: true, published: true, competitionName: competition.name, entries: [] });
    }

    const entryIds = topResults.map((r) => r.entryId);

    // Single batched query for image + participant data instead of
    // one query per entry (same N+1 mistake we already fixed once
    // in the admin Results grid — not repeating it here).
    const detailsRes = await pool.query(
      `SELECT e.id AS entry_id, p.full_name, p.category,
              s.cloudinary_url, s.capture_location
       FROM evaluation_entries e
       JOIN participants p ON p.participant_id = e.participant_id
       JOIN submissions s ON s.id = e.source_id
       WHERE e.id = ANY($1::int[])`,
      [entryIds]
    );
    const detailsMap = new Map(detailsRes.rows.map((r) => [r.entry_id, r]));

    const entries = topResults.map((r) => {
      const detail = detailsMap.get(r.entryId);
      return {
        fullName: detail?.full_name || null,
        category: detail?.category || null,
        imageUrl: detail?.cloudinary_url ? applyCloudinaryTransform(detail.cloudinary_url, 'w_1200,q_auto,f_auto') : null,
        captureLocation: detail?.capture_location || null,
      };
    });

    res.json({
      success: true,
      published: true,
      competitionName: competition.name,
      entries,
    });
  } catch (error) {
    console.error('Get public gallery error:', error);
    res.status(500).json({ success: false, message: 'Failed to load gallery' });
  }
};