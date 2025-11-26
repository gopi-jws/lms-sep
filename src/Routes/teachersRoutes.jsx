import React from "react";
import { Routes, Route } from "react-router-dom";
import TeachersDashboard from "../Components/TeachersDashboard/TeachersDashboard";
import TeachersHome from "../Components/TeachersDashboard/Pages/TeachersHome/TeachersHome";
import TeachersTests from "../Components/TeachersDashboard/Pages/TeachersTests/TeachersTests";
import TeacherclassesRoute from "../Components/TeachersDashboard/Pages/TeacherClasses/TeacherclassesRoute";
import TeacherQbRoutes from "../Components/TeachersDashboard/Pages/TeachersQuestionBanks/TeacherQbRoutes";

const TeachersRoutes = () => {
    return (
        <Routes>
            <Route path="/*" element={<TeachersDashboard />}>
                <Route index element={<TeachersHome />} />  {/* Default Page */}
                 
                 <Route path="classes/*" element={<TeacherclassesRoute />} />
                 <Route path="tests" element={<TeachersTests />} />
                 <Route path="Question-banks/*" element={<TeacherQbRoutes />} />
                  
            </Route>
        </Routes>
    );
};

export default TeachersRoutes;