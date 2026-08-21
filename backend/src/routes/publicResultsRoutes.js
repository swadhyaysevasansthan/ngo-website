import express from 'express';
import { getGallery } from '../controllers/publicResultsController.js';

const router = express.Router();

// Public — no auth. Deliberately separate from evaluationRoutes.js,
// which applies router.use(verifyAdmin) to everything in that file.
router.get('/gallery', getGallery);

export default router;
