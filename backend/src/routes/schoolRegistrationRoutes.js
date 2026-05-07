import express from 'express';
import { body, param, query } from 'express-validator';
import {
  validateToken,
  submitPaintingRegistration,
  submitQuizRegistration,
  listRegistrations,
  getRegistrationById,
  allotDate,
  sendConfirmationEmail,
} from '../controllers/schoolRegistrationController.js';
import { validateRequest } from '../middleware/validation.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// ─── Shared validation ──────────────────────────────────────

const tokenQueryValidation = [
  query('token')
    .notEmpty().withMessage('Registration token is required')
    .isLength({ min: 64, max: 64 }).withMessage('Invalid token format'),
];

const teacherValidation = [
  body('primaryTeacherName')
    .trim()
    .notEmpty().withMessage('Primary teacher name is required')
    .isLength({ min: 3, max: 255 }).withMessage('Teacher name must be between 3 and 255 characters'),

  body('primaryTeacherEmail')
    .trim()
    .notEmpty().withMessage('Primary teacher email is required')
    .isEmail().withMessage('Please provide a valid teacher email')
    .normalizeEmail(),

  body('primaryTeacherPhone')
    .trim()
    .notEmpty().withMessage('Primary teacher phone is required')
    .matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit Indian mobile number'),

  body('altTeacherName')
    .optional({ nullable: true })
    .trim()
    .isLength({ min: 3, max: 255 }).withMessage('Alternate teacher name must be between 3 and 255 characters'),

  body('altTeacherEmail')
    .optional({ nullable: true })
    .trim()
    .isEmail().withMessage('Please provide a valid alternate teacher email')
    .normalizeEmail(),

  body('altTeacherPhone')
    .optional({ nullable: true })
    .trim()
    .matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit Indian mobile number for alternate teacher'),
];

const preferredDatesValidation = [
  body('preferredDates')
    .isArray({ min: 4, max: 4 }).withMessage('Please provide exactly 4 preferred dates'),

  body('preferredDates.*')
    .isISO8601().withMessage('Each preferred date must be a valid date (YYYY-MM-DD)')
    .custom((date) => {
      const d = new Date(date);
      const min = new Date('2026-05-01');
      const max = new Date('2027-02-28');
      if (d < min || d > max) {
        throw new Error('All preferred dates must be between 1 May 2026 and 28 February 2027');
      }
      return true;
    }),
];

const paintingValidation = [
  ...tokenQueryValidation,
  ...teacherValidation,
  ...preferredDatesValidation,

  body('classCounts')
    .notEmpty().withMessage('Class-wise student counts are required')
    .isObject().withMessage('Class counts must be an object'),

  body('classCounts.3')
    .isInt({ min: 0 }).withMessage('Class 3 count must be a non-negative integer'),

  body('classCounts.4')
    .isInt({ min: 0 }).withMessage('Class 4 count must be a non-negative integer'),

  body('classCounts.5')
    .isInt({ min: 0 }).withMessage('Class 5 count must be a non-negative integer'),

  body('totalParticipants')
    .isInt({ min: 1, max: 200 })
    .withMessage('Total participants must be between 1 and 200'),
];

const quizValidation = [
  ...tokenQueryValidation,
  ...teacherValidation,
  ...preferredDatesValidation,

  body('classCounts')
    .notEmpty().withMessage('Class-wise student counts are required')
    .isObject().withMessage('Class counts must be an object'),

  body('classCounts.6')
    .isInt({ min: 0 }).withMessage('Class 6 count must be a non-negative integer'),

  body('classCounts.7')
    .isInt({ min: 0 }).withMessage('Class 7 count must be a non-negative integer'),

  body('classCounts.8')
    .isInt({ min: 0 }).withMessage('Class 8 count must be a non-negative integer'),

  body('totalParticipants')
    .isInt({ min: 1, max: 50 })
    .withMessage('Total participants must be between 1 and 50'),

  body('availableComputers')
    .isInt({ min: 1 })
    .withMessage('Number of available computers must be at least 1'),
];

// ─── Public routes ──────────────────────────────────────────

// GET /api/school-registration/validate?token=...
router.get(
  '/validate',
  tokenQueryValidation,
  validateRequest,
  validateToken
);

// POST /api/school-registration/painting?token=...
router.post(
  '/painting',
  rateLimiter,
  paintingValidation,
  validateRequest,
  submitPaintingRegistration
);

// POST /api/school-registration/quiz?token=...
router.post(
  '/quiz',
  rateLimiter,
  quizValidation,
  validateRequest,
  submitQuizRegistration
);

// ─── Admin routes ───────────────────────────────────────────

// GET /api/school-registration/admin/:competitionType
router.get(
  '/admin/:competitionType',
  verifyAdmin,
  param('competitionType')
    .isIn(['painting', 'quiz']).withMessage('Competition type must be painting or quiz'),
  validateRequest,
  listRegistrations
);

// GET /api/school-registration/admin/detail/:id
router.get(
  '/admin/detail/:id',
  verifyAdmin,
  param('id').isInt({ min: 1 }).withMessage('Invalid registration ID'),
  validateRequest,
  getRegistrationById
);

// PATCH /api/school-registration/admin/:id/allot-date
router.patch(
  '/admin/:id/allot-date',
  verifyAdmin,
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid registration ID'),
    body('allottedDate')
      .notEmpty().withMessage('Allotted date is required')
      .isISO8601().withMessage('Please provide a valid date (YYYY-MM-DD)')
      .custom((date) => {
        const d = new Date(date);
        const min = new Date('2026-05-01');
        const max = new Date('2027-02-28');
        if (d < min || d > max) {
          throw new Error('Allotted date must be within the event window');
        }
        return true;
      }),
  ],
  validateRequest,
  allotDate
);

// POST /api/school-registration/admin/:id/send-confirmation
router.post(
  '/admin/:id/send-confirmation',
  verifyAdmin,
  param('id').isInt({ min: 1 }).withMessage('Invalid registration ID'),
  validateRequest,
  sendConfirmationEmail
);

export default router;