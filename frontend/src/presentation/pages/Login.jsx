import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../application/context/AuthContext";
import { motion } from "framer-motion";
import logo from "../../assets/logo-rentdirect.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login({ email, password });

      // 🔥 POR SI QUIERES ASEGURAR (doble seguridad)
      if (res?.user) {
        localStorage.setItem("userId", res.user.id);
        localStorage.setItem("userName", res.user.name);
      }

      console.log("LOGIN OK:", res); // 🔍 DEBUG

      navigate("/");
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      if (err.message?.includes("verify your email")) {
        setError("Tu cuenta no está verificada.");
      } else {
        setError(err.message || "Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-gray-200"
      >

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col items-center mb-10"
        >
          <motion.img
            src={logo}
            alt="Rent Direct Logo"
            className="w-32 mb-4"
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <p className="text-gray-500 text-sm">
            Bienvenido a Rent Direct
          </p>
        </motion.div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Iniciar sesión
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-black focus:border-black outline-none transition"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-black focus:border-black outline-none transition"
            />
          </div>

          {/* BOTÓN */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold bg-black text-white hover:bg-gray-900 transition duration-200 disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </motion.button>

          {/* ERROR */}
          {error && (
            <div className="text-center">
              <p className="text-red-500 text-sm">{error}</p>

              {error === "Tu cuenta no está verificada." && (
                <button
                  type="button"
                  onClick={() => navigate("/verify-email")}
                  className="mt-2 text-black font-semibold underline"
                >
                  Ir a verificar correo
                </button>
              )}
            </div>
          )}
        </form>

        {/* LINKS */}
        <div className="mt-8 text-sm text-center space-y-3 text-gray-600">
          <p>
            ¿Olvidaste tu contraseña?{" "}
            <Link
              to="/forgot-password"
              className="font-semibold text-black hover:underline"
            >
              Cambiar contraseña
            </Link>
          </p>

          <p>
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              className="font-semibold text-black hover:underline"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>

      </motion.div>
    </div>
  );
}