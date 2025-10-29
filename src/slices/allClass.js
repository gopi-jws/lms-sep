import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isNewClassModalOpen: false,
}

export const allClass = createSlice({
    name:"AllClass",
    initialState,
    reducers:{
        setIsNewClassModalOpen  : (state,action) =>{
            state.isNewClassModalOpen = action.payload;
        }
    }
});

export const { setIsNewClassModalOpen } = allClass.actions;

export default allClass.reducer;