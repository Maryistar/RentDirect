import { Router } from 'express';
import * as controller from '../controllers/contracts.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authenticate, controller.create);
router.get("/chat/:chatId", controller.getByChat);
router.put("/:id/accept", authenticate, controller.accept);


export default router;