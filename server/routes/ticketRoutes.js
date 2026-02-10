import express from "express";
import {
  bookTicket,
  getAllTicketsAdmin,
  updateTicketStatusAdmin,
  getPaymentsAdmin,
  getTicketById,
} from "../controllers/ticket/ticketController.js";

import { protect } from "../middleware/authMiddleware.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

/* ================= USER ================= */
router.post("/book", protect, bookTicket);

/* ================= ADMIN ================= */
router.get("/admin", adminAuth, getAllTicketsAdmin);
router.get("/admin/payments", adminAuth, getPaymentsAdmin);
router.put("/admin/:id", adminAuth, updateTicketStatusAdmin);

/* ================= USER (DYNAMIC LAST) ================= */
router.get("/:id", getTicketById);

export default router;
