import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import museumRoutes from "./routes/museumRoutes.js";
import { protect } from "./middleware/authMiddleware.js";
import adminAuthRoutes from "./routes/adminAuth.routes.js";
import userRoutes from "./routes/user.routes.js";
import chatbotroutes from "./routes/chatbot.routes.js";
import adminRoutes from "./routes/adminRoutes.js";



// DB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/chatbots", chatbotRoutes);
app.use("/api/users", userRoutes);


app.use("/api/admin", adminAuthRoutes);
app.use("/api/museums", museumRoutes);
app.use("/api/chatbot", chatbotroutes);
app.use("/api/admin", adminRoutes);


app.use("/images", express.static(path.join(__dirname, "public/images")));


// Test routes
app.get("/", (req, res) => {
  res.send("Museum Ticket Chatbot API is running...");
});

app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "Access granted", user: req.user });
});


// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
