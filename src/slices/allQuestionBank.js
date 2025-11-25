import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    openNewQB : false,
}

export const allQuestionBank = createSlice({
    name:"AllQuestionBank",
    initialState,
    reducers:{
        addNewQB:(state,action)=>{
            state.openNewQB = action.payload;
        }
    }
});


export const { addNewQB } = allQuestionBank.actions;

export default allQuestionBank.reducer;