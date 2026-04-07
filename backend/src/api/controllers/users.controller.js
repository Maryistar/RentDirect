import * as usersRepository from "../../repositories/users.repository.js";
import * as userService from "../../services/users.service.js";
import multer from "multer";
import pool from "../../config/db.js";

const upload = multer({ storage: multer.memoryStorage() });

/* =========================
   OBTENER PERFIL (PROPIO)
========================= */
export async function getMe(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "No autorizado - token inválido",
      });
    }

    const user = await usersRepository.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    return res.json(user);

  } catch (err) {
    console.error("ERROR getMe:", err);
    next(err);
  }
}

/* =========================
   OBTENER USUARIO POR ID (ADMIN / PUBLIC)
========================= */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await usersRepository.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    res.json(user);

  } catch (error) {
    console.error("GET USER BY ID ERROR:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

/* =========================
   ACTUALIZAR PERFIL
========================= */
export async function updateMe(req, res, next) {
  try {
    await userService.updateUser(req.user.id, req.body);

    const updatedUser = await usersRepository.findById(req.user.id);

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
}

/* =========================
   SUBIR DOCUMENTO
========================= */
export function uploadDocumentHandler(req, res, next) {
  upload.single("document")(req, res, async function (err) {
    if (err) return next(err);

    try {
      const result = await userService.uploadUserDocument(
        req.user.id,
        req.file,
        req.body.type
      );

      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  });
}

/* =========================
   SUBIR AVATAR
========================= */
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se envió archivo" });
    }

    const imageUrl = req.file.path;

    await usersRepository.updateUserAvatar(req.user.id, imageUrl);

    res.json({ url: imageUrl });

  } catch (error) {
    console.error("ERROR REAL:", error);
    res.status(500).json({ message: "Error al subir imagen" });
  }
};

/* =========================
   ELIMINAR AVATAR
========================= */
export const deleteAvatar = async (req, res) => {
  try {
    await usersRepository.updateUserAvatar(req.user.id, null);

    res.json({ message: "Avatar eliminado correctamente" });
  } catch (error) {
    console.error("ERROR ELIMINANDO:", error);
    res.status(500).json({ message: "Error al eliminar avatar" });
  }
};

/* =========================
   LISTAR USUARIOS (ADMIN)
========================= */
export const getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, name, email, role, status
      FROM users
      WHERE deleted_at IS NULL
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

/* =========================
   ACTUALIZAR USUARIO (ADMIN)
========================= */
export const updateUserByAdmin = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { name, email, role, phone, status } = req.body;

    const user = await usersRepository.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    await usersRepository.updateUser(userId, { name, email, role, phone, status });

    const updatedUser = await usersRepository.findById(userId);

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};

/* =========================
   CAMBIAR STATUS (ADMIN)
========================= */
export async function toggleStatus(req, res) {
  try {
    const { id } = req.params;

    const status = await userService.toggleUserStatus(id);

    res.json({ status });

  } catch (error) {
    console.error("💥 ERROR TOGGLE USER:", error);
    res.status(500).json({ message: "Error cambiando estado" });
  }
}