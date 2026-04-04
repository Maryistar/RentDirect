import db from '../config/db.js';


// 🔹 User score
export async function findUserScore(userId) {
  const [[user]] = await db.query(
    'SELECT score FROM users WHERE id = ?',
    [userId]
  );
  return user;
}


// 🔹 Count monthly applications
export async function countMonthlyApplications(tenantId) {
  const [[result]] = await db.query(
    `SELECT COUNT(*) as total
     FROM applications
     WHERE tenant_id = ?
     AND MONTH(created_at) = MONTH(CURRENT_DATE())
     AND YEAR(created_at) = YEAR(CURRENT_DATE())`,
    [tenantId]
  );
  return result.total;
}


// 🔹 Existing application
export async function findExistingApplication(propertyId, tenantId) {
  const [[exists]] = await db.query(
    'SELECT id FROM applications WHERE property_id = ? AND tenant_id = ?',
    [propertyId, tenantId]
  );
  return exists;
}


// 🔹 Create
export async function createApplication(propertyId, tenantId, message) {
  const [result] = await db.query(
    `INSERT INTO applications (property_id, tenant_id, status, message)
     VALUES (?, ?, 'pending', ?)`,
    [propertyId, tenantId, message || null]
  );
  return result.insertId;
}


// 🔹 List mine (TENANT)
export async function getApplicationsByTenant(tenantId) {
  const [rows] = await db.query(
    `SELECT 
        a.id,
        a.status,
        a.message,
        a.created_at AS createdAt, 
        p.id AS property_id,
        p.title AS propertyTitle,
        p.address,
        p.price
     FROM applications a
     JOIN properties p ON p.id = a.property_id
     WHERE a.tenant_id = ?
     ORDER BY a.created_at DESC`,
    [tenantId]
  );

  return rows;
}


// 🔹 List applications by property (OWNER)
export async function getApplicationsByProperty(propertyId) {
  const [rows] = await db.query(
    `SELECT 
        a.id,
        a.status,
        a.message,
        a.created_at AS createdAt,
        u.id AS tenant_id,
        u.name AS user_name,    -- 
        u.email AS tenant_email
        
     FROM applications a
     JOIN users u ON u.id = a.tenant_id
     WHERE a.property_id = ?
     ORDER BY a.created_at DESC`,
    [propertyId]
  );

  return rows;
}


// 🔹 Get application with owner
export async function findApplicationWithOwner(applicationId) {
  const [[application]] = await db.query(
    `SELECT a.id, a.status, a.property_id, a.tenant_id, p.owner_id
     FROM applications a
     JOIN properties p ON p.id = a.property_id
     WHERE a.id = ?`,
    [applicationId]
  );
  return application;
}


// 🔹 Update status
export async function updateApplication(applicationId, status) {
  await db.query(
    'UPDATE applications SET status = ? WHERE id = ?',
    [status, applicationId]
  );
}


// 🔹 Mark property rented
export async function markPropertyAsRented(propertyId) {
  await db.query(
    'UPDATE properties SET status = "rented" WHERE id = ?',
    [propertyId]
  );
}


// 🔹 Reject others
export async function rejectOtherApplications(propertyId, applicationId) {
  await db.query(
    `UPDATE applications 
     SET status = 'rejected'
     WHERE property_id = ?
     AND id != ?`,
    [propertyId, applicationId]
  );
}


// 🔹 Delete
export async function deleteApplication(applicationId) {
  await db.query(
    'DELETE FROM applications WHERE id = ?',
    [applicationId]
  );
}