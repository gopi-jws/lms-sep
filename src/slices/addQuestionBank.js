import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    openAddQuestionQB: false,
    isSQAModalOpen: false,
    isModalOpen: false,
    isNumericalModalOpen: false,
    isTrueFalseModalOpen: false,
    isDescriptiveModalOpen: false,
}

export const addQuestionBank = createSlice({
    name:"AddNewQuestionQB",
    initialState,
    reducers:{
        addNewQuestionQB:(state,action)=>{
            state.openAddQuestionQB = action.payload;
        },

        setIsSQAModalOpen:(state,action)=>{
            state.isSQAModalOpen = action.payload;
        },
        
        setIsModalOpen: (state, action) => {
            state.isModalOpen = action.payload;
        },

        setIsNumericalModalOpen: (state, action) => {
            state.isNumericalModalOpen = action.payload;
        },

        setIsTrueFalseModalOpen: (state, action) => {
            state.isTrueFalseModalOpen = action.payload;
        },

        setIsDescriptiveModalOpen: (state, action) => {
            state.isDescriptiveModalOpen = action.payload;
        },
    }
});

export const { addNewQuestionQB, setIsSQAModalOpen, setIsModalOpen, setIsNumericalModalOpen, setIsTrueFalseModalOpen, setIsDescriptiveModalOpen } = addQuestionBank.actions;

export default addQuestionBank.reducer;