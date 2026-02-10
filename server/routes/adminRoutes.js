import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import { getDashboardStats } from "../controllers/admin/dashboardController.js";

const router = express.Router();

router.get("/dashboard", adminAuth, getDashboardStats);

export default router;
