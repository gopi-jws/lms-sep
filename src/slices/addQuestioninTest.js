import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    numberOfSelectionQuestion:0
}

export const addQuestioninTest = createSlice({
      name:"AddQuestioninTest",
      initialState,
      reducers:{
        setNumberofSelectionQuestion:(state,action)=>{
            state.numberOfSelectionQuestion = action.payload
        }
      }
});

export const { setNumberofSelectionQuestion } = addQuestioninTest.actions;

export default addQuestioninTest.reducer;