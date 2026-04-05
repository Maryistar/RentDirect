const BASE_URL = "http://localhost:4000/api/v1";

export async function createPaypalOrder() {

  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/payments/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Error creando orden");
  }

  return data;
}