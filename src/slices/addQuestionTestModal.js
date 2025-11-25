import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    numberOfSelectionQuestion:0
}

export const addQuestionTestModal = createSlice({
      name:"AddQuestioninTest",
      initialState,
      reducers:{
        setNumberofSelectionQuestion:(state,action)=>{
            state.numberOfSelectionQuestion = action.payload
        }
      }
});

export const { setNumberofSelectionQuestion } = addQuestionTestModal.actions;

export default addQuestionTestModal.reducer;