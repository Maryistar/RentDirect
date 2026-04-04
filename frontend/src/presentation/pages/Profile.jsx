import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../application/context/AuthContext";
import { useParams } from "react-router-dom";

const API_BASE = "http://localhost:4000/api/v1";

export default function Profile() {
  const { token, user: authUser } = useAuth();
  const { id } = useParams();

  const isOwnProfile = !id;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [photoLoading, setPhotoLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "" });

  /* =========================
     CARGAR PERFIL DINÁMICO
  ========================= */
  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("No autenticado");
      return;
    }

    async function loadProfile() {
      try {
        const endpoint = isOwnProfile
          ? `${API_BASE}/users/me`
          : `${API_BASE}/users/${id}`;

        const res = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al cargar perfil");

        const data = await res.json();
        const userData = data.data || data;

        setUser(userData);

        if (isOwnProfile) {
          setEditForm({
            name: userData.name || "",
            email: userData.email || "",
          });
        }

      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [token, id]);

  /* =========================
     SUBIR FOTO (SOLO PROPIO)
  ========================= */
  async function handlePhotoUpload(e) {
    if (!isOwnProfile) return;

    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setPhotoLoading(true);

      const res = await fetch(`${API_BASE}/users/me/avatar`, {
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
     ELIMINAR FOTO
  ========================= */
  async function handleDeleteAvatar() {
    if (!isOwnProfile) return;

    try {
      setPhotoLoading(true);

      await fetch(`${API_BASE}/users/me/avatar`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser((prev) => ({ ...prev, avatar: null }));

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
    if (!isOwnProfile) return;

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
      const updatedUser = data.data || data;

      setUser((prev) => ({ ...prev, ...updatedUser }));
      setEditOpen(false);

    } catch (err) {
      alert(err.message);
    }
  }

  /* =========================
     ESTADOS
  ========================= */
  if (!token)
    return <p className="p-6 text-center">Debes iniciar sesión</p>;

  if (loading)
    return <p className="p-6 text-center">Cargando perfil...</p>;

  if (error)
    return <p className="p-6 text-red-500 text-center">{error}</p>;

  const scorePercent = user?.score
    ? Math.min(user.score * 20, 100)
    : 0;

  /* =========================
     UI
  ========================= */
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
            <div className="relative w-36 h-36">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || "User"
                  )}`
                }
                alt="Avatar"
                className="w-36 h-36 rounded-full object-cover border-4 border-white"
              />

              {photoLoading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              {isOwnProfile && (
                <label className="absolute bottom-0 right-0 bg-black text-white text-xs px-3 py-1 rounded-full cursor-pointer">
                  Cambiar
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                </label>
              )}
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold">{user?.name}</h2>
              <p className="text-gray-300">{user?.email}</p>

              <div className="flex gap-3 mt-4 flex-wrap">
                <span className="px-4 py-1 rounded-full bg-white/20 text-sm">
                  {user?.role === "owner"
                    ? "Propietario"
                    : "Inquilino"}
                </span>

                {isOwnProfile && (
                  <>
                    <button
                      onClick={() => setEditOpen(true)}
                      className="px-4 py-1 rounded-full bg-white text-black text-sm"
                    >
                      Editar perfil
                    </button>

                    {user?.avatar && (
                      <button
                        onClick={handleDeleteAvatar}
                        className="px-4 py-1 rounded-full bg-red-500 text-white text-sm"
                      >
                        Eliminar foto
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CONTENIDO */}
        <div className="p-8">
          <h3 className="font-semibold mb-3">Score</h3>
          <div className="text-2xl font-bold mb-3">
            ⭐ {user?.score ?? "--"}
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${scorePercent}%` }}
              className="h-3 rounded-full bg-black"
            />
          </div>
        </div>
      </motion.div>

      {/* MODAL */}
      <AnimatePresence>
        {editOpen && isOwnProfile && (
          <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-80">
              <input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
              <button onClick={handleSaveProfile}>
                Guardar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}