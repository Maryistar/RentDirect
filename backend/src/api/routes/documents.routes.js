import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import * as controller from "../controllers/contracts.controller.js";

const router = Router();

router.get("/me", authenticate, controller.getMyDocuments);

export default router;