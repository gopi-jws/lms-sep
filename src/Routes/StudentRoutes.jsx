import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentLayout from '../Components/StudentDashboard/StudentComponents/Pages/student/layout/StudentLayout';
import TestList from '../Components/StudentDashboard/StudentComponents/Pages/student/Tests/TestList';
import TestAttempt from '../Components/StudentDashboard/StudentComponents/Pages/student/Tests/TestAttempt';
import StudentMainDashboard from '../Components/StudentDashboard/StudentComponents/Pages/student/Dashboard/StudentMainDashboard';
import ScheduledTests from '../Components/StudentDashboard/StudentComponents/Pages/student/Tests/pages/ScheduledTests/ScheduledTests';
import LiveTest from '../Components/StudentDashboard/StudentComponents/Pages/student/Tests/pages/LiveTest/LiveTest';
import UnscheduledTests from '../Components/StudentDashboard/StudentComponents/Pages/student/Tests/pages/UnscheduledTest/UnscheduledTest';


const StudentRoutes = () => {
    return (
        <Routes>
            <Route path="/*" element={<StudentLayout />}>
                <Route index element={<StudentMainDashboard />} />
                <Route path="tests" element={<TestList />} />
                <Route path="tests/scheduled" element={<ScheduledTests />} />
                <Route path="tests/live" element={<LiveTest />} />
                <Route path="tests/unscheduled" element={<UnscheduledTests />} />
                <Route path="tests/:testId/attempt" element={<TestAttempt />} />
            </Route>
        </Routes>
    );
};

export default StudentRoutes;
