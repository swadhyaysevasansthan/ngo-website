import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for registration endpoint
 * Prevents spam and abuse
 */
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 requests per IP
  message: {
    success: false,
    message: 'Too many registration attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
