import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  step: 0,
  session: {
    citizenType: null, // indian | foreigner
    ticketCategory: null, // General | Student | Senior Citizen
    date: null,
    timeSlot: null,
    quantity: null,
  },
};

const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({ text: action.payload });
    },

    addBotMessageDirect: (state, action) => {
      state.messages.push(action.payload);
    },

    resetChatbot: () => initialState,

    sendMessage: (state, action) => {
      const userInput = action.payload;

      switch (state.step) {
        // STEP 0 → Ask visitor type
        case 0:
          state.messages.push({
            reply: "Select citizen type",
            options: ["Indian", "Foreigner"],
          });
          state.step = 1;
          break;

        case 1:
          state.session.citizenType = userInput.toLowerCase(); // indian / foreigner
          state.messages.push({
            reply: "Select ticket category",
            options: ["General", "Child", "Senior"],
          });
          state.step = 2;
          break;

        case 2:
          state.session.ticketCategory = userInput;
          state.messages.push({ reply: "Select visit date" });
          state.step = 3;
          break;

        case 3:
          state.session.date = userInput;
          state.messages.push({
            reply: "Choose a time slot",
            options: ["10:00 AM", "1:00 PM", "4:00 PM"],
          });
          state.step = 4;
          break;

        case 4:
          state.session.timeSlot = userInput;
          state.messages.push({ reply: "How many tickets do you need?" });
          state.step = 5;
          break;

        case 5:
          state.session.quantity = Number(userInput);
          state.messages.push({
            reply: "Booking complete. Proceed to payment.",
            action: "PAYMENT",
          });
          state.step = 6;
          break;
        default:
          break;
      }
    },
  },
});

export const { addUserMessage, addBotMessageDirect, sendMessage, resetChatbot } =
  chatbotSlice.actions;

export default chatbotSlice.reducer;
