import pool from '../config/database.js';

export const trackVisitor = async (req, res) => {
  try {
    const { visitorToken } = req.body;

    if (!visitorToken) {
      return res.status(400).json({
        success: false,
        message: 'Visitor token required'
      });
    }

    const existing = await pool.query(
      `SELECT id FROM visitor_logs WHERE visitor_token = $1`,
      [visitorToken]
    );

    let totalVisitors = null;

    if (existing.rows.length === 0) {
      const ip =
        req.headers['x-forwarded-for'] ||
        req.ip ||
        req.socket.remoteAddress;

      await pool.query(
        `INSERT INTO visitor_logs (visitor_token, ip_address)
         VALUES ($1, $2)
         ON CONFLICT (visitor_token) DO NOTHING`,
        [visitorToken, ip]
      );

      const updateResult = await pool.query(`
        UPDATE visitor_stats
        SET total_visitors = total_visitors + 1
        WHERE id = 1
        RETURNING total_visitors
      `);

      if (updateResult.rows.length > 0) {
        totalVisitors = Number(updateResult.rows[0].total_visitors);
      }
    }

    if (totalVisitors === null) {
      const result = await pool.query(`
        SELECT total_visitors
        FROM visitor_stats
        WHERE id = 1
      `);
      totalVisitors = Number(result.rows[0]?.total_visitors || 0);
    }

    return res.json({
      success: true,
      totalVisitors
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Failed to track visitor'
    });
  }
};

export const getVisitorCount = async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT total_visitors
      FROM visitor_stats
      WHERE id = 1
    `);

    return res.json({
      success: true,
      totalVisitors: Number(
        result.rows[0].total_visitors
      )
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch count'
    });
  }
};