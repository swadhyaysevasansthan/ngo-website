import { nanoid } from 'nanoid';

/**
 * Generate unique participant ID
 * Format: SNPC2026-XXXXXXXX
 */
export const generateParticipantId = () => {
  const prefix = 'SNPC2026';
  const uniqueId = nanoid(8).toUpperCase();
  return `${prefix}-${uniqueId}`;
};

/**
 * Generate random password for participant login
 */
export const generatePassword = () => {
  const length = 8;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};
