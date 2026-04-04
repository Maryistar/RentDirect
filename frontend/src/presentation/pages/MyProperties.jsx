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

  // 🔥 NUEVO: función para estado visual
  function getPropertyStatus(property) {
    const s = property.status?.toLowerCase().trim();

    if (s === "rented") return "ARRENDADA";

    return "DISPONIBLE";
  }

  async function handleDelete(propertyId) {

    const confirmDelete = window.confirm("¿Eliminar esta propiedad?");

    if (!confirmDelete) return;

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
    return (
      <div className="p-10 text-center">
        Cargando propiedades...
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-slate-100 py-12 px-6">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-10">
          Mis Propiedades
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {properties.map((property) => {

            const image = property.thumbnail
              ? `http://localhost:4000/${property.thumbnail}`
              : null;

            return (

              <div
                key={property.id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
              >

                {image && (
                  <img
                    src={image}
                    alt={property.title}
                    className="w-full h-52 object-cover"
                  />
                )}

                <div className="p-5">

                  <p className="text-blue-600 font-semibold text-lg">
                    ${Number(property.price).toLocaleString("es-CO")}
                  </p>

                  <h3 className="font-bold text-lg mt-1">
                    {property.title}
                  </h3>

                  {/* 🔥 NUEVA ETIQUETA */}
                  <span
                    className={`inline-block mt-2 px-3 py-1 text-sm font-semibold rounded-full ${
                      getPropertyStatus(property) === "ARRENDADA"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {getPropertyStatus(property)}
                  </span>

                  <p className="text-gray-500 text-sm mt-1">
                    {property.address}
                  </p>

                  <div className="flex gap-4 mt-3 text-sm text-gray-600">
                    <span>{property.rooms || 0} hab</span>
                    <span>{property.bathrooms || 0} baños</span>
                    <span>{property.type}</span>
                  </div>

                  <Link
                    to={`/properties/${property.id}`}
                    className="inline-block mt-4 text-blue-600 hover:underline"
                  >
                    Ver propiedad →
                  </Link>

                  <div className="flex gap-3 mt-4">

                    <button
                      onClick={() => handleEdit(property.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => handleDelete(property.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      Eliminar
                    </button>

                  </div>

                  <div className="mt-6 border-t pt-4">

                    <h4 className="font-semibold mb-3">
                      Aplicaciones
                    </h4>

                    {property.applications.length === 0 && (

                      <p className="text-sm text-gray-500">
                        No hay aplicaciones
                      </p>

                    )}

                    {property.applications.map((app) => (

                      <div
                        key={app.id}
                        className="border rounded-xl p-3 mb-3 bg-slate-50"
                      >

                        <p>
                          <strong>Usuario:</strong>{" "}
                          {app.user_name || app.name || app.email || "Usuario"}
                        </p>

                        <p>
                          <strong>Mensaje:</strong>{" "}
                          {app.message || "Sin mensaje"}
                        </p>

                        <p className="text-blue-600 font-semibold">
                          Estado: {app.status}
                        </p>

                        {app.status === "pending" && (

                          <div className="flex gap-3 mt-2">

                            <button
                              onClick={() =>
                                handleStartChat(
                                  property.id,
                                  app.tenant_id,
                                  app.id
                                )
                              }
                              className="bg-green-600 text-white px-3 py-1 rounded"
                            >
                              Iniciar conversación
                            </button>

                            <button
                              onClick={() =>
                                handleStatus(app.id, "rejected")
                              }
                              className="bg-red-600 text-white px-3 py-1 rounded"
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

    </div>

  );

}