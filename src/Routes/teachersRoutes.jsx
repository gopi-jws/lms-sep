import React from "react";
import { Routes, Route } from "react-router-dom";

import TeachersDashboard from "../Components/TeachersDashboard/TeachersDashboard";
import TeachersHome from "../Components/TeachersDashboard/Pages/TeachersHome/TeachersHome";
import TeachersTests from "../Components/TeachersDashboard/Pages/TeachersTests/TeachersTests";
import TeachersQuestionBanks from "../Components/TeachersDashboard/Pages/TeachersQuestionBanks/TeachersQuestionBanks";
import TeacherclassesRoute from "../Components/TeachersDashboard/Pages/TeacherClasses/TeacherclassesRoute";
import TeachersAddTests from "../Components/TeachersDashboard/Pages/TeachersAddTests/TeachersAddTests";

const TeachersRoutes = () => {
    return (
        <Routes>
            <Route path="/*" element={<TeachersDashboard />}>

                {/* Default Page */}
                <Route index element={<TeachersHome />} />

                {/* Classes */}
                <Route path="classes/*" element={<TeacherclassesRoute />} />

                {/* Tests */}
                <Route path="tests" element={<TeachersTests />} />
                <Route path="tests/:id/movetest" element={<TeachersAddTests />} />

                {/* FIXED — must be lowercase and same as nav menu */}
                <Route path="question-banks" element={<TeachersQuestionBanks />} />

            </Route>
        </Routes>
    );
};

export default TeachersRoutes;
