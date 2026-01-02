import Ticket from "../models/Ticket.js";

// BOOK TICKET
export const bookTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create({
      user: req.user._id,
      ticketType: req.body.ticketType,
      date: req.body.date,
      timeSlot: req.body.timeSlot,
      quantity: req.body.quantity,
      status: "pending"
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET USER TICKETS
export const getMyTickets = async (req, res) => {
  const tickets = await Ticket.find({ user: req.user._id });
  res.json(tickets);
};


export const getTicketById = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }
  res.json(ticket);
};

export const scanTicket = async (req, res) => {
  const { ticketId } = req.body;

  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    return res.status(404).json({ message: "Invalid ticket" });
  }

  if (ticket.status === "used") {
    return res.status(400).json({ message: "Ticket already used" });
  }

  if (ticket.status !== "confirmed") {
    return res.status(400).json({ message: "Ticket not confirmed" });
  }

  ticket.status = "used";
  await ticket.save();

  res.json({
    message: "Entry allowed",
    ticket
  });
};
