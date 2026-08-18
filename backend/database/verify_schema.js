/**
 * verify_schema.js
 *
 * Verifies that the four tables (events, scanner_devices, event_passes, checkin_logs)
 * exist in the database, inspects their column structures, and verifies indexes.
 */
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function verify() {
  const client = await pool.connect();
  try {
    const tables = ['events', 'scanner_devices', 'event_passes', 'checkin_logs'];
    
    console.log('🔍 Checking tables existence:');
    for (const table of tables) {
      const res = await client.query(
        `SELECT COUNT(*) FROM information_schema.tables 
         WHERE table_schema = 'public' AND table_name = $1`,
        [table]
      );
      const exists = parseInt(res.rows[0].count, 10) === 1;
      console.log(`   ${exists ? '✅' : '❌'} Table: ${table}`);
      
      if (exists) {
        // Query columns
        const colRes = await client.query(
          `SELECT column_name, data_type, is_nullable 
           FROM information_schema.columns 
           WHERE table_schema = 'public' AND table_name = $1
           ORDER BY ordinal_position`,
          [table]
        );
        console.log(`      Columns:`);
        colRes.rows.forEach(col => {
          console.log(`        - ${col.column_name} (${col.data_type}, nullable: ${col.is_nullable})`);
        });
      }
    }

    console.log('\n🔍 Checking indexes:');
    const indexRes = await client.query(
      `SELECT tablename, indexname, indexdef 
       FROM pg_indexes 
       WHERE schemaname = 'public' AND tablename IN ('events', 'scanner_devices', 'event_passes', 'checkin_logs')
       ORDER BY tablename, indexname`
    );
    indexRes.rows.forEach(idx => {
      console.log(`   ✅ Table: ${idx.tablename} | Index: ${idx.indexname}`);
    });

  } catch (err) {
    console.error('❌ Verification failed:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

verify();
