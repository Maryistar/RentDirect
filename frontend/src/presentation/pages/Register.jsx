import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/logo-rentdirect.png";
import ReCAPTCHA from "react-google-recaptcha"; // 🔥 IMPORT

const API_URL = "http://localhost:4000/api/v1/auth/register";

export default function Register() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    cedula: "",
    password: "",
    confirmPassword: "",
    role: "tenant",
    adminKey: "",
    acceptTerms: false,
    acceptPrivacy: false,
  });

  const [captcha, setCaptcha] = useState(null); // 🔥 ESTADO CAPTCHA
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalContent, setModalContent] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!form.acceptTerms || !form.acceptPrivacy) {
      setError("Debes aceptar los Términos y la Política de Privacidad");
      return;
    }

    // 🔥 VALIDAR CAPTCHA
    if (!captcha) {
      setError("Verifica que no eres un robot");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, acceptTerms, acceptPrivacy, ...dataToSend } = form;

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...dataToSend,
          captcha, // 🔥 ENVIAR CAPTCHA AL BACKEND
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error al registrarse");
        return;
      }

      window.location.href = "/verify-email";

    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    form.password === form.confirmPassword &&
    form.acceptTerms &&
    form.acceptPrivacy;

  useEffect(() => {
    if (modalContent) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modalContent]);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-gray-200"
        >

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center mb-8"
          >
            <motion.img
              src={logo}
              alt="Rent Direct Logo"
              className="w-32 mb-4"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <p className="text-gray-500 text-sm">
              Crea tu cuenta en Rent Direct
            </p>
          </motion.div>

          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Crear cuenta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            <Input label="Nombre completo" name="name" value={form.name} onChange={handleChange} />
            <Input label="Correo electrónico" name="email" type="email" value={form.email} onChange={handleChange} />
            <Input label="Cédula" name="cedula" value={form.cedula} onChange={handleChange} />
            <Input label="Contraseña" name="password" type="password" value={form.password} onChange={handleChange} />
            <Input
              label="Confirmar contraseña"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              error={form.confirmPassword && form.password !== form.confirmPassword}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de usuario
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none"
              >
                <option value="tenant">Inquilino</option>
                <option value="owner">Propietario</option>
              </select>

              <p
                className="text-sm text-blue-600 cursor-pointer mt-2"
                onClick={() => setShowAdmin(!showAdmin)}
              >
                ¿Eres administrador?
              </p>

              {showAdmin && (
                <Input
                  label="Clave de administrador"
                  name="adminKey"
                  value={form.adminKey}
                  onChange={handleChange}
                />
              )}
              
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 text-sm">
              <label className="flex gap-2 items-center">
                <input type="checkbox" name="acceptTerms" checked={form.acceptTerms} onChange={handleChange} />
                Acepto los{" "}
                <span className="font-semibold text-black cursor-pointer underline" onClick={() => setModalContent("terms")}>
                  Términos y Condiciones
                </span>
              </label>

              <label className="flex gap-2 items-center">
                <input type="checkbox" name="acceptPrivacy" checked={form.acceptPrivacy} onChange={handleChange} />
                Acepto la{" "}
                <span className="font-semibold text-black cursor-pointer underline" onClick={() => setModalContent("privacy")}>
                  Política de Privacidad
                </span>
              </label>
            </div>

            {/* 🔥 CAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey="6LcF058sAAAAABUKqIzg3CQ9TCz0rxoGFx9A1Zes"
                onChange={(value) => setCaptcha(value)}
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              disabled={loading || !isFormValid}
              className="w-full py-3 rounded-xl font-semibold bg-black text-white disabled:opacity-60"
            >
              {loading ? "Registrando..." : "Registrarse"}
            </motion.button>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <p className="text-sm text-center text-gray-600 mt-4">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="font-semibold text-black hover:underline">
                Inicia sesión
              </Link>
            </p>

          </form>
        </motion.div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {modalContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            onClick={() => setModalContent(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white w-[90%] max-w-lg p-6 rounded-2xl shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4">
                {modalContent === "terms"
                  ? "Términos y Condiciones"
                  : "Política de Privacidad"}
              </h3>

              <p className="text-sm text-gray-600 mb-6">
                falta pegar contenido 
              </p>

              <button
                onClick={() => {
                  if (modalContent === "terms") {
                    setForm({ ...form, acceptTerms: true });
                  } else {
                    setForm({ ...form, acceptPrivacy: true });
                  }
                  setModalContent(null);
                }}
                className="w-full py-2 rounded-lg bg-black text-white font-semibold"
              >
                Aceptar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Input({ label, error, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        {...props}
        required
        className={`w-full px-4 py-3 border rounded-xl outline-none transition 
        ${error ? "border-red-500" : "border-gray-300"}
        focus:ring-2 focus:ring-black focus:border-black`}
      />
    </div>
  );
}