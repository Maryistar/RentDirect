import db from "../config/db.js";

export async function create(data) {

  const { user_id, type, url, status } = data;

  await db.query(
    `INSERT INTO documents (user_id, type, url, status)
     VALUES (?, ?, ?, ?)`,
    [user_id, type, url, status]
  );
}

export async function createDocument(data) {
  const { contract_id, user_id, url, type } = data;

  const [result] = await db.query(
    `INSERT INTO documents (contract_id, user_id, url, type, status)
     VALUES (?, ?, ?, ?, 'active')`,
    [contract_id, user_id, url, type]
  );

  return result.insertId;
}

export async function findByContractId(contractId) {
  const [rows] = await db.query(
    "SELECT * FROM documents WHERE contract_id = ?",
    [contractId]
  );

  return rows[0];
}