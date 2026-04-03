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

        <div className="absolute inset-0 bg-black/55"></div>

        <div className="relative z-10 text-center text-white max-w-3xl px-4">

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Encuentra tu próximo hogar
          </h1>

          <p className="mb-6 text-lg text-gray-200">
            Explora apartamentos, casas, habitaciones y mucho mas directamente con propietarios.
          </p>

          {/* BUSCADOR */}

          <div className="bg-white rounded-xl p-3 flex gap-2 items-center shadow-xl">

            <input
              type="text"
              placeholder="Busca por barrio o dirección..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-3 py-2 outline-none text-gray-700"
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-3 py-2 text-gray-700 outline-none"
            >
              <option value="house">Casa</option>
              <option value="">Tipo</option>
              <option value="apartment">Apartamento</option>
              <option value="apartment">Apartaestudio</option>
              <option value="room">Habitación</option>
              <option value="room">Oficina</option>
              <option value="room">Local Comercial</option>
              <option value="room">Finca</option>
            </select>

            <button
              onClick={handleSearch}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-800 transition"
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
            to="/properties?type=apartamento"
            className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-xl transition"
          >
            <Building size={40} className="mx-auto mb-3 text-blue-700" />
            <h3 className="font-semibold text-lg">Apartamentos</h3>
          </Link>

          <Link
            to="/properties?type=house"
            className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-xl transition"
          >
            <HomeIcon size={40} className="mx-auto mb-3 text-blue-700" />
            <h3 className="font-semibold text-lg">Casas</h3>
          </Link>

          <Link
            to="/properties?type=room"
            className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-xl transition"
          >
            <BedDouble size={40} className="mx-auto mb-3 text-blue-700" />
            <h3 className="font-semibold text-lg">Habitaciones</h3>
          </Link>

        </div>

      </section>

      {/* EXPLORAR */}

      <section className="bg-gray-100 py-16 px-6">

        <div className="max-w-5xl mx-auto text-center">

          <h2 className="text-3xl font-bold mb-4">
            Explora todas las propiedades disponibles
          </h2>

          <p className="text-gray-600 mb-8">
            Encuentra apartamentos, casas, habitaciones, locales y mas... disponibles para arrendar.
          </p>

          <Link
            to="/properties"
            className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition"
          >
            Ver todas las propiedades
          </Link>

        </div>

      </section>

      {/* COMO FUNCIONA */}

      <section className="py-16 px-6 max-w-6xl mx-auto">

        <h2 className="text-3xl font-bold mb-10 text-center">
          ¿Cómo funciona RentDirect?
        </h2>

        <div className="grid md:grid-cols-3 gap-10 text-center">

          <div>
            <Search size={40} className="mx-auto mb-3 text-blue-700"/>
            <h3 className="font-semibold">Explora propiedades</h3>
            <p className="text-gray-600 text-sm">
              Busca apartamentos y casas disponibles en tu ciudad.
            </p>
          </div>

          <div>
            <Star size={40} className="mx-auto mb-3 text-blue-700"/>
            <h3 className="font-semibold">Aplica directamente</h3>
            <p className="text-gray-600 text-sm">
              Contacta directamente con el propietario.
            </p>
          </div>

          <div>
            <ShieldCheck size={40} className="mx-auto mb-3 text-blue-700"/>
            <h3 className="font-semibold">Renta sin intermediarios</h3>
            <p className="text-gray-600 text-sm">
              Sin comisiones ni trámites complicados.
            </p>
          </div>

        </div>

      </section>

      {/* VENTAJAS */}

      <section className="bg-gray-50 py-16 px-6">

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

      {/* CTA */}

      <section className="py-20 text-center bg-blue-800 text-white">

        <h2 className="text-3xl font-bold mb-4">
          ¿Tienes una propiedad para arrendar?
        </h2>

        <p className="mb-6 text-blue-100">
          Publica tu primera propiedad gratis y encuentra inquilinos rápidamente.
        </p>

        <Link
          to="/create-property"
          className="bg-white text-blue-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Publicar propiedad
        </Link>

      </section>

    </div>
  );
}