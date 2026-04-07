import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ContractForm() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    paymentMethod: "Transferencia",
    utilities: [],
    inventory: [],
    terms: "",
    monthlyPrice: "",
    paymentDays: "",
    noticeTime: ""
  });

  
  const [chatInfo, setChatInfo] = useState(null);
  useEffect(() => {
    console.log("CHAT INFO FRONT:", chatInfo);
  }, [chatInfo]);

  const token = localStorage.getItem("token");

  
  useEffect(() => {
    const loadChatInfo = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/v1/chats/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setChatInfo(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadChatInfo();
  }, [id]);

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
    const { value, checked, name } = e.target;

    if (checked) {
      setForm({
        ...form,
        [name]: [...form[name], value]
      });
    } else {
      setForm({
        ...form,
        [name]: form[name].filter((u) => u !== value)
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

      // 🔥 REDIRECCIÓN AL CHAT
      navigate(`/chat/${id}`);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">

      <div className="card">

        <h2 className="title">📄 Crear contrato</h2>

        <form onSubmit={handleSubmit} className="form">

          <div className="section">
            <h3>👤 Partes</h3>
            <input value={chatInfo?.owner_name || "Propietario"} disabled />
            <input value={chatInfo?.tenant_name || "Inquilino"} disabled />
          </div>

          <div className="section">
            <h3>📅 Fechas</h3>

            <input type="date" name="startDate" onChange={handleChange} required />
            <input type="date" name="endDate" onChange={handleChange} required />
          </div>

          <div className="section">
            <h3>🏠 Inmueble</h3>

            <input
              value={chatInfo?.property_address || ""}
              disabled
            />

            <textarea
              value={chatInfo?.property_description || ""}
              disabled
            />

            <label>Inventario:</label>

            <label><input type="checkbox" name="inventory" value="Pintura nueva" onChange={handleCheckbox} /> Pintura nueva</label>
            <label><input type="checkbox" name="inventory" value="Llaves en buen estado" onChange={handleCheckbox} /> Llaves en buen estado</label>
            <label><input type="checkbox" name="inventory" value="Puertas en buen estado" onChange={handleCheckbox} /> Puertas en buen estado</label>
            <label><input type="checkbox" name="inventory" value="Ventanas en buen estado" onChange={handleCheckbox} /> Ventanas en buen estado</label>
            <label><input type="checkbox" name="inventory" value="Cocina integral" onChange={handleCheckbox} /> Cocina integral</label>
          </div>

          <div className="section">
            <h3>💰 Pago</h3>

            <div className="inputGroup">
              <span>$</span>
              <input
                type="text"
                name="monthlyPrice"
                value={formatCOP(form.monthlyPrice)}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>

            <select name="paymentMethod" onChange={handleChange}>
              <option>Transferencia</option>
              <option>Efectivo</option>
            </select>

            <input
              name="paymentDays"
              placeholder="Ej: primeros 5 días del mes"
              onChange={handleChange}
            />
          </div>

          <div className="section">
            <h3>🔌 Servicios</h3>

            <label><input type="checkbox" name="utilities" value="Agua" onChange={handleCheckbox} /> Agua</label>
            <label><input type="checkbox" name="utilities" value="Luz" onChange={handleCheckbox} /> Luz</label>
            <label><input type="checkbox" name="utilities" value="Gas" onChange={handleCheckbox} /> Gas</label>
            <label><input type="checkbox" name="utilities" value="Administración" onChange={handleCheckbox} /> Administración</label>
          </div>

          <div className="section">
            <h3>📝 Otros términos</h3>

            <textarea name="terms" onChange={handleChange} required />
          </div>

          <button className="btn">
            Guardar contrato
          </button>

        </form>

      </div>

      <style>{`
        .container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f4f6f9;
          padding: 40px 0;
        }

        .card {
          width: 500px;
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

        .section {
          background: #f9fafc;
          padding: 15px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .section h3 {
          margin-bottom: 5px;
        }

        input, textarea, select {
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #ddd;
        }

        textarea {
          resize: none;
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