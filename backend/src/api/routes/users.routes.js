// backend/src/api/routes/user.routes.js
import express from "express";
import db from "../../config/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  getMe,
  updateMe,
  uploadDocumentHandler,
  uploadAvatar,
  deleteAvatar
} from "../controllers/users.controller.js";
import { upload } from "../../config/upload.js";

dotenv.config();

const router = express.Router();

/* =========================
   MIDDLEWARE AUTENTICACIÓN
========================= */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 🔥 USAR EL MISMO SECRET EN TODO EL PROYECTO
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();

  } catch (err) {
    console.log("JWT ERROR:", err.message); // 🔍 debug útil
    return res.status(401).json({ message: "Token inválido" });
  }
};

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