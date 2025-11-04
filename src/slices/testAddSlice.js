import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    openAddQuestionTest : false
}

export const testAddSlice = createSlice({
    name:"AddQuestionTest",
    initialState,
    reducers:{
        SetOpenAddQuestionTest:(state,action)=>{
            state.openAddQuestionTest = action.payload
        }
    }
});

export const { SetOpenAddQuestionTest } = testAddSlice.actions;
export default testAddSlice.reducer;