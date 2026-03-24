import db from "../config/db.js";

export async function create(data) {

  const { user_id, type, url, status } = data;

  await db.query(
    `INSERT INTO documents (user_id, type, url, status)
     VALUES (?, ?, ?, ?)`,
    [user_id, type, url, status]
  );
}