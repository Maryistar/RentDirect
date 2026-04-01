import { useState, useRef } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../application/context/AuthContext";
import { motion } from "framer-motion";
import logo from "../../assets/logo-rentdirect.png";
import { GoogleLogin } from "@react-oauth/google";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 NUEVO: referencia para resetear captcha
  const recaptchaRef = useRef(null);

  const { login, loginGoogle } = useAuth();
  const navigate = useNavigate();

  // 🔹 LOGIN normal
  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!captcha) {
      setError("Verifica que no eres un robot");
      return;
    }

    setLoading(true);

    try {
      await login({ 
        email, 
        password,
        captcha
      });

      // 🔥 RESET CAPTCHA (IMPORTANTE)
      recaptchaRef.current.reset();
      setCaptcha(null);

      navigate("/");

    } catch (err) {

      // 🔥 TAMBIÉN RESET SI FALLA
      recaptchaRef.current.reset();
      setCaptcha(null);

      if (err.message?.includes("verify your email")) {
        setError("Tu cuenta no está verificada.");
      } else {
        setError(err.response?.data?.message || err.message || "Error al iniciar sesión");
      }

    } finally {
      setLoading(false);
    }
  }

  // 🔹 LOGIN con Google
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError("");

      const res = await axios.post(
        "http://localhost:4000/api/v1/auth/google",
        { token: credentialResponse.credential }
      );

      loginGoogle({
        token: res.data.token,
        user: res.data.user,
      });

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
          <img src={logo} alt="Rent Direct Logo" className="w-32 mb-4" />
          <p className="text-gray-500 text-sm">Bienvenido a Rent Direct</p>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Iniciar sesión
        </h2>

        {/* GOOGLE */}
        <div className="mb-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>

        <div className="text-center text-gray-400 text-sm mb-6">— o —</div>

        {/* FORM */}
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

          {/* CAPTCHA */}
          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey="6LcF058sAAAAABUKqIzg3CQ9TCz0rxoGFx9A1Zes"
              onChange={(value) => setCaptcha(value)}
              ref={recaptchaRef} // 🔥 CLAVE
            />
          </div>

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