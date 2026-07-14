import express from 'express';
import { body } from 'express-validator';
import { verifyAdmin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

import {
  syncEntries,
  getSettings,
  updateSettings,
  getResults,
  getConflicts,
  runQualification,
  getAuditLog,
  exportResults,
} from '../controllers/evaluationController.js';

import {
  createJudge,
  listJudges,
  updateJudge,
  deleteJudge,
  toggleJudgeActive,
  resetJudgePassword,
  getVerificationQueue,
  updateVerificationStatus,
  disqualifyEntry,
  requalifyEntry,
  getWinners,
  assignWinner,
  removeWinner,
} from '../controllers/adminJudgeController.js';

const router = express.Router();

// All routes here require admin auth
router.use(verifyAdmin);

// Entries / setup
router.post('/entries/sync', syncEntries);

// Judges
router.get('/judges', listJudges);
router.post(
  '/judges',
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  validateRequest,
  createJudge
);
router.put(
  '/judges/:id',
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  validateRequest,
  updateJudge
);
router.delete('/judges/:id', deleteJudge);
router.patch(
  '/judges/:id/active',
  body('isActive').isBoolean().withMessage('isActive must be boolean'),
  validateRequest,
  toggleJudgeActive
);
router.post('/judges/:id/reset-password', resetJudgePassword);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// Results / conflicts / qualification
router.get('/results', getResults);
router.get('/conflicts', getConflicts);
router.post('/qualify', runQualification);

// Round 1 disqualify / reinstate (distinct from verification disqualify)
router.patch('/entries/:entryId/disqualify', disqualifyEntry);
router.patch('/entries/:entryId/reinstate', requalifyEntry);

// Verification queue
router.get('/verification-queue', getVerificationQueue);
router.patch(
  '/entries/:entryId/verification',
  body('status')
    .isIn(['pending_verification', 'verified', 'disqualified', 'needs_clarification'])
    .withMessage('Invalid verification status'),
  validateRequest,
  updateVerificationStatus
);

// Winners
router.get('/winners', getWinners);
router.post(
  '/winners',
  body('entryId').isInt().withMessage('entryId is required'),
  body('prizeType').isIn(['first', 'second', 'third', 'consolation']).withMessage('Invalid prize type'),
  validateRequest,
  assignWinner
);
router.delete('/winners/:id', removeWinner);

// Audit log
router.get('/audit-log', getAuditLog);

// Exports
router.get('/export/:format', exportResults);

export default router;
