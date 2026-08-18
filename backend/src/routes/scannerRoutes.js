import express from 'express';
import { scannerLogin, scannerMe } from '../controllers/scannerAuthController.js';
import { checkInPass } from '../controllers/checkInController.js';
import { verifyScanner } from '../middleware/scannerAuth.js';

const router = express.Router();

// Public scanner routes
router.post('/login', scannerLogin);

// Authenticated scanner routes
router.use(verifyScanner);
router.get('/me', scannerMe);
router.post('/checkin', checkInPass);

export default router;
