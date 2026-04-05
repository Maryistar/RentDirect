import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Search,
  Star,
  ShieldCheck,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [scale, setScale] = useState(1);

  // EFECTO ZOOM AL SCROLL
  useEffect(() => {
    const handleScroll = () => {
      const value = 1 + window.scrollY * 0.0005; // velocidad zoom
      setScale(value > 1.15 ? 1.15 : value); // límite zoom
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <div className="w-full overflow-hidden">

      {/* HERO PRO */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">

        {/* IMAGEN CON ZOOM */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300"
          style={{
            transform: `scale(${scale})`,
            backgroundImage:
              "url('https://cdn.prod.website-files.com/6565c5a84d3ef6316fbf310e/67f7014c39f3441d2410fd48_MEdellin.jpg')",
          }}
        />

        {/* OVERLAY SUAVE (NO OPACO) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10"></div>

        {/* CONTENIDO */}
        <div className="relative z-10 text-center text-white max-w-3xl px-4">

          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Encuentra tu próximo hogar
          </h1>

          <p className="mb-6 text-lg text-gray-200">
            Arrienda directamente con propietarios
          </p>

          {/* BADGES */}
          <div className="flex justify-center gap-3 mb-6 text-sm flex-wrap">
            <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur">
              Sin intermediarios
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur">
              Sin comisiones
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur">
              Rápido y seguro
            </span>
          </div>

          {/* BUSCADOR */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 flex gap-2 items-center shadow-2xl">

            <input
              type="text"
              placeholder="Busca por barrio o dirección..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-3 py-2 outline-none text-gray-700 bg-transparent"
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-3 py-2 text-gray-700 outline-none bg-transparent"
            >
              <option value="">Tipo</option>
              <option value="house">Casa</option>
              <option value="apartment">Apartamento</option>
              <option value="room">Habitación</option>
              <option value="office">Oficina</option>
            </select>

            <button
              onClick={handleSearch}
              className="bg-blue-700 text-white px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-800 transition"
            >
              <Search size={18} />
              Buscar
            </button>

          </div>

        </div>
      </section>

      {/* EXPLORAR */}
      <section className="bg-gray-100 py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Explora todas las propiedades disponibles
        </h2>

        <p className="text-gray-600 mb-8">
          Encuentra apartamentos, casas, habitaciones y más en Medellín.
        </p>

        <Link
          to="/properties"
          className="bg-blue-700 text-white px-6 py-3 rounded-xl hover:bg-blue-800 transition"
        >
          Ver todas las propiedades
        </Link>
      </section>

      {/* SIN INTERMEDIARIOS */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

          <img
            src="https://i.pinimg.com/736x/7e/fa/98/7efa9873dcb864712797789c87a0faeb.jpg"
            className="rounded-2xl shadow"
          />

          <div>
            <h2 className="text-3xl font-bold mb-4">
              Renta sin intermediarios
            </h2>

            <p className="text-gray-600 mb-4">
              Contacta directamente con propietarios reales. Sin comisiones,
              sin papeleo innecesario y más rápido.
            </p>

            <ul className="space-y-2 text-gray-700">
              <li>✔ Sin comisiones ocultas</li>
              <li>✔ Contacto directo</li>
              <li>✔ Proceso rápido</li>
            </ul>
          </div>

        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-20 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10">
          ¿Cómo funciona RentDirect?
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          <div className="p-6 rounded-2xl shadow hover:shadow-xl transition">
            <Search className="mx-auto mb-3 text-blue-700" size={40} />
            <h3 className="font-semibold">Explora</h3>
            <p className="text-gray-600 text-sm">
              Busca propiedades fácilmente.
            </p>
          </div>

          <div className="p-6 rounded-2xl shadow hover:shadow-xl transition">
            <Star className="mx-auto mb-3 text-blue-700" size={40} />
            <h3 className="font-semibold">Aplica</h3>
            <p className="text-gray-600 text-sm">
              Contacta directamente al dueño.
            </p>
          </div>

          <div className="p-6 rounded-2xl shadow hover:shadow-xl transition">
            <ShieldCheck className="mx-auto mb-3 text-blue-700" size={40} />
            <h3 className="font-semibold">Renta</h3>
            <p className="text-gray-600 text-sm">
              Sin intermediarios ni comisiones.
            </p>
          </div>

        </div>
      </section>

      {/* VENTAJAS */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">

          <h2 className="text-3xl font-bold mb-10">
            ¿Por qué usar RentDirect?
          </h2>

          <div className="grid md:grid-cols-4 gap-6">

            {[
              "Sin intermediarios",
              "Sin fiadores",
              "Proceso rápido",
              "Usuarios verificados",
            ].map((text, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition"
              >
                <p className="font-semibold">{text}</p>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center bg-slate-900 text-white">

        <h2 className="text-3xl font-bold mb-4">
          ¿Tienes una propiedad para arrendar?
        </h2>

        <p className="mb-6 text-blue-100">
          Publica gratis y encuentra inquilinos rápido.
        </p>

        <Link
          to="/create-property"
          className="bg-white text-blue-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          Publicar propiedad
        </Link>

      </section>

    </div>
  );
}