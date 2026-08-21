import pool from '../config/database.js';
import { getDefaultCompetition, applyCloudinaryTransform } from './evaluationController.js';
import { computeRoundResults } from '../services/qualificationService.js';

/**
 * Public, unauthenticated endpoint powering the results gallery page.
 * Deliberately separate from evaluationController.js's admin-facing
 * getResults — this never requires a token and never exposes numeric
 * scores, only rank + winner badges, which is standard practice for
 * a public exhibition page.
 *
 * Ranking rule: if Round 2 scoring is enabled, rank by Round 2
 * totals (the same "active round" logic already used for winner
 * selection); otherwise rank by Round 1. Disqualified entries are
 * always excluded — both entry-level disqualification and
 * verification-stage disqualification.
 */
export const getGallery = async (req, res) => {
  try {
    const competition = await getDefaultCompetition();
    if (!competition) {
      return res.json({ success: true, published: false });
    }

    const settingsRes = await pool.query(
      'SELECT results_published, gallery_top_n, round2_scoring_enabled FROM evaluation_settings WHERE competition_id = $1',
      [competition.id]
    );
    const settings = settingsRes.rows[0];

    if (!settings || !settings.results_published) {
      return res.json({ success: true, published: false, competitionName: competition.name });
    }

    const topN = settings.gallery_top_n || 60;
    const activeRound = settings.round2_scoring_enabled ? 2 : 1;

    let results = await computeRoundResults(competition.id, activeRound);
    // Round 2's own query already excludes disqualified/unqualified
    // entries; Round 1's does not (it covers every active entry), so
    // filter explicitly here for that case.
    if (activeRound === 1) {
      results = results.filter((r) => r.status !== 'disqualified');
    }

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
      `SELECT e.id AS entry_id, e.entry_number, p.full_name, p.category,
              s.cloudinary_url, s.capture_location
       FROM evaluation_entries e
       JOIN participants p ON p.participant_id = e.participant_id
       JOIN submissions s ON s.id = e.source_id
       WHERE e.id = ANY($1::int[])`,
      [entryIds]
    );
    const detailsMap = new Map(detailsRes.rows.map((r) => [r.entry_id, r]));

    const winnersRes = await pool.query(
      `SELECT entry_id, prize_type FROM evaluation_winners WHERE competition_id = $1`,
      [competition.id]
    );
    const winnerMap = new Map(winnersRes.rows.map((r) => [r.entry_id, r.prize_type]));

    const entries = topResults.map((r, index) => {
      const detail = detailsMap.get(r.entryId);
      return {
        rank: index + 1,
        entryNumber: detail?.entry_number || r.entryNumber,
        fullName: detail?.full_name || null,
        category: detail?.category || null,
        imageUrl: detail?.cloudinary_url ? applyCloudinaryTransform(detail.cloudinary_url, 'w_1200,q_auto,f_auto') : null,
        captureLocation: detail?.capture_location || null,
        prizeType: winnerMap.get(r.entryId) || null,
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
