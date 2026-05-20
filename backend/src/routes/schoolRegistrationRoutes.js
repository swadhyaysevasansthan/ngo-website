import express from 'express';
import { body, query, param } from 'express-validator';

import {
  validateToken,
  submitPaintingRegistration,
  submitQuizRegistration,
  listRegistrations,
  allotDate,
  sendConfirmation,
} from '../controllers/schoolRegistrationController.js';

import { validateRequest } from '../middleware/validation.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// ─────────────────────────────────────────────
// Shared Validations
// ─────────────────────────────────────────────

const tokenValidation = [
  query('token')
    .trim()
    .notEmpty()
    .withMessage('Registration token is required'),
];

const teachersValidation = [
  body('teachers')
    .isArray({ min: 1 })
    .withMessage('At least one teacher is required'),

  body('teachers.*.name')
    .trim()
    .notEmpty()
    .withMessage('Teacher name is required'),

  body('teachers.*.email')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Valid teacher email required'),

  body('teachers.*.phone')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Valid Indian mobile number required'),
];

// ─────────────────────────────────────────────
// Painting Validation
// ─────────────────────────────────────────────

const paintingValidation = [
  ...tokenValidation,
  ...teachersValidation,

  body('classCounts')
    .isObject()
    .withMessage('Class counts are required'),

  body('totalParticipants')
    .isInt({ min: 1 })
    .withMessage('Total participants must be greater than 0'),

  body('primaryCategoryTotal')
    .isInt({ min: 0 })
    .withMessage('Primary category total is required'),

  body('secondaryCategoryTotal')
    .isInt({ min: 0 })
    .withMessage('Secondary category total is required'),

  body('preferredDates')
    .isArray({ min: 1 })
    .withMessage('Preferred dates are required'),
];

// ─────────────────────────────────────────────
// Quiz Validation
// ─────────────────────────────────────────────

const quizValidation = [
  ...tokenValidation,
  ...teachersValidation,

  body('classCounts')
    .isObject()
    .withMessage('Class counts are required'),

  body('totalParticipants')
    .isInt({ min: 1 })
    .withMessage('Total participants must be greater than 0'),

  body('availableComputers')
    .isInt({ min: 1 })
    .withMessage('Available computers required'),

  body('preferredDates')
    .isArray({ min: 1 })
    .withMessage('Preferred dates are required'),
];

// ─────────────────────────────────────────────
// Public Routes
// ─────────────────────────────────────────────

router.get(
  '/validate',
  tokenValidation,
  validateRequest,
  validateToken
);

router.post(
  '/painting',
  rateLimiter,
  paintingValidation,
  validateRequest,
  submitPaintingRegistration
);

router.post(
  '/quiz',
  rateLimiter,
  quizValidation,
  validateRequest,
  submitQuizRegistration
);

// ─────────────────────────────────────────────
// Admin Routes
// ─────────────────────────────────────────────

router.get(
  '/admin/:competitionType',
  verifyAdmin,
  param('competitionType')
    .isIn(['painting', 'quiz'])
    .withMessage('Invalid competition type'),

  validateRequest,
  listRegistrations
);

router.patch(
  '/admin/:id/allot-date',
  verifyAdmin,

  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid registration ID'),

  body('allottedDate')
    .notEmpty()
    .withMessage('Allotted date is required'),

  validateRequest,

  allotDate
);

router.post(
  '/admin/:id/send-confirmation',

  verifyAdmin,

  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid registration ID'),

  validateRequest,

  sendConfirmation
);

export default router;