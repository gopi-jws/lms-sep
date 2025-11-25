import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Users,
  Archive,
  Trash2,
  Plus,
  FolderSync
} from "lucide-react";
import { toast } from "react-toastify";
import NewTeacherModal from "../../../ReusableComponents/NewTeacherModal/NewTeacherModal";
import AddFolderModal from "../../../ReusableComponents/AddFolderModal/AddFolderModal";
import TagActionsDropdown from "../../../ReusableComponents/TagActionsDropdown/TagActionsDropdown";
import { useDispatch, useSelector } from "react-redux";
import { setIsNewTeacherModalOpen } from "../../../../slices/allTeacher";
import "./TeachersSidebar.css";

const TeachersSidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(null);
  const [activeSection, setActiveSection] = useState("AllTeachers");
  const [folders, setFolders] = useState(["Folder 1", "Folder 2"]);
  const [modalHeading, setModalHeading] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const isNewTeacherModalOpen = useSelector(
    (state) => state.AllTeacher.isNewTeacherModalOpen
  );

  // 🎯 Automatically update active section based on current path
  useEffect(() => {
    if (location.pathname.endsWith("/allteachers")) {
      setActiveSection("AllTeachers");
    } else if (location.pathname.endsWith("/archived")) {
      setActiveSection("archived");
    } else if (location.pathname.endsWith("/trashed")) {
      setActiveSection("trashed");
    } else {
      setActiveSection("AllTeachers"); // default
    }
  }, [location.pathname]);

  // 🎯 Manual click (mainly closes mobile sidebar)
  const handleSetActive = (section) => {
    setActiveSection(section);
    setIsMobileOpen(false);
  };

  const popup = () =>
    toast.success(`Added Teacher Successfully`, {
      position: "top-right",
      autoClose: 3000,
    });

  const handleFolderClick = (index) => {
    setShowMoreOptions(showMoreOptions === index ? null : index);
  };

  const handleAddFolder = ({ name, color }) => {
    console.log("New Folder Created:", { name, color });
  };

  const iconColors = ["#f44336", "#2196f3", "#ff9800", "#9c27b0"];

  return (
    <div className="sidebar-wrapper">
      {isMobileOpen && (
        <div className="mobile-overlay" onClick={() => setIsMobileOpen(false)} />
      )}

      <nav
        className={`test-sidebar-container ${isMobileOpen ? "mobile-open" : ""}`}
        aria-label="Main Navigation"
      >
        <div className="test-sidebar-header">
          <div className="w-100 d-flex justify-content-center">
            <button
              onClick={() => dispatch(setIsNewTeacherModalOpen(true))}
              className="allbuttons"
            >
              <span className="sidebar-letters">New Teacher</span>
            </button>
          </div>
        </div>

        <div className="test-sidebar-scroll">
          <div className="test-sidebar-section">
            <ul className="test-sidebar-menu">
              <li>
                <Link
                  to="/teachers/allteachers"
                  className={`sidebar-contents ${activeSection === "AllTeachers" ? "active" : ""
                    }`}
                  onClick={() => handleSetActive("AllTeachers")}
                >
                  <Users className="icon" size={18} />
                  <span className="sidebar-letters">All Teachers</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/teachers/archived"
                  className={`sidebar-contents ${activeSection === "archived" ? "active" : ""
                    }`}
                  onClick={() => handleSetActive("archived")}
                >
                  <Archive className="icon" size={18} />
                  <span className="sidebar-letters">Archived</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/teachers/trashed"
                  className={`sidebar-contents ${activeSection === "trashed" ? "active" : ""
                    }`}
                  onClick={() => handleSetActive("trashed")}
                >
                  <Trash2 className="icon" size={18} />
                  <span className="sidebar-letters">Trashed</span>
                </Link>
              </li>
            </ul>
          </div>

          <hr />

          <div className="test-sidebar-section">
            <li className="sidebar-section-title">Folders</li>

            <button
              className="newtag"
              onClick={() => {
                setIsFolderModalOpen(true);
                setModalHeading("New Folder");
              }}
            >
              <Plus className="icon" size={18} />
              <span className="sidebar-letters">New Folder</span>
            </button>

            <ul className="test-sidebar-menu tags">
              {folders.map((folder, index) => (
                <li key={index} className="tag-item">
                  <Link className="sidebar-contents">
                    <FolderSync
                      className="icon"
                      size={18}
                      style={{ color: iconColors[index % iconColors.length] }}
                    />
                    <div className="w-100 d-flex justify-content-between align-items-center">
                      <span className="sidebar-letters">{folder}</span>

                      <button className="tag-button">
                        <span
                          className="tag-dropdown-toggle"
                          onClick={() => handleFolderClick(index)}
                        ></span>
                      </button>

                      <TagActionsDropdown
                        isOpen={showMoreOptions === index}
                        onEdit={() => {
                          setIsFolderModalOpen(true);
                          setShowMoreOptions(null);
                          setModalHeading("Edit ");
                          setSelectedSection(folders[index]);
                        }}
                        onRemove={() => setShowMoreOptions(null)}
                        onClose={() => setShowMoreOptions(null)}
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <p
              className="sidebar-contents"
              style={{ fontStyle: "italic" }}
              onClick={popup}
            >
              Uncategorized <span className="number">(5)</span>
            </p>
          </div>
        </div>
      </nav>

      {/* Modals */}
      <NewTeacherModal
        isOpen={isNewTeacherModalOpen}
        onClose={() => dispatch(setIsNewTeacherModalOpen(false))}
      />

      <AddFolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onAddFolder={handleAddFolder}
        heading={modalHeading}
        selectedSection={selectedSection}
      />
    </div>
  );
};

export default TeachersSidebar;
