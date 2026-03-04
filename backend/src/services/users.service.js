import * as userRepository from '../repositories/users.repository.js';
import { uploadFile } from './files.service.js';

/* ================================
   OBTENER USUARIO
================================ */
export async function getUserById(userId) {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

/* ================================
   ACTUALIZAR PERFIL
================================ */
export async function updateUser(userId, data) {
  // Aquí puedes agregar validaciones futuras

  await userRepository.update(userId, data);

  return await userRepository.findById(userId); // 🔥 devolvemos usuario actualizado
}

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