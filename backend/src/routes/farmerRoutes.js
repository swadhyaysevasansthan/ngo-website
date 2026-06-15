import express from 'express';

import {
  getAllFarmers,
  getFarmerBySlug,
  adminGetFarmers,
  createFarmer,
  updateFarmer,
  deleteFarmer,
  getFarmerCategories,
  createFarmerCategory,
  updateFarmerCategory,
  deleteFarmerCategory,
} from '../controllers/farmerController.js';

import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// ADMIN ROUTES FIRST
router.get('/admin/all', verifyAdmin, adminGetFarmers);

router.post('/admin', verifyAdmin, createFarmer);

router.put('/admin/:id', verifyAdmin, updateFarmer);

router.delete('/admin/:id', verifyAdmin, deleteFarmer);

router.get('/categories/all', getFarmerCategories);

router.post('/categories', verifyAdmin, createFarmerCategory);

router.put('/categories/:id', verifyAdmin, updateFarmerCategory);

router.delete('/categories/:id', verifyAdmin, deleteFarmerCategory);

// PUBLIC ROUTES AFTER
router.get('/', getAllFarmers);

router.get('/:slug', getFarmerBySlug);

export default router;