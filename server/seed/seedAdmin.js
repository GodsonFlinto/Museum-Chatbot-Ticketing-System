import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

mongoose.connect("mongodb://127.0.0.1:27017/museum_chatbot");

const createAdmin = async () => {
  const adminExists = await Admin.findOne({ email: "admin@museum.com" });
  if (adminExists) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await Admin.create({
    email: "admin@gmail.com",
    password: hashedPassword
  });

  console.log("Admin created successfully");
  process.exit();
};

createAdmin();
