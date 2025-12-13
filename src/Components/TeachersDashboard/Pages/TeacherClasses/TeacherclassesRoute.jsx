import React from "react";
import { Routes, Route } from "react-router-dom";
// Class list page
import TeacherClassDetails from "./TeacherClassDetails/TeacherClassDetails";
import TeacherClasses from "./TeacherClasses";
import TeacherClassArchived from "./TeacherClassArchived/TeacherClassArchived";
import TeacherClassTrash from "./TeacherClassTrash/TeacherClassTrash";


const TeacherclassesRoute = () => {
  return (
    <Routes>

      {/* Default class list page */}
      <Route index element={<TeacherClasses />} />

      <Route
        path="archive"
        element={<TeacherClassArchived />}
      />

        <Route
        path="trash"
        element={<TeacherClassTrash />}
      />

      {/* /classes/:id */}
      <Route path=":id/class-students" element={<TeacherClassDetails />} />

    </Routes>
  );
};

export default TeacherclassesRoute;
