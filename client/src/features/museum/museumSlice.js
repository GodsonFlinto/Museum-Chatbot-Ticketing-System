import { createSlice } from "@reduxjs/toolkit";

const museumSlice = createSlice({
  name: "museum",
  initialState: {
    activeMuseum: null,
  },
  reducers: {
    setActiveMuseum: (state, action) => {
      state.activeMuseum = action.payload;
    },
    clearActiveMuseum: (state) => {
      state.activeMuseum = null;
    },
  },
});

export const { setActiveMuseum, clearActiveMuseum } = museumSlice.actions;
export default museumSlice.reducer;