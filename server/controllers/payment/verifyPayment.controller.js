import { getStripe } from "../../config/stripe.js";
import Ticket from "../../models/Ticket.js";
import QRCode from "qrcode";

export const verifyPayment = async (req, res) => {
  const { sessionId } = req.body;
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return res.status(400).json({ message: "Payment not completed" });
  }

  const ticketId = session.metadata.ticketId;

  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  const qrCode = await QRCode.toDataURL(ticket._id.toString());

  ticket.status = "confirmed";
  ticket.qrCode = qrCode;
  await ticket.save();

  res.json({ ticketId: ticket._id });
};
