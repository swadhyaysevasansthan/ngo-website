import { body, validationResult } from 'express-validator';
import { sanitizeReviewInput } from '../utils/reviewSanitizer.js';

export const validateReviewSubmission = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name must be less than 100 characters'),
  body('email').trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').optional()
    .isLength({ max: 20 }).withMessage('Phone must be less than 20 characters'),
  body('designation').optional()
    .isLength({ max: 100 }).withMessage('Designation must be less than 100 characters'),
  body('review_text').trim().notEmpty().withMessage('Review text is required')
    .isLength({ min: 20, max: 500 }).withMessage('Review must be between 20 and 500 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    req.body = sanitizeReviewInput(req.body);
    next();
  },
];

export const submitReviewRules = validateReviewSubmission;

export const refineReviewRules = [
  body('refined_review_text').trim().notEmpty().withMessage('Refined text is required.')
    .isLength({ min: 10 }).withMessage('Minimum 10 characters.')
    .isLength({ max: 600 }).withMessage('Maximum 600 characters.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    next();
  },
];

export const featureReviewRules = [
  body('is_featured').isBoolean().withMessage('is_featured must be a boolean.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    next();
  },
];

export const pinReviewRules = [
  body('is_pinned').isBoolean().withMessage('is_pinned must be a boolean.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    next();
  },
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  next();
};