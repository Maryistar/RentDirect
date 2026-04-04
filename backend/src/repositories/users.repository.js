import db from '../config/db.js';

/* ================================
   OBTENER USUARIO POR ID
================================ */
export async function findById(userId) {
  const [rows] = await db.query(
    `SELECT 
        id,
        email,
        name,
        cedula,
        role,
        score,
        status,
        phone,
        avatar,
        description,
        created_at
     FROM users
     WHERE id = ?`,
    [userId]
  );

  return rows[0] || null;
}

/* ================================
   ACTUALIZAR DATOS DEL USUARIO
================================ */
export async function update(userId, data) {
  const {
    name = null,
    phone = null,
    email = null,
    description = null
  } = data;

  const query = `
    UPDATE users
    SET 
      name = ?,
      phone = ?,
      email = ?,
      description = ?
    WHERE id = ?
  `;

  await db.query(query, [
    name,
    phone,
    email,
    description,
    userId
  ]);
}

/* ================================
   ACTUALIZAR AVATAR
================================ */
export async function updateUserAvatar(userId, avatarUrl) {
  const query = `
    UPDATE users
    SET avatar = ?
    WHERE id = ?
  `;

  await db.query(query, [avatarUrl, userId]);
}

/* ================================
   ELIMINAR AVATAR
================================ */
export async function removeUserAvatar(userId) {
  const query = `
    UPDATE users
    SET avatar = NULL
    WHERE id = ?
  `;

  await db.query(query, [userId]);
}

/* ================================
   INSERTAR DOCUMENTO
================================ */
export async function insertDocument(userId, type, url) {
  const query = `
    INSERT INTO documents (user_id, type, url, status)
    VALUES (?, ?, ?, ?)
  `;

  await db.query(query, [
    userId,
    type,
    url,
    'pending'
  ]);
}

export const getUserById = async (id) => {
  const [rows] = await db.query(
    "SELECT id, name, email, role, phone, status FROM users WHERE id = ?",
    [id]
  );
  return rows[0]; // retorna un usuario
};

export const updateUser = async (id, data) => {
  const { name, email, role, phone, status } = data;
  await db.query(
    "UPDATE users SET name = ?, email = ?, role = ?, phone = ?, status = ? WHERE id = ?",
    [name, email, role, phone, status, id]
  );
  return getUserById(id);
};