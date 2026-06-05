import express from 'express';

import {
  trackVisitor,
  getVisitorCount
} from '../controllers/visitorController.js';

const router = express.Router();

router.post('/track', trackVisitor);

router.get('/count', getVisitorCount);

export default router;