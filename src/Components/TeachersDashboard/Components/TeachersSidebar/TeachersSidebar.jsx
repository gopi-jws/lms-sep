"use client";

import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  HelpCircle,
  LogOut,
  GraduationCap,
} from "lucide-react";
import "./TeachersSidebar.css";

const TeachersSidebar = ({ isMobileOpen, onClose }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/teachers-dashboard" },
    { icon: GraduationCap, label: "My Classes", path: "/teachers/classes" },
    { icon: FileText, label: "My Tests", path: "/teachers/tests" },
    { icon: BookOpen, label: "Question Banks", path: "/teachers/question-banks" },
    { icon: HelpCircle, label: "Help Center", path: "/teachers/help" },
  ];

  const isActive = (path) => currentPath.startsWith(path);

  const handleMobileClose = () => {
    if (window.innerWidth <= 768) onClose();
  };

  return (
    <div className="sidebar-wrapper">

      {isMobileOpen && (
        <div className="mobile-overlay" onClick={handleMobileClose}></div>
      )}

      <nav
        className={`test-sidebar-container ${isMobileOpen ? "mobile-open" : ""}`}
        aria-label="Teacher Navigation"
      >
        {/* Header */}
        <div className="test-sidebar-header">
          <span className="sidebar-letters">Teacher Panel</span>
        </div>

        {/* Scrollable Section */}
        <div className="test-sidebar-scroll">
          <div className="test-sidebar-section">
            <ul className="test-sidebar-menu">
              <li className="sidebar-section-title">Main</li>

              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`sidebar-contents ${
                        isActive(item.path) ? "active" : ""
                      }`}
                      onClick={handleMobileClose}
                    >
                      <Icon className="icon" size={20} />
                      <span className="sidebar-letters">{item.label}</span>
                    </Link>
                  </li>
                );
              })}

              <hr />

              {/* Profile */}
              <li className="sidebar-section-title">Profile Info</li>

              <li>
                <Link
                  to="/teachers/profile"
                  className={`sidebar-contents ${
                    currentPath === "/teachers/profile" ? "active" : ""
                  }`}
                  onClick={handleMobileClose}
                >
                  <BookOpen className="icon" size={20} />
                  <span className="sidebar-letters">My Profile</span>
                </Link>
              </li>

              {/* Logout */}
              <li>
                <Link
                  to="/logout"
                  className="sidebar-contents"
                  onClick={handleMobileClose}
                >
                  <LogOut className="icon" size={20} />
                  <span className="sidebar-letters">Logout</span>
                </Link>
              </li>

            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default TeachersSidebar;
