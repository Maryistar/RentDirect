import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ContractForm() {
  const { id } = useParams(); // chatId

  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    paymentMethod: "Transferencia",
    utilities: [],
    use: "",
    repairs: "",
    termination: "",
    terms: ""
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;

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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow">

      <h2 className="text-2xl font-bold mb-4">Crear contrato</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* FECHAS */}
        <div>
          <h3 className="font-semibold">Duración</h3>
          <input
            type="date"
            name="startDate"
            onChange={handleChange}
            className="input"
          />
          <input
            type="date"
            name="endDate"
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* MÉTODO DE PAGO */}
        <div>
          <h3 className="font-semibold">Método de pago</h3>
          <select
            name="paymentMethod"
            onChange={handleChange}
            className="input"
          >
            <option>Transferencia</option>
            <option>Efectivo</option>
          </select>
        </div>

        {/* SERVICIOS */}
        <div>
          <h3 className="font-semibold">Servicios incluidos</h3>
          <label><input type="checkbox" value="Agua" onChange={handleCheckbox} /> Agua</label>
          <label><input type="checkbox" value="Luz" onChange={handleCheckbox} /> Luz</label>
          <label><input type="checkbox" value="Gas" onChange={handleCheckbox} /> Gas</label>
          <label><input type="checkbox" value="Administración" onChange={handleCheckbox} /> Administración</label>
        </div>

        {/* CLÁUSULAS */}
        <div>
          <h3 className="font-semibold">Cláusulas</h3>

          <textarea
            name="use"
            placeholder="Uso del inmueble"
            onChange={handleChange}
            className="input"
          />

          <textarea
            name="repairs"
            placeholder="Reparaciones"
            onChange={handleChange}
            className="input"
          />

          <textarea
            name="termination"
            placeholder="Terminación anticipada"
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* EXTRA */}
        <div>
          <h3 className="font-semibold">Términos adicionales</h3>
          <textarea
            name="terms"
            placeholder="Otros términos"
            onChange={handleChange}
            className="input"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl w-full hover:bg-blue-700"
        >
          Guardar contrato
        </button>

      </form>
    </div>
  );
}

export default ContractForm;