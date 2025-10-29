import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    openAddQuestion : false
}

export const testAddSlice = createSlice({
    name:"TestAdd",
    initialState,
    reducers:{
        addNewQuestion:(state,action)=>{
            state.openAddQuestion = action.payload
        }
    }
});

export const { addNewQuestion } = testAddSlice.actions;
export default testAddSlice.reducer;