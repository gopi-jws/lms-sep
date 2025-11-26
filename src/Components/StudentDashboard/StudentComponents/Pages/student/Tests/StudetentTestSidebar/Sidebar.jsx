import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    FileText,
    User,
    LogOut,
} from "lucide-react";
import { GrSchedules } from "react-icons/gr";
import { MdOutlineEventBusy, MdOutlineLiveTv } from "react-icons/md";

const Sidebar = ({ isMobileOpen, onClose }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(true);

    const location = useLocation();
    const currentPath = location.pathname;

    // ⭐ ACTIVE CHECK FOR NESTED ROUTES
    const isActive = (path) => {
        if (path === "/student/tests") {
            return (
                currentPath === "/student/tests" ||
                (currentPath.startsWith("/student/tests/") &&
                    !currentPath.includes("/scheduled") &&
                    !currentPath.includes("/live") &&
                    !currentPath.includes("/unscheduled"))
            );
        }

        return currentPath === path;
    };


    console.log(isActive);


    const menuItems = [
        { icon: FileText, label: "All Tests", path: "/student/tests" },
        { icon: GrSchedules, label: "Scheduled", path: "/student/tests/scheduled" },
        { icon: MdOutlineLiveTv, label: "Live", path: "/student/tests/live" },
        { icon: MdOutlineEventBusy, label: "Unscheduled", path: "/student/tests/unscheduled" },
    ];

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

    const handleMobileClose = () => {
        if (isMobile) onClose();
    };

    return (
        <div className="sidebar-wrapper">
            {isMobileOpen && (
                <div className="mobile-overlay" onClick={handleMobileClose}></div>
            )}

            <nav className={`test-sidebar-container ${isMobileOpen ? "mobile-open" : ""}`}>
                <div className="test-sidebar-header">
                    <span className="sidebar-letters">Student Panel</span>
                </div>

                <div className="test-sidebar-scroll">
                    <div className="test-sidebar-section">
                        <ul className="test-sidebar-menu">
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
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
