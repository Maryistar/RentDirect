import db from '../config/db.js';

// 🔹 Crear registro de arriendo
export async function createRentalRecord(data) {
  const [result] = await db.query(
    `
    INSERT INTO rental_records (
      application_id,
      property_id,
      owner_id,
      tenant_id,
      start_date,
      end_date,
      monthly_price,
      deposit,
      duration_months
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.application_id,
      data.property_id,
      data.owner_id,
      data.tenant_id,
      data.start_date,
      data.end_date,
      data.monthly_price,
      data.deposit,
      data.duration_months
    ]
  );

  return result.insertId;
}

// 🔹 Buscar registro por aplicación
export async function findByApplication(applicationId) {
  const [[record]] = await db.query(
    `SELECT * FROM rental_records WHERE application_id = ?`,
    [applicationId]
  );

  return record;
}

// 🔹 Listar registros del inquilino
export async function getRentalsByTenant(tenantId) {
  const [rows] = await db.query(
    `
    SELECT rr.*, p.title AS property_title
    FROM rental_records rr
    JOIN properties p ON p.id = rr.property_id
    WHERE rr.tenant_id = ?
    ORDER BY rr.created_at DESC
    `,
    [tenantId]
  );

  return rows;
}