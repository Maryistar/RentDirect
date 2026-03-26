import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../application/context/AuthContext";
import { motion } from "framer-motion";
import logo from "../../assets/logo-rentdirect.png";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // 🔹 LOGIN NORMAL
  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      if (err.message?.includes("verify your email")) {
        setError("Tu cuenta no está verificada.");
      } else {
        setError(err.message || "Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  }

  // 🔥 LOGIN CON GOOGLE (ARREGLADO)
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError("");

      const res = await axios.post(
        "http://localhost:4000/api/v1/auth/google",
        {
          token: credentialResponse.credential, // ✅ CORRECTO
        }
      );

      // 🔹 Guardar token y usuario
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");

    } catch (err) {
      console.error("ERROR GOOGLE FRONT:", err?.response?.data || err);
      setError("Error al iniciar sesión con Google");
    }
  };

  const handleGoogleError = () => {
    setError("Error con Google");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-gray-200"
      >

        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <img
            src={logo}
            alt="Rent Direct Logo"
            className="w-32 mb-4"
          />
          <p className="text-gray-500 text-sm">
            Bienvenido a Rent Direct
          </p>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Iniciar sesión
        </h2>

        {/* 🔥 BOTÓN GOOGLE */}
        <div className="mb-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>

        <div className="text-center text-gray-400 text-sm mb-6">
          — o —
        </div>

        {/* FORM NORMAL */}
        <form onSubmit={handleLogin} className="space-y-6">

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-xl"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-xl"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-black text-white"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {error && (
            <div className="text-center text-red-500 text-sm">
              {error}
            </div>
          )}
        </form>

        <div className="mt-8 text-sm text-center text-gray-600">
          <p>
            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          </p>
          <p>
            <Link to="/register">Crear cuenta</Link>
          </p>
        </div>

      </motion.div>
    </div>
  );
}