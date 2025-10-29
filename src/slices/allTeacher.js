import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isNewTeacherModalOpen : false,
}

 const allTeacher = createSlice({
    name : "All Teacher",
    initialState,
     reducers: {
         setIsNewTeacherModalOpen: (state, action) => {
             state.isNewTeacherModalOpen = action.payload;
         },
    }
});

export const { setIsNewTeacherModalOpen } = allTeacher.actions;
export default allTeacher.reducer;