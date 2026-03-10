const BASE_URL = "http://localhost:4000/api/v1";

export async function getMessages(chatId) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/messages/chat/${chatId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

export async function sendMessage(chatId, content) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      chatId,
      content
    }),
  });

  return res.json();
}