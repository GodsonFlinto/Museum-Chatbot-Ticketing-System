export const intents = {
  start: {
    reply: "Welcome! What would you like to book?",
    options: ["Entry Ticket", "Show Ticket", "Exhibition"]
  },

  ticketType: {
    reply: "Please select a date (YYYY-MM-DD)"
  },

  date: {
    reply: "Choose a time slot",
    options: ["10:00–12:00", "12:00–14:00", "14:00–16:00"]
  },

  timeSlot: {
    reply: "How many tickets do you need?"
  },

  quantity: {
    reply: "Proceeding to payment..."
  }
};
