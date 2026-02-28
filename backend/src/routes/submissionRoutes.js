import express from 'express';
import { body } from 'express-validator';
import { submitPhoto, getSubmissionByParticipant } from '../controllers/submissionController.js';
import { validateRequest } from '../middleware/validation.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// New validation rules (minimal)
const submissionValidation = [
  body('participantId')
    .trim()
    .notEmpty()
    .withMessage('Participant ID is required'),

  body('captureLocation')
    .trim()
    .notEmpty()
    .withMessage('Capture location is required'),

  body('captureDate')
    .notEmpty()
    .withMessage('Capture date is required')
    .isISO8601()
    .withMessage('Please provide a valid date')
    .custom(value => {
      const date = new Date(value);
      const min = new Date('2025-09-01');
      if (date < min) {
        throw new Error('Capture date must be on or after 1st September 2025.');
      }
      return true;
    }),

  body('cameraModel')
    .trim()
    .notEmpty()
    .withMessage('Camera or mobile model is required'),
];

// Routes
router.post(
  '/submit',
  rateLimiter,
  upload.single('photograph'),   // field name from frontend
  submissionValidation,
  validateRequest,
  submitPhoto
);

router.get('/:participantId', getSubmissionByParticipant);

export default router;
