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

const accessRequestValidation = [
  body('schoolName')
    .trim()
    .notEmpty().withMessage('School name is required')
    .isLength({ min: 3, max: 255 }).withMessage('School name must be between 3 and 255 characters'),

  body('schoolEmail1')
    .trim()
    .notEmpty().withMessage('School email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('schoolEmail2')
    .trim()
    .notEmpty().withMessage('Alternate school email is required')
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

  body('landlineNumber')
    .trim()
    .notEmpty()
    .withMessage('Landline number is required')
    .matches(/^[0-9]{2,5}-?[0-9]{5,8}$/)
    .withMessage('Please enter a valid landline number with area code'),

  body('mobileNumber')
    .trim()
    .notEmpty()
    .withMessage('Mobile number is required')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit mobile number'),

  body('hasEcoClub')
    .exists().withMessage('Please indicate if your school has an Eco Club')
    .custom((value) => {
      return value === true ||
            value === false ||
            value === 'true' ||
            value === 'false';
    })
    .withMessage('Eco Club field must be true or false'),

  body('principalName')
    .trim()
    .notEmpty().withMessage('Principal name is required')
    .isLength({ min: 3, max: 255 }).withMessage('Principal name must be between 3 and 255 characters'),

  body('principalPhone')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit Indian mobile number'),

  body('principalEmail')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isEmail().withMessage('Please provide a valid principal email address')
    .normalizeEmail(),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Notes must not exceed 1000 characters'),

  body().custom((value, { req }) => {

    // EMAIL CHECK
    if (
      req.body.schoolEmail1 &&
      req.body.schoolEmail2 &&
      req.body.schoolEmail1.trim().toLowerCase() ===
      req.body.schoolEmail2.trim().toLowerCase()
    ) {
      throw new Error(
        'Primary and alternate school email cannot be the same'
      );
    }

    // PHONE CHECK
    const landline =
      req.body.landlineNumber
        ?.replace(/[-\s]/g, '');

    const mobile =
      req.body.mobileNumber
        ?.replace(/[-\s]/g, '');

    if (
      landline &&
      mobile &&
      landline === mobile
    ) {
      throw new Error(
        'Landline and mobile number cannot be the same'
      );
    }

    return true;
  }),
  ];

const rejectValidation = [
  param('id').isInt({ min: 1 }).withMessage('Invalid request ID'),
  body('rejectionReason')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Rejection reason must not exceed 500 characters'),
];

router.post(
  '/request',
  rateLimiter,
  accessRequestValidation,
  validateRequest,
  createAccessRequest
);

router.get(
  '/admin/requests',
  verifyAdmin,
  listAccessRequests
);

router.get(
  '/admin/requests/:id',
  verifyAdmin,
  param('id').isInt({ min: 1 }).withMessage('Invalid request ID'),
  validateRequest,
  getAccessRequestById
);

router.patch(
  '/admin/requests/:id/approve',
  verifyAdmin,
  param('id').isInt({ min: 1 }).withMessage('Invalid request ID'),
  validateRequest,
  approveAccessRequest
);

router.patch(
  '/admin/requests/:id/reject',
  verifyAdmin,
  rejectValidation,
  validateRequest,
  rejectAccessRequest
);

router.post(
  '/admin/requests/:id/resend-link',
  verifyAdmin,
  param('id').isInt({ min: 1 }).withMessage('Invalid request ID'),
  validateRequest,
  resendMagicLink
);

export default router;