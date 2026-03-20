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
    `
    SELECT 
      c.id,

      -- nombre del otro usuario
      CASE 
        WHEN c.owner_id = ? THEN u2.name
        ELSE u1.name
      END AS name,

      -- último mensaje
      m.message AS lastMessage,

      -- hora del último mensaje
      m.created_at AS lastMessageTime

    FROM chats c

    -- usuarios
    JOIN users u1 ON c.owner_id = u1.id
    JOIN users u2 ON c.tenant_id = u2.id

    -- último mensaje
    LEFT JOIN messages m ON m.id = (
      SELECT id FROM messages
      WHERE chat_id = c.id
      ORDER BY created_at DESC
      LIMIT 1
    )

    WHERE c.owner_id = ? OR c.tenant_id = ?

    ORDER BY m.created_at DESC
    `,
    [userId, userId, userId]
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