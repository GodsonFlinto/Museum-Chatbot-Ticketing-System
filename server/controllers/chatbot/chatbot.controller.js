import { processMessage } from "../../services/chatbot/chatbot.service.js";

export const chat = async (req, res) => {
  try {
    const { message, language } = req.body;

    const response = await processMessage({
      userId: req.user._id,
      message,
      language
    });

    res.json(response);
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ message: error.message });
  }
};
