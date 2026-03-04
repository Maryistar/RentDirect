import * as usersRepository from "../../repositories/users.repository.js";
import * as userService from '../../services/users.service.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

/* =========================
   OBTENER PERFIL
========================= */
export async function getMe(req, res, next) {
  try {
    const user = await userService.getUserById(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

/* =========================
   ACTUALIZAR PERFIL
   🔥 CAMBIO AQUÍ
========================= */
export async function updateMe(req, res, next) {
  try {
    // 1️⃣ Actualizar usuario
    await userService.updateUser(req.user.id, req.body);

    // 2️⃣ 🔥 Buscar usuario completo actualizado
    const updatedUser = await userService.getUserById(req.user.id);

    // 3️⃣ Devolver TODO el usuario actualizado
    res.json(updatedUser);

  } catch (err) {
    next(err);
  }
}

/* =========================
   SUBIR DOCUMENTO
========================= */
export function uploadDocumentHandler(req, res, next) {
  upload.single('document')(req, res, async function (err) {
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
    console.log("REQ.FILE:", req.file);
    console.log("REQ.USER:", req.user);

    if (!req.file) {
      return res.status(400).json({ message: "No se envió archivo" });
    }

    const imageUrl = req.file.path;

    // Actualizar en base de datos
    await usersRepository.updateUserAvatar(req.user.id, imageUrl);

    res.json({ url: imageUrl });

  } catch (error) {
    console.error("ERROR REAL:", error);
    res.status(500).json({ message: "Error al subir imagen" });
  }
};

export const deleteAvatar = async (req, res) => {
  try {
    await usersRepository.updateUserAvatar(req.user.id, null);

    res.json({ message: "Avatar eliminado correctamente" });

  } catch (error) {
    console.error("ERROR ELIMINANDO:", error);
    res.status(500).json({ message: "Error al eliminar avatar" });
  }
};