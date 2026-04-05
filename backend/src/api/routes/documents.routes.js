import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import * as controller from "../controllers/contracts.controller.js";

const router = Router();
router.get("/my-documents", authenticate, controller.getMyDocuments);
export default router;