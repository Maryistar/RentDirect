import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ContractForm() {

  const { id } = useParams();

  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    monthlyPrice: "",
    terms: ""
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:4000/api/v1/contracts",
        {
          chatId: id,
          ...form
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Contrato creado 🔥");

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.card}>

        <h2 style={styles.title}>📄 Crear contrato</h2>

        <form onSubmit={handleSubmit} style={styles.form}>

          <div style={styles.group}>
            <label style={styles.label}>Fecha inicio</label>
            <input
              type="date"
              name="startDate"
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Fecha fin</label>
            <input
              type="date"
              name="endDate"
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Precio mensual</label>
            <input
              type="number"
              name="monthlyPrice"
              placeholder="Ej: 1200000"
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Términos del contrato</label>
            <textarea
              name="terms"
              placeholder="Escribe los términos..."
              onChange={handleChange}
              style={styles.textarea}
            />
          </div>

          <button type="submit" style={styles.button}>
            Guardar contrato
          </button>

        </form>

      </div>

      {/* Animación */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

    </div>
  );
}

/* 🎨 ESTILOS */
const styles = {

  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #eef2f7, #dfe9f3)"
  },

  card: {
    width: "400px",
    background: "#fff",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    animation: "fadeIn 0.4s ease"
  },

  title: {
    textAlign: "center",
    marginBottom: "20px"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },

  group: {
    display: "flex",
    flexDirection: "column"
  },

  label: {
    fontSize: "13px",
    marginBottom: "5px",
    color: "#555"
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    transition: "0.2s"
  },

  textarea: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    minHeight: "80px",
    resize: "none",
    outline: "none"
  },

  button: {
    marginTop: "10px",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #4CAF50, #43a047)",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s"
  }
};

export default ContractForm;