import * as controller from "../controllers/properties.controller.js";
import express from 'express';
import multer from 'multer';
import {
  listAvailableProperties,
  listOwnerProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty
} from '../controllers/properties.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';

const router = express.Router();
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

/* =========================
   PUBLIC
========================= */
router.get('/', listAvailableProperties);

/* =========================
   OWNER (⚠️ ANTES de /:id)
========================= */
router.get(
  '/my',
  authenticate,
  authorize(['owner', 'admin']),
  listOwnerProperties
);

/* =========================
   PUBLIC POR ID
========================= */
router.get('/:id', getProperty);

/* =========================
   OWNER CRUD
========================= */
router.post(
  '/',
  authenticate,
  authorize(['owner', 'admin']),
  upload.array('images', 8),
  createProperty
);

router.put(
  '/:id',
  authenticate,
  authorize(['owner', 'admin']),
  upload.array('images', 8),
  updateProperty
);

router.delete(
  '/:id',
  authenticate,
  authorize(['owner', 'admin']),
  deleteProperty
);

router.get("/admin", authenticate, controller.listAllProperties);

export default router;
