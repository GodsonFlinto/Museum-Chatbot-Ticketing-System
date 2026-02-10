import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import chatbotReducer from "../features/chatbot/chatbotSlice";
import paymentReducer from "../features/payment/paymentSlice";
import languageReducer from "../features/language/languageSlice";
import museumReducer from "../features/museum/museumSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chatbot: chatbotReducer,
    payment: paymentReducer,
    language : languageReducer,
    museum: museumReducer
  }
});
