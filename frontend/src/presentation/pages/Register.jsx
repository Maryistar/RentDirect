import { useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:4000/api/v1/auth/register";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    cedula: "",
    password: "",
    confirmPassword: "",
    role: "tenant",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 🔥 VALIDACIÓN NUEVA
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      // ⚠️ No enviamos confirmPassword al backend
      const { confirmPassword, ...dataToSend } = form;

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error al registrarse");
        return;
      }

      alert("Registro exitoso 🎉 Revisa tu correo para verificar tu cuenta");
      window.location.href = "/verify-email";
    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>Crear cuenta</h2>

        <input
          name="name"
          placeholder="Nombre completo"
          value={form.name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          name="email"
          type="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          name="cedula"
          type="text"
          placeholder="Cédula única"
          value={form.cedula}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
          style={styles.input}
        />

        {/* NUEVO CAMPO */}
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirmar contraseña"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          style={{
            ...styles.input,
            border:
              form.confirmPassword &&
              form.password !== form.confirmPassword
                ? "1px solid #dc2626"
                : "1px solid #21324bff",
          }}
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="tenant">Inquilino</option>
          <option value="owner">Propietario</option>
        </select>

        <button disabled={loading} style={styles.button}>
          {loading ? "Registrando..." : "Registrarse"}
        </button>

        {error && <p style={styles.error}>{error}</p>}

        <p style={styles.footer}>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" style={styles.link}>
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
}

/* =========================
   ESTILOS
========================= */
const styles = {
  page: {
    minHeight: "calc(100vh - 80px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(228, 234, 240, 1)",
  },
  card: {
    width: "100%",
    maxWidth: 460,
    padding: "50px",
    background: "#ffffff",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(179, 88, 88, 0.08)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontWeight: 700,
  },
  input: {
    width: "100%",
    marginBottom: "15px",
    padding: "10px 12px",
    fontSize: "15px",
    borderRadius: "8px",
    border: "1px solid #21324bff",
    transition: "0.2s ease",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "999px",
    fontWeight: 600,
    marginTop: "10px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  error: {
    color: "#dc2626",
    marginTop: "12px",
    textAlign: "center",
    fontSize: "14px",
  },
  footer: {
    marginTop: "18px",
    textAlign: "center",
    fontSize: "14px",
  },
  link: {
    color: "#2563eb",
    fontWeight: 600,
  },
};