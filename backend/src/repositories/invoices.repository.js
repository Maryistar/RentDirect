import db from '../config/db.js';

export const getAllInvoices = async () => {
  const [invoices] = await db.query(`
    SELECT 
      i.id,
      i.user_id AS usuario_id,
      i.property_data,
      i.total,
      i.status AS estado,
      i.created_at
    FROM invoices i
    ORDER BY i.created_at DESC
  `);
  return invoices;
};

export const createInvoice = async ({ user_id, property_data, total, status, paypal_order_id }) => {
  const [result] = await db.query(
    `INSERT INTO invoices (user_id, property_data, total, status, paypal_order_id) VALUES (?, ?, ?, ?, ?)`,
    [user_id, property_data, total, status, paypal_order_id]
  );
  return result.insertId;
};