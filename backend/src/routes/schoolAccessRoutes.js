import express from 'express';
import { body, param } from 'express-validator';
import {
  createAccessRequest,
  listAccessRequests,
  getAccessRequestById,
  approveAccessRequest,
  rejectAccessRequest,
  resendMagicLink,
} from '../controllers/schoolAccessController.js';
import { validateRequest } from '../middleware/validation.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// ─── Validation rules ───────────────────────────────────────

const accessRequestValidation = [
  body('schoolName')
    .trim()
    .notEmpty().withMessage('School name is required')
    .isLength({ min: 3, max: 255 }).withMessage('School name must be between 3 and 255 characters'),

  body('schoolEmail')
    .trim()
    .notEmpty().withMessage('School email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('schoolAddress')
    .trim()
    .notEmpty().withMessage('School address is required')
    .isLength({ min: 5 }).withMessage('Please provide a complete address'),

  body('city')
    .trim()
    .notEmpty().withMessage('City is required'),

  body('state')
    .trim()
    .notEmpty().withMessage('State is required'),

  body('boardOfEducation')
    .trim()
    .notEmpty().withMessage('Board of education is required'),

  body('hasEcoClub')
    .notEmpty().withMessage('Please indicate if your school has an Eco Club')
    .isBoolean().withMessage('Eco Club field must be true or false'),

  body('teacherName')
    .trim()
    .notEmpty().withMessage('Coordinating teacher name is required')
    .isLength({ min: 3, max: 255 }).withMessage('Teacher name must be between 3 and 255 characters'),

  body('teacherEmail')
    .trim()
    .notEmpty().withMessage('Teacher email is required')
    .isEmail().withMessage('Please provide a valid teacher email address')
    .normalizeEmail(),

  body('teacherPhone')
    .trim()
    .notEmpty().withMessage('Teacher phone number is required')
    .matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit Indian mobile number'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Notes must not exceed 1000 characters'),
];

const rejectValidation = [
  param('id').isInt({ min: 1 }).withMessage('Invalid request ID'),
  body('rejectionReason')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Rejection reason must not exceed 500 characters'),
];

// ─── Public routes ──────────────────────────────────────────

// POST /api/school-access/request
router.post(
  '/request',
  rateLimiter,
  accessRequestValidation,
  validateRequest,
  createAccessRequest
);

// ─── Admin routes ───────────────────────────────────────────

// GET /api/school-access/admin/requests
router.get(
  '/admin/requests',
  verifyAdmin,
  listAccessRequests
);

// GET /api/school-access/admin/requests/:id
router.get(
  '/admin/requests/:id',
  verifyAdmin,
  param('id').isInt({ min: 1 }).withMessage('Invalid request ID'),
  validateRequest,
  getAccessRequestById
);

// PATCH /api/school-access/admin/requests/:id/approve
router.patch(
  '/admin/requests/:id/approve',
  verifyAdmin,
  param('id').isInt({ min: 1 }).withMessage('Invalid request ID'),
  validateRequest,
  approveAccessRequest
);

// PATCH /api/school-access/admin/requests/:id/reject
router.patch(
  '/admin/requests/:id/reject',
  verifyAdmin,
  rejectValidation,
  validateRequest,
  rejectAccessRequest
);

// POST /api/school-access/admin/requests/:id/resend-link
router.post(
  '/admin/requests/:id/resend-link',
  verifyAdmin,
  param('id').isInt({ min: 1 }).withMessage('Invalid request ID'),
  validateRequest,
  resendMagicLink
);

export default router;