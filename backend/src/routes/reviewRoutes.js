import express from 'express';
import rateLimit from 'express-rate-limit';
import { submitReview, getPublicReviews, getFeaturedReviews } from '../controllers/reviewController.js';
import { submitReviewRules } from '../middleware/reviewValidation.js';

const router = express.Router();

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { success: false, message: 'Too many submissions. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', submitLimiter, submitReviewRules, submitReview);
router.get('/', getPublicReviews);
router.get('/featured', getFeaturedReviews);

export default router;