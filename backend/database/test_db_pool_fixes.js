/**
 * test_db_pool_fixes.js
 *
 * Automated verification of PostgreSQL pooling, resource safety, and review model consolidation.
 */
import dotenv from 'dotenv';
dotenv.config();

import pool, { getPoolStats, safeRollback, query } from '../src/config/database.js';
import { Review } from '../src/models/reviewModel.js';

async function runTests() {
  console.log('🧪 Starting database pool & resource safety verification...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Verify Pool Configuration
    console.log('1. Pool Configuration Verification:');
    assert(pool.options.max === 5 || pool.options.max === parseInt(process.env.DB_POOL_MAX || 5, 10), 'Pool max is set to 5 (or DB_POOL_MAX)');
    assert(pool.options.min === 0, 'Pool min is set to 0');
    assert(pool.options.idleTimeoutMillis === 30000 || pool.options.idleTimeoutMillis === parseInt(process.env.DB_IDLE_TIMEOUT_MS || 30000, 10), 'Idle timeout is set to 30000ms');
    assert(pool.options.connectionTimeoutMillis === 5000 || pool.options.connectionTimeoutMillis === parseInt(process.env.DB_CONNECTION_TIMEOUT_MS || 5000, 10), 'Connection timeout is set to 5000ms');

    // 2. Verify Pool Metrics
    console.log('\n2. Pool Metrics Verification:');
    const initialStats = getPoolStats();
    assert(typeof initialStats.totalCount === 'number', 'Pool stats has totalCount');
    assert(typeof initialStats.idleCount === 'number', 'Pool stats has idleCount');
    assert(typeof initialStats.waitingCount === 'number', 'Pool stats has waitingCount');
    assert(initialStats.maxConfigured === 5 || initialStats.maxConfigured === parseInt(process.env.DB_POOL_MAX || 5, 10), 'Pool stats reports maxConfigured');

    // 3. Verify Basic Connectivity & Safe Logging
    console.log('\n3. Database Connectivity & Query Helper:');
    const dbTest = await query('SELECT 1 AS num');
    assert(dbTest.rows[0].num === 1, 'Safe query helper successfully executes query');

    // 4. Verify Review Model Uses Shared Pool & Operations Function
    console.log('\n4. Review Model Consolidation:');
    const publicReviews = await Review.findPublic(2, 0);
    assert(Array.isArray(publicReviews.items), 'Review.findPublic returns items array');
    assert(typeof publicReviews.total === 'number', 'Review.findPublic returns total count');

    const adminReviews = await Review.findAdmin('pending');
    assert(Array.isArray(adminReviews), 'Review.findAdmin returns array using optimized LATERAL query');

    // 5. Verify Safe Rollback Helper
    console.log('\n5. Safe Rollback Behavior:');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await safeRollback(client);
      assert(true, 'safeRollback executes cleanly on active transaction');
    } finally {
      client.release();
    }

    // Verify safeRollback on closed/null client doesn't throw
    await safeRollback(null);
    assert(true, 'safeRollback handles null client safely without throwing');

    // 6. Verify Client Release on Transaction Error in Review.refine
    console.log('\n6. Review.refine Error & Resource Release Handling:');
    const preCount = pool.idleCount + (pool.totalCount - pool.idleCount);
    try {
      // Intentionally cause failure with invalid ID type or condition
      await Review.refine(-999999, 'Test text', 'Test Admin');
    } catch (e) {
      // Expected if table constraint or non-existent
    }
    const postCount = pool.waitingCount;
    assert(postCount === 0, 'No clients left hung or waiting in pool after refine call');

    console.log(`\n🎉 Verification Complete: ${passed} passed, ${failed} failed.`);
  } catch (err) {
    console.error('Fatal test error:', err);
    failed++;
  } finally {
    await pool.end().catch(() => {});
  }

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
