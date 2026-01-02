import Payment from "../../models/Payment.js";
import Ticket from "../../models/Ticket.js";
import { retrieveStripeSession } from "./stripe.service.js";

export const createPaymentRecord = async ({ userId, ticketId, sessionId, amount }) => {
  return await Payment.create({
    user: userId,
    ticket: ticketId,
    stripeSessionId: sessionId,
    amount
  });
};

export const verifyAndConfirmPayment = async (sessionId) => {
  const session = await retrieveStripeSession(sessionId);

  if (session.payment_status !== "paid") {
    throw new Error("Payment not completed");
  }

  const payment = await Payment.findOne({ stripeSessionId: sessionId });
  if (!payment) throw new Error("Payment record not found");

  payment.status = "success";
  await payment.save();

  await Ticket.findByIdAndUpdate(payment.ticket, {
    status: "confirmed"
  });

  return payment;
};
