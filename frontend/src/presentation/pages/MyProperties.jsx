import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyProperties } from "../../infrastructure/api/properties";
import {
  getApplicationsForProperty,
  updateApplicationStatus,
} from "../../infrastructure/api/applications";
import { startChat } from "../../infrastructure/api/chats";

export default function MyProperties() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
            return { ...property, applications: apps };
          } catch {
            return { ...property, applications: [] };
          }
        })
      );

      setProperties(withApplications);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar tus propiedades");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatus(applicationId, status) {
    try {
      await updateApplicationStatus(applicationId, status);
      alert("Estado actualizado correctamente");
      loadProperties();
    } catch (err) {
      alert("Error al actualizar la aplicación");
    }
  }

  // 🔥 ESTA ES LA FUNCIÓN NUEVA
  async function handleStartChat(propertyId, tenantId, applicationId) {
    try {
      const chat = await startChat(propertyId, tenantId);

      // Cambiamos estado a in_review cuando inicia conversación
      await updateApplicationStatus(applicationId, "in_review");

      navigate(`/chat/${chat.id}`);
    } catch (error) {
      console.error(error);
      alert("Error al iniciar conversación");
    }
  }

  function getVisualStatus(status) {
    if (
      status === "pending" ||
      status === "in_review" ||
      status === "agreed" ||
      status === "contract_signed"
    ) {
      return { text: "En proceso", color: "#2563eb" };
    }

    if (status === "active") {
      return { text: "Arrendada", color: "green" };
    }

    if (status === "rejected") {
      return { text: "Rechazada", color: "#dc2626" };
    }

    return { text: status, color: "gray" };
  }

  if (loading) return <p style={{ padding: 20 }}>Cargando propiedades...</p>;
  if (error) return <p style={{ padding: 20, color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 20 }}>Mis Propiedades</h1>

      {properties.length === 0 && (
        <p>No tienes propiedades publicadas todavía.</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 20,
        }}
      >
        {properties.map((property) => (
          <div
            key={property.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              overflow: "hidden",
              background: "#fff",
            }}
          >
            {property.thumbnail ? (
              <img
                src={`http://localhost:4000/${property.thumbnail}`}
                alt={property.title}
                style={{
                  width: "100%",
                  height: 180,
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  height: 180,
                  background: "#eee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#666",
                }}
              >
                Sin imagen
              </div>
            )}

            <div style={{ padding: 14 }}>
              <h3>{property.title}</h3>

              <p><strong>Dirección:</strong> {property.address}</p>
              <p><strong>Precio:</strong> ${property.price}</p>

              <Link
                to={`/properties/${property.id}`}
                style={{ display: "inline-block", marginTop: 8, color: "#2563eb" }}
              >
                Ver propiedad →
              </Link>

              <div
                style={{
                  marginTop: 16,
                  paddingTop: 12,
                  borderTop: "1px solid #eee",
                }}
              >
                <h4>Aplicaciones</h4>

                {property.applications.length === 0 ? (
                  <p style={{ fontSize: 14, color: "#666" }}>
                    No hay aplicaciones aún
                  </p>
                ) : (
                  property.applications.map((app) => {
                    const visual = getVisualStatus(app.status);

                    return (
                      <div
                        key={app.id}
                        style={{
                          border: "1px solid #ddd",
                          borderRadius: 6,
                          padding: 10,
                          marginBottom: 8,
                          background: "#fafafa",
                        }}
                      >
                        <p><strong>Usuario:</strong> {app.name || app.email}</p>
                        <p><strong>Mensaje:</strong> {app.message || "Sin mensaje"}</p>

                        <p>
                          <strong>Estado:</strong>{" "}
                          <span style={{ color: visual.color, fontWeight: "bold" }}>
                            {visual.text}
                          </span>
                        </p>

                        {app.status === "pending" && (
                          <div style={{ marginTop: 8 }}>
                            <button
                              onClick={() =>
                                handleStartChat(
                                  property.id,
                                  app.tenant_id,   // ⚠️ si no funciona revisamos el nombre
                                  app.id
                                )
                              }
                              style={{
                                marginRight: 8,
                                padding: "6px 10px",
                                background: "green",
                                color: "#fff",
                                border: "none",
                                borderRadius: 4,
                                cursor: "pointer",
                              }}
                            >
                              Iniciar conversación
                            </button>

                            <button
                              onClick={() =>
                                handleStatus(app.id, "rejected")
                              }
                              style={{
                                padding: "6px 10px",
                                background: "#dc2626",
                                color: "#fff",
                                border: "none",
                                borderRadius: 4,
                                cursor: "pointer",
                              }}
                            >
                              Rechazar
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}