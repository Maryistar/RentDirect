import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getMyProperties,
  deleteProperty
} from "../../infrastructure/api/properties";

import {
  getApplicationsForProperty,
  updateApplicationStatus
} from "../../infrastructure/api/applications";

import { startChat } from "../../infrastructure/api/chats";

export default function MyProperties() {

  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    try {
      const data = await getMyProperties();

      const withApplications = await Promise.all(
        data.map(async (property) => {
          try {
            const apps = await getApplicationsForProperty(property.id);

            return {
              ...property,
              applications: Array.isArray(apps) ? apps : []
            };

          } catch {
            return {
              ...property,
              applications: []
            };
          }
        })
      );

      setProperties(withApplications);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function getPropertyStatus(property) {
    const s = property.status?.toLowerCase();
    if (s === "rented") return "ARRENDADA";
    return "DISPONIBLE";
  }

  function translateStatus(status) {
    switch (status) {
      case "pending": return "Pendiente";
      case "in_review": return "En revisión";
      case "agreed": return "Aceptado";
      case "rejected": return "Rechazado";
      default: return status;
    }
  }

  async function handleDelete(propertyId) {
    if (!window.confirm("¿Eliminar esta propiedad?")) return;

    try {
      await deleteProperty(propertyId);
      loadProperties();
    } catch {
      alert("No se puede eliminar la propiedad porque no está disponible");
    }
  }

  function handleEdit(propertyId) {
    navigate(`/edit-property/${propertyId}`);
  }

  async function handleStatus(applicationId, status) {
    try {
      await updateApplicationStatus(applicationId, status);
      loadProperties();
    } catch {
      alert("Error actualizando aplicación");
    }
  }

  async function handleStartChat(propertyId, tenantId, applicationId) {
    try {
      const chat = await startChat(propertyId, tenantId);
      await updateApplicationStatus(applicationId, "in_review");
      navigate(`/chat/${chat.id}`);
    } catch {
      alert("Error iniciando conversación");
    }
  }

  if (loading) {
    return <div className="p-10 text-center">Cargando propiedades...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">

      <div className="max-w-7xl mx-auto">

        {/* TITULO CENTRADO */}
        <h1 className="text-4xl font-bold text-center mb-12 text-slate-800 animate-fade-in-down">
          Mis Propiedades
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {properties.map((property, index) => {

            const image = property.thumbnail
              ? `http://localhost:4000/${property.thumbnail}`
              : null;

            return (
              <div
                key={property.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl 
                transition-all duration-300 overflow-hidden 
                transform hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >

                {image && (
                  <img
                    src={image}
                    alt={property.title}
                    className="w-full h-52 object-cover transition-transform duration-300 hover:scale-105"
                  />
                )}

                <div className="p-5">

                  <p className="text-blue-700 font-bold text-lg">
                    ${Number(property.price).toLocaleString("es-CO")}
                  </p>

                  <h3 className="font-bold text-lg text-slate-800">
                    {property.title}
                  </h3>

                  <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full
                    ${getPropertyStatus(property) === "ARRENDADA"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"}`}>
                    {getPropertyStatus(property)}
                  </span>

                  <p className="text-gray-500 text-sm mt-1">
                    {property.address}
                  </p>

                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <span>{property.rooms || 0} hab</span>
                    <span>{property.bathrooms || 0} baños</span>
                    <span>{property.type}</span>
                  </div>

                  {/*  ACCIONES */}
                  <div className="flex justify-between items-center mt-4">

                    <Link
                        to={`/properties/${property.id}`}
                        state={{ from: "/my-properties" }}
                        className="text-sm px-4 py-1 rounded-full 
                        bg-blue-50 text-blue-700 
                        hover:bg-blue-100 transition"
                      >
                        Ver propiedad
                      </Link>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(property.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => handleDelete(property.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Eliminar
                      </button>
                    </div>

                  </div>

                  {/* APLICACIONES */}
                  <div className="mt-6 border-t pt-4">

                    <h4 className="font-semibold mb-3">Aplicaciones</h4>

                    {property.applications.length === 0 && (
                      <p className="text-sm text-gray-500">
                        No hay aplicaciones
                      </p>
                    )}

                    {property.applications.map((app) => (

                      <div
                        key={app.id}
                        className="bg-gray-50 border rounded-xl p-4 mb-3"
                      >

                        <div className="flex justify-between items-center">

                          <p className="font-semibold text-sm">
                            {app.user_name || app.name}
                          </p>

                          <button
                            onClick={() => navigate(`/profile/${app.tenant_id}`)}
                            className="text-xs px-3 py-1 rounded-full 
                            bg-gray-200 text-gray-700 
                            hover:bg-gray-300 transition"
                          >
                            Ver perfil
                          </button>

                        </div>

                        <p className="text-sm text-gray-600 mt-1">
                          {app.message || "Sin mensaje"}
                        </p>

                        <p className="text-xs mt-2 font-semibold text-blue-600">
                          {translateStatus(app.status)}
                        </p>

                        {app.status === "pending" && (
                          <div className="flex gap-2 mt-3">

                            <button
                              onClick={() =>
                                handleStartChat(property.id, app.tenant_id, app.id)
                              }
                              className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                            >
                              Chat
                            </button>

                            <button
                              onClick={() => handleStatus(app.id, "rejected")}
                              className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                            >
                              Rechazar
                            </button>

                          </div>
                        )}

                      </div>

                    ))}

                  </div>

                </div>

              </div>
            );

          })}

        </div>

        {properties.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No tienes propiedades publicadas
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
}