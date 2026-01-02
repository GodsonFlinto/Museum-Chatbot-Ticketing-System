import express from "express";
import { bookTicket, getMyTickets, scanTicket, getTicketById } from "../controllers/ticketController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/book", protect, bookTicket);
router.get("/my", protect, getMyTickets);
router.get("/:id", protect, getTicketById);
router.post("/scan", protect, scanTicket);

export default router;
