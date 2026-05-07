import crypto from 'crypto';

const EVENT_REGISTRATION_DEADLINE = new Date('2027-02-28T23:59:59.000Z');
const TOKEN_VALIDITY_DAYS = 60;

/**
 * Generate a cryptographically secure random token.
 * Returns the raw token (to be sent in the magic link URL).
 * Never store this raw value in the database.
 */
export const generateRawToken = () => {
  return crypto.randomBytes(32).toString('hex'); // 64-char hex string
};

/**
 * Hash a raw token using SHA-256.
 * Store only this hash in the database.
 */
export const hashToken = (rawToken) => {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
};

/**
 * Calculate token expiry.
 * Expires at the earlier of:
 *   - approvalDate + TOKEN_VALIDITY_DAYS
 *   - EVENT_REGISTRATION_DEADLINE
 */
export const calculateTokenExpiry = (approvalDate = new Date()) => {
  const validityExpiry = new Date(approvalDate);
  validityExpiry.setDate(validityExpiry.getDate() + TOKEN_VALIDITY_DAYS);
  return validityExpiry < EVENT_REGISTRATION_DEADLINE
    ? validityExpiry
    : EVENT_REGISTRATION_DEADLINE;
};

/**
 * Build the full magic link URL to send in email.
 */
export const buildRegistrationLink = (rawToken) => {
  const baseUrl = process.env.FRONTEND_URL || 'https://www.swadhyayseva.org';
  return `${baseUrl}/school-registration?token=${rawToken}`;
};

/**
 * Verify a token record fetched from the database.
 * Returns { valid: true } or { valid: false, reason: string }
 *
 * tokenRecord shape (from DB):
 * { token_hash, expires_at, is_used }
 */
export const verifyTokenRecord = (tokenRecord) => {
  if (!tokenRecord) {
    return { valid: false, reason: 'Token not found.' };
  }

  if (tokenRecord.is_used) {
    return { valid: false, reason: 'This registration link has already been used.' };
  }

  if (new Date() > new Date(tokenRecord.expires_at)) {
    return { valid: false, reason: 'This registration link has expired. Please contact us to request a new one.' };
  }

  return { valid: true };
};