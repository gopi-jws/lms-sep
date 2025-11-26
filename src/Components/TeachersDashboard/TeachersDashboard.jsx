import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import TeachersSidebar from "./Components/TeachersSidebar/TeachersSidebar";
import TeachersHeader from "./Components/TeachersHeader/TeachersHeader";
import './TeachersDashboard.css';

const TeachersDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleMenuToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <>
            <TeachersHeader onMenuToggle={handleMenuToggle} />

            <div className="layout-container">
                {/* <TeachersSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} /> */}
                <div className="layout-main">

                    <main className="layout-content">
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
};

export default TeachersDashboard;