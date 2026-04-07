import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";// componente de facturas

export default function Admin() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    properties: 0,
    contracts: 0,
    invoices: 0, // <-- nueva estadística
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
      navigate("/");
    }

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:4000/api/v1/admin/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStats(res.data);
      } catch (error) {
        console.error(error);
        alert("Error cargando estadísticas");
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">

      {/* HEADER */}
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            Dashboard Admin 🚀
          </h1>
          <p className="text-gray-500 mt-1">
            Control total de la plataforma
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"> {/* <-- ahora 4 columnas */}

        {/* Usuarios */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-lg hover:shadow-2xl transition">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-gray-500 text-sm">Usuarios</h2>
            <span className="text-xl">👤</span>
          </div>
          <p className="text-4xl font-bold text-gray-800">
            {stats.users}
          </p>
        </div>

        {/* Propiedades */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-lg hover:shadow-2xl transition">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-gray-500 text-sm">Propiedades</h2>
            <span className="text-xl">🏠</span>
          </div>
          <p className="text-4xl font-bold text-gray-800">
            {stats.properties}
          </p>
        </div>

        {/* Contratos */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-lg hover:shadow-2xl transition">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-gray-500 text-sm">Contratos</h2>
            <span className="text-xl">📄</span>
          </div>
          <p className="text-4xl font-bold text-gray-800">
            {stats.contracts}
          </p>
        </div>

        {/* Facturas */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-lg hover:shadow-2xl transition">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-gray-500 text-sm">Facturas</h2>
            <span className="text-xl">💵</span>
          </div>
          <p className="text-4xl font-bold text-gray-800">
            {stats.invoices} {/* <-- cantidad de facturas */}
          </p>
        </div>

      </div>

      {/* ACCIONES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6"> {/* <-- 4 columnas */}

        {/* Usuarios */}
        <div className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition group">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            Gestionar Usuarios
          </h3>
          <p className="text-gray-500 mb-6">
            Ver, editar, suspender o activar usuarios
          </p>
          <button
            onClick={() => navigate("/admin/users")}
            className="w-full bg-black text-white py-2 rounded-xl group-hover:bg-gray-800 transition"
          >
            Ir a usuarios 
          </button>
        </div>

        {/* Propiedades */}
        <div className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition group">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            Gestionar Propiedades
          </h3>
          <p className="text-gray-500 mb-6">
            Administrar propiedades publicadas
          </p>
          <button
            onClick={() => navigate("/admin/properties")}
            className="w-full bg-black text-white py-2 rounded-xl group-hover:bg-gray-800 transition"
          >
            Ir a propiedades 
          </button>
        </div>

        {/* Contratos */}
        <div className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition group">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            Ver Contratos
          </h3>
          <p className="text-gray-500 mb-6">
            Administra y controla todos los contratos
          </p>
          <button
            onClick={() => navigate("/admin/contracts")}
            className="w-full bg-black text-white py-2 rounded-xl group-hover:bg-gray-800 transition"
          >
            Ir a contratos 
          </button>
        </div>

        {/* Facturas */}
        <div className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition group">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            Ver Facturas
          </h3>
          <p className="text-gray-500 mb-6">
            Consulta todas las facturas generadas
          </p>
          <button
            onClick={() => navigate("/admin/invoices")}
            className="w-full bg-black text-white py-2 rounded-xl group-hover:bg-gray-800 transition"
          >
            Ir a facturas 
          </button>
        </div>

      </div>

    </div>
  );
}