
import express from "express";
import * as controller from "../controllers/users.controller.js";
import db from "../../config/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  getMe,
  updateMe,
  uploadDocumentHandler,
  uploadAvatar,
  deleteAvatar,
  getUsers,
  updateUserByAdmin,
} from "../controllers/users.controller.js";
import { upload } from "../../config/upload.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js"; // <-- Usar tus middleware existentes

dotenv.config();

const router = express.Router();

/* =========================
   RUTAS ADMIN USUARIOS
========================= */
router.get("/users", authenticate, authorize(["admin"]), getUsers); // admin lista usuarios
router.put("/admin/:id", authenticate, authorize(["admin"]), updateUserByAdmin); // admin edita usuarios

/* =========================
   RUTAS PERFIL USUARIO LOGUEADO
========================= */
router.get("/me", authenticate, getMe);
router.put("/me", authenticate, updateMe);
router.post("/me/documents", authenticate, uploadDocumentHandler);
router.post("/me/avatar", authenticate, upload.single("file"), uploadAvatar);
router.delete("/me/avatar", authenticate, deleteAvatar);
router.put("/:id/toggle", authenticate, controller.toggleStatus);
/* =========================
   RUTA PERFIL POR ID
========================= */
router.get("/:id", authenticate, controller.getUserById);

export default router;