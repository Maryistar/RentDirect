import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ContractForm() {

  const { id } = useParams();

  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    paymentMethod: "Transferencia",
    utilities: [],
    use: "",
    repairs: "",
    termination: "",
    terms: "",
    monthlyPrice: ""
  });

  const token = localStorage.getItem("token");

  const formatCOP = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("es-CO").format(value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "monthlyPrice") {
      const numericValue = value.replace(/\D/g, "");
      setForm({
        ...form,
        monthlyPrice: numericValue
      });
      return;
    }

    setForm({
      ...form,
      [name]: value
    });
  };

  const handleCheckbox = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setForm({
        ...form,
        utilities: [...form.utilities, value]
      });
    } else {
      setForm({
        ...form,
        utilities: form.utilities.filter((u) => u !== value)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:4000/api/v1/contracts",
        {
          chatId: id,
          ...form,
          monthlyPrice: Number(form.monthlyPrice)
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

          {/* FECHAS */}
          <div className="inputGroup">
            <label className="labelTop">Fecha inicio</label>
            <input type="date" name="startDate" onChange={handleChange} required />
          </div>

          <div className="inputGroup">
            <label className="labelTop">Fecha fin</label>
            <input type="date" name="endDate" onChange={handleChange} required />
          </div>

          {/* 💰 PRECIO */}
          <div className="inputGroup priceGroup">
            <span className="currency">$</span>
            <input
              type="text"
              name="monthlyPrice"
              value={formatCOP(form.monthlyPrice)}
              onChange={handleChange}
              placeholder="0"
              required
            />
            <label>Precio mensual</label>
          </div>

          {/* MÉTODO DE PAGO */}
          <div className="inputGroup">
            <select name="paymentMethod" onChange={handleChange}>
              <option>Transferencia</option>
              <option>Efectivo</option>
            </select>
          </div>

          {/* SERVICIOS */}
          <div className="inputGroup">
            <label>Servicios incluidos</label>
            <div>
              <label><input type="checkbox" value="Agua" onChange={handleCheckbox} /> Agua</label>
              <label><input type="checkbox" value="Luz" onChange={handleCheckbox} /> Luz</label>
              <label><input type="checkbox" value="Gas" onChange={handleCheckbox} /> Gas</label>
              <label><input type="checkbox" value="Administración" onChange={handleCheckbox} /> Administración</label>
            </div>
          </div>

          {/* CLÁUSULAS */}
          <div className="inputGroup">
            <textarea name="use" placeholder="Uso del inmueble" onChange={handleChange} />
            <textarea name="repairs" placeholder="Reparaciones" onChange={handleChange} />
            <textarea name="termination" placeholder="Terminación anticipada" onChange={handleChange} />
          </div>

          {/* TERMINOS */}
          <div className="inputGroup">
            <textarea name="terms" onChange={handleChange} required />
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
        }

        .title {
          text-align: center;
          margin-bottom: 20px;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .inputGroup input,
        .inputGroup textarea,
        .inputGroup select {
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #ddd;
        }

        .btn {
          padding: 12px;
          border: none;
          border-radius: 12px;
          background: #4CAF50;
          color: white;
          font-weight: bold;
          cursor: pointer;
        }
      `}</style>

    </div>
  );
}

export default ContractForm;