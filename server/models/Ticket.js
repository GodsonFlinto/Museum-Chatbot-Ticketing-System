import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    ticketType: {
      type: String,
      enum: ["entry", "show", "exhibition"],
      required: true
    },
    date: {
      type: String,
      required: true
    },
    timeSlot: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    qrCode: {
      type: String
    },
    status: {
    type: String,
    enum: ["pending", "confirmed", "used"],
    default: "pending"
  }
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);
