"use client"
import { Phone } from "lucide-react";
import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  DollarSign,
  Users,
  ClipboardList,
  UserCheck,
  FolderOpen,
  User,
  Power,
  ChevronDown,
  ChevronUp,
  Home,
  Info,
  BookOpen,
  FileText,
  Menu,
  CircleDollarSign,
  BookOpenCheck,
  X,
} from "lucide-react"
import "./sidemenu.css"

const SidebarMenu = ({ isMobileOpen, sideBarTop }) => {
  console.log(isMobileOpen);

  const location = useLocation()
  const [isManageHomeVisible, setManageHomeVisible] = useState(true)
  const currentPath = location.pathname;

  // Dropdown states for all 5 items
  const [isHomeDropdownOpen, setIsHomeDropdownOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isCoursesDropdownOpen, setIsCoursesDropdownOpen] = useState(false);
  const [isBlogDropdownOpen, setIsBlogDropdownOpen] = useState(false);
  const [isContactDropdownOpen, setIsContactDropdownOpen] = useState(false);

  const isActive = (section) => {
    const path = currentPath;
    switch (section) {
      case "general":
        return path === "/";
      case "scheduled":
        return (
          path.startsWith("/maindashboard/scheduled") ||
          path.includes("/current-running-test-details/") ||
          path.includes("/upcoming-test-details/") ||
          path.includes("/completed-test-details/")
        );
      case "unscheduled":
        return (
          path.startsWith("/maindashboard/unscheduled") ||
          path.includes("/unscheduledtest-details/")
        );
      case "subscription":
        return path === "/maindashboard/subscription";
      case "teachers":
        return path.includes("/Teachers");
      default:
        return path.includes(section);
    }
  }

  const toggleManageHomeVisibility = () => {
    setManageHomeVisible(!isManageHomeVisible)
  }

  const toggleMobileSidebar = () => {
    if (typeof isMobileOpen === 'function') {
      isMobileOpen((prev) => !prev);
    }
  }

  const handleCloseMobile = () => {
    if (typeof isMobileOpen === 'function') {
      isMobileOpen(false);
    }
  }

  return (
    <div className="sidebar-wrapper">
      {isMobileOpen && <div className="mobile-overlay" onClick={handleCloseMobile} />}

      <nav className={`test-sidebar-container ${isMobileOpen ? "mobile-open" : ""} ${sideBarTop ? "dashboard-sidebar" : ""}`} aria-label="Main Navigation">
        <div className="test-sidebar-header">
          <span className="sidebar-letters">LMS Institute</span>
        </div>

        {/* FIXED SCROLL CONTAINER */}
        <div className="test-sidebar-scroll">
          <div className="test-sidebar-section">
            <ul className="test-sidebar-menu">
              <li className="sidebar-section-title">Dashboard</li>

              <li>
                <Link
                  to="/"
                  className={`sidebar-contents ${isActive("general") ? "active" : ""}`}
                  aria-label="General"
                  onClick={handleCloseMobile}
                >
                  <Users className="icon" size={20} />
                  <span className="sidebar-letters">General</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/maindashboard/scheduled"
                  className={`sidebar-contents ${isActive("scheduled") ? "active" : ""}`}
                  aria-label="scheduled"
                  onClick={handleCloseMobile}
                >
                  <UserCheck className="icon" size={20} />
                  <span className="sidebar-letters">Scheduled</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/maindashboard/unscheduled"
                  className={`sidebar-contents ${isActive("unscheduled") ? "active" : ""}`}
                  aria-label="UnScheduled"
                  onClick={handleCloseMobile}
                >
                  <ClipboardList className="icon" size={20} />
                  <span className="sidebar-letters">UnScheduled</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/Teachers"
                  className={`sidebar-contents ${currentPath.includes("/Teachers") ? "active" : ""}`}
                  aria-label="Teachers"
                  onClick={handleCloseMobile}
                >
                  <BookOpenCheck className="icon" size={20} />
                  <span className="sidebar-letters">Teachers</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/subscription"
                  className={`sidebar-contents ${currentPath === "/subscription" ? "active" : ""}`}
                  aria-label="Subscription"
                  onClick={handleCloseMobile}
                >
                  <CircleDollarSign className="icon" size={20} />
                  <span className="sidebar-letters">Subscription</span>
                </Link>
              </li>

              <hr />

              <li className="sidebar-section-title" onClick={toggleManageHomeVisibility}>
                Manage Website <span className="tag-dropdown-toggle ms-auto"></span>
              </li>

              {isManageHomeVisible && (
                <ul className="test-sidebar-submenu">
                  {/* HOME */}
                  <li>
                    <div
                      className="sidebar-contents"
                      onClick={() => setIsHomeDropdownOpen(!isHomeDropdownOpen)}
                      style={{ cursor: "pointer" }}
                    >
                      <Home className="icon" size={20} />
                      <span className="sidebar-letters">Home</span>
                      <span className="tag-dropdown-toggle ms-auto"></span>
                    </div>
                  </li>
                  {isHomeDropdownOpen && (
                    <ul className="test-sidebar-submenu nested">
                      <li><Link to="/home/sliders" className="sidebar-contents"><span className="sidebar-letters">Sliders</span></Link></li>
                      <li><Link to="/home/highlights" className="sidebar-contents"><span className="sidebar-letters">Why Choose</span></Link></li>
                      <li><Link to="/home/discover-features" className="sidebar-contents"><span className="sidebar-letters">Discover Features</span></Link></li>
                      <li><Link to="/home/explore-courses" className="sidebar-contents"><span className="sidebar-letters">Explore Courses</span></Link></li>
                      <li><Link to="/home/explore-blog" className="sidebar-contents"><span className="sidebar-letters">Explore Blog</span></Link></li>
                      <li><Link to="/home/hear-from-students" className="sidebar-contents"><span className="sidebar-letters">Hear From Students</span></Link></li>
                      <li><Link to="/home/happy-students" className="sidebar-contents"><span className="sidebar-letters">Happy Students</span></Link></li>
                    </ul>
                  )}

                  {/* ABOUT */}
                  <li>
                    <Link to="/home/about" className="sidebar-contents">
                      <FileText className="icon" size={20} />
                      <span className="sidebar-letters">About</span>
                    </Link>
                  </li>

                  {/* COURSES */}
                  <li>
                    <Link to="/home/course" className="sidebar-contents">
                      <FileText className="icon" size={20} />
                      <span className="sidebar-letters">Courses</span>
                    </Link>
                  </li>

                  {/* BLOG */}
                  <li>
                    <Link to="/home/manage-blog" className="sidebar-contents">
                      <FileText className="icon" size={20} />
                      <span className="sidebar-letters">Blog</span>
                    </Link>
                  </li>

                  {/* CONTACT */}
                  <li>
                    <Link to="/home/manage-contact" className="sidebar-contents">
                      <Phone className="icon" size={20} />
                      <span className="sidebar-letters">Contact</span>
                    </Link>
                  </li>
                </ul>
              )}

              <hr />
              <li className="sidebar-section-title">Profile Info</li>

              <li>
                <Link
                  to="/profile"
                  className={`sidebar-contents ${currentPath === "/profile" ? "active" : ""}`}
                  aria-label="Profile"
                  onClick={handleCloseMobile}
                >
                  <User className="icon" size={20} />
                  <span className="sidebar-letters">Profile</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/logout"
                  className="sidebar-contents"
                  aria-label="Logout"
                  onClick={handleCloseMobile}
                >
                  <Power className="icon" size={20} />
                  <span className="sidebar-letters">Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default SidebarMenu
