"use client"

import { useState, useEffect, useRef } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { LayoutDashboard, BookOpen, Database, GraduationCap, Users, CircleUser, Menu, X } from 'lucide-react'
import { FaGraduationCap } from "react-icons/fa";
import "./header.css"

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Tests", href: "/test", icon: BookOpen },
  { name: "Question Banks", href: "/questionbank", icon: Database },
  { name: "Classes", href: "/class", icon: GraduationCap },
  { name: "Teachers", href: "/teachers", icon: Users },
]

const Header = () => {
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isNavOpen, setIsNavOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navRef = useRef(null)
  const location = useLocation()

  // Check if screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      if (!mobile) {
        setIsNavOpen(false) // Close mobile menu when resizing to desktop
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close settings dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSettingsExpanded(false)
      }

      // Close mobile nav menu when clicking outside
      if (navRef.current && !navRef.current.contains(event.target) && isNavOpen) {
        // Check if the click is not on the hamburger button
        const hamburgerButton = document.querySelector('.navbar-toggler')
        if (!hamburgerButton || !hamburgerButton.contains(event.target)) {
          setIsNavOpen(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isNavOpen])

  const toggleDropdown = () => {
    setIsSettingsExpanded(!isSettingsExpanded)
  }

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen)
  }

  const closeMobileNav = () => {
    if (isMobile) {
      setIsNavOpen(false)
    }
  }

  return (
    <header className="top-bar">
      <div className="top-bar-container">

        <div className="logo-left">
          <FaGraduationCap className="header-logo-icon" />
          <span className="header-logo-text">LMS Admin</span>
        </div>


        {/* Navigation Menu */}
        <nav
          ref={navRef}
          className={`nav-menu ${isNavOpen ? 'nav-menu-open' : ''}`}
        >
          {navItems.map((item) => {
            const isDashboard = item.href === "/"
            const isActiveDashboard = isDashboard && (
              location.pathname === "/" ||
              location.pathname.startsWith("/maindashboard") ||
              location.pathname === "/subscription"
            )

            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) => `nav-item ${isActive || isActiveDashboard ? "active" : ""}`}
                onClick={closeMobileNav}
              >
                <item.icon className="nav-icon" />
                <span className="nav-text">{item.name}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="header-right2" ref={dropdownRef}>
          <button className="header-settings-button" onClick={toggleDropdown} aria-label="User menu">
            <CircleUser className="header-profile-icon" />
            <p className="admin-label">Admin</p>
          </button>

          {isSettingsExpanded && (
            <div className={`settings-dropdown ${isMobile ? "mobile" : ""}`}>
              <a href="/profile" className="header-dropdown-item">My Profile</a>
              <a href="/account" className="header-dropdown-item">Account Settings</a>
              <a href="/dashboard" className="header-dropdown-item">Dashboard</a>
              <a href="/courses" className="header-dropdown-item">My Courses</a>
              <div className="divider2"></div>
              <a href="/help" className="header-dropdown-item">Help Center</a>
              <a href="/logout" className="header-dropdown-item logout">Logout</a>
            </div>
          )}

          {/* Hamburger Button for Mobile */}
          <button
            className="navbar-toggler "
            type="button"
            onClick={toggleNav}
            aria-label="Toggle navigation"
          >
            {isNavOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
      </div>
    </header>
  )
}

export default Header