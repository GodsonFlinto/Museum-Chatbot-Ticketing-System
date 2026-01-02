import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createCheckoutSession,
  verifyPayment
} from "../controllers/payment/paymentController.js";

const router = express.Router();

// Create Stripe Checkout Session
router.post("/create-session", protect, createCheckoutSession);

// Verify payment after redirect
router.post("/verify", protect, verifyPayment);

export default router;
