import mongoose from "mongoose";
import dotenv from "dotenv";
import Museum from "../models/Museum.js";

dotenv.config();

const museums = [
  {
  name: "Salar Jung Museum",
  location: "Hyderabad, Telangana",
  icon: "🏺",
  description: "One of the largest art museums in the world with rare collections.",
  timing: "10:00 AM - 5:00 PM (Closed on Fridays)",
  coverImage: "/images/salar1.png",
  images: ["/images/salar1.png", "/images/salar3.png", "/images/salar5.png"],
  highlights: [
    "Veiled Rebecca",
    "European Sculptures",
    "Persian Artifacts",
    "Clock Collection"
  ],
  category: ["art", "history", "international"],
  pricing: {
    indian: 50,
    foreigner: 500
  }
},
{
  name: "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya",
  location: "Mumbai, Maharashtra",
  icon: "🏛️",
  description: "Iconic heritage museum showcasing Indian history and culture.",
  timing: "10:15 AM - 6:00 PM",
  coverImage: "/images/salar10.png",
  images: ["/images/salar10.png", "/images/salar8.png", "/images/salar6.png"],
  highlights: [
    "Indus Valley Artifacts",
    "Maratha History",
    "Miniature Paintings",
    "Decorative Arts"
  ],
  category: ["history", "culture", "art"],
  pricing: {
    indian: 85,
    foreigner: 500
  }
},
{
  name: "Government Museum Chennai",
  location: "Chennai, Tamil Nadu",
  icon: "🏺",
  description: "Renowned museum for South Indian bronze sculptures.",
  timing: "9:30 AM - 5:00 PM (Closed on Fridays)",
  coverImage: "/images/salar2.png",
  images: ["/images/salar2.png", "/images/salar4.png", "/images/salar6.png"],
  highlights: [
    "Chola Bronzes",
    "Archaeological Gallery",
    "Numismatics",
    "Natural History"
  ],
  category: ["history", "art", "ancient"],
  pricing: {
    indian: 15,
    foreigner: 250
  }
},
{
  name: "Albert Hall Museum",
  location: "Jaipur, Rajasthan",
  icon: "🏛️",
  description: "Famous museum known for Indo-Saracenic architecture.",
  timing: "9:00 AM - 8:00 PM",
  coverImage: "/images/salar9.png",
  images: ["/images/salar9.png", "/images/salar7.png", "/images/salar5.png"],
  highlights: [
    "Egyptian Mummy",
    "Persian Carpets",
    "Paintings Gallery",
    "Metal Artifacts"
  ],
  category: ["history", "architecture", "art"],
  pricing: {
    indian: 40,
    foreigner: 300
  }
},
{
  name: "National Rail Museum",
  location: "New Delhi, India",
  icon: "🚆",
  description: "Museum showcasing the history of Indian Railways.",
  timing: "9:30 AM - 5:30 PM (Closed on Mondays)",
  coverImage: "/images/salar3.png",
  images: ["/images/salar3.png", "/images/salar4.png", "/images/salar5.png"],
  highlights: [
    "Vintage Locomotives",
    "Toy Train Ride",
    "Royal Coaches",
    "Railway Heritage"
  ],
  category: ["technology", "history", "transport"],
  pricing: {
    indian: 50,
    foreigner: 200
  }
},
{
  name: "Science City",
  location: "Kolkata, West Bengal",
  icon: "🔬",
  description: "Largest science center in the Indian subcontinent.",
  timing: "9:00 AM - 8:00 PM",
  coverImage: "/images/salar8.png",
  images: ["/images/salar8.png", "/images/salar6.png", "/images/salar4.png"],
  highlights: [
    "Space Odyssey",
    "Dynamotion Hall",
    "Science Park",
    "Aquatic World"
  ],
  category: ["science", "technology", "education"],
  pricing: {
    indian: 60,
    foreigner: 400
  }
},
{
  name: "Victoria Memorial",
  location: "Kolkata, West Bengal",
  icon: "🏛️",
  description: "Grand marble building dedicated to British-era history.",
  timing: "10:00 AM - 5:00 PM (Closed on Mondays)",
  coverImage: "/images/salar4.png",
  images: ["/images/salar4.png", "/images/salar6.png", "/images/salar8.png"],
  highlights: [
    "British Colonial Art",
    "Historical Manuscripts",
    "Royal Portraits",
    "Gardens"
  ],
  category: ["history", "colonial", "architecture"],
  pricing: {
    indian: 30,
    foreigner: 500
  }
},
{
  name: "Dr. Bhau Daji Lad Museum",
  location: "Mumbai, Maharashtra",
  icon: "🏺",
  description: "Mumbai’s oldest museum showcasing decorative arts.",
  timing: "10:00 AM - 6:00 PM (Closed on Wednesdays)",
  coverImage: "/images/salar7.png",
  images: ["/images/salar7.png", "/images/salar9.png", "/images/salar5.png"],
  highlights: [
    "Industrial Artifacts",
    "Maps of Bombay",
    "Decorative Arts",
    "Cultural Exhibits"
  ],
  category: ["culture", "history", "art"],
  pricing: {
    indian: 10,
    foreigner: 100
  }
}

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
