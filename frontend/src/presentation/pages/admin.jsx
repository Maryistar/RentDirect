import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();

  // 🔥 estados para estadísticas
  const [stats, setStats] = useState({
    users: 0,
    properties: 0,
    contracts: 0,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
      navigate("/");
    }

    // 🔥 DATOS TEMPORALES (luego conectamos backend)
    setStats({
      users: 12,
      properties: 8,
      contracts: 5,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard Admin
          </h1>
          <p className="text-gray-500">
            Control total de la plataforma 🚀
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        {/* Usuarios */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-gray-500 text-sm">Usuarios</h2>
          <p className="text-3xl font-bold text-black">{stats.users}</p>
        </div>

        {/* Propiedades */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-gray-500 text-sm">Propiedades</h2>
          <p className="text-3xl font-bold text-black">{stats.properties}</p>
        </div>

        {/* Contratos */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-gray-500 text-sm">Contratos</h2>
          <p className="text-3xl font-bold text-black">{stats.contracts}</p>
        </div>

      </div>

      {/* ACCIONES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
          <h3 className="text-lg font-semibold mb-2">Gestionar Usuarios</h3>
          <p className="text-gray-500 mb-4">
            Ver, editar o eliminar usuarios
          </p>
          <button className="bg-black text-white px-4 py-2 rounded-lg">
            Ir a usuarios
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
          <h3 className="text-lg font-semibold mb-2">Gestionar Propiedades</h3>
          <p className="text-gray-500 mb-4">
            Administrar propiedades publicadas
          </p>
          <button className="bg-black text-white px-4 py-2 rounded-lg">
            Ir a propiedades
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
          <h3 className="text-lg font-semibold mb-2">Ver Contratos</h3>
          <p className="text-gray-500 mb-4">
            Revisar contratos activos
          </p>
          <button className="bg-black text-white px-4 py-2 rounded-lg">
            Ir a contratos
          </button>
        </div>

      </div>

    </div>
  );
}