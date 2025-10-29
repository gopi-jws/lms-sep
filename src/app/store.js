import { configureStore } from "@reduxjs/toolkit";
import allTestReducer from "../slices/allTestSlice.js"; // ✅ renamed variable
import testAddReducer from "../slices/testAddSlice.js";
import allQuestionBank from "../slices/allQuestionBank.js";
import addQuestionQB from "../slices/addQuestionBank";
import allClass  from "../slices/allClass.js";
import addStudent  from "../slices/addStudent.js";
import addTeacher from "../slices/allTeacher.js"

export const store = configureStore({
    reducer: {
        AllTest: allTestReducer, 
        TestAdd: testAddReducer,
        AllQuestionBank: allQuestionBank,
        AddQuestionQB: addQuestionQB,
        AllClass: allClass,
        AddStudent: addStudent,
        AllTeacher: addTeacher,
    },
});
