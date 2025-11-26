import React, { useState, useRef, useEffect } from "react";
import { VscTriangleDown } from "react-icons/vsc";
import {
    Users,
    GraduationCap,
    BookOpen,
    FileText,
    MessageSquare,
    BarChart3,
    PieChart
} from "lucide-react";

import TeachersSidebar from "../../Components/TeachersSidebar/TeachersSidebar";
import "./TeachersHome.css";

const TeachersHome = () => {

    const statsData = [
        { title: "Total Classes", value: "12", icon: <BookOpen size={24} />, label: "Classes", color: "#3B82F6" },
        { title: "Total Students", value: "245", icon: <Users size={24} />, label: "Students", color: "#3B82F6" },
        { title: "Pending Tests", value: "07", icon: <FileText size={24} />, label: "Tests", color: "#3B82F6" },
        // { title: "Completion Rate", value: "89%", icon: <PieChart size={24} />, label: "Rate", color: "#3B82F6" },
    ];

    const recentActivities = [
        { course: 'Mathematics 101', action: 'New test created - Midterm Exam', time: '2 hours ago' },
        { course: 'Science Class', action: 'Test results published - Lab Quiz', time: '4 hours ago' },
        { course: 'English Literature', action: 'Test scheduled - Final Assessment', time: '1 day ago' },
        { course: 'Computer Science', action: 'Question bank updated - Programming Test', time: '2 days ago' },
    ];

    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const sidebarRef = useRef(null);
    const toggleRef = useRef(null);

    // Close sidebar
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!isMobileOpen) return;

            const sidebar = sidebarRef.current;
            const toggle = toggleRef.current;

            if (!sidebar || !toggle) return;

            const outsideSidebar = !sidebar.contains(e.target);
            const outsideToggle = !toggle.contains(e.target);

            if (outsideSidebar && outsideToggle) {
                setIsMobileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMobileOpen]);

    const toggleMobileSidebar = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    return (
        <div className="div" style={{ position: "relative" }}>

            {/* Sidebar */}
            <div ref={sidebarRef} className="header-moblile-sideBar" style={{ marginTop: "0px" }}>
                <TeachersSidebar
                    isMobileOpen={isMobileOpen}
                    onClose={() => setIsMobileOpen(false)}
                />
            </div>

            {/* CONTENT */}
            <section className="dashboard-content">

                {/* Heading (same as institute) */}
                <div className="dashboardheading">
                    <h3>Teacher Dashboard</h3>
                    <div className="test-index-header-moblie">
                        <VscTriangleDown
                            onClick={toggleMobileSidebar}
                            ref={toggleRef}
                            className="dashboard-TriangleDown"
                        />
                    </div>
                </div>

                {/* STATS (same structure as institute) */}
                <div className="dashboard-stats-grid mb-4">
                    {statsData.map((stat, index) => (
                        <div className="dashboard-stat-card" key={index}>
                            <div
                                className="dashboard-stat-icon"
                                style={{
                                    backgroundColor: `${stat.color}20`,
                                    color: stat.color
                                }}
                            >
                                {stat.icon}
                            </div>

                            <div className="stat-content">
                                <p className="stat-title">{stat.title}</p>
                                <h3 className="dashboard-stat-value">{stat.value} {stat.label}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 🔥 NOW WE ADD THE TWO EXTRA CARDS (INSTITUTE STYLE GRID) */}
                <div className="teacher-dashboard-main">
                    <div className="row g-4">

                        {/* Recent Activities */}
                        <div className="col-xl-6 col-lg-12">
                            <div className="teacher-dashboard-card">
                                <div className="teacher-dashboard-card-header">
                                    <h3 className="teacher-dashboard-card-title">Recent Activities</h3>
                                    <button className="teacher-dashboard-card-link">View All</button>
                                </div>

                                <div className="teacher-dashboard-card-body">
                                    <div className="teacher-dashboard-activity-list">
                                        {recentActivities.map((activity, index) => (
                                            <div key={index} className="teacher-dashboard-activity-item">
                                                <div className="teacher-dashboard-activity-content">
                                                    <h4 className="teacher-dashboard-activity-course">{activity.course}</h4>
                                                    <p className="teacher-dashboard-activity-action">{activity.action}</p>
                                                </div>
                                                <span className="teacher-dashboard-activity-time">{activity.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="col-xl-6 col-lg-12">
                            <div className="teacher-dashboard-card">
                                <div className="teacher-dashboard-card-header">
                                    <h3 className="teacher-dashboard-card-title">Quick Actions</h3>
                                </div>

                                <div className="teacher-dashboard-card-body">
                                    <div className="teacher-dashboard-actions">
                                        <div className="row g-3">

                                            <div className="col-sm-6">
                                                <button className="teacher-dashboard-action">
                                                    <FileText size={22} />
                                                    <span>Create Class</span>
                                                </button>
                                            </div>

                                            <div className="col-sm-6">
                                                <button className="teacher-dashboard-action">
                                                    <BookOpen size={22} />
                                                    <span>Create Test</span>
                                                </button>
                                            </div>

                                            <div className="col-sm-6">
                                                <button className="teacher-dashboard-action">
                                                    <MessageSquare size={22} />
                                                    <span>Send Announcement</span>
                                                </button>
                                            </div>

                                            <div className="col-sm-6">
                                                <button className="teacher-dashboard-action">
                                                    <BarChart3 size={22} />
                                                    <span>View Reports</span>
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

            </section>
        </div>
    );
};

export default TeachersHome;
