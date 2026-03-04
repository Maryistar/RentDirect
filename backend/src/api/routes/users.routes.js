

import express from 'express';
import { getMe, updateMe, uploadDocumentHandler } from '../controllers/users.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { deleteAvatar } from "../controllers/users.controller.js";
const router = express.Router();

import { upload } from "../../config/upload.js";
import { uploadAvatar } from "../controllers/users.controller.js";

router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateMe);
router.post('/me/documents', authenticate, uploadDocumentHandler);

router.post(
  "/me/avatar",
  authenticate,
  upload.single("file"),
  uploadAvatar
);
router.delete("/me/avatar", authenticate, deleteAvatar);

export default router;
