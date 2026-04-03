import db from '../config/db.js';

// 🔹 Crear propiedad
export async function createProperty(data) {
  const {
    ownerId,
    title,
    description,
    address,
    price,
    type,
    rooms,
    bathrooms,
    tags,
    thumbnail
  } = data;

  const [result] = await db.query(
    `INSERT INTO properties 
     (owner_id, title, description, address, price, type, rooms, bathrooms, tags, status, thumbnail)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'available', ?)`,
    [
      ownerId,
      title,
      description,
      address,
      price,
      type,
      rooms,
      bathrooms,
      tags,
      thumbnail
    ]
  );

  return result.insertId;
}

// 🔹 Crear imagen
export async function createPropertyImage(data) {
  const [result] = await db.query(
    `
    INSERT INTO property_images (property_id, url, ord)
    VALUES (?, ?, ?)
    `,
    [data.property_id, data.url, data.ord]
  );

  return result.insertId;
}



// 🔹 Buscar propiedad con imágenes
export async function findByIdWithImages(id) {
  const [properties] = await db.query(
    `SELECT * FROM properties WHERE id = ?`,
    [id]
  );

  if (!properties.length) return null;

  const property = properties[0];

  const [images] = await db.query(
    `SELECT * FROM property_images 
     WHERE property_id = ? 
     ORDER BY ord ASC`,
    [id]
  );

  property.images = images;

  return property;
}

// 🔹 Listar todas disponibles
export async function getAllAvailable() {
  const [rows] = await db.query(
    `SELECT * FROM properties 
     WHERE status = 'available'
     ORDER BY created_at DESC`
  );

  return rows;
}
// 🔹 Property
export async function findPropertyById(propertyId) {
  const [[property]] = await db.query(
    `SELECT id, address, description, price, owner_id, status 
     FROM properties 
     WHERE id = ?`,
    [propertyId]
  );
  return property;
}

// 🔹 Buscar por id
export async function findById(id) {
  const [rows] = await db.query(
    `SELECT * FROM properties WHERE id = ?`,
    [id]
  );

  return rows[0];
}

// 🔹 Listar del owner
export async function findByOwner(ownerId) {
  const [rows] = await db.query(
    `SELECT * FROM properties 
     WHERE owner_id = ? 
     ORDER BY created_at DESC`,
    [ownerId]
  );

  return rows;
}

// 🔹 Actualizar
export async function updateProperty(id, data) {
  const {
    title,
    description,
    address,
    price,
    status,
    type,
    rooms,
    bathrooms,
    tags
  } = data;

  await db.query(
    `UPDATE properties 
     SET title = ?, 
         description = ?, 
         address = ?, 
         price = ?, 
         status = ?, 
         type = ?, 
         rooms = ?, 
         bathrooms = ?, 
         tags = ?
     WHERE id = ?`,
    [
      title,
      description,
      address,
      price,
      status,
      type,
      rooms,
      bathrooms,
      tags,
      id
    ]
  );
}

// 🔹 Eliminar
export async function deleteProperty(id) {
  await db.query(
    `DELETE FROM properties WHERE id = ?`,
    [id]
  );
}

export async function updateStatus(id, status) {
  await db.query(
    "UPDATE properties SET status = ? WHERE id = ?",
    [status, id]
  );
}