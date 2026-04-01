import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPropertyById } from "../../infrastructure/api/properties";
import { applyToProperty } from "../../infrastructure/api/applications";

export default function PropertyDetail() {

  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);

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

  return (

    <div className="max-w-6xl mx-auto p-6">

      <Link
        to="/properties"
        className="text-blue-600 hover:underline mb-6 inline-block"
      >
        ← Volver a propiedades
      </Link>

      {/* IMÁGENES */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">

        {property.images && property.images.length > 0 ? (

          property.images.map((img, index) => {

            const imageUrl = img?.url || img;

            const fullImageUrl = imageUrl.startsWith("http")
              ? imageUrl
              : `http://localhost:4000/${imageUrl}`;

            return (
              <img
                key={index}
                src={fullImageUrl}
                alt="propiedad"
                className="w-full h-72 object-cover rounded-xl"
              />
            );

          })

        ) : (

          <div className="h-72 bg-gray-200 flex items-center justify-center rounded-xl">
            Sin imágenes
          </div>

        )}

      </div>

      {/* INFO */}
      <h1 className="text-3xl font-bold mb-4">
        {property.title}
      </h1>

      <p className="text-gray-600 mb-2">
        📍 {property.address}
      </p>

      <p className="text-blue-600 text-2xl font-semibold mb-6">
        ${new Intl.NumberFormat("es-CO").format(property.price)}
      </p>

      <div className="flex gap-6 text-gray-700 mb-6">
        <span>🛏 {property.rooms} habitaciones</span>
        <span>🚿 {property.bathrooms} baños</span>
        <span>🏠 {property.type}</span>
      </div>

      {/* TAGS */}
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

      {/* DESCRIPCIÓN */}
      <p className="text-gray-700 leading-relaxed">
        {property.description}
      </p>

      {/* BOTÓN APLICAR */}
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