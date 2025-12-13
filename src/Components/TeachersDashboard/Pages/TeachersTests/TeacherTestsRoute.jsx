import React from 'react';
import { Routes, Route } from "react-router-dom";

import TeachersTests from './TeachersTests';
import TeachersAddTests from '../TeachersAddTests/TeachersAddTests';
import TeacherShareTest from './TeacherShareTest/TeacherShareTest';
import TeacherPublish from './TeacherPublish/TeacherPublish';
import TeacherTestArchive from './TeacherTestArchive/TeacherTestArchive';
import TeacherTestTrash from './TeacherTestTrash/TeacherTestTrash';

const TeacherTestsRoute = () => {
    return (
        <div>
            <Routes>
                <Route index element={<TeachersTests />} />
                    <Route path="share-tests" element={<TeacherShareTest />} />
                     <Route path="publish" element={<TeacherPublish />} />
                       <Route path="archive" element={<TeacherTestArchive />} />
                         <Route path="trash" element={<TeacherTestTrash />} />
                <Route path=":id/movetest" element={<TeachersAddTests />} />
            </Routes>
        </div>
    );
}

export default TeacherTestsRoute;
