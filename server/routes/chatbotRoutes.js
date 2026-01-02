import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { chat } from "../controllers/chatbot/chatbot.controller.js";

const router = express.Router();

router.post("/message", protect, chat);

export default router;
