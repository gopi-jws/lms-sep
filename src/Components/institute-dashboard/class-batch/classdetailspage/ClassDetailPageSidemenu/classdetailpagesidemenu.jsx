"use client";

import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  Users,
  CheckCircle2,
  XCircle,
  Archive,
  Trash2,
} from "lucide-react";
import AddStudentModal from "../../../../ReusableComponents/AddStudentModal/AddStudentModal";
import AddTagModal from "../../../../ReusableComponents/AddTagModal/AddTagModal";
import { useSelector, useDispatch } from "react-redux";
import { setIsAddStudentModalOpen } from "../../../../../slices/addStudent";

const ClassDetailPageSideMenu = ({
  archivedCount,
  trashedCount,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const location = useLocation();
  const { id } = useParams();
  const [isNewTagModalOpen, setIsNewTagModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("allStudents");

  const dispatch = useDispatch();
  const isAddStudentModalOpen = useSelector(
    (state) => state.AddStudent.isAddStudentModalOpen
  );

  // 🔹 Keep active section in sync with current URL
  useEffect(() => {
    console.log("Path:", location.pathname);

    if (location.pathname.endsWith("/activeStudents")) {
      setActiveSection("activeStudents");
    } else if (location.pathname.endsWith("/inactiveStudents")) {
      setActiveSection("inactiveStudents");
    } else if (location.pathname.endsWith("/archive")) {
      setActiveSection("archive");
    } else if (location.pathname.endsWith("/trash")) {
      setActiveSection("trash");
    } else {
      setActiveSection("allStudents");
    }
  }, [location.pathname]);

  // 🔹 Handle manual clicks (also closes mobile menu)
  const handleSetActive = (section) => {
    setActiveSection(section);
    setIsMobileOpen(false);
  };

  return (
    <div className="sidebar-wrapper">
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav
        className={`test-sidebar-container ${isMobileOpen ? "mobile-open" : ""
          }`}
      >
        <div className="test-sidebar-header">
          <div className="w-100 d-flex justify-content-center">
            <button
              onClick={() => dispatch(setIsAddStudentModalOpen(true))}
              className="allbuttons"
            >
              <span className="sidebar-letters">New Student</span>
            </button>
          </div>
        </div>

        <div className="test-sidebar-scroll">
          <div className="test-sidebar-section">
            <ul className="test-sidebar-menu">
              <li>
                <Link
                  to={`/class/${id}/classdetailpage`}
                  className={`sidebar-contents ${activeSection === "allStudents" ? "active" : ""
                    }`}
                  onClick={() => handleSetActive("allStudents")}
                >
                  <Users size={18} className="icon" />
                  <span className="sidebar-letters">All Students</span>
                </Link>
              </li>

              <li>
                <Link
                  to={`/class/${id}/classdetailpage/activeStudents`}
                  className={`sidebar-contents ${activeSection === "activeStudents" ? "active" : ""
                    }`}
                  onClick={() => handleSetActive("activeStudents")}
                >
                  <CheckCircle2 size={18} className="icon" />
                  <span className="sidebar-letters">Active Students</span>
                </Link>
              </li>

              <li>
                <Link
                  to={`/class/${id}/classdetailpage/inactiveStudents`}
                  className={`sidebar-contents ${activeSection === "inactiveStudents" ? "active" : ""
                    }`}
                  onClick={() => handleSetActive("inactiveStudents")}
                >
                  <XCircle size={18} className="icon" />
                  <span className="sidebar-letters">Inactive Students</span>
                </Link>
              </li>
            </ul>
          </div>

          <hr />

          <div className="test-sidebar-section">
            <ul className="test-sidebar-menu">
              <li>
                <Link
                  to={`/class/${id}/classdetailpage/archive`}
                  className={`sidebar-contents ${activeSection === "archive" ? "active" : ""
                    }`}
                  onClick={() => handleSetActive("archive")}
                >
                  <Archive size={18} className="icon" />
                  <span className="sidebar-letters">Archived</span>
                  {archivedCount > 0 && (
                    <span className="count-badge">{archivedCount}</span>
                  )}
                </Link>
              </li>

              <li>
                <Link
                  to={`/class/${id}/classdetailpage/trash`}
                  className={`sidebar-contents ${activeSection === "trash" ? "active" : ""
                    }`}
                  onClick={() => handleSetActive("trash")}
                >
                  <Trash2 size={18} className="icon" />
                  <span className="sidebar-letters">Trashed</span>
                  {trashedCount > 0 && (
                    <span className="count-badge">{trashedCount}</span>
                  )}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Modals */}
      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={() => dispatch(setIsAddStudentModalOpen(false))}
      />

      <AddTagModal
        isOpen={isNewTagModalOpen}
        onClose={() => setIsNewTagModalOpen(false)}
      />
    </div>
  );
};

export default ClassDetailPageSideMenu;
