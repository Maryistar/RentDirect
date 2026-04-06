import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminContracts() {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
      navigate("/");
    }

    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:4000/api/v1/contracts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setContracts(res.data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar contratos");
    }
  };

  // ✅ ACEPTAR
  const handleAccept = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:4000/api/v1/contracts/${id}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Contrato aceptado ✅");
      fetchContracts();
    } catch (err) {
      console.error(err);
      alert("Error aceptando contrato");
    }
  };

  // ❌ RECHAZAR
  const handleReject = async (id) => {
    if (!window.confirm("¿Rechazar contrato?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:4000/api/v1/contracts/${id}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Contrato rechazado ❌");
      fetchContracts();
    } catch (err) {
      console.error(err);
      alert("Error rechazando contrato");
    }
  };

  // 🗑️ ELIMINAR (NUEVO)
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar contrato definitivamente?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:4000/api/v1/contracts/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Contrato eliminado 🗑️");

      // 🔥 actualizar UI sin recargar
      setContracts(contracts.filter((c) => c.id !== id));

    } catch (err) {
      console.error(err);
      alert("Error eliminando contrato");
    }
  };

  // 📄 PDF
  const handleDownload = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:4000/api/v1/contracts/${id}/pdf`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      if (res.headers["content-type"] === "application/pdf") {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", `contrato_${id}.pdf`);

        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        const text = await res.data.text();
        const json = JSON.parse(text);

        alert(json.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error descargando PDF");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Gestión de Contratos 📄
        </h1>
        <p className="text-gray-500">
          
        </p>
      </div>

      <div className="grid gap-4">

        {contracts.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow text-center">
            <p className="text-gray-400 text-lg">
              No hay contratos disponibles 😕
            </p>
          </div>
        ) : (
          contracts.map((c) => (
            <div
              key={c.id}
              className="bg-white p-5 rounded-2xl shadow hover:shadow-xl transition flex justify-between items-center"
            >

              <div>
                <p className="text-lg font-semibold text-gray-800">
                  Contrato #{c.id}
                </p>

                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                    c.status
                  )}`}
                >
                  {c.status}
                </span>
              </div>

              <div className="flex gap-2 flex-wrap">

                {c.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleAccept(c.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Aceptar
                    </button>

                    <button
                      onClick={() => handleReject(c.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Rechazar
                    </button>
                  </>
                )}

                {c.status === "active" && (
                  <button
                    onClick={() => handleDownload(c.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    PDF
                  </button>
                )}

                
                <button
                  onClick={() => handleDelete(c.id)}
                  className="bg-gray-800 hover:bg-black text-white px-3 py-1 rounded-lg text-sm"
                >
                  Eliminar
                </button>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}