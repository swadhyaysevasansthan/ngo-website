/**
 * passQRUtils.js
 *
 * Utility functions for the QR Event Pass & Check-In system.
 *
 * Token design rationale
 * ─────────────────────
 * The QR token is stored RAW (not hashed) in event_passes.qr_token.
 * This differs from the school-access magic-link flow (tokenService.js)
 * which stores only a SHA-256 hash.
 *
 * Reason: the scanner APK sends the raw token and the API must look it
 * up with a simple SELECT WHERE qr_token = $1.  Storing a hash here
 * would require the API to hash the incoming value first — unnecessary
 * complexity given that:
 *   1. The token is already 256 bits of CSPRNG entropy.
 *   2. It is UNIQUE in the DB (index-enforced).
 *   3. Check-in uses SELECT FOR UPDATE + transaction, giving atomic
 *      duplicate protection that is independent of token secrecy.
 *   4. The token is never sent in a URL that appears in server logs
 *      (APK → HTTPS POST body only).
 *
 * Do NOT use sequential IDs or any guest-identifiable data as the QR
 * security token.
 */

import crypto from 'crypto';

// ────────────────────────────────────────────────────────────
// QR TOKEN
// ────────────────────────────────────────────────────────────

/**
 * Generate a cryptographically secure QR token.
 *
 * Returns a 64-character lowercase hex string (256 bits of entropy).
 * Stored as-is in event_passes.qr_token.
 * Embedded directly in the QR code (the scanner reads this exact string).
 *
 * @returns {string} 64-char hex token
 */
export const generateQRToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// ────────────────────────────────────────────────────────────
// PASS NUMBER
// ────────────────────────────────────────────────────────────

/**
 * Generate a human-readable pass number.
 *
 * Format:  <PREFIX>-<YEAR>-<SEQUENCE>
 * Example: SNEPC-2026-0001
 *
 * The prefix is derived from the event slug (up to 5 chars, uppercase).
 * The sequence is zero-padded to 4 digits.
 *
 * The caller is responsible for ensuring the sequence is globally
 * unique within the event (typically: SELECT MAX(pass_number) or use
 * a PostgreSQL sequence counter).
 *
 * @param {string} eventSlug   - event slug, e.g. "snepc-2026" or "annual-day-2026"
 * @param {number} sequence    - 1-based integer, e.g. 1, 2, …, 9999
 * @returns {string}            pass number, e.g. "SNEPC-2026-0001"
 */
export const generatePassNumber = (eventSlug, sequence) => {
  // Take the first segment of the slug (before the first '-') as the prefix,
  // uppercased, capped at 5 characters.  Falls back to 'PASS' if the slug
  // is missing or malformed.
  const prefix = (eventSlug || 'pass')
    .split('-')[0]
    .toUpperCase()
    .slice(0, 5) || 'PASS';

  const year = new Date().getFullYear();
  const seq  = String(Math.max(1, Math.floor(sequence))).padStart(4, '0');

  return `${prefix}-${year}-${seq}`;
};

/**
 * Derive the next pass sequence number for an event.
 *
 * Queries the database for the maximum existing pass_number for the
 * given eventId and returns the next integer.  Uses advisory locking
 * via the caller's transaction to avoid gaps when two passes are
 * created concurrently.
 *
 * Usage (inside a transaction):
 *   const seq = await getNextPassSequence(client, eventId);
 *   const passNumber = generatePassNumber(slug, seq);
 *
 * @param {pg.PoolClient} client  - DB client (inside a transaction)
 * @param {number}        eventId
 * @returns {Promise<number>}     next sequence integer (1-based)
 */
export const getNextPassSequence = async (client, eventId) => {
  // Extract the numeric part from the last segment of pass_number
  // (e.g. "SNEPC-2026-0042" → 42) and return MAX + 1.
  // If no passes exist yet, returns 1.
  const res = await client.query(
    `SELECT COALESCE(
       MAX(
         CAST(
           SPLIT_PART(pass_number, '-', 3) AS INTEGER
         )
       ),
       0
     ) + 1 AS next_seq
     FROM event_passes
     WHERE event_id = $1`,
    [eventId]
  );
  return parseInt(res.rows[0].next_seq, 10);
};

// ────────────────────────────────────────────────────────────
// SCANNER CREDENTIALS
// ────────────────────────────────────────────────────────────

import { randomInt } from 'crypto';

/**
 * Generate a readable, unambiguous password for a scanner device.
 *
 * Uses crypto.randomInt (CSPRNG) — same approach as judgeCredentials.js.
 * Avoids visually ambiguous characters: 0/O, 1/l/I.
 *
 * @param {number} [length=10]
 * @returns {string}
 */
export const generateScannerPassword = (length = 10) => {
  const charset = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(randomInt(0, charset.length));
  }
  return password;
};

// ────────────────────────────────────────────────────────────
// PASS VALIDATION
// ────────────────────────────────────────────────────────────

/**
 * Verify a pass record fetched from the database.
 * Returns { valid: boolean, result: string, message: string }
 * Matches results in checkin_logs: SUCCESS, ALREADY_CHECKED_IN, INVALID, CANCELLED, WRONG_EVENT
 *
 * @param {object} passRecord - Row fetched from event_passes table (can be null/undefined)
 * @param {number} [expectedEventId] - The event ID associated with the scanning device/session (optional)
 * @returns {object} verification result
 */
export const verifyPassRecord = (passRecord, expectedEventId) => {
  if (!passRecord) {
    return {
      valid: false,
      result: 'INVALID',
      message: 'Pass not found.'
    };
  }

  if (passRecord.status === 'CANCELLED') {
    return {
      valid: false,
      result: 'CANCELLED',
      message: 'This pass has been cancelled.'
    };
  }

  if (passRecord.status === 'CHECKED_IN') {
    const timeStr = passRecord.checked_in_at 
      ? new Date(passRecord.checked_in_at).toLocaleTimeString() 
      : 'unknown time';
    return {
      valid: false,
      result: 'ALREADY_CHECKED_IN',
      message: `Pass already checked in at gate ${passRecord.gate || 'N/A'} at ${timeStr}.`
    };
  }

  if (expectedEventId && passRecord.event_id !== expectedEventId) {
    return {
      valid: false,
      result: 'WRONG_EVENT',
      message: 'This pass is for a different event.'
    };
  }

  return {
    valid: true,
    result: 'SUCCESS',
    message: 'Pass verified successfully.'
  };
};

