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

  /* ========================= LOAD PROFILE ========================= */
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
        setUser(data.data || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [token, id]);

  /* ========================= AVATAR ========================= */
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

  /* ========================= REVIEWS ========================= */
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
              <h2 className="text-3xl font-bold">{user?.name}</h2>
              <p>{user?.email}</p>

              {isOwnProfile && user?.avatar && (
                <button
                  onClick={handleDeleteAvatar}
                  className="mt-2 text-xs bg-red-500 px-3 py-1 rounded"
                >
                  Eliminar foto
                </button>
              )}
            </div>

          </div>
        </div>

        {/* RESTO IGUAL */}
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