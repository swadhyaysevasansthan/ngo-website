import express from 'express';
import { body, query, param } from 'express-validator';

import {
  validateToken,
  submitPaintingRegistration,
  submitQuizRegistration,
  listRegistrations,
  allotPaintingDates,
  allotQuizDate,
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

  body('competitionCategories')
    .isArray({ min: 1 })
    .withMessage(
      'At least one competition category must be selected'
    ),

  body('classCounts')
    .isObject()
    .withMessage('Class counts are required'),

  body('totalParticipants')
    .isInt({ min: 1 })
    .withMessage(
      'Total participants must be greater than 0'
    ),

  body('primaryCategoryTotal')
    .optional()
    .isInt({ min: 0 })
    .withMessage(
      'Primary category total must be valid'
    ),

  body('secondaryCategoryTotal')
    .optional()
    .isInt({ min: 0 })
    .withMessage(
      'Secondary category total must be valid'
    ),

  body('primaryPreferredDates')
    .optional()
    .isArray()
    .withMessage(
      'Primary preferred dates must be an array'
    ),

  body('secondaryPreferredDates')
    .optional()
    .isArray()
    .withMessage(
      'Secondary preferred dates must be an array'
    ),
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
  '/admin/:id/allot-painting-dates',
  verifyAdmin,

  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid registration ID'),

  body().custom((value, { req }) => {

    const {
      primaryAllottedDate,
      secondaryAllottedDate,
    } = req.body;

    if (
      !primaryAllottedDate &&
      !secondaryAllottedDate
    ) {
      throw new Error(
        'At least one allotted date is required'
      );
    }

    return true;
  }),

  validateRequest,

  allotPaintingDates
);

router.patch(
  '/admin/:id/allot-quiz-date',
  verifyAdmin,

  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid registration ID'),

  body('allottedDate')
    .notEmpty()
    .withMessage('Allotted date required'),

  validateRequest,

  allotQuizDate
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