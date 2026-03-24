import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ContractForm() {

  const { id } = useParams(); // chatId

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
    <div>

      <h2>Crear contrato</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="date"
          name="startDate"
          onChange={handleChange}
        />

        <input
          type="date"
          name="endDate"
          onChange={handleChange}
        />

        <input
          type="number"
          name="monthlyPrice"
          placeholder="Precio mensual"
          onChange={handleChange}
        />

        <textarea
          name="terms"
          placeholder="Términos"
          onChange={handleChange}
        />

        <button type="submit">
          Guardar
        </button>

      </form>

    </div>
  );
}

export default ContractForm;