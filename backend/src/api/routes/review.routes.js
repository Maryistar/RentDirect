import express from "express";
import { authenticate } from "./users.routes.js";
import {
  createReview,
  getReviewsByUser,
  updateReview,
  deleteReview
} from "../controllers/review.controller.js";

const router = express.Router();

// crear reseña
router.post("/", authenticate, createReview);

// obtener reseñas de un usuario
router.get("/:id", getReviewsByUser);

router.put("/:id", authenticate, updateReview);
router.delete("/:id", authenticate, deleteReview);

export default router;