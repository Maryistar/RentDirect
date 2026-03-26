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
    <div className="container">

      <div className="card">

        <h2 className="title">📄 Crear contrato</h2>

        <form onSubmit={handleSubmit} className="form">

          {/* FECHA INICIO */}
          <div className="inputGroup">
            <label className="labelTop">Fecha inicio</label>
            <input
              type="date"
              name="startDate"
              onChange={handleChange}
              required
            />
          </div>

          {/* FECHA FIN */}
          <div className="inputGroup">
            <label className="labelTop">Fecha fin</label>
            <input
              type="date"
              name="endDate"
              onChange={handleChange}
              required
            />
          </div>

          {/* PRECIO */}
          <div className="inputGroup">
            <input
              type="number"
              name="monthlyPrice"
              onChange={handleChange}
              required
            />
            <label>Precio mensual</label>
          </div>

          {/* TERMINOS */}
          <div className="inputGroup">
            <textarea
              name="terms"
              onChange={handleChange}
              required
            />
            <label>Términos del contrato</label>
          </div>

          <button className="btn">
            Guardar contrato
          </button>

        </form>

      </div>

      <style>{`

        .container {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f4f6f9;
        }

        .card {
          width: 400px;
          padding: 30px;
          border-radius: 20px;
          background: #ffffff;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          animation: fadeInUp 0.5s ease;
        }

        .title {
          text-align: center;
          color: #333;
          margin-bottom: 20px;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .inputGroup {
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .inputGroup input,
        .inputGroup textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 10px;
          outline: none;
          font-size: 14px;
          transition: 0.3s;
        }

        .inputGroup input:focus,
        .inputGroup textarea:focus {
          border-color: #4CAF50;
          box-shadow: 0 0 0 3px rgba(76,175,80,0.1);
        }

        .inputGroup textarea {
          min-height: 80px;
          resize: none;
        }

        /* LABEL NORMAL (FECHAS) */
        .labelTop {
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }

        /* FLOATING LABEL */
        .inputGroup label:not(.labelTop) {
          position: absolute;
          top: 50%;
          left: 12px;
          transform: translateY(-50%);
          background: white;
          padding: 0 5px;
          color: #777;
          font-size: 13px;
          transition: 0.3s;
        }

        .inputGroup input:focus + label,
        .inputGroup input:valid + label,
        .inputGroup textarea:focus + label,
        .inputGroup textarea:valid + label {
          top: -8px;
          font-size: 11px;
          color: #4CAF50;
        }

        .btn {
          padding: 12px;
          border: none;
          border-radius: 12px;
          background: #4CAF50;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.15);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

      `}</style>

    </div>
  );
}

export default ContractForm;