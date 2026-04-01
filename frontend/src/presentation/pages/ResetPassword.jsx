import { useState } from "react";

export default function ResetPassword() {
  const [form, setForm] = useState({
    email: "",
    code: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:4000/api/v1/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-5"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Cambiar contraseña
        </h2>

        <p className="text-sm text-gray-500 text-center">
          Ingresa el código que recibiste y tu nueva contraseña
        </p>

        <input
          type="email"
          name="email"
          placeholder="Correo"
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />

        <input
          type="text"
          name="code"
          placeholder="Código recibido"
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />

        <input
          type="password"
          name="newPassword"
          placeholder="Nueva contraseña"
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />

        <button
          type="submit"
          className="bg-indigo-500 text-white py-2 rounded-xl font-semibold hover:bg-indigo-600 transition duration-300 shadow-md"
        >
          Cambiar contraseña
        </button>
      </form>
    </div>
  );
}