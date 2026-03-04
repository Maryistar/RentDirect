import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "http://localhost:4000/api/v1";

export default function Profile() {
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [photoLoading, setPhotoLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "" });

  /* =========================
     CARGAR PERFIL
  ========================= */
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch(`${API_BASE}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Error al cargar perfil");

        const data = await res.json();
        setUser(data);
        setEditForm({ name: data.name, email: data.email });

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [token]);

  /* =========================
     SUBIR FOTO
  ========================= */
  async function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setPhotoLoading(true);

      const res = await fetch(`${API_BASE}/users/me/documents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Error al subir imagen");

      const data = await res.json();

      setUser((prev) => ({
        ...prev,
        avatar: data.url || prev.avatar,
      }));

    } catch (err) {
      alert(err.message);
    } finally {
      setPhotoLoading(false);
    }
  }

  /* =========================
     GUARDAR EDICIÓN
  ========================= */
  async function handleSaveProfile() {
    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) throw new Error("Error al actualizar perfil");

      const data = await res.json();
      setUser(data);
      setEditOpen(false);

    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p className="p-6 text-center">Cargando perfil...</p>;
  if (error) return <p className="p-6 text-red-500 text-center">{error}</p>;

  const scorePercent = user.score ? Math.min(user.score * 20, 100) : 0;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden"
      >

        {/* HEADER */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 p-8 text-white">

          <div className="flex flex-col md:flex-row items-center gap-6">

            <div className="relative">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={
                  user.avatar ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(user.name || "User")
                }
                alt="Avatar"
                className="w-36 h-36 rounded-full object-cover border-4 border-white"
              />

              <label className="absolute bottom-0 right-0 bg-black text-white text-xs px-3 py-1 rounded-full cursor-pointer">
                {photoLoading ? "..." : "Editar"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold">{user.name}</h2>
              <p className="text-gray-300">{user.email}</p>

              <div className="flex gap-3 mt-4 justify-center md:justify-start">
                <span className="px-4 py-1 rounded-full bg-white/20 text-sm">
                  {user.role === "owner" ? "Propietario" : "Inquilino"}
                </span>

                <button
                  onClick={() => setEditOpen(true)}
                  className="px-4 py-1 rounded-full bg-white text-black text-sm font-semibold hover:bg-gray-200 transition"
                >
                  Editar perfil
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* CONTENIDO */}
        <div className="p-8 space-y-10">

          {/* SCORE */}
          <div className="bg-gray-50 p-6 rounded-2xl border shadow-sm">
            <h3 className="font-semibold mb-3">Score</h3>

            <div className="text-2xl font-bold mb-3">
              ⭐ {user.score ?? "--"}
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${scorePercent}%` }}
                transition={{ duration: 0.8 }}
                className="h-3 rounded-full bg-black"
              />
            </div>
          </div>

          {/* ESTADÍSTICAS OWNER */}
          {user.role === "owner" && (
            <div className="bg-gray-50 p-6 rounded-2xl border shadow-sm">
              <h3 className="font-semibold mb-4">Estadísticas</h3>

              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-white rounded-xl shadow">
                  <p className="text-2xl font-bold">
                    {user.properties?.length || 0}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Propiedades publicadas
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl shadow">
                  <p className="text-2xl font-bold">
                    {user.reviews?.length || 0}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Reseñas recibidas
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* HISTORIAL */}
          <div>
            <h3 className="font-semibold mb-4">Actividad reciente</h3>

            {user.activity && user.activity.length > 0 ? (
              <ul className="space-y-3">
                {user.activity.map((a, i) => (
                  <li
                    key={i}
                    className="bg-gray-50 p-4 rounded-xl border text-sm"
                  >
                    {a}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                No hay actividad reciente.
              </p>
            )}
          </div>

        </div>
      </motion.div>

      {/* MODAL EDITAR */}
      <AnimatePresence>
        {editOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setEditOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-8 rounded-2xl w-full max-w-md"
            >
              <h3 className="text-lg font-semibold mb-4">
                Editar perfil
              </h3>

              <input
                className="w-full border rounded-lg p-2 mb-3"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                placeholder="Nombre"
              />

              <input
                className="w-full border rounded-lg p-2 mb-5"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                placeholder="Email"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 rounded-lg bg-black text-white"
                >
                  Guardar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}