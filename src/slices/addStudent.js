import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAddStudentModalOpen: false,
}


export const addStudent = createSlice({
    name:"Add Student",
    initialState,
    reducers:{
        setIsAddStudentModalOpen:(state,action) =>{
            state.isAddStudentModalOpen = action.payload;
        }
    }
});

export const {setIsAddStudentModalOpen} = addStudent.actions;
export default addStudent.reducer;