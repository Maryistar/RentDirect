import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:4000/api/v1/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      navigate("/reset-password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-5"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Recuperar contraseña
        </h2>

        <p className="text-sm text-gray-500 text-center">
          Ingresa tu correo y te enviaremos un código
        </p>

        <input
          type="email"
          placeholder="Tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />

        <button
          type="submit"
          className="bg-indigo-500 text-white py-2 rounded-xl font-semibold hover:bg-indigo-600 transition duration-300 shadow-md"
        >
          Enviar código
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-sm text-indigo-500 hover:underline text-center"
        >
          Volver al login
        </button>
      </form>
    </div>
  );
}
