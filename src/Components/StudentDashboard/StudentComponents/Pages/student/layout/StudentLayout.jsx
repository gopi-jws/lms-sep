import React from 'react';
// import StudentSidebar from '../../../../StudentSidebar/StudentSidebar';
import { Outlet, useLocation } from 'react-router-dom';
import './StudentLayout.css';
import StudentHeader from '../../../StudentHeader/StudentHeader';

const StudentLayout = () => {
    const location = useLocation();
    const hideSidebar = location.pathname.includes('/tests/') && location.pathname.includes('/attempt');

    return (

        <>
            <StudentHeader />

            <div className="layout-container">
                <div className="layout-main">
                    <main className="layout-content">
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
};

export default StudentLayout;