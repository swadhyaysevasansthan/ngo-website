import { nanoid } from 'nanoid';
import { randomInt } from 'crypto';

/**
 * Generate a unique judge username from their name.
 * Format: firstname.xxxx (xxxx = 4-char random suffix to avoid collisions)
 */
export const generateJudgeUsername = (fullName) => {
  const base =
    fullName
      .trim()
      .split(/\s+/)[0]
      .toLowerCase()
      .replace(/[^a-z]/g, '') || 'judge';
  const suffix = nanoid(4).toLowerCase();
  return `${base}.${suffix}`;
};

/**
 * Generate a random, readable judge password using a CSPRNG
 * (crypto.randomInt), not Math.random(). Avoids visually ambiguous
 * characters (0/O, 1/l/I).
 */
export const generateJudgePassword = () => {
  const length = 10;
  const charset = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(randomInt(0, charset.length));
  }
  return password;
};
