import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("LOGIN REQUEST EMAIL:", email);

  const admin = await Admin.findOne({ email });

  console.log("ADMIN FOUND:", admin);

  if (!admin) {
    return res.status(401).json({ msg: "Invalid Admin" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ msg: "Wrong Password" });
  }

  const token = jwt.sign(
    { id: admin._id, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
});


// router.get("/dashboard", async (req, res) => {
//   const museums = await Museum.countDocuments();
//   const bookings = await Booking.countDocuments();
//   const users = await User.countDocuments();

//   res.json({ museums, bookings, users });
// });


export default router;
