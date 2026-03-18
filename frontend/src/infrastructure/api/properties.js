const BASE_URL = "http://localhost:4000/api/v1";

/**
 * 🔓 PÚBLICO – listar todas las propiedades
 */
export async function getProperties() {

  const res = await fetch(`${BASE_URL}/properties`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error al cargar propiedades");
  }

  return data.data || data;
}

/**
 * 🔓 PÚBLICO – detalle de una propiedad
 */
export async function getPropertyById(id) {

  const res = await fetch(`${BASE_URL}/properties/${id}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error al cargar la propiedad");
  }

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

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error al cargar propiedades");
  }

  return data.data || data;
}

/**
 * 🔐 OWNER – crear propiedad
 */
export async function createProperty(formData) {

  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/properties`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error al crear la propiedad");
  }

  return data.data || data;
}

/**
 * 🔐 OWNER – actualizar propiedad
 */
export async function updateProperty(id, formData) {

  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/properties/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error al actualizar la propiedad");
  }

  return data.data || data;
}

/**
 * 🔐 OWNER – eliminar propiedad
 */
export async function deleteProperty(propertyId) {

  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/properties/${propertyId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al eliminar la propiedad");
  }

  return true;
}

/**
 * 🔥 TENANT – aplicar a una propiedad (CORREGIDO)
 */
export async function applyToProperty(propertyId) {

  const token = localStorage.getItem("token");

  const res = await fetch(
    `${BASE_URL}/applications/properties/${propertyId}/apply`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error al aplicar");
  }

  return data;
}