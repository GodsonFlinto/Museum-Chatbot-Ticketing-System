import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
  addMuseumAdmin,
  getAllMuseumsAdmin,
  updateMuseumAdmin,
  deleteMuseumAdmin,
  getAllMuseums,
  getMuseumById,
} from "../controllers/museum/museumController.js";

const router = express.Router();

/* ================= ADMIN (FIRST) ================= */
router.post("/admin", adminAuth, addMuseumAdmin);
router.get("/admin", adminAuth, getAllMuseumsAdmin);
router.put("/admin/:id", adminAuth, updateMuseumAdmin);
router.delete("/admin/:id", adminAuth, deleteMuseumAdmin);

/* ================= USER (LAST) ================= */
router.get("/", getAllMuseums);
router.get("/:id", getMuseumById);

export default router;
