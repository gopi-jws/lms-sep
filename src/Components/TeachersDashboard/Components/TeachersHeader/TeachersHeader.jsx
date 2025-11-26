"use client";

import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  Menu,
  X,
  Bell,
  Search,
  User,
  ChevronDown,
  Settings,
  LogOut,
  LayoutDashboard,
  GraduationCap,
  FileText,
  BookOpen,
  HelpCircle,
} from "lucide-react";
import { FaGraduationCap } from "react-icons/fa";
import "./TeachersHeader.css";

// ------------ Teacher Menu Items ------------
const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/teachers-dashboard" },
  { icon: GraduationCap, label: "My Classes", path: "/teachers-dashboard/classes" },
  { icon: FileText, label: "My Tests", path: "/teachers-dashboard/tests" },
  { icon: BookOpen, label: "Question Banks", path: "/teachers-dashboard/question-banks" },
  // { icon: HelpCircle, label: "Help Center", path: "/teachers-dashboard/help" },
];

const TeacherHeader = ({ userName = "Dr. Sarah Johnson" }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const navRef = useRef(null);

  // Detect Mobile
  useEffect(() => {
    const detectMobile = () => {
      const m = window.innerWidth <= 768;
      setIsMobile(m);
      if (!m) setIsNavOpen(false);
    };

    detectMobile();
    window.addEventListener("resize", detectMobile);
    return () => window.removeEventListener("resize", detectMobile);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }

      if (navRef.current && !navRef.current.contains(event.target) && isNavOpen) {
        const toggleBtn = document.querySelector(".navbar-toggler");
        if (!toggleBtn || !toggleBtn.contains(event.target)) {
          setIsNavOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isNavOpen]);

  const toggleNav = () => setIsNavOpen(!isNavOpen);
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);
  const closeMobileNav = () => isMobile && setIsNavOpen(false);

  return (
    <header className="top-bar">
      <div className="top-bar-container">

        {/* Left: Logo + Mobile Toggle */}
        <div className="logo-left">
          <button className="navbar-toggler" onClick={toggleNav}>
            {isNavOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          <FaGraduationCap className="header-logo-icon" />
          <span className="header-logo-text">Teacher Dashboard</span>
        </div>

        {/* Search Bar */}
        {/* <div className="teacher-search-bar">
          <Search size={18} className="teacher-search-icon" />
          <input type="text" placeholder="Search..." className="teacher-search-input" />
        </div> */}

        {/* ------------ Teacher NAV MENU (same structure as Admin) ------------ */}
        <nav ref={navRef} className={`nav-menu ${isNavOpen ? "nav-menu-open" : ""}`}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="nav-item"
              onClick={closeMobileNav}
            >
              <item.icon className="nav-icon" />
              <span className="nav-text">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* ------------ Right Side: Notifications + User Dropdown ------------ */}
        <div className="header-right2" ref={dropdownRef}>
          {/* <button className="teacher-notification-btn">
            <Bell size={20} />
            <span className="teacher-notification-badge">3</span>
          </button> */}

          <button className="header-settings-button" onClick={toggleUserDropdown}>
            <div className="teacher-user-avatar">
              <User size={18} />
            </div>
            <p className="admin-label">{userName}</p>
            <ChevronDown size={16} className={`teacher-arrow ${isUserDropdownOpen ? "open" : ""}`} />
          </button>

          {isUserDropdownOpen && (
            <div className={`settings-dropdown ${isMobile ? "mobile" : ""}`}>
              <a href="/teacher/profile" className="header-dropdown-item">
                <User size={16} /> Profile
              </a>
              <a href="/teacher/settings" className="header-dropdown-item">
                <Settings size={16} /> Settings
              </a>

              <div className="divider2"></div>

              <a href="/logout" className="header-dropdown-item logout">
                <LogOut size={16} /> Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TeacherHeader;
