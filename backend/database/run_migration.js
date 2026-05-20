import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  try {
    await pool.query(`ALTER TABLE community_image_albums ADD COLUMN IF NOT EXISTS description TEXT;`);
    await pool.query(`ALTER TABLE community_image_albums ADD COLUMN IF NOT EXISTS location VARCHAR(255);`);
    console.log('✅ Added description and location columns to community_image_albums');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    await pool.end();
  }
}

migrate();
