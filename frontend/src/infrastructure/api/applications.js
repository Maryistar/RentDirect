const BASE_URL = "http://localhost:4000/api/v1";

/* =========================
   TENANT → aplicar a propiedad
========================= */
export async function applyToProperty(propertyId, message) {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${BASE_URL}/properties/${propertyId}/apply`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error al aplicar a esta propiedad");
  }

  return data;
}

/* =========================
   TENANT → ver MIS aplicaciones
========================= */
export async function getMyApplications() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/applications/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al cargar mis aplicaciones");
  }

  return res.json();
}

/* =========================
   OWNER → ver aplicaciones de una propiedad
========================= */
export async function getApplicationsForProperty(propertyId) {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${BASE_URL}/properties/${propertyId}/applications`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Error al cargar las aplicaciones de la propiedad");
  }

  const data = await res.json();

  return data.data || []; // 🔥 AQUÍ ESTÁ LA MAGIA
}

/* =========================
   OWNER → aprobar / rechazar aplicación
========================= */
export async function updateApplicationStatus(applicationId, status) {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${BASE_URL}/applications/${applicationId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error al actualizar aplicación");
  }

  return data;
}

export async function withdrawApplication(applicationId) {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `http://localhost:4000/api/v1/applications/${applicationId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Error al retirar la aplicación");
  }
}
