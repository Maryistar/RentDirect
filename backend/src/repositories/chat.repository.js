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

// 🔹 Obtener chat por ID (NO TOCAR MÁS)
export async function getChatById(chatId) {
  const [rows] = await pool.execute(
    `
    SELECT 
      c.*,

      a.id AS applicationId,
      a.status AS applicationStatus,
      
      tenant.name AS tenant_name,
      owner.name AS owner_name,

      p.address AS property_address,
      p.description AS property_description

    FROM chats c

    LEFT JOIN applications a
      ON a.property_id = c.property_id
      AND a.tenant_id = c.tenant_id

    LEFT JOIN users tenant ON tenant.id = c.tenant_id
    LEFT JOIN users owner ON owner.id = c.owner_id

    LEFT JOIN properties p ON p.id = c.property_id

    WHERE c.id = ?
    `,
    [chatId]
  );

  return rows[0];
}

// 🔹 🔥 ESTA ERA LA QUE FALTABA (CRÍTICA)
export async function getUserChats(userId) {
  const [rows] = await pool.execute(
    `
    SELECT 
      c.id,
      c.property_id,
      c.owner_id,
      c.tenant_id,

      a.id AS applicationId,
      a.status AS applicationStatus,

      -- 🔥 ESTE YA RESUELVE EL NOMBRE
      IF(c.owner_id = ?, u2.name, u1.name) AS name,

      m.message AS lastMessage,
      m.created_at AS lastMessageTime

    FROM chats c

    LEFT JOIN applications a 
      ON a.property_id = c.property_id 
      AND a.tenant_id = c.tenant_id

    LEFT JOIN users u1 ON c.owner_id = u1.id
    LEFT JOIN users u2 ON c.tenant_id = u2.id

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