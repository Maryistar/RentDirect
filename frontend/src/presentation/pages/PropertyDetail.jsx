import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPropertyById } from "../../infrastructure/api/properties";
import { applyToProperty } from "../../infrastructure/api/applications";
import { useLocation, useNavigate } from "react-router-dom";

export default function PropertyDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from;

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);

  // CARRUSEL STATE
  const [currentImage, setCurrentImage] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    async function loadProperty() {
      try {
        const data = await getPropertyById(id);
        const propertyData = data.data || data;

        setProperty(propertyData);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la propiedad");
      } finally {
        setLoading(false);
      }
    }

    loadProperty();
  }, [id]);

  //  AUTO SLIDE
  useEffect(() => {
    if (!property?.images?.length) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) =>
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [property]);

  const handleApply = async () => {
    try {
      setApplying(true);
      await applyToProperty(property.id, "Estoy interesado en esta propiedad");
      alert("✅ Aplicación enviada");
    } catch (error) {
      alert(error.message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <p className="p-10">Cargando propiedad...</p>;
  if (error) return <p className="p-10 text-red-500">{error}</p>;
  if (!property) return <p className="p-10">Propiedad no encontrada</p>;

  const ownerId = property.owner_id;

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/*  BOTÓN VOLVER  */}
      <button
        onClick={() => navigate(from || "/properties")}
        className="mb-6 px-6 py-2 rounded-full 
        bg-blue-700 text-white font-semibold 
        shadow-md hover:bg-blue-800 hover:scale-105 
        transition-all duration-300"
      >
        Volver 
      </button>

      {/*  CARRUSEL */}
      <div className="relative mb-8">

        {property.images && property.images.length > 0 ? (
          <>
            {/* IMAGEN ACTUAL */}
            <img
              src={
                property.images[currentImage]?.url?.startsWith("http")
                  ? property.images[currentImage].url
                  : `http://localhost:4000/${property.images[currentImage]?.url || property.images[currentImage]}`
              }
              alt="propiedad"
              className="w-full h-[420px] object-cover rounded-2xl transition-all duration-700"
            />

            {/* BOTONES */}
            <button
              onClick={() =>
                setCurrentImage((prev) =>
                  prev === 0 ? property.images.length - 1 : prev - 1
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 
              bg-white/80 px-3 py-2 rounded-full shadow hover:scale-110"
            >
              ‹
            </button>

            <button
              onClick={() =>
                setCurrentImage((prev) =>
                  prev === property.images.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 
              bg-white/80 px-3 py-2 rounded-full shadow hover:scale-110"
            >
              ›
            </button>

            {/* INDICADORES */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {property.images.map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i === currentImage
                      ? "bg-white"
                      : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="h-72 bg-gray-200 flex items-center justify-center rounded-xl">
            Sin imágenes
          </div>
        )}

      </div>

      {/* INFO */}
      <h1 className="text-3xl font-bold mb-4">{property.title}</h1>

      <p className="text-gray-600 mb-2">📍 {property.address}</p>

      <p className="text-blue-600 text-2xl font-semibold mb-6">
        ${new Intl.NumberFormat("es-CO").format(property.price)}
      </p>

      <div className="flex gap-6 text-gray-700 mb-6">
        <span>🛏 {property.rooms} habitaciones</span>
        <span>🚿 {property.bathrooms} baños</span>
        <span>🏠 {property.type}</span>
      </div>

      {property.tags && property.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {property.tags.map((tag, i) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <p className="text-gray-700 leading-relaxed">
        {property.description}
      </p>

      {/* OWNER */}
      <div className="mt-12 bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-100">
        
        <div className="flex items-center gap-5 w-full md:w-auto">
          <img
            src={
              property.owner_photo
                ? property.owner_photo.startsWith("http")
                  ? property.owner_photo
                  : `http://localhost:4000/${property.owner_photo}`
                : "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(property.owner_name || "Owner")
            }
            alt="owner"
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow-sm"
          />

          <div>
            <p className="font-semibold text-lg text-gray-800">
              {property.owner_name || "Propietario"}
            </p>

            <p className="text-gray-500 text-sm">
              {property.owner_email}
            </p>
          </div>
        </div>

        <div className="w-full md:w-auto">
          {ownerId ? (
            <Link
              to={`/profile/${ownerId}`}
              className="px-6 py-2 rounded-lg bg-gray-900 text-white hover:bg-black transition"
            >
              Ver perfil
            </Link>
          ) : (
            <span className="text-gray-400 text-sm">
              Perfil no disponible
            </span>
          )}
        </div>
      </div>

      {/* APPLY */}
      {user?.role === "tenant" && (
        <button
          onClick={handleApply}
          disabled={applying}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"
        >
          {applying ? "Aplicando..." : "Aplicar a propiedad"}
        </button>
      )}
    </div>
  );
}