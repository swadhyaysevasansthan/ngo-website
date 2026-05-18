import express from 'express';
import { getPublicTopics, getPublicTopicBySlug } from '../controllers/communityController.js';

const router = express.Router();

router.get('/', getPublicTopics);
router.get('/:slug', getPublicTopicBySlug);

export default router;
