import { configureStore } from "@reduxjs/toolkit";
import allTestReducer from "../slices/allTestSlice.js"; // ✅ renamed variable
import addQuestionTest from "../slices/testAddSlice.js";
import allQuestionBank from "../slices/allQuestionBank.js";
import addQuestionQB from "../slices/addQuestionBank";
import allClassReducer from "../slices/allClassSlice.js"
import addStudent from "../slices/addStudent.js";
import addTeacher from "../slices/allTeacher.js"
import addQuestionTestModal from "../slices/addQuestionTestModal.js";

export const store = configureStore({
    reducer: {
        AllTest: allTestReducer,
        AddQuestionTest: addQuestionTest,
        AddQuestionTestModal: addQuestionTestModal,
        AllQuestionBank: allQuestionBank,
        AddQuestionQB: addQuestionQB,
        AllClass: allClassReducer,
        AddStudent: addStudent,
        AllTeacher: addTeacher,
    },
});
