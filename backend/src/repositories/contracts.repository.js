import db from "../config/db.js";

// 🔹 Crear contrato
export async function createContract(data) {
  const {
    chatId,
    propertyId,
    ownerId,
    tenantId,
    startDate,
    endDate,
    monthlyPrice,
    terms
  } = data;

  const [result] = await db.query(
    `INSERT INTO contracts
     (chat_id, property_id, owner_id, tenant_id, start_date, end_date, monthly_price, terms)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      chatId,
      propertyId,
      ownerId,
      tenantId,
      startDate,
      endDate,
      monthlyPrice,
      terms
    ]
  );

  return result.insertId;
}

export async function findByChatId(chatId) {
  const [rows] = await db.query(
    "SELECT * FROM contracts WHERE chat_id = ?",
    [chatId]
  );

  return rows[0];
}

export async function updateStatus(id, status) {
  const [result] = await db.query(
    "UPDATE contracts SET status = ? WHERE id = ?",
    [status, Number(id)]
  );

  return result;
}

export async function findById(id) {
  const [rows] = await db.query(
    "SELECT * FROM contracts WHERE id = ?",
    [id]
  );
  return rows[0];
}

export async function findExistingContract(propertyId, tenantId) {
  const [rows] = await db.query(
    `SELECT id FROM contracts 
     WHERE property_id = ? AND tenant_id = ?`,
    [propertyId, tenantId]
  );

  return rows[0];
}