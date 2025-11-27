import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentMainDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../../../Sidebar/Sidebar';
import { GrCompliance } from "react-icons/gr";
import { VscTriangleDown } from 'react-icons/vsc';
import { BookOpen, Layers, BarChart2, Trophy } from "lucide-react";

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState('past');

    /* ------------------------------------
       Dummy Test Data
    ------------------------------------ */
    const [pastTests, setPastTests] = useState([
        {
            id: 'hist303',
            name: 'World History',
            owner: 'Prof. Davis',
            date: '2023-05-20',
            score: 85,
            totalScore: 100,
            status: 'completed',
            subject: 'History',
            topics: ['Ancient Civilizations', 'World Wars', 'Modern History'],
            strengths: ['Ancient Civilizations', 'Modern History'],
            weaknesses: ['World Wars']
        },
        {
            id: 'eng404',
            name: 'Literature Exam',
            owner: 'Dr. Wilson',
            date: '2023-05-15',
            score: 92,
            totalScore: 100,
            status: 'completed',
            subject: 'English',
            topics: ['Poetry', 'Prose', 'Drama'],
            strengths: ['Poetry', 'Drama'],
            weaknesses: ['Prose']
        },
        {
            id: 'math101',
            name: 'Algebra Midterm',
            owner: 'Prof. Smith',
            date: '2023-04-10',
            score: 78,
            totalScore: 100,
            status: 'completed',
            subject: 'Mathematics',
            topics: ['Equations', 'Functions', 'Matrices'],
            strengths: ['Equations'],
            weaknesses: ['Functions', 'Matrices']
        },
        {
            id: 'sci202',
            name: 'Chemistry Quiz',
            owner: 'Dr. Johnson',
            date: '2023-03-25',
            score: 88,
            totalScore: 100,
            status: 'completed',
            subject: 'Science',
            topics: ['Periodic Table', 'Chemical Reactions', 'Organic Chemistry'],
            strengths: ['Periodic Table', 'Chemical Reactions'],
            weaknesses: ['Organic Chemistry']
        }
    ]);

    const [selectedTest, setSelectedTest] = useState(null);

    /* ----------------------------------------
       Functions
    ---------------------------------------- */
    const calculateAverageScore = () => {
        const sum = pastTests.reduce((total, test) => total + test.score, 0);
        return (sum / pastTests.length).toFixed(1);
    };

    const getScoreColor = (score) => {
        if (score >= 90) return 'excellent';
        if (score >= 80) return 'good';
        if (score >= 70) return 'average';
        return 'needs-improvement';
    };

    /* ------------------------------------
       STATS DATA (Your Required Format)
    ------------------------------------ */
    const statsData = [
        {
            title: "Tests Completed",
            value: pastTests.length,
            icon: <GrCompliance size={24} />,
            label: "",
            color: "#3B82F6",
        },
        {
            title: "Average Score",
            value: `${calculateAverageScore()}%`,
            icon: <BarChart2 size={24} />,
            label: "",
            color: "#3B82F6",
        },
        {
            title: "Best Score",
            value: `${Math.max(...pastTests.map(test => test.score))}%`,
            icon: <Trophy size={24} />,
            label: "",
            color: "#3B82F6",
        },
        {
            title: "Subjects",
            value: new Set(pastTests.map(test => test.subject)).size,
            icon: <BookOpen size={24} />,
            label: "",
            color: "#3B82F6",
        },
    ];

    /* ------------------------------------
       Mobile Sidebar Close
    ------------------------------------ */
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const sidebarRef = useRef(null);
    const toggleRef = useRef(null);

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

    const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

    /* ------------------------------------
       Return UI
    ------------------------------------ */
    return (
        <div className="student-dashboard" style={{ position: "relative" }}>

            <div ref={sidebarRef} className="header-moblile-sideBar" style={{ marginTop: "0px" }}>
                <Sidebar
                    isMobileOpen={isMobileOpen}
                    onClose={() => setIsMobileOpen(false)}
                />
            </div>


            <div className="container-fluid py-4">
                <div className="dashboardheading">
                    <h3>Student Dashboard</h3>
                    <div className="test-index-header-moblie">
                        <VscTriangleDown
                            onClick={toggleMobileSidebar}
                            ref={toggleRef}
                            className="dashboard-TriangleDown"
                        />
                    </div>
                </div>

                {/* ------------------------------------
                     Stats Cards (New format)
                ------------------------------------ */}
                <div className="dashboard-stats-grid mb-4">
                    {statsData.map((stat, index) => (
                        <div className="dashboard-stat-card" key={index}>
                            <div
                                className="dashboard-stat-icon"
                                style={{
                                    backgroundColor: `${stat.color}20`,
                                    color: stat.color,
                                }}
                            >
                                {stat.icon}
                            </div>

                            <div className="stat-content">
                                <p className="stat-title">{stat.title}</p>
                                <h3 className="dashboard-stat-value">{stat.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ------------------------------------
                     TABLE + DETAILS / SUMMARY
                ------------------------------------ */}
                <div className="row">
                    <div className="col-md-8">
                        <div className="card shadow-sm mb-4">
                            <div className="card-header bg-white">
                                <h5 className="card-title mb-0">Past Test Results</h5>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Test Name</th>
                                                <th>Subject</th>
                                                <th>Date</th>
                                                <th>Score</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pastTests.map((test) => (
                                                <tr key={test.id}>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <div
                                                                className="subject-icon me-2"
                                                                data-subject={test.subject.toLowerCase()}
                                                            >
                                                                {test.subject.charAt(0)}
                                                            </div>
                                                            <span>{test.name}</span>
                                                        </div>
                                                    </td>
                                                    <td>{test.subject}</td>
                                                    <td>{test.date}</td>
                                                    <td>
                                                        <div className="score-wrapper">
                                                            <div className={`score-badge ${getScoreColor(test.score)}`}>
                                                                {test.score}%
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => setSelectedTest(test)}
                                                        >
                                                            Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ------------------------------------
                        RIGHT SIDE SUMMARY / DETAILS
                    ------------------------------------ */}
                    <div className="col-md-4">
                        {selectedTest ? (
                            <div className="card shadow-sm mb-4">
                                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                    <h5 className="card-title mb-0">Test Details</h5>
                                    <button
                                        className="btn btn-sm btn-link text-muted"
                                        onClick={() => setSelectedTest(null)}
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>
                                <div className="card-body">
                                    <div className="test-detail-header">
                                        <div className={`large-subject-icon ${selectedTest.subject.toLowerCase()}`}>
                                            {selectedTest.subject.charAt(0)}
                                        </div>
                                        <div className="test-info">
                                            <h4>{selectedTest.name}</h4>
                                            <p className="text-muted">
                                                {selectedTest.owner} • {selectedTest.date}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="score-circle-container">
                                        <div className={`score-circle ${getScoreColor(selectedTest.score)}`}>
                                            <div className="score-value">{selectedTest.score}</div>
                                            <div className="score-max">/{selectedTest.totalScore}</div>
                                        </div>
                                    </div>

                                    <div className="topics-section mt-4">
                                        <h6>Topics Covered</h6>
                                        <div className="topics-list">
                                            {selectedTest.topics.map((topic, index) => (
                                                <span className="topic-badge" key={index}>{topic}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="strengths-section mt-4">
                                        <h6>Strengths</h6>
                                        <ul className="strength-list">
                                            {selectedTest.strengths.map((strength, index) => (
                                                <li key={index}>
                                                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                                                    {strength}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="weaknesses-section mt-4">
                                        <h6>Areas for Improvement</h6>
                                        <ul className="weakness-list">
                                            {selectedTest.weaknesses.map((weakness, index) => (
                                                <li key={index}>
                                                    <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
                                                    {weakness}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-4">
                                        <button className="btn btn-primary w-100">
                                            View Full Report
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="card shadow-sm mb-4">
                                <div className="card-header bg-white">
                                    <h5 className="card-title mb-0">Performance Summary</h5>
                                </div>
                                <div className="card-body">
                                    <div className="text-center mb-4">
                                        <div className="empty-state">
                                            <i className="bi bi-bar-chart-line"></i>
                                            <p>Select a test to view detailed performance</p>
                                        </div>
                                    </div>

                                    <div className="subject-performance">
                                        <h6>Subject Performance</h6>
                                        <div className="subject-bars">
                                            <div className="subject-bar-item">
                                                <div className="subject-label">Mathematics</div>
                                                <div className="progress">
                                                    <div className="progress-bar bg-primary" style={{ width: '78%' }}>78%</div>
                                                </div>
                                            </div>

                                            <div className="subject-bar-item">
                                                <div className="subject-label">Science</div>
                                                <div className="progress">
                                                    <div className="progress-bar bg-success" style={{ width: '88%' }}>88%</div>
                                                </div>
                                            </div>

                                            <div className="subject-bar-item">
                                                <div className="subject-label">English</div>
                                                <div className="progress">
                                                    <div className="progress-bar bg-info" style={{ width: '92%' }}>92%</div>
                                                </div>
                                            </div>

                                            <div className="subject-bar-item">
                                                <div className="subject-label">History</div>
                                                <div className="progress">
                                                    <div className="progress-bar bg-warning" style={{ width: '85%' }}>85%</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
