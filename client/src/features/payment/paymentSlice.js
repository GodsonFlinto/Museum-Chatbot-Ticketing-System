import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const startPayment = createAsyncThunk(
  "payment/start",
  async ({ ticketId, amount }) => {
    const res = await api.post("/payment/create-session", {
      ticketId,
      amount
    });

    // 🔥 REDIRECT TO STRIPE
    window.location.href = res.data.url;
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(startPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(startPayment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(startPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default paymentSlice.reducer;
