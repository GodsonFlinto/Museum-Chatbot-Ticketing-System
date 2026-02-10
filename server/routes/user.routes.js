import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
  getAllUsersAdmin,
  toggleUserStatusAdmin,
} from "../controllers/user/userController.js";

const router = express.Router();

/* ================= ADMIN ================= */
router.get("/admin", adminAuth, getAllUsersAdmin);
router.put("/admin/toggle/:id", adminAuth, toggleUserStatusAdmin);

export default router;
