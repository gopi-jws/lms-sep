"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, X, Bell, Search, User, ChevronDown, Settings, LogOut } from "lucide-react"
import { FaGraduationCap } from "react-icons/fa"
import "./TeachersHeader.css"

const TeacherHeader = ({ userName = "Dr. Sarah Johnson" }) => {
  const [isMobile, setIsMobile] = useState(false)
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)

  const dropdownRef = useRef(null)
  const navRef = useRef(null)

  // Detect Mobile
  useEffect(() => {
    const detectMobile = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      if (!mobile) setIsNavOpen(false)
    }

    detectMobile()
    window.addEventListener("resize", detectMobile)
    return () => window.removeEventListener("resize", detectMobile)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false)
      }

      if (navRef.current && !navRef.current.contains(event.target) && isNavOpen) {
        const toggleBtn = document.querySelector(".navbar-toggler")
        if (!toggleBtn || !toggleBtn.contains(event.target)) {
          setIsNavOpen(false)
        }
      }
    }

    document.addEventListener("mousedown", handleOutside)
    return () => document.removeEventListener("mousedown", handleOutside)
  }, [isNavOpen])

  const toggleNav = () => setIsNavOpen(!isNavOpen)
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen)

  return (
    <header className="top-bar">
      <div className="top-bar-container">

        {/* ------------ LEFT SIDE: LOGO + SEARCH + MOBILE TOGGLE ------------ */}
        <div className="logo-left">

          {/* Mobile Sidebar Toggle */}
          <button className="navbar-toggler" onClick={toggleNav} aria-label="Toggle navigation">
            {isNavOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* Logo (same as Institute) */}
          <FaGraduationCap className="header-logo-icon" />
          <span className="header-logo-text">Teacher Panel</span>


        </div>

        {/* Search Bar */}
        <div className="teacher-search-bar">
          <Search size={18} className="teacher-search-icon" />
          <input
            type="text"
            placeholder="Search..."
            className="teacher-search-input"
          />

          {/* Mobile Sliding Nav (kept empty per requirements) */}
          <nav ref={navRef} className={`nav-menu ${isNavOpen ? "nav-menu-open" : ""}`} />
        </div>



        {/* ------------ RIGHT SIDE: NOTIFICATIONS + USER DROPDOWN ------------ */}
        <div className="header-right2" ref={dropdownRef}>

          {/* Notifications */}
          <button className="teacher-notification-btn">
            <Bell size={20} />
            <span className="teacher-notification-badge">3</span>
          </button>

          {/* User Menu */}
          <button className="header-settings-button" onClick={toggleUserDropdown}>
            <div className="teacher-user-avatar">
              <User size={18} />
            </div>
            <p className="admin-label">{userName}</p>
            <ChevronDown
              size={16}
              className={`teacher-arrow ${isUserDropdownOpen ? "open" : ""}`}
            />
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
  )
}

export default TeacherHeader
