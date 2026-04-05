import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProperty } from "../../infrastructure/api/properties";
import { UploadCloud } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPaypalOrder } from "../../infrastructure/api/payments";
import { PayPalButtons } from "@paypal/react-paypal-js";


export default function CreateProperty() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("Apartamento");
  const [rooms, setRooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [pendingProperty, setPendingProperty] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaypal, setShowPaypal] = useState(false);
  const [showPremiumPaypal, setShowPremiumPaypal] = useState(false);

  async function handlePayment() {
    try {
      const order = await createPaypalOrder();

      console.log("ORDER ID:", order.id);

      alert("Orden creada: " + order.id);

    } catch (err) {
      console.error(err);
      alert("Error en pago");
    }
  }


  const propertyTypes = [
    "Casa",
    "Apartamento",
    "Apartaestudio",
    "Habitacion",
    "Oficina",
    "Local Comercial",
    "Finca",
    
    
  ];

  const medellinNeighborhoods = [
    "La Candelaria (Centro)",
    "La America",
    "El Poblado",
    "Laureles",
    "Villa Hermosa",
    "Manrique",
    "San Javier",
    "Doce De Octubre",
    "Envigado",
    "Itagüi",
    "Sabaneta",
    "La Estrella",
    "Caldas",
    "Bello",
    "Robledo",
    "Santa Cruz",
    "Popular",
    "Santo Domingo Savio",
    "Belén",
    "Buenos Aires",
    "Guayabal",
    "Castilla",
    "Aranjuez",
    "Copacabana",
    "Girardota",
    "Barbosa",
  ];

  const availableTags = [
    "Amoblado",
    "Parqueadero",
    "Acepto Mascotas",
    "Balcón",
    "Ascensor",
    "Red de gas",
    "Calentador de agua",
  ];

  const formatCOP = (value) => {
    const number = value.replace(/\D/g, "");
    return new Intl.NumberFormat("es-CO").format(number);
  };

  const handlePriceChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    setPrice(formatCOP(raw));
  };

  const toggleTag = (tag) => {
    setTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  async function handleSubmit() {
    const formData = new FormData();

    formData.append("title", title);
    const fullAddress = `${address}, ${neighborhood}`;
    formData.append("address", fullAddress);
    formData.append("price", price.replace(/\./g, ""));
    formData.append("type", type);
    formData.append("rooms", rooms);
    formData.append("bathrooms", bathrooms);
    formData.append("tags", JSON.stringify(tags));
    formData.append("description", description);

    images.forEach((img) => formData.append("images", img));

    // 🔥 NO PUBLICAR TODAVÍA
    setPendingProperty(formData);

    // mostrar modal de pago
    setShowPaymentModal(true);
  }

  const progress = (step / 3) * 100;

  


  return (
    <div className="min-h-screen bg-slate-100 py-16 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">

        <div className="bg-white p-10 rounded-3xl shadow-xl">

          <div className="mb-8">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">Paso {step} de 3</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <StepOne
                  title={title}
                  setTitle={setTitle}
                  address={address}
                  setAddress={setAddress}
                  neighborhood={neighborhood}
                  setNeighborhood={setNeighborhood}
                  neighborhoods={medellinNeighborhoods}
                  price={price}
                  handlePriceChange={handlePriceChange}
                  type={type}
                  setType={setType}
                  propertyTypes={propertyTypes}
                />
              )}

              {step === 2 && (
                <StepTwo
                  rooms={rooms}
                  setRooms={setRooms}
                  bathrooms={bathrooms}
                  setBathrooms={setBathrooms}
                  tags={tags}
                  toggleTag={toggleTag}
                  availableTags={availableTags}
                />
              )}

              {step === 3 && (
                <StepThree
                  description={description}
                  setDescription={setDescription}
                  setImages={setImages}
                  setPreview={setPreview}
                  preview={preview}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-10">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
              >
                Atrás
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="ml-auto px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="ml-auto px-6 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
              >
                {loading ? "Publicando..." : "Publicar"}
              </button>
            )}
          </div>

          {error && (
            <p className="text-red-500 mt-4 text-sm">{error}</p>
          )}
        </div>

        <div className="hidden lg:block">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-xl font-bold mb-6">Vista previa</h2>

            {preview[0] && (
              <img
                src={preview[0]}
                alt="preview"
                className="w-full h-56 object-cover rounded-2xl mb-6"
              />
            )}

            <h3 className="text-2xl font-bold">{title || "Título propiedad"}</h3>

            <p className="text-gray-500 mt-2">
              {address || "Dirección"} {neighborhood && `- ${neighborhood}`}
            </p>

            <p className="text-blue-600 text-xl font-semibold mt-4">
              {price ? `$ ${price}` : "$ 0"}
            </p>

            <div className="flex gap-4 mt-4 text-sm text-gray-600">
              <span>{rooms} hab</span>
              <span>{bathrooms} baños</span>
              <span>{type}</span>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-gray-600 mt-6 text-sm">
              {description || "Descripción de la propiedad..."}
            </p>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">

            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              🚫 Publicación gratuita usada
            </h2>

            <p className="text-gray-600 mb-6">
              Ya usaste tu publicación gratis.
              Para continuar, debes elegir una opción:
            </p>

            <div className="flex flex-col gap-4">


              <button
                onClick={() => {
                  setShowPaypal(true);
                  setShowPremiumPaypal(false);
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-xl"
              >
                💳 Pagar por publicación
              </button>

              {showPaypal && (
                <div className="mt-4">
                  <PayPalButtons
                    createOrder={async () => {
                      const order = await createPaypalOrder("basic");
                      return order.id;
                    }}
                    onApprove={async () => {
                      alert("Pago exitoso 🔥");

                      try {
                        await createProperty(pendingProperty);

                        alert("Propiedad publicada ✅");
                        navigate("/my-properties");

                      } catch (err) {
                        alert("Error creando propiedad");
                      }
                    }}
                  />
                </div>
              )}


              <button
                onClick={() => {
                  setShowPremiumPaypal(true);
                  setShowPaypal(false);
                }}
                className="bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition"
              >
                ⭐ Comprar plan premium
              </button>

              {showPremiumPaypal && (
                <div className="mt-4">
                  <PayPalButtons
                    createOrder={async () => {
                      const order = await createPaypalOrder("premium"); // luego lo diferenciamos
                      return order.id;
                    }}
                    onApprove={async (data) => {
                      alert("Plan premium activado ⭐🔥");

                      // aquí luego activamos plan premium
                    }}
                  />
                </div>
              )}

              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-500 text-sm mt-2"
              >
                Cancelar
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputClass =
  "w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition";

function StepOne({
  title,
  setTitle,
  address,
  setAddress,
  neighborhood,
  setNeighborhood,
  neighborhoods,
  price,
  handlePriceChange,
  type,
  setType,
  propertyTypes,
}) {
  return (
    <div className="space-y-6">

      <div>
        <label className="block mb-2 text-sm font-semibold">Título</label>
        <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div>
        <label className="block mb-2 text-sm font-semibold">Dirección</label>
        <input className={inputClass} value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>

      <div>
        <label className="block mb-2 text-sm font-semibold">Barrio</label>
        <select
          className={inputClass}
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
        >
          <option value="">Seleccionar barrio</option>
          {neighborhoods.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2 text-sm font-semibold">Precio mensual (COP)</label>
        <input className={inputClass} value={price} onChange={handlePriceChange} />
      </div>

      <div>
        <label className="block mb-2 text-sm font-semibold">Tipo de propiedad</label>
        <select className={inputClass} value={type} onChange={(e) => setType(e.target.value)}>
          {propertyTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

    </div>
  );
}

/* STEP 2 */
function StepTwo({
  rooms,
  setRooms,
  bathrooms,
  setBathrooms,
  tags,
  toggleTag,
  availableTags,
}) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-sm font-semibold">
            Número de habitaciones
          </label>
          <input
            type="number"
            min="1"
            className={inputClass}
            value={rooms}
            onChange={(e) => setRooms(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-semibold">
            Número de baños
          </label>
          <input
            type="number"
            min="1"
            className={inputClass}
            value={bathrooms}
            onChange={(e) => setBathrooms(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block mb-3 text-sm font-semibold">
          Caracteristicas
        </label>
        <div className="flex flex-wrap gap-3">
          {availableTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-4 py-2 rounded-full text-sm transition ${
                tags.includes(tag)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* STEP 3 */
function StepThree({
  description,
  setDescription,
  setImages,
  setPreview,
  preview,
}) {
  return (
    <div className="space-y-6">

      <div>
        <label className="block mb-2 text-sm font-semibold">Descripción</label>
        <textarea
          rows="4"
          className={inputClass}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-semibold">Imágenes</label>
        <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition block">
          <UploadCloud className="mx-auto mb-2" />
          Subir imágenes
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files);
              setImages(files);
              setPreview(files.map((f) => URL.createObjectURL(f)));
            }}
            className="hidden"
          />
        </label>
      </div>

      {preview.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {preview.map((src, i) => (
            <img key={i} src={src} alt="preview" className="h-24 object-cover rounded-lg" />
          ))}
        </div>
      )}
    </div>
  );
}