import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProperties } from "../../infrastructure/api/properties";

export default function Properties() {

  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [neighborhoodFilter, setNeighborhoodFilter] = useState("Todos");

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    try {
      const data = await getProperties();
      setProperties(data);
      setFiltered(data);
    } catch (error) {
      console.error("Error cargando propiedades", error);
    }
  }

  useEffect(() => {
    let result = [...properties];

    if (typeFilter !== "Todos") {
      result = result.filter(p => p.type === typeFilter);
    }

    if (neighborhoodFilter !== "Todos") {
      result = result.filter(p => p.address?.includes(neighborhoodFilter));
    }

    setFiltered(result);
  }, [typeFilter, neighborhoodFilter, properties]);

  const propertyTypes = [
    "Todos",
    "Casa",
    "Apartamento",
    "Apartaestudio",
    "Habitacion",
    "Oficina",
    "Local Comercial",
    "Finca",
  ];

  const neighborhoods = [
    "Todos",
    "La Candelaria (Centro)",
    "La America",
    "El Poblado",
    "Laureles",
    "Villa Hermosa",
    "Manrique",
    "Doce De Octubre",
    "San Javier",
    "Envigado",
    "Itagüi",
    "Sabaneta",
    "La Estrella",
    "Caldas",
    "Bello",
    "Belen",
    "Robledo",
    "Popular",
    "Santo Domingo Savio",
    "Castilla",
    "Buenos Aires",
    "Aranjuez",
    "Guayabal",
    "Copacabana",
    "Girardota",
    "Barbosa",
  ];

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col items-center mb-12">

          <h1 className="text-4xl font-bold text-center mb-6 
            animate-fade-in-down 
            text-slate-800">
            Propiedades disponibles
          </h1>

          {/* FILTROS MODERNOS */}
          <div className="flex flex-wrap gap-4 justify-center">

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-5 py-2 
              shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-700 
              hover:shadow-md transition"
            >
              {propertyTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>

            <select
              value={neighborhoodFilter}
              onChange={(e) => setNeighborhoodFilter(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-5 py-2 
              shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-700 
              hover:shadow-md transition"
            >
              {neighborhoods.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>

          </div>

        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {filtered.map((property, index) => {

            const image = property.thumbnail
              ? `http://localhost:4000/${property.thumbnail}`
              : null;

            return (

              <Link
                key={property.id}
                to={`/properties/${property.id}`}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl 
                transition-all duration-300 overflow-hidden 
                transform hover:-translate-y-1 
                animate-fade-in-up"
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

                  <p className="text-blue-700 font-semibold text-lg">
                    ${Number(property.price).toLocaleString("es-CO")}
                  </p>

                  <h3 className="font-bold text-lg mt-1 text-slate-800">
                    {property.title}
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    {property.address}
                  </p>

                  <div className="flex gap-4 mt-3 text-sm text-gray-600">
                    <span>{property.rooms || 0} hab</span>
                    <span>{property.bathrooms || 0} baños</span>
                    <span>{property.type}</span>
                  </div>

                </div>

              </Link>

            );

          })}

        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No hay propiedades disponibles
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