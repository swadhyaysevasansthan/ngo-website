import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Formatted ISO timestamp for logging
const getTimestamp = () => new Date().toISOString();

// Pool sizing and timeout configuration
const poolMax = parseInt(process.env.DB_POOL_MAX, 10) || 5;
const poolMin = parseInt(process.env.DB_POOL_MIN, 10) || 0;
const idleTimeoutMillis = parseInt(process.env.DB_IDLE_TIMEOUT_MS, 10) || 30000;
const connectionTimeoutMillis = parseInt(process.env.DB_CONNECTION_TIMEOUT_MS, 10) || 5000;
const statementTimeout = parseInt(process.env.DB_STATEMENT_TIMEOUT_MS, 10) || 15000;
const slowQueryThreshold = parseInt(process.env.SLOW_QUERY_THRESHOLD_MS, 10) || 500;

// SSL configuration
// If custom CA certificate is provided via CA_CERT or PGSSLROOTCERT, enforce rejectUnauthorized: true.
// Otherwise, default to rejectUnauthorized: false for compatibility with Aiven without custom cert mount.
const sslConfig = process.env.CA_CERT
  ? { ca: process.env.CA_CERT, rejectUnauthorized: true }
  : { rejectUnauthorized: false };

// PostgreSQL shared connection pool (singleton for this process)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
  max: poolMax,
  min: poolMin,
  idleTimeoutMillis,
  connectionTimeoutMillis,
  statement_timeout: statementTimeout,
});

// Test database connection event
// Note: In production, we suppress logging on every single client checkout to avoid flooding Render logs
pool.on('connect', () => {
  if (process.env.NODE_ENV !== 'production' || process.env.DEBUG_QUERIES === 'true') {
    console.log(`[${getTimestamp()}] ✅ PostgreSQL client connected to pool`);
  }
});

// Idle client error handling
// In node-postgres, pool.on('error') fires when an IDLE client in the pool experiences an error
// (e.g. backend server dropped connection, timeout, network blip).
// Do NOT call process.exit() here! The pool automatically removes the broken client and recovers.
pool.on('error', (err, client) => {
  console.error(`[${getTimestamp()}] ⚠️  PostgreSQL idle client error (client discarded by pool):`, {
    code: err.code,
    message: err.message,
  });
});

// Helper to sanitize query text for safe logging (never log parameters or full raw bodies)
const sanitizeQuery = (text) => {
  if (typeof text === 'string') {
    return text.replace(/\s+/g, ' ').trim().slice(0, 150);
  }
  if (text && typeof text.text === 'string') {
    return text.text.replace(/\s+/g, ' ').trim().slice(0, 150);
  }
  return '[Complex Query Object]';
};

// Safe query execution logger with ISO timestamps
const logQueryMetrics = (text, duration, res, error) => {
  const isSlow = duration >= slowQueryThreshold;
  const isDebug = process.env.DEBUG_QUERIES === 'true' || process.env.NODE_ENV === 'development';

  if (error) {
    console.error(`[${getTimestamp()}] ❌ Database query error:`, {
      code: error.code,
      message: error.message,
      duration: `${duration}ms`,
      query: sanitizeQuery(text),
    });
    return;
  }

  if (isSlow) {
    console.warn(`[${getTimestamp()}] ⚠️  [SLOW QUERY]:`, {
      duration: `${duration}ms`,
      threshold: `${slowQueryThreshold}ms`,
      rows: res ? res.rowCount : 0,
      query: sanitizeQuery(text),
    });
  } else if (isDebug) {
    console.log(`[${getTimestamp()}] ⚡ Executed query:`, {
      duration: `${duration}ms`,
      rows: res ? res.rowCount : 0,
      query: sanitizeQuery(text),
    });
  }
};

// Wrap pool.query to intercept both direct pool.query calls and track metrics safely
const originalPoolQuery = pool.query.bind(pool);
pool.query = function (text, params, callback) {
  const start = Date.now();

  if (typeof params === 'function') {
    callback = params;
    params = undefined;
  }

  if (typeof callback === 'function') {
    return originalPoolQuery(text, params, (err, res) => {
      const duration = Date.now() - start;
      logQueryMetrics(text, duration, res, err);
      callback(err, res);
    });
  }

  return originalPoolQuery(text, params)
    .then((res) => {
      const duration = Date.now() - start;
      logQueryMetrics(text, duration, res, null);
      return res;
    })
    .catch((err) => {
      const duration = Date.now() - start;
      logQueryMetrics(text, duration, null, err);
      throw err;
    });
};

// Query helper function
export const query = (text, params) => pool.query(text, params);

// Helper for safe transaction rollbacks without masking primary errors
export const safeRollback = async (client) => {
  if (!client) return;
  try {
    await client.query('ROLLBACK');
  } catch (rollbackErr) {
    console.error(`[${getTimestamp()}] ⚠️  Transaction ROLLBACK failed (connection may already be closed):`, {
      code: rollbackErr.code,
      message: rollbackErr.message,
    });
  }
};

// Lightweight connection pool monitoring
export const getPoolStats = () => ({
  timestamp: getTimestamp(),
  totalCount: pool.totalCount,
  idleCount: pool.idleCount,
  waitingCount: pool.waitingCount,
  maxConfigured: poolMax,
});

let poolMonitoringInterval = null;

export const startPoolMonitoring = () => {
  if (poolMonitoringInterval) return; // Prevent duplicate intervals

  const shouldMonitor =
    process.env.ENABLE_DB_POOL_LOGGING === 'true' ||
    (process.env.NODE_ENV !== 'production' && process.env.ENABLE_DB_POOL_LOGGING !== 'false');

  if (!shouldMonitor) return;

  const intervalMs = parseInt(process.env.DB_POOL_LOG_INTERVAL_MS, 10) || 60000;

  poolMonitoringInterval = setInterval(() => {
    const stats = getPoolStats();
    console.log(`[${getTimestamp()}] 📊 [DB Pool Stats]:`, stats);
  }, intervalMs);

  // Ensure timer does not prevent process from exiting
  if (poolMonitoringInterval.unref) {
    poolMonitoringInterval.unref();
  }
};

export const stopPoolMonitoring = () => {
  if (poolMonitoringInterval) {
    clearInterval(poolMonitoringInterval);
    poolMonitoringInterval = null;
  }
};

// Initialize pool monitoring if enabled
startPoolMonitoring();

export default pool;
