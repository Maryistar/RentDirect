const BASE_URL = "http://localhost:4000/api/v1";

/**
 * 🔓 PÚBLICO – listar todas las propiedades
 */
export async function getProperties() {

  const res = await fetch(`${BASE_URL}/properties`);

  if (!res.ok) {
    throw new Error("Error al cargar propiedades");
  }

  const data = await res.json();

  // 👇 IMPORTANTE
  return data.data || data;
}

/**
 * 🔓 PÚBLICO – detalle de una propiedad
 */
export async function getPropertyById(id) {

  const res = await fetch(`${BASE_URL}/properties/${id}`);

  if (!res.ok) {
    throw new Error("Error al cargar la propiedad");
  }

  const data = await res.json();

  // 👇 IMPORTANTE
  return data.data || data;
}

/**
 * 🔐 OWNER – obtener MIS propiedades
 */
export async function getMyProperties() {

  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/properties/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error al cargar propiedades");

  const data = await res.json();

  return data.data || data;
}

export async function deleteProperty(propertyId) {

  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/properties/${propertyId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error al eliminar la propiedad");

  return true;
}

export async function createProperty(formData) {

  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/properties`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData, // 👈 importante para Cloudinary
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error al crear la propiedad");
  }

  return data.data || data;
}