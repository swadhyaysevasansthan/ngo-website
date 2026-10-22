import express from 'express';
import {
  getQuizSettings,
  getPublicQuizSettings,
  updateQuizSettings,
} from '../controllers/quizSettingsController.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public — used by Quiz.jsx and QuestionBank.jsx at page load
router.get('/', getPublicQuizSettings);

// Admin — protected
router.get('/admin', verifyAdmin, getQuizSettings);
router.put('/admin', verifyAdmin, updateQuizSettings);

export default router;
