import { getStripe } from "../../config/stripe.js";

export const createStripeSession = async ({ amount, ticketId, userId }) => {
  const stripe = getStripe();

  return await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
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
    success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    metadata: { ticketId, userId }
  });
};

export const retrieveStripeSession = async (sessionId) => {
  const stripe = getStripe();
  return await stripe.checkout.sessions.retrieve(sessionId);
};

