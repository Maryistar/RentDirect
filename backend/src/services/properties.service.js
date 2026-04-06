import * as repo from '../repositories/properties.repository.js';

// 🔹 Crear
export async function createProperty(data, user, files) {

  if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
    throw { status: 403, message: 'Forbidden' };
  }

  if (!data.title || !data.address || !data.price) {
    throw { status: 400, message: 'Missing required fields' };
  }

  const realUser = await repo.getUserById(user.id);

  // 🔥 DETECTAR SI VIENE DE PAGO
  const isPaid = data.isPaid === "true";

  // 🔥 VALIDACIONES
  const isPremiumActive =
    realUser.is_premium &&
    realUser.premium_until &&
    new Date(realUser.premium_until) > new Date();

  const hasFree = realUser.free_publications_used < 1;

  // ❌ SOLO BLOQUEAR SI:
  // - NO es premium
  // - NO tiene gratis
  // - NO ha pagado
  if (!isPremiumActive && !hasFree && !isPaid) {
    return {
      requirePayment: true,
      message: "Debes pagar para publicar otra propiedad"
    };
  }

  // 🔥 CREAR PROPIEDAD (UNA SOLA VEZ)
  const thumbnail = files?.length
    ? `uploads/${files[0].filename}`
    : null;

  const propertyId = await repo.createProperty({
    ownerId: user.id,
    title: data.title,
    description: data.description || '',
    address: data.address,
    price: data.price,
    type: data.type || 'Apartamento',
    rooms: data.rooms || 1,
    bathrooms: data.bathrooms || 1,
    tags: data.tags || null,
    thumbnail
  });

 
  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      await repo.createPropertyImage({
        property_id: propertyId,
        url: `uploads/${files[i].filename}`,
        ord: i + 1
      });
    }
  }

 
  if (hasFree && !isPremiumActive && !isPaid) {
    await repo.incrementFreePublications(user.id);
  }

  return { id: propertyId };
}


 


// 🔹 Listar disponibles
export async function listAvailable() {
  return await repo.getAllAvailable();
}

// 🔹 Ver una propiedad
export async function getProperty(id) {

  const property = await repo.findByIdWithImages(id);

  if (!property) {
    throw { status: 404, message: 'Property not found' };
  }

  // Convertir tags JSON string → array
  if (property.tags) {
    try {
      property.tags = JSON.parse(property.tags);
    } catch {
      property.tags = [];
    }
  }

  return property;
}

// 🔹 Mis propiedades
export async function listOwnerProperties(user) {

  if (user.role !== 'owner' && user.role !== 'admin') {
    throw { status: 403, message: 'Forbidden' };
  }

  return await repo.findByOwner(user.id);
}

// 🔹 Actualizar
export async function updateProperty(id, data, user) {

  const property = await repo.findById(id);

  if (!property) {
    throw { status: 404, message: 'Property not found' };
  }

  if (user.role !== 'admin' && property.owner_id !== user.id) {
    throw { status: 403, message: 'Forbidden' };
  }

  await repo.updateProperty(id, {
    title: data.title ?? property.title,
    description: data.description ?? property.description,
    address: data.address ?? property.address,
    price: data.price ?? property.price,
    status: data.status ?? property.status,
    type: data.type ?? property.type,
    rooms: data.rooms ?? property.rooms,
    bathrooms: data.bathrooms ?? property.bathrooms,
    tags: data.tags ?? property.tags
  });

  return { message: 'Property updated successfully' };
}

// 🔹 Eliminar
import * as propertyRepo from '../repositories/properties.repository.js';

export async function deleteProperty(propertyId, user) {

  // 1. Buscar la propiedad
  const property = await propertyRepo.findPropertyById(propertyId);

  if (!property) {
    throw { status: 404, message: 'Property not found' };
  }

  // 2. Validar que sea el dueño
  if (property.owner_id !== user.id) {
    throw { status: 403, message: 'You are not the owner of this property' };
  }

  // 3. 🔥 VALIDACIÓN CLAVE
  if (property.status === 'rented') {
    throw {
      status: 400,
      message: 'No se puede eliminar la propiedad porque está arrendada'
    };
  }

  // 4. Eliminar
  await propertyRepo.deleteProperty(propertyId);

  return { message: 'Propiedad eliminada correctamente' };
}

export async function listAllProperties() {
  return await propertyRepository.getAllProperties();
}