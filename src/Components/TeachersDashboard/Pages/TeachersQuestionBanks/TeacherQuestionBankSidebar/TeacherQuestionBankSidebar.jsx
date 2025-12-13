"use client"

import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Database,
  Folder,
  Plus,
  FileText,
  Archive,
  Trash2,
  Tag,
  Menu,
  X,
  FolderKanban,
  FolderSync
} from "lucide-react";

import { useSelector , useDispatch } from "react-redux";
import { addNewQB } from "../../../../../slices/allQuestionBank"
import TagActionsDropdown from "../../../../ReusableComponents/TagActionsDropdown/TagActionsDropdown";
import NewQBModal from "../../../../ReusableComponents/NewQBModal/NewQBModal";
import AddFolderModal from "../../../../ReusableComponents/AddFolderModal/AddFolderModal";
import AddTagsComponent from "../../../../ReusableComponents/AddTagsComponent/AddTagsComponent";

const TeacherQuestionBankSidebar = ({ foldersIteam = [], setFoldersIteam, isMobileOpen, setIsMobileOpen, createNewQuestionBank }) => {
  const [folders, setFolders] = useState(() => {
    const storedFolders = localStorage.getItem("teacherFolders");
    return storedFolders ? JSON.parse(storedFolders) : [];
  });

  const [modalHeading, setModalHeading] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [qbs, setQBs] = useState([]);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testName, setTestName] = useState("");
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [editedFolderName, setEditedFolderName] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("questionBank");
  const [showMoreOptions, setShowMoreOptions] = useState(null);
  const [isNewTagModalOpen, setIsNewTagModalOpen] = useState(false);
  const [selectedFolder, setselectedFolder] = useState(null);

  
  const dispatch = useDispatch();
  const isQbModalOpen = useSelector((state) => state.AllQuestionBank.openNewQB);

  console.log("isQbModalOpen " + isQbModalOpen);
  

  const iconColors = ['#f44336', '#2196f3', '#ff9800', '#9c27b0'];
  const dropdownRef = useRef(null);
  const toggleRef = useRef(null);
  const sidebarRef = useRef(null);

  const location = useLocation();

  const handleTagClick = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMoreOptions(showMoreOptions === index ? null : index);
    setselectedFolder({id:foldersIteam[index].id,name:foldersIteam[index].name,color:foldersIteam[index].color})
  };

  const handleEditFolder = (folder) =>{
    setIsFolderModalOpen(true);
    setShowMoreOptions(null);
    setModalHeading("Edit Folder");
    setEditingFolder(folder);
  }

  const handleAddFolder = ({ name, color }) => {
    if (editingFolder) {
      setFoldersIteam(prev =>
        prev.map(f =>
          f.id === editingFolder.id
            ? { ...f, name, color }
            : f
        )
      );
      setEditingFolder(null);
    } else {
      setFoldersIteam(prev => [
        ...prev,
        {
          id: prev.length > 0 ? Math.max(...prev.map(f => f.id)) + 1 : 1,
          name,
          color,
          QB:[],
        },
      ]);
    }
  };

  const handleRemoveTag = (folder) =>{
    setselectedFolder(folder);
    setModalHeading("Delete Folder");
    setIsRemoveModalOpen(true)
  }

  const removeFolder = (removeFolder) =>{
    setFoldersIteam(prev => prev.filter(foldersIteam => foldersIteam.id !== removeFolder.id))
  }

  const handleCreateQB = (qbName) => {
    console.log(qbName);
    
    setQBs([...qbs, qbName]);
  };

  const addNewFolder = () => {
    const newFolder = {
      id: Date.now(),
      name: `New Folder ${folders.length + 1}`,
    };
    setFolders([...folders, newFolder]);
  };

  const startEditingFolder = (id, name) => {
    setEditingFolderId(id);
    setEditedFolderName(name);
  };

  const saveFolderName = (id) => {
    const updatedFolders = folders.map((folder) =>
      folder.id === id ? { ...folder, name: editedFolderName } : folder
    );
    setFolders(updatedFolders);
    setEditingFolder(null);
    setEditedFolderName("");
  };

  const deleteFolder = (id) => {
    setFolders(folders.filter((folder) => folder.id !== id));
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
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

      {/* Sidebar Container */}
      <nav className={`test-sidebar-container test-sidebar-container-option ${isMobileOpen ? "mobile-open" : ""}`} aria-label="Question Bank Navigation" >
        <div className="test-sidebar-header">
          {/* <div className="w-100 d-flex justify-content-center">
            <button
              onClick={() => dispatch(addNewQB(true))}
              className="allbuttons"
              aria-label="Create New Question Bank"
            >
              <span className="sidebar-letters">New QB</span>
            </button>
          </div> */}
        </div>

        <div className="test-sidebar-scroll">
          <div className="test-sidebar-section">
            <ul className="test-sidebar-menu">
              <li>
                <Link
                  to="/teachers-dashboard/question-banks"
                  className={`sidebar-contents ${isActive("/teachers-dashboard/question-banks") ? "active" : ""}`}
                  aria-label="All Question Banks"
                  onClick={() => handleSetActive("all")}
                >
                  <FileText className="icon" size={20} />
                  <span className="sidebar-letters">All QB</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/teachers-dashboard/question-banks/archive"
                  className={`sidebar-contents ${isActive("/teachers-dashboard/question-banks/archive") ? "active" : ""}`}
                  aria-label="Archived"
                  onClick={() => handleSetActive("archived")}
                >
                  <Archive className="icon" size={20} />
                  <span className="sidebar-letters">Archived</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/teachers-dashboard/question-banks/trash"
                  className={`sidebar-contents ${isActive("/teachers-dashboard/question-banks/trash") ? "active" : ""}`}
                  aria-label="Trashed"
                  onClick={() => handleSetActive("trashed")}
                >
                  <Trash2 className="icon" size={20} />
                  <span className="sidebar-letters">Trashed</span>
                </Link>
              </li>
            </ul>
          </div>
          <hr />
          <div className="test-sidebar-section">
            <li className="sidebar-section-title">My Folders</li>
            <button
              className="newtag"
              aria-label="Create New Folder"
              onClick={() => {
                setIsFolderModalOpen(true);
                setModalHeading("New Folder");
                setEditingFolder(null)
                setModalHeading("Create New Folder")
              }}
            >
              <Plus className="icon" size={20} />
              <span className="sidebar-letters">New Folder</span>
            </button>
            <ul className="test-sidebar-menu tags">
              {foldersIteam.map((folder, index) => (
                <li key={index} className="tag-item">
                  <Link className="sidebar-contents">
                    <FolderSync
                      className="icon"
                      size={20}
                      color={folder.color}
                    />
                    <div className="w-100 d-flex justify-content-between align-items-center">
                      <span className="sidebar-letters tag-letters-container">
                        <span className="tag-name-wrapper">
                          <span className="tag-name-text">
                            {folder.name}
                          </span>
                        </span>
                        <span className="tag-count">
                          ({folder.QB?.length})
                        </span>
                      </span>

                      <button className="tag-button" ref={toggleRef}>
                        <span
                          className="tag-dropdown-toggle"
                          onClick={(e) => handleTagClick(e, index)}
                        ></span>
                      </button>

                      <TagActionsDropdown
                        isOpen={showMoreOptions === index}
                        onEdit={() => {handleEditFolder(folder)}}
                        onRemove={() => {handleRemoveTag(folder)}}
                        onClose={() => setShowMoreOptions(null)}
                        folderId={selectedFolder?.id}
                        folderName={selectedFolder?.name}
                        folderColor={selectedFolder?.color}
                        mode="folder"
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

        </div>

        {/* Remove Folder */}
        <NewQBModal
                isOpen={isRemoveModalOpen}
                onClose={() => {
                  setIsRemoveModalOpen(false);
                  selectedFolder(null);
                }}
                mode="delete"
                selectedFolder={selectedFolder}
                heading={modalHeading}
                onSubmit={() => {
                  removeFolder(selectedFolder);
                  setIsRemoveModalOpen(false);
                  selectedFolder(null);
                }}
          />
        
        
        <AddFolderModal
          isOpen={isFolderModalOpen}
          onClose={() => { setIsFolderModalOpen(false); setEditingFolder(null); }}
          onAddFolder={handleAddFolder}
          heading={modalHeading}
          selectedSection={editingFolder}
        />

        <AddTagsComponent
          isOpen={isTagModalOpen}
          onClose={() => setIsTagModalOpen(false)}
        />
      </nav>
 
      {/* Modals */}
      <NewQBModal
        isOpen={isQbModalOpen}
        heading="Create New QB"
        onClose={() => dispatch(addNewQB(false))}
        onSubmit={() => dispatch(addNewQB(false))}
        mode="create"
      />

    </div>
  );
};

export default TeacherQuestionBankSidebar;