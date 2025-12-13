"use client"

import React, { useState, useEffect, useRef } from "react"
import { Link, useLocation, useParams } from "react-router-dom"
import { BiSolidRename } from "react-icons/bi"
import { FaFilePdf, FaEdit, FaFolderPlus } from "react-icons/fa"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faChevronDown } from "@fortawesome/free-solid-svg-icons";

import {
  Trash2,
  Folder,
  Tag,
  Plus,
  Share2,
  Send,
  Archive,
  List,
  ListOrdered,
  Calculator,
  CheckSquare,
  Text,
  X,
  Menu,
  ChevronDown,
  ChevronUp,
  FileText,
  Check,
  X as XIcon,
  FolderOpen,
  BookOpen,
  FileQuestion,
  ListChecks
} from "lucide-react"

import { useSelector, useDispatch } from "react-redux"
import TagActionsDropdown from "../../../../ReusableComponents/TagActionsDropdown/TagActionsDropdown"
import AddFolderModal from "../../../../ReusableComponents/AddFolderModal/AddFolderModal"
import AddTagsComponent from "../../../../ReusableComponents/AddTagsComponent/AddTagsComponent"
// import { addNewQuestionQB } from "../../../../../slices/addQuestionBank"

const TeacherQbQuestionsSidemenu = ({ isMobileOpen, setIsMobileOpen, hideQuestionType }) => {

  console.log(isMobileOpen);
  
  const { id } = useParams()
  const [folders, setFolders] = useState(() => {
    const storedFolders = localStorage.getItem("teacherFolders")
    return storedFolders ? JSON.parse(storedFolders) : []
  })
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false)
 // const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null);

  // Add this near the top of your component
  const dropdownRef = useRef(null);
  
  //Get the value for Redux
  const dispatch = useDispatch();
  const isDropdownOpen = useSelector((state) => state.AddQuestionQB.openAddQuestionQB);
  
  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev)
  }
  
  const handleCloseDropdown = () => {
    setIsDropdownOpen(false)
  }
  
  const questionTypeRef = useRef(null);
  const settingsRef = useRef(null); // <-- missing earlier
  // For both dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedInsideQuestionButton =
        dropdownRef.current && dropdownRef.current.contains(event.target);

      // ✅ handles even if modal is rendered via portal
      const clickedInsideQuestionList =
        event.target.closest(".list-of-questions-type");

      const clickedInsideSettingsButton =
        settingsRef.current && settingsRef.current.contains(event.target);

      // ✅ Close both only if clicked outside everything
      if (
        !clickedInsideQuestionButton &&
        !clickedInsideQuestionList &&
        !clickedInsideSettingsButton
      ) {
        dispatch(addNewQuestionQB(false));
        setOpenDropdown(false);
      }
    };

    if (isDropdownOpen || openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, openDropdown, dispatch]);

  const [testName, setTestName] = useState("")
  const [editingFolderId, setEditingFolderId] = useState(null)
  const [editedFolderName, setEditedFolderName] = useState("")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isTagModalOpen, setIsTagModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("questionBank")
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const iconColors = ['#f44336', '#2196f3', '#ff9800', '#9c27b0']
  const [tags, setTags] = useState(["Folder 1 (10)", "Folder 2 (20)"])
  const [isManageHomeVisible, setManageHomeVisible] = useState(true)
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
 
     useEffect(() => {
         const handleResize = () => {
             setScreenWidth(window.innerWidth);
         };
 
         // ✅ Add listener
         window.addEventListener("resize", handleResize);
 
         // ✅ Call once on mount
         handleResize();
 
         // ✅ Clean up on unmount
         return () => window.removeEventListener("resize", handleResize);
     }, []);

 // const [isMobileOpen, setIsMobileOpen] = useState(false)
  const handleTagClick = (index) => {
    setShowMoreOptions(showMoreOptions === index ? null : index)
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

  const typeCounts = {
    "SAQ-1": 10,
    "MAQ-2": 5,
    "Numerical": 3,
    "True/False": 7,
    "Descriptive": 2,
  }

  const location = useLocation()
  const [activeTag, setActiveTag] = useState("")

  useEffect(() => {
    localStorage.setItem("teacherFolders", JSON.stringify(folders))
  }, [folders])

  const addNewFolder = () => {
    const newFolder = {
      id: Date.now(),
      name: `New Folder ${folders.length + 1}`,
    }
    setFolders([...folders, newFolder])
  }

  const startEditingFolder = (id, name) => {
    setEditingFolderId(id)
    setEditedFolderName(name)
  }

  const saveFolderName = (id) => {
    const updatedFolders = folders.map((folder) =>
      folder.id === id ? { ...folder, name: editedFolderName } : folder
    )
    setFolders(updatedFolders)
    setEditingFolderId(null)
    setEditedFolderName("")
  }

  const deleteFolder = (id) => {
    setFolders(folders.filter((folder) => folder.id !== id))
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section)
  }

  const isActive = (path) => location.pathname === path
  const toggleManageHomeVisibility = () => {
    setManageHomeVisible(!isManageHomeVisible)
  }

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  const handleSetActive = (section) => {
    setActiveSection(section)
    // Close mobile sidebar when a link is clicked
    setIsMobileOpen(false)
  }

  const handleSettingsClick = () => {
    setOpenDropdown(!openDropdown);
  };


  return (
    <div className="sidebar-wrapper">

      <nav className={`test-sidebar-container ${isMobileOpen ? "mobile-open" : ""}`} aria-label="Main Navigation">
        <div className="test-sidebar-header">
          
          {/* <div className="w-100 d-flex justify-content-center" ref={dropdownRef}>
              <button
                className="allbuttons"
                aria-label="Create New Question"
                onClick={() => dispatch(addNewQuestionQB(!isDropdownOpen))}
              >
              <span className="sidebar-letters">New Question</span>
              </button>

            <ListOfQuestionsType
              isOpen={isDropdownOpen}
              onClose={() => dispatch(addNewQuestionQB(false))}
            />
          </div> */}
        </div>

        <div className="test-sidebar-scroll">
          <div className="test-sidebar-section">
            <ul className="test-sidebar-menu">
              <li className="sidebar-section-title">All Questions</li>
              <li>
                <Link
                  to={`/teacher/QuestionBank/Trashed/${id}/add`}
                  className={`sidebar-contents ${isActive(`/teacher/QuestionBank/Trashed/${id}/add`) ? "active" : ""}`}
                >
                  <Trash2 className="icon" size={20} />
                  <span className="sidebar-letters">Trashed</span>
                </Link>
              </li>
            </ul>
          </div>

          <hr />

          <div className="test-sidebar-section">
            <ul className="test-sidebar-menu">
              <li className="sidebar-section-title">Question Types</li>

              <li>
                <Link
                  to="#"
                  className={`sidebar-contents ${isActive("") ? "active" : ""}`}
                >
                  <ListChecks className="icon" size={20} />
                  <span className="sidebar-letters">SAQ (10)</span>
                </Link>
              </li>

              <li>
                <Link
                  to="#"
                  className={`sidebar-contents ${isActive("") ? "active" : ""}`}
                >
                  <ListChecks className="icon" size={20} />
                  <span className="sidebar-letters">MAQ (10)</span>
                </Link>
              </li>

              <li>
                <Link
                  to="#"
                  className={`sidebar-contents ${isActive("") ? "active" : ""}`}
                >
                  <Calculator className="icon" size={20} />
                  <span className="sidebar-letters">Numerical (10)</span>
                </Link>
              </li>

              <li>
                <Link
                  to="#"
                  className={`sidebar-contents ${isActive("") ? "active" : ""}`}
                >
                  <CheckSquare className="icon" size={20} />
                  <span className="sidebar-letters">True/False (10)</span>
                </Link>
              </li>

              <li>
                <Link
                  to="#"
                  className={`sidebar-contents ${isActive("") ? "active" : ""}`}
                >
                  <FileText className="icon" size={20} />
                  <span className="sidebar-letters">Descriptive (10)</span>
                </Link>
              </li>
            </ul>
          </div>
          <hr></hr>
          <div className="test-sidebar-section">
            <li className="sidebar-section-title">My Categories</li>
            <ul>
              <li>
                <button
                  className="sidebar-contents newtag"
                  aria-label="Create New Category"
                  onClick={() => setIsFolderModalOpen(true)}
                >
                  <Plus className="icon" size={20} />
                  <span className="sidebar-letters">New Category</span>
                </button>
              </li>
            </ul>
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
                      style={{ color: iconColors[index % iconColors.length] }}
                    />
                    <div className="w-100 d-flex justify-content-between align-items-center">
                      <span className="sidebar-letters">{tag}</span>
                      <button className="tag-button">
                        <span
                          className="tag-dropdown-toggle"
                          onClick={() => handleTagClick(index)}
                        ></span>
                      </button>
                      <TagActionsDropdown
                        isOpen={showMoreOptions === index}
                        onEdit={() => {
                          setIsFolderModalOpen(true)
                          setShowMoreOptions(null)
                        }}
                        onRemove={() => setShowMoreOptions(null)}
                        onClose={() => setShowMoreOptions(null)}
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <ul>
              <li>
                <Link
                  to="#"
                  className="sidebar-contents"
                >
                  {/* <FolderOpen className="icon" size={20} /> */}
                  <span className="sidebar-letters">
                    Uncategorized <span className="number">(5)</span>
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <hr></hr>
          <div className="test-sidebar-section">
            {/* <h3 className="sidebar-section-title">Actions</h3> */}
            <div className="settings-dropdown-container" ref={settingsRef}>

              <button
                className="settings-trigger-btn sidebar-contents"
                onClick={() => setOpenDropdown(!openDropdown)}
                aria-label="Test settings"
                aria-expanded={openDropdown}
              >
                <FontAwesomeIcon icon={faGear} className="icon" size="lg" />
                Settings
                <span className="tag-dropdown-toggle ms-auto"></span>
              </button>


              {openDropdown && (
                <div className="settings-dropdown-menu">
                  <ul className="test-sidebar-menu">
                    <li>
                      <button
                        className="dropdown-menu-item sidebar-contents"
                        onClick={() => handleActionClick("edit", testItem)}
                      >
                        <FaEdit className="icon" size={18} />
                        <span className="dropdown-text">Edit</span>
                      </button>
                    </li>

                    <li>
                      <button
                        className="dropdown-menu-item sidebar-contents"
                        onClick={() => handleActionClick("pdf")}
                      >
                        <FaFilePdf className="icon" size={18} />
                        <span className="dropdown-text">Download</span>
                      </button>
                    </li>

                    <li>
                      <button
                        className="dropdown-menu-item sidebar-contents"
                        onClick={() => handleActionClick("addToFolder")}
                      >
                        <FaFolderPlus className="icon" size={18} />
                        <span className="dropdown-text">Add to Folder</span>
                      </button>
                    </li>

                    <li>
                      <button
                        className="dropdown-menu-item sidebar-contents"
                        onClick={() => handleActionClick("archive")}
                      >
                        <Archive className="icon" size={18} />
                        <span className="dropdown-text">Archived</span>
                      </button>
                    </li>

                    <li>
                      <button
                        className="dropdown-menu-item sidebar-contents"
                        onClick={() => handleActionClick("delete")}
                      >
                        <Trash2 className="icon" size={18} />
                        <span className="dropdown-text">Trashed</span>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

        </div>


      </nav>
      {/* Mobile Toggle Button */}
     
      <AddFolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        heading="Create New Category"   // ✅ pass heading here
        />

      {/* {(isDropdownOpen && !isMobileOpen) && (
        <div ref={questionTypeRef} className="list-of-questions-type">
          <ListOfQuestionsType onClose={() => dispatch(addNewQuestionQB(false))} />
        </div>
      )} */}

      
      
      {/* {!hideQuestionType && screenWidth >= 769 && (
        <div ref={questionTypeRef} className="list-of-questions-type">
          <ListOfQuestionsType
            isOpen={isDropdownOpen}
            onClose={() => dispatch(addNewQuestionQB(false))}
          />
        </div>
      )} */}

      <AddTagsComponent
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
      />  

    </div>
  )
}

export default TeacherQbQuestionsSidemenu