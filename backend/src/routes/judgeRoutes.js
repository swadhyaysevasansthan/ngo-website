import express from 'express';
import { body } from 'express-validator';
import { judgeLogin } from '../controllers/judgeAuthController.js';
import {
  getDashboard,
  getEntries,
  getEntryDetail,
  getNextPendingEntry,
  submitScore,
  getProfile,
} from '../controllers/judgeController.js';
import { verifyJudge } from '../middleware/judgeAuth.js';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();

const loginValidation = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const scoreValidation = [
  body('round').isInt({ min: 1, max: 2 }).withMessage('Round must be 1 or 2'),
  body('score').isInt({ min: 0, max: 5 }).withMessage('Score must be a whole number between 0 and 5'),
];

// Public
router.post('/login', loginValidation, validateRequest, judgeLogin);

// Protected (judge JWT only)
router.get('/me', verifyJudge, getProfile);
router.get('/dashboard', verifyJudge, getDashboard);
router.get('/entries', verifyJudge, getEntries);
router.get('/entries/next', verifyJudge, getNextPendingEntry);
router.get('/entries/:entryId', verifyJudge, getEntryDetail);
router.post('/entries/:entryId/score', verifyJudge, scoreValidation, validateRequest, submitScore);

export default router;
