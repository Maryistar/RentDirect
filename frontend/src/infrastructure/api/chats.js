const BASE_URL = "http://localhost:4000/api/v1";

/**
 * 🔐 OWNER – iniciar chat con inquilino
 */
export async function startChat(propertyId, tenantId) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/chats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      propertyId,
      tenantId,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error al iniciar chat");
  }

  return data;
}

/**
 * 📄 Obtener mis chats
 */
export async function getMyChats() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/chats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error al obtener chats");
  }

  return data;
}

/**
 * 💬 Obtener mensajes de un chat
 */
export async function getMessages(chatId) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/chats/${chatId}/messages`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error al obtener mensajes");
  }

  return data;
}
