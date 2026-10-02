import { Router } from "express";
import { getAiStatus, getLeadSummary, generateEmail, getSalesInsights } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.use(protect);
router.get("/status", getAiStatus);
router.post("/lead-summary", getLeadSummary);
router.post("/generate-email", generateEmail);
router.post("/sales-insights", getSalesInsights);

export default router;
