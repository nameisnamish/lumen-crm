import { Router } from "express";
import { getContacts, getContactById, createContact, updateContact, deleteContact } from "../controllers/contactsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.use(protect);
router.get("/", getContacts);
router.post("/", createContact);
router.get("/:id", getContactById);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);

export default router;
