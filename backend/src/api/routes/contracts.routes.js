import { Router } from 'express';
import * as controller from '../controllers/contracts.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authenticate, controller.create);
router.get("/", authenticate, controller.getAll);
router.get("/chat/:chatId", controller.getByChat);
router.put("/:id/accept", authenticate, controller.accept);
router.get("/:id/pdf", controller.downloadPDF);
router.put("/:id/reject", authenticate, controller.reject);
router.delete("/:id", authenticate, controller.remove);

export default router;