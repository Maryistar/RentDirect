import express from "express";
import { 
  register, 
  login, 
  verifyEmail, 
  forgotPassword, 
  resetPassword, 
  googleLogin 
} from "../controllers/auth.controller.js";

import { loginLimiter, registerLimiter } from "../../middlewares/rateLimit.js";

const router = express.Router();

// ✅ BIEN: limiter antes del controller
router.post("/login", loginLimiter, login);
router.post("/register", registerLimiter, register);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/google", googleLogin);

export default router;