"use client"

import React, { useState, useEffect, useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  FileText,
  Archive,
  Trash2,
  Folder,
  Tag,
  Plus,
  ChevronDown,
  ChevronUp,
  X,
  Menu,
  BookOpen,
  Users ,
  FolderSync
} from "lucide-react"
import AddTagsComponent from "../../../ReusableComponents/AddTagsComponent/AddTagsComponent"
import AddClassModal from "../../../ReusableComponents/AddClassModal/AddClassModal"
import AddFolderModal from "../../../ReusableComponents/AddFolderModal/AddFolderModal"
import TagActionsDropdown from "../../../ReusableComponents/TagActionsDropdown/TagActionsDropdown"
import "./classsidemenu.css"

const ClassSideMenu = ({ archivedCount, trashedCount }) => {
  // const [folders, setFolders] = useState(() => {
  //   const storedFolders = localStorage.getItem("folders")
  //   return storedFolders ? JSON.parse(storedFolders) : []
  // })
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false)
  const [isNewClassModalOpen, setIsNewClassModalOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [testName, setTestName] = useState("")
  const [editingFolderId, setEditingFolderId] = useState(null)
  const [editedFolderName, setEditedFolderName] = useState("")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isTagModalOpen, setIsTagModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("questionBank")
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const iconColors = ['#f44336', '#2196f3', '#ff9800', '#9c27b0']
  const [folders, setFolders] = useState(["Folder 1", "Folder 2"]);
  const [modalHeading, setModalHeading] = useState("")
  const [selectedSection, setSelectedSection] = useState("")
  const dropdownRef = useRef(null)
  const location = useLocation();
  // Mobile toggle function
  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  const handleSetActive = (section) => {
    setActiveSection(section)
    setIsMobileOpen(false)
  }

  const handleTagClick = (index) => {
    setShowMoreOptions(showMoreOptions === index ? null : index)
  }

  const handleAddFolder = ({ name, color }) => {
    console.log("New Folder Created:", { name, color })
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTestName("")
  }

  const handleCreateTest = () => {
    if (testName.trim() !== "") {
      console.log("New Test Created:", testName)
    }
    handleCloseModal()
  }

  useEffect(() => {
    localStorage.setItem("folders", JSON.stringify(folders))
  }, [folders])

  const addNewFolder = () => {
    const newFolder = {
      id: Date.now(),
      name: `New Folder ${folders.length + 1}`,
    }
    setFolders([...folders, newFolder])
  }


  const isActive = (path) => location.pathname === path;
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMoreOptions(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="sidebar-wrapper">
      {/* Mobile Overlay */}
      {isMobileOpen && <div className="mobile-overlay" onClick={() => setIsMobileOpen(false)} />}

      {/* Sidebar Container */}
      <nav className={`test-sidebar-container ${isMobileOpen ? "mobile-open" : ""}`} aria-label="Class Navigation">
        <div className="test-sidebar-header">
          <div className="w-100 d-flex justify-content-center">
              <button className="allbuttons" aria-label="Create New Class" onClick={()=>setIsNewClassModalOpen(true)}>
                <span className="sidebar-letters">New Class</span>
              </button>
          </div>
        </div>

        <div className="test-sidebar-scroll">
           <div className="test-sidebar-section">
          <ul className="test-sidebar-menu">
   
            <li>
              <Link
                to="/class"
                className={`sidebar-contents ${isActive("/class") ? "active" : ""}`}
                aria-label="All Classes"
                onClick={() => handleSetActive("allClasses")}
              >
                <FileText className="icon" size={20} />
                <span className="sidebar-letters">All Classes</span>
              </Link>
            </li>

            <li>
              <Link
                to="/class/archivepage"
                className={`sidebar-contents ${isActive("/class/archivepage") ? "active" : ""}`}
                onClick={() => handleSetActive("archived")}
              >
                <Archive className="icon" size={20} />
                <span className="sidebar-letters">Archived</span>
              </Link>
            </li>

            <li>
              <Link
                to="/class/trashPage"
                className={`sidebar-contents ${isActive("/class/trashPage") ? "active" : ""}`}
                onClick={() => handleSetActive("trashed")}
              >
                <Trash2 className="icon" size={20} />
                <span className="sidebar-letters">Trashed</span>
              </Link>
            </li>
          </ul>
        </div>
        <hr/>
        <div className="test-sidebar-section">
          <li className="sidebar-section-title">Folders</li>
          <button
            className="newtag"
            aria-label="Create New Folder"
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
                <Link
                  className="sidebar-contents"
                  aria-label={`Folder: ${folder}`}
                >
                  <FolderSync
                    className="icon"
                    size={18}
                    style={{
                      color: iconColors[index % iconColors.length],
                    }}
                  />
                  <div className="w-100 d-flex justify-content-between align-items-center">
                    <span className="sidebar-letters">{folder}</span>

                    <button className="tag-button">
                      <span className="tag-dropdown-toggle" onClick={() => handleFolderClick(index)}></span>
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

          <p className="sidebar-contents" style={{ fontStyle: "italic" }}> Uncategorized<span className="number">(5)</span></p>
        </div>
        </div>
      </nav>

      {/* Mobile Toggle Button */}
      <button
        className={`mobile-toggle-btn ${isMobileOpen ? "sidebar-open" : ""}`}
        onClick={toggleMobileSidebar}
        aria-label="Toggle sidebar"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>


      {isNewClassModalOpen && (
        <AddClassModal
          omOpen={isNewClassModalOpen}
          onClose={() => setIsNewClassModalOpen(false)}
        />
      )}
      
      
      <AddFolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onAddFolder={handleAddFolder}
        heading={modalHeading}
        selectedSection={selectedSection}
      />
      <AddTagsComponent
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
      />
    </div>
  )
}

export default ClassSideMenu