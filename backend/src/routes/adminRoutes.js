import express from 'express';
import { body } from 'express-validator';
import {
  adminLogin,
  getAllParticipants,
  getDashboardStats,
  sendBulkEmail,
  updateSubmissionStatus,
} from '../controllers/adminController.js';
import { verifyAdmin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();

// Login validation
const loginValidation = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Bulk email validation
const bulkEmailValidation = [
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('recipients')
    .isIn(['all', 'submitted', 'pending'])
    .withMessage('Invalid recipient type'),
];

// Public
router.post('/login', loginValidation, validateRequest, adminLogin);

// Protected
router.get('/participants', verifyAdmin, getAllParticipants);
router.patch(
  '/participants/:participantId/submission-status',
  verifyAdmin,
  body('hasSubmitted')
    .isBoolean()
    .withMessage('hasSubmitted must be boolean'),
  validateRequest,
  updateSubmissionStatus
);
router.get('/stats', verifyAdmin, getDashboardStats);
router.post(
  '/bulk-email',
  verifyAdmin,
  bulkEmailValidation,
  validateRequest,
  sendBulkEmail
);

export default router;
