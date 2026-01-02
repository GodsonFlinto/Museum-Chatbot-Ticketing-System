import { getStripe } from "../../config/stripe.js";
import Ticket from "../../models/Ticket.js";
import QRCode from "qrcode";

// CREATE STRIPE SESSION
export const createCheckoutSession = async (req, res) => {
  const stripe = getStripe();
  const { amount, ticketId } = req.body;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    metadata: {
      ticketId // 🔥 LINK TICKET TO PAYMENT
    },
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: { name: "Museum Ticket" },
          unit_amount: amount * 100
        },
        quantity: 1
      }
    ],
    success_url:
      "http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "http://localhost:5173/chat"
  });

  res.json({ url: session.url });
};


// VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const ticket = await Ticket.findOne({ status: "pending" }).sort({
      createdAt: -1
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const qrCode = await QRCode.toDataURL(ticket._id.toString());

    ticket.status = "confirmed";
    ticket.qrCode = qrCode;
    await ticket.save();

    res.json({ ticketId: ticket._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
