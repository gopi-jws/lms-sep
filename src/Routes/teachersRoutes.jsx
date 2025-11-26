import React from "react";
import { Routes, Route } from "react-router-dom";
import TeachersDashboard from "../Components/TeachersDashboard/TeachersDashboard";
import TeachersHome from "../Components/TeachersDashboard/Pages/TeachersHome/TeachersHome";
import TeachersQuestionBanks from "../Components/TeachersDashboard/Pages/TeachersQuestionBanks/TeachersQuestionBanks";
import TeachersTests from "../Components/TeachersDashboard/Pages/TeachersTests/TeachersTests";

const TeachersRoutes = () => {
    return (
        <Routes>
            <Route path="/*" element={<TeachersDashboard />}>
                <Route index element={<TeachersHome />} />  {/* Default Page */}
            </Route>
        </Routes>
    );
};

export default TeachersRoutes;