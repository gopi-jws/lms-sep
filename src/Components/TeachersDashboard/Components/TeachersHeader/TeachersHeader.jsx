"use client";

import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  Menu,
  X,
  User,
  ChevronDown,
  Settings,
  LogOut,
  LayoutDashboard,
  GraduationCap,
  FileText,
  BookOpen,
} from "lucide-react";
import { FaGraduationCap } from "react-icons/fa";
import "./TeachersHeader.css";

// ------------ Teacher Menu Items ------------
const navItems = [
  { icon: LayoutDashboard, name: "Dashboard", href: "/teachers-dashboard" },
  { icon: GraduationCap, name: "My Classes", href: "/teachers-dashboard/classes" },
  { icon: FileText, name: "My Tests", href: "/teachers-dashboard/tests" },
  { icon: BookOpen, name: "Question Banks", href: "/teachers-dashboard/question-banks" },
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

  // Close dropdowns on outside click
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

        {/* ------------ NAV MENU USING NavLink ------------ */}
        <nav ref={navRef} className={`nav-menu ${isNavOpen ? "nav-menu-open" : ""}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/teachers-dashboard"} // exact match only for Dashboard
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              onClick={closeMobileNav}
            >
              <item.icon className="nav-icon" />
              <span className="nav-text">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* ------------ Right Side: User Dropdown ------------ */}
        <div className="header-right2" ref={dropdownRef}>
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
