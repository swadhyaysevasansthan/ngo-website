import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const Review = {
  // Submit new review
  async create(data) {
    const query = `
      INSERT INTO reviews (name, email, phone, designation, original_review_text, status)
      VALUES ($1, $2, $3, $4, $5, 'pending')
      RETURNING *
    `;
    const result = await pool.query(query, [
      data.name,
      data.email,
      data.phone,
      data.designation,
      data.original_review_text,
    ]);
    return result.rows[0];
  },

  // Get public reviews (approved only)
async findPublic(limit = 5, offset = 0) {
  const query = `
    SELECT
      id,
      name,
      designation,
      COALESCE(NULLIF(refined_review_text, ''), original_review_text) AS review_text,
      is_featured,
      is_pinned,
      created_at
    FROM reviews
    WHERE status = 'approved'
    ORDER BY is_pinned DESC, created_at DESC
    LIMIT $1 OFFSET $2
  `;

  const countQuery = `SELECT COUNT(*) FROM reviews WHERE status = 'approved'`;

  const [itemsResult, countResult] = await Promise.all([
    pool.query(query, [limit, offset]),
    pool.query(countQuery),
  ]);

  return {
    items: itemsResult.rows,
    total: parseInt(countResult.rows[0].count, 10),
  };
},
  // Get admin reviews
  async findAdmin(status = 'pending') {
    const query = `
      SELECT r.*, rv.version_text as latest_version
      FROM reviews r
      LEFT JOIN (
        SELECT review_id, version_text, ROW_NUMBER() OVER (PARTITION BY review_id ORDER BY created_at DESC) as rn
        FROM review_versions
      ) rv ON r.id = rv.review_id AND rv.rn = 1
      WHERE r.status = $1
      ORDER BY r.created_at DESC
    `;
    const result = await pool.query(query, [status]);
    return result.rows;
  },

  // Update review status
  async updateStatus(id, status) {
    const query = `
      UPDATE reviews 
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  },

  // Refine review text
  async refine(id, refinedText, adminName) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Save version history
      const originalQuery = 'SELECT refined_review_text FROM reviews WHERE id = $1';
      const originalResult = await client.query(originalQuery, [id]);
      const originalText = originalResult.rows[0]?.refined_review_text || '';
      
      if (originalText !== refinedText) {
        const versionQuery = `
          INSERT INTO review_versions (review_id, version_text, created_by)
          VALUES ($1, $2, $3)
        `;
        await client.query(versionQuery, [id, originalText || '', adminName]);
      }
      
      // Update refined text
      const updateQuery = `
        UPDATE reviews 
        SET refined_review_text = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `;
      const result = await client.query(updateQuery, [refinedText, id]);
      
      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // Toggle featured/pinned
  async toggleFeatured(id, isFeatured) {
    const query = `
      UPDATE reviews 
      SET is_featured = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [isFeatured, id]);
    return result.rows[0];
  },

  async togglePinned(id, isPinned) {
    const query = `
      UPDATE reviews 
      SET is_pinned = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [isPinned, id]);
    return result.rows[0];
  },

  // Delete review
  async delete(id) {
    const query = 'DELETE FROM reviews WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  },

  // Get review versions
  async getVersions(id) {
    const query = `
      SELECT * FROM review_versions 
      WHERE review_id = $1 
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [id]);
    return result.rows;
  },

  // Find by ID
  async findById(id) {
    const query = `
      SELECT r.*, rv.version_text as latest_version
      FROM reviews r
      LEFT JOIN (
        SELECT review_id, version_text, ROW_NUMBER() OVER (PARTITION BY review_id ORDER BY created_at DESC) as rn
        FROM review_versions
      ) rv ON r.id = rv.review_id AND rv.rn = 1
      WHERE r.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};