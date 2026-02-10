import { getStripe } from "../../config/stripe.js";
import Ticket from "../../models/Ticket.js";
import QRCode from "qrcode";

// CREATE STRIPE SESSION
export const createCheckoutSession = async (req, res) => {
  try {
    const stripe = getStripe();
    const { amount, ticketId } = req.body;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],

      metadata: {
        ticketId, // 🔥 VERY IMPORTANT
      },

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Museum Ticket" },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],

      success_url:
        "http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/chat",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("CREATE SESSION ERROR:", err);
    res.status(500).json({ message: "Stripe session creation failed" });
  }
};

// VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
  try {
    const stripe = getStripe(); // ✅ FIX IS HERE

    const { sessionId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const ticketId = session.metadata?.ticketId;
    if (!ticketId) {
      return res
        .status(400)
        .json({ message: "Ticket ID missing in metadata" });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.status = "confirmed";
    await ticket.save();

    res.json({
      success: true,
      ticketId: ticket._id,
    });
  } catch (err) {
    console.error("VERIFY PAYMENT ERROR:", err);
    res.status(500).json({ message: "Payment verification failed" });
  }
};
