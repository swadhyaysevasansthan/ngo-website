import express from 'express';
import {
  createRegistrationOrder,
  verifyRegistrationPayment,
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-order', createRegistrationOrder);
router.post('/verify', verifyRegistrationPayment);

export default router;
