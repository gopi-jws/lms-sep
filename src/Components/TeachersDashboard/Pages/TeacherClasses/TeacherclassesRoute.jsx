import React from "react";
import { Routes, Route } from "react-router-dom";
          // Class list page
import TeacherClassDetails from "./TeacherClassDetails/TeacherClassDetails";
import TeacherClasses from "./TeacherClasses";

const TeacherclassesRoute = () => {
  return (
    <Routes>

      {/* Default class list page */}
      <Route index element={<TeacherClasses />} />

      {/* /classes/:id */}
      <Route path=":id/class-students" element={<TeacherClassDetails />} />

    </Routes>
  );
};

export default TeacherclassesRoute;
