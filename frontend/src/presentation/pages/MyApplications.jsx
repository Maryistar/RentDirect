import React, { useEffect, useState } from "react"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../application/context/AuthContext";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState("EN_PROCESO");

  const navigate = useNavigate();
  const { token, user } = useAuth();

  useEffect(() => {
    if (token) fetchApplications();
  }, [token]);

  const fetchApplications = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/applications/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("DATA BACKEND:", data);
      setApplications(data.data || data);
    } catch (error) {
      console.error("Error cargando aplicaciones", error);
    }
  };

  const mapStatusToUI = (status) => {
    if (!status) return "EN_PROCESO";

    const s = String(status).trim().toLowerCase();

    if (s === "rejected") return "RECHAZADA";

    if (["agreed", "contract_signed", "active"].includes(s)) {
      return "ARRENDADA";
    }

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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchApplications();
    } catch (error) {
      console.error("Error al retirar solicitud", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800 animate-fade-in-down">
            Mis aplicaciones
          </h1>
        </div>

        {/* TABS MODERNOS */}
        <div className="flex justify-center mb-10 flex-wrap gap-3">
          {["EN_PROCESO", "ARRENDADA", "RECHAZADA"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-medium transition
              ${
                activeTab === tab
                  ? "bg-blue-800 text-white shadow"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {tab.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* GRID DE CARDS */}
        <div className="grid md:grid-cols-2 gap-6">

          {filteredApplications.map((app, index) => {
            const uiStatus = mapStatusToUI(app.status);

            // 🔥 IMAGEN PREVIEW
            const image = app.thumbnail
              ? `http://localhost:4000/${app.thumbnail}`
              : null;

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl 
                transition-all duration-300 overflow-hidden 
                animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >

                {/* IMAGEN */}
                {image && (
                  <img
                    src={image}
                    alt="property"
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-5">

                  {/* HEADER CARD */}
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-slate-800">
                      {app.propertyTitle || "Propiedad"}
                    </h3>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeStyle(
                        uiStatus
                      )}`}
                    >
                      {uiStatus.replace("_", " ")}
                    </span>
                  </div>

                  {/* INFO */}
                  <p className="text-gray-600 text-sm mb-2">
                    <strong>Mensaje:</strong> {app.message || "Sin mensaje"}
                  </p>

                  <p className="text-gray-400 text-xs mb-4">
                    Aplicado el{" "}
                    {app.createdAt
                      ? new Date(app.createdAt).toLocaleDateString()
                      : "Fecha no disponible"}
                  </p>

                  {/* ACCIONES */}
                  <div className="flex justify-between items-center">

                    <button
                      onClick={() =>
                        navigate(`/properties/${app.property_id}`, {
                          state: { from: "/my-applications" },
                        })
                      }
                      className="text-sm px-4 py-1 rounded-full 
                      bg-blue-100 text-blue-800 
                      hover:bg-blue-200 transition font-medium"
                    >
                      Ver propiedad
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

              </div>
            );
          })}
        </div>

        {/* EMPTY */}
        {filteredApplications.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No hay aplicaciones en esta categoría
          </p>
        )}

      </div>

      {/* ANIMACIONES */}
      <style>
        {`
          .animate-fade-in-down {
            animation: fadeInDown 0.6s ease;
          }

          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease;
          }

          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

    </div>
  );
};

export default MyApplications;