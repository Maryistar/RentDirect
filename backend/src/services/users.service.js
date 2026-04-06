import * as userRepository from '../repositories/users.repository.js';
import { uploadFile } from './files.service.js';
import pool from "../config/db.js";

/* ================================
   OBTENER USUARIO
================================ */
export async function getUserById(userId) {
  const user = await userRepository.findById(userId);

  if (!user) {
    return null;
  }

  return user;
}

/* ================================
   ACTUALIZAR PERFIL
================================ */
export const updateUser = async (id, data) => {
  const { name, last_name, email, description } = data;

  await pool.query(
    `
    UPDATE users
    SET 
      name = ?, 
      last_name = ?, 
      email = ?, 
      description = ?
    WHERE id = ?
    `,
    [
      name || null,
      last_name || null,
      email || null,
      description || null,
      id
    ]
  );
};

/* ================================
   SUBIR DOCUMENTO
================================ */
export async function uploadUserDocument(userId, file, type) {
  if (!file) {
    throw new Error('No file');
  }

  const url = await uploadFile(file);

  await userRepository.insertDocument(
    userId,
    type || 'other',
    url
  );

  return { url };
}

export async function toggleUserStatus(id) {
  return await userRepository.toggleUserStatus(id);
}