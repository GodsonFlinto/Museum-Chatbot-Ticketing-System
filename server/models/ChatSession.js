import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    step: {
      type: String,
      default: "start"
    },
    data: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
);

export default mongoose.model("ChatSession", chatSessionSchema);
