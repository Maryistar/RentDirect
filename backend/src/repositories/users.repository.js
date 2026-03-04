import db from '../config/db.js';

export async function findById(userId) {
  const [rows] = await db.query(
    'SELECT id, email, name, role, score, status, created_at FROM users WHERE id = ?',
    [userId]
  );

  return rows[0] || null;
}

export async function update(userId, name, phone) {
  await db.query(
    'UPDATE users SET name = ?, phone = ? WHERE id = ?',
    [name || null, phone || null, userId]
  );
}

export async function insertDocument(userId, type, url) {
  await db.query(
    'INSERT INTO documents (user_id, type, url, status) VALUES (?, ?, ?, ?)',
    [userId, type, url, 'pending']
  );
}

export const updateUserAvatar = async (userId, avatarUrl) => {
  const query = `
    UPDATE users
    SET avatar = ?
    WHERE id = ?
  `;

  return db.query(query, [avatarUrl, userId]);
};