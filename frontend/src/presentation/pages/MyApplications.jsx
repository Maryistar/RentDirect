import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../application/context/AuthContext"; // 🔹 Importamos contexto

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState("EN_PROCESO");

  const navigate = useNavigate();
  const { token, user } = useAuth(); // 🔹 Traemos token y usuario del contexto

  useEffect(() => {
    if (token) fetchApplications(); // 🔹 Solo intentar si hay token
  }, [token]);

  const fetchApplications = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/applications/me",
        {
          headers: {
            Authorization: `Bearer ${token}`, // 🔹 Usamos token del contexto
          },
        }
      );

      const data = await response.json();
      console.log("DATA BACKEND:", data); // 🔥 DEBUG
      setApplications(data.data || data);
    } catch (error) {
      console.error("Error cargando aplicaciones", error);
    }
  };

  const mapStatusToUI = (status) => {
    const s = status?.toLowerCase();

    if (
      s === "pending" ||
      s === "in_review" ||
      s === "agreed" ||
      s === "contract_signed"
    ) {
      return "EN_PROCESO";
    }

    if (s === "active") return "ARRENDADA";
    if (s === "rejected") return "RECHAZADA";

    return "EN_PROCESO";
  };

  const filteredApplications = applications.filter(
    (app) => mapStatusToUI(app.status) === activeTab
  );

  const getBadgeStyle = (status) => {
    if (status === "EN_PROCESO")
      return "bg-yellow-100 text-yellow-800";
    if (status === "ARRENDADA")
      return "bg-green-100 text-green-800";
    if (status === "RECHAZADA")
      return "bg-red-100 text-red-800";
  };

  const handleWithdraw = async (id) => {
    try {
      await fetch(
        `http://localhost:4000/api/v1/applications/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // 🔹 Usamos token del contexto
          },
        }
      );

      fetchApplications();
    } catch (error) {
      console.error("Error al retirar solicitud", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">
        Mis aplicaciones
      </h1>

      {/* TABS */}
      <div className="flex gap-4 mb-8">
        {["EN_PROCESO", "ARRENDADA", "RECHAZADA"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {tab.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* LISTADO */}
      <div className="space-y-6">
        {filteredApplications.map((app) => {
          const uiStatus = mapStatusToUI(app.status);

          return (
            <div
              key={app.id}
              className="bg-white rounded-xl shadow p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium">
                  {app.propertyTitle || "Propiedad"}
                </h3>

                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold ${getBadgeStyle(
                    uiStatus
                  )}`}
                >
                  {uiStatus.replace("_", " ")}
                </span>
              </div>

              <p className="mb-2">
                <strong>Mensaje:</strong> {app.message || "Sin mensaje"}
              </p>

              <p className="text-gray-500 text-sm mb-4">
                Aplicado el{" "}
                {app.createdAt
                  ? new Date(app.createdAt).toLocaleDateString()
                  : "Fecha no disponible"}
              </p>

              <div className="flex justify-between items-center">
                <button
                  onClick={() =>
                    navigate(`/properties/${app.property_id}`)
                  }
                  className="text-blue-600 font-medium hover:underline"
                >
                  Ver propiedad →
                </button>

                {uiStatus === "EN_PROCESO" && (
                  <button
                    onClick={() => handleWithdraw(app.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Retirar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyApplications;