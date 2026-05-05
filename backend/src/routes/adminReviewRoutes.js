import express from 'express';
import {
  getAdminReviews, approveReview, rejectReview,
  refineReview, featureReview, pinReview,
  deleteReview, getReviewVersions,
} from '../controllers/reviewController.js';
import { verifyAdmin } from '../middleware/auth.js';
import {
  refineReviewRules, featureReviewRules, pinReviewRules,
} from '../middleware/reviewValidation.js';

const router = express.Router();

router.use(verifyAdmin);

router.get('/', getAdminReviews);
router.put('/:id/approve', approveReview);
router.put('/:id/reject', rejectReview);
router.put('/:id/refine', refineReviewRules, refineReview);
router.put('/:id/feature', featureReviewRules, featureReview);
router.put('/:id/pin', pinReviewRules, pinReview);
router.delete('/:id', deleteReview);
router.get('/:id/versions', getReviewVersions);

export default router;