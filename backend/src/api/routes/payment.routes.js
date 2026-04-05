import express from 'express';
import { createOrder, captureOrder } from '../controllers/payment.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/payments/create-order', authenticate, createOrder);
router.post('/payments/capture-order', authenticate, captureOrder);

export default router;