import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { verifyAdmin } from '../middleware/auth.js';

import {
  uploadProfileImage,
  uploadCoverImage,
  uploadGalleryImages,
  deleteProfileImage,
  deleteCoverImage,
  deleteGalleryImage,
} from '../controllers/adminFarmerController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tempDir = path.join(__dirname, '../../uploads/temp');

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, tempDir),

  filename: (req, file, cb) =>
    cb(
      null,
      `${Date.now()}_${file.originalname}`
    ),
});

const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
});

const router = express.Router();

router.use(verifyAdmin);

router.post(
  '/:id/profile-image',
  upload.single('image'),
  uploadProfileImage
);

router.post(
  '/:id/cover-image',
  upload.single('image'),
  uploadCoverImage
);

router.post(
  '/:id/gallery',
  upload.array('images', 20),
  uploadGalleryImages
);

router.delete(
  '/:id/profile-image',
  verifyAdmin,
  deleteProfileImage
);

router.delete(
  '/:id/cover-image',
  verifyAdmin,
  deleteCoverImage
);

router.delete(
  '/:id/gallery',
  verifyAdmin,
  deleteGalleryImage
);

export default router;