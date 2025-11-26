import React from 'react'
import { Routes, Route } from "react-router-dom";
import TeacherClasses from '../TeacherClasses/TeacherClasses';
import TeachersQuestionBanks from './TeachersQuestionBanks';
import TeacherQbQuestions from './TeacherQbQuestions/TeacherQbQuestions';


const TeacherQbRoutes = () => {
  return (
    <div>

           <Routes>
        
              {/* Default class list page */}
              <Route index element={<TeachersQuestionBanks />} />
        
              {/* /classes/:id */}
              <Route path="questions" element={<TeacherQbQuestions />} />
        
            </Routes>
      
    </div>
  )
}

export default TeacherQbRoutes
