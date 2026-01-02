import { createStripeSession } from "../../services/payment/stripe.service.js";
import { createPaymentRecord } from "../../services/payment/payment.service.js";

export const createCheckout = async (req, res) => {
  const { ticketId, amount } = req.body;

  try {
    const session = await createStripeSession({
      amount,
      ticketId,
      userId: req.user._id
    });

    await createPaymentRecord({
      userId: req.user._id,
      ticketId,
      sessionId: session.id,
      amount
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
