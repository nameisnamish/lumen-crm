import { Router } from "express";
import { getLeads, getLeadById, createLead, updateLead, deleteLead, reorderLeads } from "../controllers/leadsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", getLeads);
router.post("/", createLead);
router.patch("/reorder", reorderLeads);
router.get("/:id", getLeadById);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);

export default router;
