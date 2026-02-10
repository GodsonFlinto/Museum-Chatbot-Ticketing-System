import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
  getAllFaqs,
  addFaq,
  updateFaq,
  deleteFaq,
} from "../controllers/chatbot/chatbotController.js";

const router = express.Router();

/* ================= ADMIN ================= */
router.get("/admin", adminAuth, getAllFaqs);
router.post("/admin", adminAuth, addFaq);
router.put("/admin/:id", adminAuth, updateFaq);
router.delete("/admin/:id", adminAuth, deleteFaq);

export default router;
