import express from 'express';
import { downloadAllSubmissions, downloadByCategory } from '../controllers/downloadController.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (require admin authentication)
router.get('/all', verifyAdmin, downloadAllSubmissions);
router.get('/category/:category', verifyAdmin, downloadByCategory);

export default router;
