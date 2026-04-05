import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../application/context/AuthContext";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:4000/api/v1";

export default function Profile() {
  const { token, user: authUser } = useAuth();
  const { id } = useParams();

  const isOwnProfile = !id;

  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingReview, setEditingReview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [average, setAverage] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const [photoLoading, setPhotoLoading] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [form, setForm] = useState({
    name: "",
    last_name: "",
    email: "",
    description: ""
  });

  const handleEditChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    try {
      setSaving(true);

      const res = await fetch(`${API_BASE}/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setUser(data.data || data);

      setShowToast(true);

      setTimeout(() => setEditMode(false), 300);
      setTimeout(() => setShowToast(false), 2500);

    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

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
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        const userData = data.data || data;

        setUser(userData);

        setForm({
          name: userData.name || "",
          last_name: userData.last_name || "",
          email: userData.email || "",
          description: userData.description || ""
        });

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [token, id]);

  const handlePhotoUpload = async (e) => {
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
  };

  const handleDeleteAvatar = async () => {
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
  };

  const loadReviews = async () => {
    const userId = id || authUser?.id;
    if (!userId) return;

    try {
      const res = await fetch(`${API_BASE}/reviews/${userId}`);
      const data = await res.json();

      setReviews(data.reviews);
      setAverage(data.average);
      setTotalReviews(data.total);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [id, authUser]);

  const handleReview = async () => {
    try {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reviewed_id: id || authUser?.id,
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      await loadReviews();
      setComment("");
      setRating(5);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdate = async (reviewId) => {
    try {
      const res = await fetch(`${API_BASE}/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      await loadReviews();
      setEditingReview(null);
      setComment("");
      setRating(5);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      const res = await fetch(`${API_BASE}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      await loadReviews();
    } catch (err) {
      alert(err.message);
    }
  };

  function StarSelector({ value, onChange }) {
    return (
      <div className="flex gap-1 text-xl cursor-pointer">
        {[1,2,3,4,5].map(i => (
          <span key={i} onClick={() => onChange(i)}
            className={i <= value ? "text-yellow-400" : "text-gray-300"}>
            ★
          </span>
        ))}
      </div>
    );
  }

  function Stars({ value }) {
    return (
      <div className="text-yellow-400">
        {[1,2,3,4,5].map(i => (
          <span key={i}>{i <= value ? "★" : "☆"}</span>
        ))}
      </div>
    );
  }

  if (!token) return <p className="p-6 text-center">Debes iniciar sesión</p>;
  if (loading) return <p className="p-6 text-center">Cargando perfil...</p>;
  if (error) return <p className="p-6 text-red-500 text-center">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <motion.div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 p-8 text-white">
          <div className="flex items-center gap-6">

            <div className="relative">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}`}
                className="w-36 h-36 rounded-full object-cover"
              />

              {photoLoading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              {isOwnProfile && (
                <label className="absolute bottom-0 right-0 bg-black text-white text-xs px-3 py-1 rounded-full cursor-pointer">
                  Cambiar
                  <input type="file" hidden onChange={handlePhotoUpload} />
                </label>
              )}
            </div>

            <div>
              <h2 className="text-3xl font-bold">
                {user?.name} {user?.last_name}
              </h2>

              
              {user?.role && (
                <span className="inline-block mt-1 text-xs bg-white/20 px-2 py-1 rounded">
                  {user.role === "owner" ? "Propietario" : "Inquilino"}
                </span>
              )}

              <p>{user?.email}</p>

              {user?.description && (
                <p className="text-sm mt-2 text-gray-300">
                  {user.description}
                </p>
              )}

              {isOwnProfile && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="bg-white text-black px-3 py-1 rounded text-xs"
                  >
                    Editar perfil
                  </button>

                  {user?.avatar && (
                    <button
                      onClick={handleDeleteAvatar}
                      className="bg-red-500 px-3 py-1 rounded text-xs"
                    >
                      Eliminar foto
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        

        {/* EDIT FORM */}
        {editMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ duration: 0.25 }}
              className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6"
            >

              {/* HEADER */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Editar perfil</h3>
                <button
                  onClick={() => setEditMode(false)}
                  className="text-gray-400 hover:text-black text-lg"
                >
                  ✕
                </button>
              </div>

              {/* FORM */}
              <div className="space-y-4">

                {/* NOMBRE */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nombre
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleEditChange}
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-black outline-none"
                  />
                </div>

                {/* APELLIDO */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Apellido
                  </label>
                  <input
                    name="last_name"
                    value={form.last_name}
                    onChange={handleEditChange}
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-black outline-none"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Correo electrónico
                  </label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleEditChange}
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-black outline-none"
                  />
                </div>

                {/* DESCRIPCIÓN */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleEditChange}
                    rows={3}
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-black outline-none"
                  />
                </div>

              </div>

              {/* BOTONES */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleUpdateProfile}
                  disabled={saving}
                  className={`px-4 py-2 rounded-lg text-white transition-all duration-200
                    ${saving ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"}
                  `}
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Guardando...
                    </span>
                  ) : (
                    "Guardar cambios"
                  )}
                </button>
              </div>

            </motion.div>
          </div>
        )}
              
        <div className="p-8">

          <h3 className="font-semibold mb-1">Calificación</h3>
          <p className="text-2xl flex items-center gap-2">
            ⭐ {average.toFixed(1)}
            <span className="text-gray-500 text-sm">
              ({totalReviews} reseñas)
            </span>
          </p>

          <p className="text-sm text-gray-500 mt-1 mb-6">
            Score: {user?.score}
          </p>

          <h3 className="text-xl font-semibold mb-4">Reseñas</h3>

          {reviews.length === 0 ? (
            <p>No hay reseñas aún</p>
          ) : (
            reviews
              .filter(r => r.reviewer_id !== (id || authUser?.id))
              .map(r => {
                const isMyReview = r.reviewer_id === authUser?.id;
                const isEditing = editingReview?.id === r.id;

                return (
                  <div key={r.id} className="border-b py-4 flex gap-4">

                    <img src={r.avatar} className="w-10 h-10 rounded-full" />

                    <div className="flex-1">
                      <Link
                        to={`/profile/${r.reviewer_id}`}
                        className="font-semibold hover:underline text-blue-600"
                      >
                        {r.reviewer_name}
                      </Link>

                      {isEditing ? (
                        <>
                          <StarSelector value={rating} onChange={setRating} />
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full border mt-2 p-2 rounded"
                          />
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => handleUpdate(r.id)} className="text-green-600 text-sm">
                              Guardar
                            </button>
                            <button onClick={() => setEditingReview(null)} className="text-gray-500 text-sm">
                              Cancelar
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <Stars value={r.rating} />
                          <p className="text-gray-600">{r.comment}</p>

                          {isMyReview && (
                            <div className="flex gap-3 mt-2">
                              <button
                                onClick={() => {
                                  setEditingReview(r);
                                  setRating(r.rating);
                                  setComment(r.comment);
                                }}
                                className="text-blue-500 text-sm"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete(r.id)}
                                className="text-red-500 text-sm"
                              >
                                Eliminar
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })
          )}

          {!isOwnProfile && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Dejar reseña</h3>

              <StarSelector value={rating} onChange={setRating} />

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border mt-2 p-2 rounded"
              />

              <button
                onClick={handleReview}
                className="bg-black text-white mt-2 px-4 py-2 rounded"
              >
                Enviar
              </button>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}