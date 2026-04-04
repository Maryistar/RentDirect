import db from "../../config/db.js";

/* =========================
   HELPER: convertir rating a delta
========================= */
const getDelta = (rating) => {
  switch (rating) {
    case 5: return 20;
    case 4: return 10;
    case 3: return 0;
    case 2: return -10;
    case 1: return -20;
    default: return 0;
  }
};

/* =========================
   CREAR RESEÑA
========================= */
export const createReview = async (req, res) => {
  const { reviewed_id, rating, comment } = req.body;
  const reviewer_id = req.user.id;

  try {
    // ✅ FIX AQUÍ
    if (reviewer_id === reviewed_id) {
      return res.status(400).json({ message: "Acción inválida" });
    }

    const [existing] = await db.query(
      "SELECT id FROM reviews WHERE reviewer_id = ? AND reviewed_id = ?",
      [reviewer_id, reviewed_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Ya calificaste a este usuario" });
    }

    await db.query(
      "INSERT INTO reviews (reviewer_id, reviewed_id, rating, comment) VALUES (?, ?, ?, ?)",
      [reviewer_id, reviewed_id, rating, comment]
    );

    const delta = getDelta(rating);

    await db.query(
      "UPDATE users SET score = LEAST(GREATEST(score + ?, 0), 1000) WHERE id = ?",
      [delta, reviewed_id]
    );

    res.json({ message: "Reseña creada", delta });

  } catch (err) {
    console.error("ERROR CREATE REVIEW:", err);
    res.status(500).json({ message: "Error al crear reseña" });
  }
};

/* =========================
   OBTENER RESEÑAS
========================= */
export const getReviewsByUser = async (req, res) => {
  const { id } = req.params;

  try {
    // reseñas
    const [reviews] = await db.query(
      `
      SELECT r.*, u.name AS reviewer_name, u.avatar
      FROM reviews r
      JOIN users u ON r.reviewer_id = u.id
      WHERE r.reviewed_id = ?
      ORDER BY r.created_at DESC
      `,
      [id]
    );

    // ⭐ promedio + total
    const [stats] = await db.query(
      `
      SELECT 
        COUNT(*) as total,
        AVG(rating) as average
      FROM reviews
      WHERE reviewed_id = ?
      `,
      [id]
    );

    res.json({
      reviews,
      total: stats[0].total,
      average: Number(stats[0].average) || 0
    });

  } catch (err) {
    console.error("ERROR GET REVIEWS:", err);
    res.status(500).json({ message: "Error al obtener reseñas" });
  }
};

export const updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;

  try {
    const [rows] = await db.query(
      "SELECT * FROM reviews WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Reseña no encontrada" });
    }

    const review = rows[0];

    if (review.reviewer_id !== userId) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const oldDelta = getDelta(review.rating);
    const newDelta = getDelta(rating);
    const difference = newDelta - oldDelta;

    await db.query(
      "UPDATE reviews SET rating = ?, comment = ? WHERE id = ?",
      [rating, comment, id]
    );

    // 🔥 actualizar score con diferencia
    await db.query(
      "UPDATE users SET score = LEAST(GREATEST(score + ?, 0), 1000) WHERE id = ?",
      [difference, review.reviewed_id]
    );

    res.json({ message: "Reseña actualizada", delta: difference });

  } catch (err) {
    console.error("ERROR UPDATE REVIEW:", err);
    res.status(500).json({ message: "Error al actualizar reseña" });
  }
};

/* =========================
   ELIMINAR RESEÑA (🔥 FIX SCORE)
========================= */
export const deleteReview = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const [rows] = await db.query(
      "SELECT * FROM reviews WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Reseña no encontrada" });
    }

    const review = rows[0];

    if (review.reviewer_id !== userId) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const delta = -getDelta(review.rating);

    await db.query("DELETE FROM reviews WHERE id = ?", [id]);

    //  restar impacto del score
    await db.query(
      "UPDATE users SET score = LEAST(GREATEST(score + ?, 0), 1000) WHERE id = ?",
      [delta, review.reviewed_id]
    );

    res.json({ message: "Reseña eliminada", delta });

  } catch (err) {
    console.error("ERROR DELETE REVIEW:", err);
    res.status(500).json({ message: "Error al eliminar reseña" });
  }
};