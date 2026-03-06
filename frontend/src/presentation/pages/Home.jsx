import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Building, Home as HomeIcon, BedDouble, Search, Star, ShieldCheck } from "lucide-react";

export default function Home() {

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  const handleSearch = () => {
    let url = "/properties";

    const params = new URLSearchParams();

    if (search) params.append("search", search);
    if (type && type !== "Tipo") params.append("type", type);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    navigate(url);
  };

  return (
    <div className="w-full">

      {/* HERO */}
      <section
        className="relative h-[500px] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://cdn.prod.website-files.com/6565c5a84d3ef6316fbf310e/67f7014c39f3441d2410fd48_MEdellin.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 text-center text-white max-w-3xl px-4">

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Encuentra tu próximo hogar sin intermediarios
          </h1>

          <p className="mb-6 text-lg">
            Explora apartamentos, casas y habitaciones directamente con propietarios.
          </p>

          {/* BUSCADOR */}
          <div className="bg-white rounded-xl p-3 flex gap-2 items-center shadow-lg">

            <input
              type="text"
              placeholder="Buscar por ciudad o dirección..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-3 py-2 outline-none text-gray-700"
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-3 py-2 text-gray-700 outline-none"
            >
              <option value="">Tipo</option>
              <option value="apartment">Apartamento</option>
              <option value="house">Casa</option>
              <option value="room">Habitación</option>
            </select>

            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
            >
              <Search size={18} />
              Buscar
            </button>

          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="py-16 px-6 max-w-6xl mx-auto">

        <h2 className="text-3xl font-bold mb-10 text-center">
          Explora por tipo de propiedad
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <Link
            to="/properties?type=apartment"
            className="bg-white shadow-lg rounded-xl p-6 text-center hover:shadow-2xl transition"
          >
            <Building size={40} className="mx-auto mb-3 text-blue-600" />
            <h3 className="font-semibold text-lg">Apartamentos</h3>
          </Link>

          <Link
            to="/properties?type=house"
            className="bg-white shadow-lg rounded-xl p-6 text-center hover:shadow-2xl transition"
          >
            <HomeIcon size={40} className="mx-auto mb-3 text-blue-600" />
            <h3 className="font-semibold text-lg">Casas</h3>
          </Link>

          <Link
            to="/properties?type=room"
            className="bg-white shadow-lg rounded-xl p-6 text-center hover:shadow-2xl transition"
          >
            <BedDouble size={40} className="mx-auto mb-3 text-blue-600" />
            <h3 className="font-semibold text-lg">Habitaciones</h3>
          </Link>

        </div>
      </section>

      {/* PROPIEDADES DESTACADAS */}
      <section className="bg-gray-100 py-16 px-6">

        <div className="max-w-6xl mx-auto">

          <h2 className="text-3xl font-bold mb-10 text-center">
            Propiedades Destacadas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {[1,2,3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition"
              >
                <img
                  src="https://images.unsplash.com/photo-1560185127-6ed189bf02f4"
                  className="h-52 w-full object-cover"
                />

                <div className="p-4">
                  <h3 className="font-semibold text-lg">$900.000</h3>
                  <p className="text-gray-600 text-sm">
                    Apartamento en Medellín
                  </p>
                </div>
              </div>
            ))}

          </div>

          <div className="text-center mt-10">

            <Link
              to="/properties"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Ver todas las propiedades
            </Link>

          </div>

        </div>

      </section>

      {/* COMO FUNCIONA */}
      <section className="py-16 px-6 max-w-6xl mx-auto">

        <h2 className="text-3xl font-bold mb-10 text-center">
          ¿Cómo funciona RentDirect?
        </h2>

        <div className="grid md:grid-cols-3 gap-10 text-center">

          <div>
            <Search size={40} className="mx-auto mb-3 text-blue-600"/>
            <h3 className="font-semibold">Explora propiedades</h3>
            <p className="text-gray-600 text-sm">
              Busca apartamentos y casas disponibles en tu ciudad.
            </p>
          </div>

          <div>
            <Star size={40} className="mx-auto mb-3 text-blue-600"/>
            <h3 className="font-semibold">Aplica directamente</h3>
            <p className="text-gray-600 text-sm">
              Contacta directamente con el propietario.
            </p>
          </div>

          <div>
            <ShieldCheck size={40} className="mx-auto mb-3 text-blue-600"/>
            <h3 className="font-semibold">Renta sin intermediarios</h3>
            <p className="text-gray-600 text-sm">
              Sin comisiones ni trámites complicados.
            </p>
          </div>

        </div>

      </section>

      {/* VENTAJAS */}
      <section className="bg-blue-50 py-16 px-6">

        <div className="max-w-6xl mx-auto text-center">

          <h2 className="text-3xl font-bold mb-10">
            ¿Por qué usar RentDirect?
          </h2>

          <div className="grid md:grid-cols-4 gap-6">

            <div className="bg-white p-6 rounded-xl shadow">
              Sin intermediarios
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              Sin fiadores
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              Proceso rápido
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              Usuarios verificados
            </div>

          </div>

        </div>

      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 text-center bg-blue-600 text-white">

        <h2 className="text-3xl font-bold mb-4">
          ¿Tienes una propiedad para arrendar?
        </h2>

        <p className="mb-6">
          Publica tu primera propiedad gratis y encuentra inquilinos rápidamente.
        </p>

        <Link
          to="/create-property"
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Publicar propiedad
        </Link>

      </section>

    </div>
  );
}