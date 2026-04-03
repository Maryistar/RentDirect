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
    "Doce De Octubre",
    "San Javier",
    "Envigado",
    "Itagüi",
    "Sabaneta",
    "Bello",
    "Belen",
    "Robledo",
    "Popular",
    "Santo Domingo Savio",
    "Castilla",
    "Buenos Aires",
    "Manrique",
    "Aranjuez",
    "Guayabal"
  ];

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex justify-between items-center mb-10">

          <h1 className="text-3xl font-bold">
            Propiedades disponibles
          </h1>

          <div className="flex gap-4">

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border rounded-lg px-4 py-2"
            >
              {propertyTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>

            <select
              value={neighborhoodFilter}
              onChange={(e) => setNeighborhoodFilter(e.target.value)}
              className="border rounded-lg px-4 py-2"
            >
              {neighborhoods.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>

          </div>

        </div>

        {/* GRID */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {filtered.map((property) => {

            const image = property.thumbnail
              ? `http://localhost:4000/${property.thumbnail}`
              : null;

            return (

              <Link
                key={property.id}
                to={`/properties/${property.id}`}
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

    </div>
  );
}