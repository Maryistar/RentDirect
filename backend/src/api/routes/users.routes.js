// users.routes.js

import express from "express";
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

/* =========================
   RUTA PERFIL POR ID
========================= */
router.get("/users/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const [users] = await db.query(
      "SELECT id, name, email, avatar, role FROM users WHERE id = ?",
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(users[0]);
  } catch (err) {
    console.error("ERROR GET USER BY ID:", err);
    res.status(500).json({ message: "Error al obtener perfil" });
  }
});

export default router;