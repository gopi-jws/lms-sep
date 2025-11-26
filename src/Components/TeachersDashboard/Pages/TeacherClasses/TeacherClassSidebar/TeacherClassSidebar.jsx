import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FileText,
  Archive,
  Trash2,
  FolderSync,
  Plus
} from "lucide-react";


const TeacherClassSidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();
  const [folders] = useState(["Folder 1", "Folder 2"]);
  const iconColors = ["#f44336", "#2196f3", "#ff9800", "#9c27b0"];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar-wrapper">
      <nav
        className={`test-sidebar-container ${isMobileOpen ? "mobile-open" : ""}`}
        aria-label="Teacher Class Navigation"
      >
        {/* ❌ Teacher cannot create classes – remove "New Class" button */}

        <div className="test-sidebar-scroll">
          {/* MAIN SECTION */}
          <div className="test-sidebar-section">
            <ul className="test-sidebar-menu">
              <li>
                <Link
                  to="/teachers-dashboard/classes"
                  className={`sidebar-contents ${
                    isActive("/teachers-dashboard/classes") ? "active" : ""
                  }`}
                >
                  <FileText className="icon" size={20} />
                  <span className="sidebar-letters">All Classes</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/teachers-dashboard/classes/archive"
                  className={`sidebar-contents ${
                    isActive("/teachers-dashboard/classes/archive")
                      ? "active"
                      : ""
                  }`}
                >
                  <Archive className="icon" size={20} />
                  <span className="sidebar-letters">Archived</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/teachers-dashboard/classes/trash"
                  className={`sidebar-contents ${
                    isActive("/teachers-dashboard/classes/trash")
                      ? "active"
                      : ""
                  }`}
                >
                  <Trash2 className="icon" size={20} />
                  <span className="sidebar-letters">Trashed</span>
                </Link>
              </li>
            </ul>
          </div>

          <hr />

          {/* FOLDERS SECTION */}
          <div className="test-sidebar-section">
            <li className="sidebar-section-title">Folders</li>

            <ul className="test-sidebar-menu tags">
              {folders.map((folder, index) => (
                <li key={index} className="tag-item">
                  <div className="sidebar-contents">
                    <FolderSync
                      size={18}
                      className="icon"
                      style={{
                        color: iconColors[index % iconColors.length]
                      }}
                    />

                    <span className="sidebar-letters">{folder}</span>
                  </div>
                </li>
              ))}
            </ul>

            <p className="sidebar-contents" style={{ fontStyle: "italic" }}>
              Uncategorized <span className="number">(5)</span>
            </p>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default TeacherClassSidebar;
