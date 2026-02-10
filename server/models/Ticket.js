import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    museumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Museum",
      required: true,
    },

    museumName: {
      type: String,
      required: true,
    },

    citizenType: {
      type: String,
      enum: ["indian", "foreigner"],
      required: true,
    },

    ticketCategory: {
      type: String,
      enum: ["General", "Child", "Senior"],
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    timeSlot: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "used"],
      default: "pending",
    },

    qrCode: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);
