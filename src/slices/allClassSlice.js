// slices/allClass.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isNewClassModalOpen: false,
};

const allClassSlice = createSlice({
    name: "AllClass",
    initialState,
    reducers: {
        setIsNewClassModalOpen: (state, action) => {
            state.isNewClassModalOpen = action.payload;
        },
    },
});

export const { setIsNewClassModalOpen } = allClassSlice.actions;
export default allClassSlice.reducer;
