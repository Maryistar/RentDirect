import { Router } from 'express';
import * as controller from '../controllers/rental.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post(
  '/',
  authenticate,
  controller.createRental
);

router.get(
  '/my',
  authenticate,
  controller.listMyRentals
);

export default router;