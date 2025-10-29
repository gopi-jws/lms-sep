import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openNewtest: false,
};

export const allTestSlice = createSlice({
  name: "AllTest",
  initialState, // ✅ Correct spelling here
  reducers: {
    addNewTest: (state,action) => {
      state.openNewtest = action.payload;
    },
  },
});

export const { addNewTest } = allTestSlice.actions;
export default allTestSlice.reducer; // ✅ Correct export
