import ChatSession from "../../models/ChatSession.js";
import { messages } from "../../utils/chatbot/messages.js";

export const processMessage = async ({
  userId,
  message,
  language = "en"
}) => {
  let session = await ChatSession.findOne({ user: userId });

  if (!session) {
    session = await ChatSession.create({
      user: userId,
      step: "start",
      data: {}
    });
  }

  const lang = messages[language] ? language : "en";

  switch (session.step) {
    case "start":
      session.step = "ticketType";
      await session.save();
      return {
        reply: messages[lang].ticketType,
        options: ["entry", "show", "exhibition"],
        data: session.data
      };

    case "ticketType":
      session.data.ticketType = message;
      session.step = "date";
      await session.save();
      return {
        reply: messages[lang].date,
        data: session.data
      };

    case "date":
      session.data.date = message;
      session.step = "timeSlot";
      await session.save();
      return {
        reply: messages[lang].timeSlot,
        options: ["10–12", "12–2", "2–4"],
        data: session.data
      };

    case "timeSlot":
      session.data.timeSlot = message;
      session.step = "quantity";
      await session.save();
      return {
        reply: messages[lang].quantity,
        data: session.data
      };

    case "quantity":
      session.data.quantity = Number(message);
      session.step = "payment";
      await session.save();
      return {
        reply: messages[lang].payment,
        action: "PAYMENT",
        data: session.data
      };

    default:
      session.step = "start";
      session.data = {};
      await session.save();
      return {
        reply: messages[lang].start,
        data: session.data
      };
  }
};
