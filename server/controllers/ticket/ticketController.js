import Ticket from "../../models/Ticket.js";

/* =======================
   BOOK TICKET
======================= */
export const bookTicket = async (req, res) => {
  try {
    const {
      museumId,
      museumName,
      citizenType,
      ticketCategory,
      date,
      timeSlot,
      quantity,
      amount,
    } = req.body;

    const ticket = await Ticket.create({
      user: req.user._id,
      museumId,
      museumName,
      citizenType,
      ticketCategory,
      date,
      timeSlot,
      quantity,
      amount,
      status: "pending",
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error("BOOK TICKET ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);
  } catch (err) {
    console.error("GET TICKET ERROR:", err);
    res.status(500).json({ message: "Failed to fetch ticket" });
  }
};

/* ================= ADMIN ================= */

/* GET ALL BOOKINGS (TICKETS) */
export const getAllTicketsAdmin = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("user", "name email")
      .populate("museumId", "name location");

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch tickets" });
  }
};

/* UPDATE TICKET STATUS */
export const updateTicketStatusAdmin = async (req, res) => {
  try {
    const { status } = req.body;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket)
      return res.status(404).json({ msg: "Ticket not found" });

    ticket.status = status;
    await ticket.save();

    res.json({ msg: "Ticket status updated" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update ticket" });
  }
};

/* ================= ADMIN PAYMENT ================= */
export const getPaymentsAdmin = async (req, res) => {
  try {
    const tickets = await Ticket.find({ status: { $ne: "pending" } })
      .populate("user", "name email")
      .populate("museumId", "name");

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch payments" });
  }
};
