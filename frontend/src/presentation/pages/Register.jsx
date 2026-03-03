import { useState, useEffect } from "react";
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
    acceptTerms: false,
    acceptPrivacy: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalContent, setModalContent] = useState(null); // "terms" | "privacy"
  const [animate, setAnimate] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAcceptFromModal = () => {
    if (modalContent === "terms") {
      setForm({ ...form, acceptTerms: true });
    }
    if (modalContent === "privacy") {
      setForm({ ...form, acceptPrivacy: true });
    }
    setModalContent(null);
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

    setLoading(true);

    try {
      const { confirmPassword, acceptTerms, acceptPrivacy, ...dataToSend } =
        form;

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

      alert("Registro exitoso 🎉");
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
      setTimeout(() => setAnimate(true), 10);
    } else {
      document.body.style.overflow = "auto";
      setAnimate(false);
    }
  }, [modalContent]);

  return (
    <>
      <div style={styles.page}>
        <form onSubmit={handleSubmit} style={styles.card}>
          <h2 style={styles.title}>Crear cuenta</h2>

          <input name="name" placeholder="Nombre completo" value={form.name} onChange={handleChange} required style={styles.input} />
          <input name="email" type="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} required style={styles.input} />
          <input name="cedula" type="text" placeholder="Cédula única" value={form.cedula} onChange={handleChange} required style={styles.input} />
          <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required style={styles.input} />

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

          <select name="role" value={form.role} onChange={handleChange} style={styles.input}>
            <option value="tenant">Inquilino</option>
            <option value="owner">Propietario</option>
          </select>

          {/* CHECKBOXES CORREGIDOS */}
          <div style={styles.checkboxContainer}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="acceptTerms"
                checked={form.acceptTerms}
                onChange={handleChange}
              />
              Acepto los{" "}
              <span
                style={styles.linkText}
                onClick={() => setModalContent("terms")}
              >
                Términos y Condiciones
              </span>
            </label>

            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="acceptPrivacy"
                checked={form.acceptPrivacy}
                onChange={handleChange}
              />
              Acepto la{" "}
              <span
                style={styles.linkText}
                onClick={() => setModalContent("privacy")}
              >
                Política de Privacidad
              </span>
            </label>
          </div>

          <button
            disabled={loading || !isFormValid}
            style={{
              ...styles.button,
              opacity: loading || !isFormValid ? 0.6 : 1,
            }}
          >
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

      {/* MODAL */}
      {modalContent && (
        <div style={styles.modalOverlay} onClick={() => setModalContent(null)}>
          <div
            style={{
              ...styles.modal,
              transform: animate ? "scale(1)" : "scale(0.9)",
              opacity: animate ? 1 : 0,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button style={styles.closeButton} onClick={() => setModalContent(null)}>
              ✕
            </button>

            <h3 style={{ marginBottom: "20px" }}>
              {modalContent === "terms"
                ? "Términos y Condiciones"
                : "Política de Privacidad"}
            </h3>

            <div style={styles.modalContent}>
              {modalContent === "terms" && (
                <>
                   <h1>
                    1. Aceptación de los Términos
                   </h1>
                  <p>
                    Al registrarse, acceder o utilizar la plataforma Rent Direct, el usuario declara haber leído, entendido y aceptado estos Términos y Condiciones de Uso.
                    Si el usuario no está de acuerdo con alguna de las disposiciones aquí establecidas, deberá abstenerse de utilizar la plataforma.
                  </p>

                    <h1>
                      2. Descripción del Servicio
                    </h1>
              
                  <p>
                   Rent Direct es una plataforma digital que facilita la conexión entre propietarios (owners) e inquilinos (tenants) para la publicación, búsqueda y solicitud de arriendo de propiedades.
                  La plataforma actúa únicamente como intermediario tecnológico y no es parte directa de los contratos de arrendamiento que puedan celebrarse entre los usuarios.

                  </p>

                  <p>
                    
                  </p>

                  <p>
                
                  </p>
                </>
              )}

              {modalContent === "privacy" && (
                <>
                  <p>
                   Tengo que encontrar la manera de pegar el texto y que se vea bien 
                  </p>

                  <p>
                    
                  </p>

                  <p>
                   
                  </p>

                  <p>
                   
                  </p>
                </>
              )}
            </div>

            <button style={styles.acceptButton} onClick={handleAcceptFromModal}>
              Aceptar
            </button>
          </div>
        </div>
      )}
    </>
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
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  title: { textAlign: "center", marginBottom: "20px", fontWeight: 700 },
  input: {
    width: "100%",
    marginBottom: "15px",
    padding: "10px 12px",
    fontSize: "15px",
    borderRadius: "8px",
    border: "1px solid #21324bff",
  },
  checkboxContainer: { marginTop: "10px", marginBottom: "10px", fontSize: "14px" },
  checkboxLabel: { display: "flex", gap: "6px", alignItems: "center" },
  linkText: { color: "#2563eb", fontWeight: 600, cursor: "pointer" },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "999px",
    fontWeight: 600,
    marginTop: "10px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
  },
  error: { color: "#dc2626", marginTop: "12px", textAlign: "center", fontSize: "14px" },
  footer: { marginTop: "18px", textAlign: "center", fontSize: "14px" },
  link: { color: "#2563eb", fontWeight: 600 },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    width: "90%",
    maxWidth: "600px",
    maxHeight: "80vh",
    overflowY: "auto",
    borderRadius: "12px",
    padding: "25px",
    position: "relative",
    transition: "all 0.25s ease",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "15px",
    border: "none",
    background: "transparent",
    fontSize: "18px",
    cursor: "pointer",
  },
  modalContent: {
    fontSize: "14px",
    lineHeight: "1.8",
    marginBottom: "20px",
  },
  acceptButton: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
  },
};