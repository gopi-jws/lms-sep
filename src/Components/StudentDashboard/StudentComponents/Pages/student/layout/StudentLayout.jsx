import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './StudentLayout.css';
import StudentHeader from '../../../StudentHeader/StudentHeader';

const StudentLayout = () => {
    const location = useLocation();

    // Hide header ONLY on: /student/tests/:id/attempt
    const hideHeader = /^\/student\/tests\/\d+\/attempt$/.test(location.pathname);

    return (
        <>
            {!hideHeader && <StudentHeader />}

            <div className="layout-container">
                <div className="layout-main">
                    <main className={hideHeader ? "test-attempt-layout-content" : "layout-content"}>
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
};

export default StudentLayout;
