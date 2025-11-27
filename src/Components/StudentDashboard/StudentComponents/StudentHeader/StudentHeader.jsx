"use client"
import { useState, useEffect, useRef } from "react"
import {
    Menu,
    X,
    Bell,
    User,
    ChevronDown,
    Settings,
    LogOut,
    LayoutDashboard,
    BookOpen
} from "lucide-react"
import { FaGraduationCap } from "react-icons/fa"
import { NavLink, useLocation } from "react-router-dom"
import "./StudentHeader.css"

const StudentHeader = ({ userName = "John Doe" }) => {
    const [isMobile, setIsMobile] = useState(false)
    const [isNavOpen, setIsNavOpen] = useState(false)
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)

    const location = useLocation()
    const currentPath = location.pathname

    const navItems = [
        { name: "Dashboard", href: "/student", icon: LayoutDashboard },
        { name: "Tests", href: "/student/tests", icon: BookOpen },
    ]

    const dropdownRef = useRef(null)
    const navRef = useRef(null)

    // ⭐ Your isActive function (FINAL)
    const isActive = (path) => {
        if (path === "/student") {
            return currentPath === "/student" // Dashboard only active on exact '/student'
        }
        return currentPath === path || currentPath.startsWith(path + "/")
    }

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

    const closeMobileNav = () => {
        if (isMobile) setIsNavOpen(false)
    }

    return (
        <header className="top-bar">
            <div className="top-bar-container">

                {/* LEFT LOGO + MENU */}
                <div className="logo-left">
                    <button className="navbar-toggler" onClick={toggleNav} aria-label="Toggle navigation">
                        {isNavOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>

                    <FaGraduationCap className="header-logo-icon" />
                    <span className="header-logo-text">Student Panel</span>
                </div>

                {/* NAVIGATION */}
                <nav ref={navRef} className={`nav-menu ${isNavOpen ? "nav-menu-open" : ""}`}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            end={item.href === "/student"}   // ⭐ FIX: exact match only for Dashboard
                            className={`nav-item ${isActive(item.href) ? "active" : ""}`}
                            onClick={closeMobileNav}
                        >
                            <item.icon className="nav-icon" />
                            <span className="nav-text">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>


                {/* RIGHT SIDE */}
                <div className="header-right2" ref={dropdownRef}>

                    <button className="teacher-notification-btn">
                        <Bell size={20} />
                        <span className="teacher-notification-badge">3</span>
                    </button>

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

export default StudentHeader
