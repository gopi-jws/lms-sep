import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Home,
    FileText,
    User,
    LogOut,
    GraduationCap,
    LayoutDashboard,
} from "lucide-react";

import "./StudentSidebar.css";

const Sidebar = ({ isMobileOpen, onClose }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(true);

    const location = useLocation();
    const currentPath = location.pathname;

    // ⭐ ACTIVE LINK CHECK (supports nested paths)
    // ⭐ ACTIVE LINK CHECK (supports nested paths)
    const isActive = (path) => {
        if (path === "/student") {
            return currentPath === "/student"; // prevent Dashboard from being active on test pages
        }
        return currentPath === path || currentPath.startsWith(path + "/");
    };


    // ⭐ SIDEBAR MENU ITEMS
    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/student" },
        { icon: GraduationCap, label: "Tests", path: "/student/tests" },
    ];

    // ⭐ RESPONSIVE BEHAVIOR
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            setIsOpen(!mobile);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // ⭐ Close sidebar on mobile
    const handleMobileClose = () => {
        if (isMobile) onClose();
    };

    return (
        <div className="sidebar-wrapper">

            

            {/* MOBILE OVERLAY */}
            {isMobileOpen && (
                <div className="mobile-overlay" onClick={handleMobileClose}></div>
            )}
            

            <nav className={`test-sidebar-container ${isMobileOpen ? "mobile-open" : ""}`}>

                {/* HEADER */}
                <div className="test-sidebar-header">
                    <span className="sidebar-letters">Student Panel</span>
                </div>

                <div className="test-sidebar-scroll">
                    <div className="test-sidebar-section">

                        <ul className="test-sidebar-menu">

                            {/* ⭐ LOOP MENU ITEMS */}
                            {menuItems.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            className={`sidebar-contents ${isActive(item.path) ? "active" : ""}`}
                                            onClick={handleMobileClose}
                                        >
                                            <Icon className="icon" size={20} />
                                            <span className="sidebar-letters">{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}

                            <hr />

                            {/* ⭐ PROFILE SECTION */}
                            <li className="sidebar-section-title">Profile</li>

                            <li>
                                <Link
                                    to="/student/profile"
                                    className={`sidebar-contents ${isActive("/student/profile") ? "active" : ""}`}
                                    onClick={handleMobileClose}
                                >
                                    <User className="icon" size={20} />
                                    <span className="sidebar-letters">My Profile</span>
                                </Link>
                            </li>

                            {/* ⭐ LOGOUT */}
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

export default Sidebar;
