import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

/**
 * Send message to backend chatbot
 * Backend returns: { reply, options?, action?, data? }
 */
export const sendMessage = createAsyncThunk(
  "chatbot/sendMessage",
  async (message, { getState }) => {
    const language = getState().chatbot.language || "en";

    const res = await api.post("/chatbot/message", {
      message,
      language
    });

    return res.data;
  }
);

const initialState = {
  messages: [],
  language: "en",

  // 🔥 SINGLE SOURCE OF TRUTH FOR BOOKING
  session: {
    data: {
      ticketType: null,
      date: null,
      timeSlot: null,
      quantity: null
    }
  }
};

const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,

  reducers: {
    // Store user message (UI only)
    addUserMessage: (state, action) => {
      state.messages.push({ text: action.payload });
    },

    setLanguage: (state, action) => {
      state.language = action.payload;
    },

    // Reset everything (optional)
    resetChatbot: (state) => {
      state.messages = [];
      state.session.data = {
        ticketType: null,
        date: null,
        timeSlot: null,
        quantity: null
      };
    }
  },

  extraReducers: (builder) => {
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      const payload = action.payload;

          console.log("CHATBOT API PAYLOAD:", action.payload);

      // 1️⃣ Store bot reply (UI)
      state.messages.push(payload);

      // 2️⃣ 🔥 STORE BOOKING DATA (THIS FIXES EVERYTHING)
      if (payload.data) {
        state.session.data = {
          ...state.session.data,
          ...payload.data
        };
      }
    });
  }
});

export const {
  addUserMessage,
  setLanguage,
  resetChatbot
} = chatbotSlice.actions;

export default chatbotSlice.reducer;
