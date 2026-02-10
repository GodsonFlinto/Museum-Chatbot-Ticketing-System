import mongoose from "mongoose";

const MuseumSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    icon: {
      type: String,
    },

    description: {
      type: String,
    },

    timing: {
      type: String,
    },

    coverImage: {
      type: String,
    },

    images: [String],

    highlights: [String],

    category: [String],

    // ✅ PRICING BASED ON CITIZEN TYPE
    pricing: {
      indian: {
        type: Number,
        required: true,
      },
      foreigner: {
        type: Number,
        required: true,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Museum", MuseumSchema);
