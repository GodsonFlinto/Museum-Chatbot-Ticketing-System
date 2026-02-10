import mongoose from "mongoose";
import dotenv from "dotenv";
import Museum from "../models/Museum.js";

dotenv.config();

const museums = [
  {
    name: "National Museum of India",
    location: "New Delhi, India",
    icon: "🏛️",
    description: "One of the largest museums in India.",
    timing: "10:00 AM - 6:00 PM (Closed on Mondays)",
    coverImage: "/images/salar1.png",
    images: ["/images/salar1.png", "/images/salar3.png", "/images/salar5.png"],
    highlights: [
      "Ancient Sculptures",
      "Harappan Civilization",
      "Buddhist Art",
      "Miniature Paintings",
    ],
    category: ["history", "art", "ancient"],
    pricing: {
      indian: 20,
      foreigner: 650,
    },
  },
  {
    name: "Indian Museum Kolkata",
    location: "Kolkata, West Bengal",
    icon: "🏺",
    description: "Oldest and largest museum in India.",
    timing: "10:00 AM - 5:00 PM (Closed on Mondays)",
    coverImage: "/images/salar2.png",
    images: ["/images/salar2.png", "/images/salar4.png", "/images/salar6.png"],
    highlights: [
      "Egyptian Mummy",
      "Buddhist Stupas",
      "Meteorite Gallery",
      "Fossil Collection",
    ],
    category: ["history", "science", "ancient"],
    pricing: {
      indian: 50,
      foreigner: 500,
    },
  },
];

const seedMuseums = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Museum.deleteMany();
    await Museum.insertMany(museums);
    console.log("✅ Museums seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed", err);
    process.exit(1);
  }
};

seedMuseums();
