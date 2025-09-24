"use client"

import React, { useState, useRef } from "react";
import "./TestAddSideabr.css";
import {
  PlusCircle,
  Tag,
  Award,
  Clock,
  FileText,
  Plus,
  ListChecks,
  X,
  Menu,
  BookOpen,
  Trash2,   
  MinusCircle,
  ChevronDown, Edit, Settings, MoreVertical ,
  Bookmark  
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link, useLocation, useParams } from "react-router-dom";
import TagActionsDropdown from "../../../ReusableComponents/TagActionsDropdown/TagActionsDropdown";
import AddTagsComponent from "../../../ReusableComponents/AddTagsComponent/AddTagsComponent";
import AddFolderModal from "../../../ReusableComponents/AddFolderModal/AddFolderModal";
import useOutsideClick from '../../../../hooks/useOutsideClick'; // adjust path
const TestAddSidebar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const handleNewQuestionClick = () => {
    const id = "1";
    sessionStorage.setItem("testQuestionData", JSON.stringify({ id }));
    window.open(`/lms-sep/test/${id}/movetest/testquestionadd`, "_blank");
  };

  const handleAddFolder = ({ name, color }) => {
    console.log("New Folder Created:", { name, color });
  };

  const initialSections = [
    { name: "Physics", tag: "Physics", color: "#ff6b6b" },
    { name: "Chemistry", tag: "Chemistry", color: "#4caf50" },
    { name: "Maths", tag: "Math", color: "#2196f3" },
  ];
  // Inside your component
  const dropdownRef = useRef(null);

  useOutsideClick(dropdownRef, () => {
    setShowDescDropdown(false); // or setShowInstrDropdown(false)
  });
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sections, setSections] = useState(initialSections);
  const [newSection, setNewSection] = useState({ name: "", color: "#000000" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [tags, setTags] = useState(["Section 1", "Section 2"]);
  const iconColors = ['#f44336', '#2196f3', '#ff9800', '#9c27b0'];
  const [modalHeading, setModalHeading] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [testInfo] = useState({
    marks: 100,
    noOfQuestions: 50,
    negativeMarks: -0.25,
    duration: "2h",
  });
  const [showDescDropdown, setShowDescDropdown] = useState(false);
  const [showInstrDropdown, setShowInstrDropdown] = useState(false);

  const handleTagClick = (index) => {
    setShowMoreOptions(showMoreOptions === index ? null : index);
  };

  const handleAddSection = () => {
    if (newSection.name.trim() === "") {
      alert("Please enter a section name.");
      return;
    }

    setSections([
      ...sections,
      {
        name: newSection.name,
        tag: newSection.name,
        color: newSection.color,
      },
    ]);

    setNewSection({ name: "", color: "#000000" });
    setDropdownOpen(false);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleSetActive = (section) => {
    setActiveSection(section);
    setIsMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar-wrapper">
      {/* Mobile Overlay */}
      {isMobileOpen && <div className="mobile-overlay" onClick={() => setIsMobileOpen(false)} />}

      {/* Sidebar Container */}
      <nav className={`test-sidebar-container ${isMobileOpen ? "mobile-open" : ""}`} aria-label="Test Navigation">
        <div className="test-sidebar-header">
          <div className="w-100 d-flex justify-content-center">
            <button
              onClick={handleNewQuestionClick}
              className="allbuttons"
              aria-label="Add New Question"
            >
              <span className="sidebar-letters">Add Question</span>
            </button>
          </div>
        </div>
         
        <div className="test-sidebar-scroll">

          <div className=" test-sidebar-section">
            <h3 className=" test-sidebar-section snap-chat-btn">Snap Shot</h3>
          </div>

          <hr />

          <div className="test-sidebar-section">
            <h3 className="sidebar-section-title">Sections</h3>
            <ul className="test-sidebar-menu">
              <div className="sidebar-section">
                <button
                  className="newtag"
                  aria-label="Create New Section"
                  onClick={() => {
                    setIsFolderModalOpen(true);
                    setModalHeading("New Section");
                  }}
                >
                  <Plus className="icon" size={20} />
                  <span className="sidebar-letters">New Section</span>
                </button>

                <ul className="test-sidebar-menu tags">
                  {tags.map((tag, index) => (
                    <li key={index} className="tag-item">
                      <Link
                        className="sidebar-contents"
                        aria-label={`Tag: ${tag}`}
                      >
                        <Tag
                          className="icon"
                          size={20}
                          color={iconColors[index % iconColors.length]}
                        />
                        <div className="w-100 d-flex justify-content-between align-items-center">
                          <span className="sidebar-letters">{tag}</span>
                          <button className="tag-button">
                            <span className="tag-dropdown-toggle" onClick={() => handleTagClick(index)}></span>
                          </button>
                          <TagActionsDropdown
                            isOpen={showMoreOptions === index}
                            onEdit={() => {
                              setIsFolderModalOpen(true);
                              setModalHeading("Edit");
                              setSelectedSection(tags[index]);
                              setShowMoreOptions(null);
                            }}
                            onRemove={() => setShowMoreOptions(null)}
                            onClose={() => setShowMoreOptions(null)}
                          />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>

                <p className="sidebar-contents" style={{ fontStyle: "italic" }}>
                  Uncategorized<span className="number">(5)</span>
                </p>
              </div>

            </ul>
          </div>
          <hr></hr>
          <div className="test-sidebar-section">
            <h3 className="sidebar-section-title">Test Information</h3>
            <ul>
              <li>
                <Link to="#" className={`sidebar-contents ${isActive("") ? "active" : ""}`}>
                  <Award className="icon" size={20} />
                  <span className="sidebar-letters">Marks : (10)</span>
                </Link>
              </li>
              <li>
                <Link to="#" className={`sidebar-contents ${isActive("") ? "active" : ""}`}>
                  <ListChecks className="icon" size={20} />
                  <span className="sidebar-letters">No. of Q : (10)</span>
                </Link>
              </li>
              <li>
                <Link to="#" className={`sidebar-contents ${isActive("") ? "active" : ""}`}>
                  <MinusCircle className="icon" size={20} />
                  <span className="sidebar-letters">Neg : (10)</span>
                </Link>
              </li>

              <li>
                <Link to="#" className={`sidebar-contents ${isActive("") ? "active" : ""}`}>
                  <Clock className="icon" size={20} />
                  <span className="sidebar-letters">Duration : (10)</span>
                </Link>
              </li>
              <li className="dropdown-container">
                <div className={`sidebar-contents ${isActive("") || showDescDropdown ? "active" : ""}`}>
                  <div className="d-flex align-items-center gap-2 w-100 justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <FileText className="icon" size={20} />
                      <span className="sidebar-letters">Description</span>
                    </div>
                    <div className="dropdown-icon-container">
                      <button
                        className="dropdown-toggle3"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent bubbling
                          setShowDescDropdown(!showDescDropdown);
                          setShowInstrDropdown(false);
                        }}
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {showDescDropdown && (
                  <div className="Description-dropdown" ref={dropdownRef}>
                    <button
                      className="Description-option"
                      onClick={() => {
                        console.log("Edit Description");
                        setShowDescDropdown(false);
                      }}
                    >
                      <Edit size={16} />
                      <span>Edit</span>
                    </button>
                    <button
                      className="Description-option"
                      onClick={() => {
                        console.log("Settings clicked");
                        setShowDescDropdown(false);
                      }}
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </button>
                  </div>
                )}
              </li>


              <li className="dropdown-container">
                <div className={`sidebar-contents ${isActive("") ? "active" : ""}`}>
                  <div className="d-flex align-items-center gap-2 w-100 justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <BookOpen className="icon" size={20} />
                      <span className="sidebar-letters">Instruction</span>
                    </div>
                    <div className="dropdown-icon-container">
                      <button
                        className="dropdown-toggle3"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowInstrDropdown(!showInstrDropdown);
                          setShowDescDropdown(false);
                        }}
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {showInstrDropdown && (
                  <div className="Description-dropdown" ref={dropdownRef}>
                    <button className="Description-option" onClick={() => console.log("Edit Instruction")}>
                      <Edit size={16} />
                      <span>Edit</span>
                    </button>
                    <button className="Description-option" onClick={() => console.log("Settings")}>
                      <Settings size={16} />
                      <span>Settings</span>
                    </button>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>

        <AddTagsComponent
          isOpen={isTagModalOpen}
          onClose={() => setIsTagModalOpen(false)}
        />
      </nav>

      {/* Mobile Toggle Button */}
      <button
        className={`mobile-toggle-btn ${isMobileOpen ? "sidebar-open" : ""}`}
        onClick={toggleMobileSidebar}
        aria-label="Toggle sidebar"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

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

export default TestAddSidebar;