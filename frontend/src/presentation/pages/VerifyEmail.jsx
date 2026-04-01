import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:4000/api/v1/auth/verify-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      navigate("/login");
    }
  };

  const handleResend = async () => {
    if (!email) {
      alert("Ingresa tu correo primero");
      return;
    }

    const res = await fetch("http://localhost:4000/api/v1/auth/verify-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl flex flex-col gap-5"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Verificar correo
        </h2>

        <p className="text-sm text-gray-500 text-center">
          Ingresa el código que te enviamos a tu correo
        </p>

        <input
          type="email"
          placeholder="Tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />

        <input
          type="text"
          placeholder="Código de verificación"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />

        <button
          type="submit"
          className="bg-indigo-500 text-white py-2 rounded-xl font-semibold hover:bg-indigo-600 transition duration-300 shadow-md"
        >
          Verificar
        </button>

        <button
          type="button"
          onClick={handleResend}
          className="border border-indigo-500 text-indigo-500 py-2 rounded-xl font-semibold hover:bg-indigo-50 transition duration-300"
        >
          Reenviar código
        </button>
      </form>
    </div>
  );
}