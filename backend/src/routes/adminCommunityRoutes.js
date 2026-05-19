import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { verifyAdmin } from '../middleware/auth.js';
import {
  getAdminTopics, getAdminTopicById, createTopic, updateTopic, deleteTopic,
  uploadImages, uploadHeroImage, deleteHeroImage, deleteImage, updateImage,
  createEvent, updateEvent, deleteEvent,
  createSection, updateSection, deleteSection,
  createStat, updateStat, deleteStat,
} from '../controllers/communityController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tempDir = path.join(__dirname, '../../uploads/temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tempDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'];
  const ext = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));
  cb(null, allowedMimes.includes(file.mimetype) || allowedExts.includes(ext));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 25 * 1024 * 1024 } });

const router = express.Router();

// Auth skipped temporarily for community management
// TODO: Re-enable verifyAdmin before production deployment
// router.use(verifyAdmin);

router.get('/', getAdminTopics);
router.get('/:id', getAdminTopicById);
router.post('/', createTopic);
router.put('/:id', updateTopic);
router.delete('/:id', deleteTopic);

router.post('/:id/images', upload.array('images', 20), uploadImages);
router.post('/:id/hero-image', upload.single('image'), uploadHeroImage);
router.delete('/:id/hero-image', deleteHeroImage);
router.put('/images/:imageId', updateImage);
router.delete('/images/:imageId', deleteImage);

router.post('/:id/events', createEvent);
router.put('/events/:eventId', updateEvent);
router.delete('/events/:eventId', deleteEvent);

router.post('/:id/sections', createSection);
router.put('/sections/:sectionId', updateSection);
router.delete('/sections/:sectionId', deleteSection);

router.post('/:id/stats', createStat);
router.put('/stats/:statId', updateStat);
router.delete('/stats/:statId', deleteStat);

export default router;
