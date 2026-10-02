import { Router } from "express";
import { getOverview } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.use(protect);
router.get("/overview", getOverview);

export default router;
