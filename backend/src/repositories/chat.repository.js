import pool from '../config/db.js';

// 🔹 Crear chat
export async function createChat({ propertyId, ownerId, tenantId }) {
  const [result] = await pool.execute(
    `INSERT INTO chats (property_id, owner_id, tenant_id)
     VALUES (?, ?, ?)`,
    [propertyId, ownerId, tenantId]
  );

  return result.insertId;
}

// 🔹 Buscar chat por propiedad y usuarios
export async function findExistingChat(propertyId, ownerId, tenantId) {
  const [rows] = await pool.execute(
    `SELECT * FROM chats
     WHERE property_id = ?
     AND owner_id = ?
     AND tenant_id = ?`,
    [propertyId, ownerId, tenantId]
  );

  return rows[0];
}

// 🔹 Obtener chats del usuario
export async function getUserChats(userId) {
  const [rows] = await pool.execute(
    `SELECT * FROM chats
     WHERE owner_id = ? OR tenant_id = ?
     ORDER BY created_at DESC`,
    [userId, userId]
  );

  return rows;
}

// 🔹 Guardar mensaje
export async function saveMessage({ chatId, senderId, message }) {
  const [result] = await pool.execute(
    `INSERT INTO messages (chat_id, sender_id, message)
     VALUES (?, ?, ?)`,
    [chatId, senderId, message]
  );

  return result.insertId;
}

// 🔹 Obtener mensajes de un chat
export async function getChatMessages(chatId) {
  const [rows] = await pool.execute(
    `SELECT m.*, u.name
     FROM messages m
     JOIN users u ON m.sender_id = u.id
     WHERE chat_id = ?
     ORDER BY created_at ASC`,
    [chatId]
  );

  return rows;
}