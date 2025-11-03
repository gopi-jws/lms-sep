"use client"

import React, { useState, useRef, useEffect,} from "react";
import "./TestAddSideabr.css";
import { FaPaperPlane, FaCopy, FaFilePdf, FaShare, FaArchive, FaTrashAlt, FaEdit, FaTag } from "react-icons/fa"
import { BiSolidRename } from "react-icons/bi"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear,faChevronDown  } from "@fortawesome/free-solid-svg-icons";

import {
  PlusCircle,
  Tag,
  Award,
  Share2,
  Send,
  Clock,
  Archive,
  FileText,
  Plus,
  ListChecks,
  X,
  Menu,
  BookOpen,
  Trash2,
  MinusCircle,
  ChevronDown, Edit, Settings, MoreVertical,
  Bookmark
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link, useLocation, useParams } from "react-router-dom";
import TagActionsDropdown from "../../../ReusableComponents/TagActionsDropdown/TagActionsDropdown";
import AddTagsComponent from "../../../ReusableComponents/AddTagsComponent/AddTagsComponent";
import AddFolderModal from "../../../ReusableComponents/AddFolderModal/AddFolderModal";
import useOutsideClick from '../../../../hooks/useOutsideClick'; // adjust path
import NewTestModal from '../../../ReusableComponents/NewTestModal/NewTestModal'
import PublishModal from "../../../ReusableComponents/PublishModal/PublishModal"
import ShareModal from "../../../ReusableComponents/TestShareModal/ShareModal"
import AddQuestionModal from "../../../ReusableComponents/AddQuestionModal/AddQuestionModal";

import TestIndex from "../TestIndex/TestIndex";
const TestAddSidebar = ({ isMobileOpen, setIsMobileOpen }) => {

  const initialData = [
    { id: 1, test: "Test 1", owner: "John Doe", status: "Not Published", lastModified: "2 days ago by You", duration: 60, description: "Sample test 1", instructions: "Follow the guidelines", trashed: false, archived: false },
    { id: 2, test: "Test 2", owner: "Jane Smith", status: "Not Published", lastModified: "10 hours ago by You", duration: 45, description: "Sample test 2", instructions: "Read carefully", trashed: false, archived: false },
    { id: 3, test: "Test 3", owner: "Mark Johnson", status: "Not Published", lastModified: "5 days ago by You", duration: 90, description: "Sample test 3", instructions: "Complete all sections", trashed: false, archived: false },
    { id: 4, test: "Test 4", owner: "Mark Johnson", status: "Not Published", lastModified: "8 hours ago by You", duration: 30, description: "Sample test 4", instructions: "Time-bound test", trashed: false, archived: false },
    { id: 5, test: "Test 5", owner: "Mark Johnson", status: "Not Published", lastModified: "3 days ago by You", duration: 75, description: "Sample test 5", instructions: "Answer all questions", trashed: false, archived: false },
    { id: 6, test: "Test 6", owner: "Mark Johnson", status: "Not Published", lastModified: "12 hours ago by You", duration: 60, description: "Sample test 6", instructions: "Follow instructions", trashed: false, archived: false },
    { id: 7, test: "Test 7", owner: "Mark Johnson", status: "Not Published", lastModified: "1 day ago by You", duration: 60, description: "Sample test 7", instructions: "Follow instructions", trashed: false, archived: false },
    { id: 8, test: "Test 8", owner: "Mark Johnson", status: "Not Published", lastModified: "6 hours ago by You", duration: 60, description: "Sample test 8", instructions: "Follow instructions", trashed: false, archived: false },
    { id: 9, test: "Test 9", owner: "Mark Johnson", status: "Not Published", lastModified: "4 days ago by You", duration: 60, description: "Sample test 9", instructions: "Follow instructions", trashed: false, archived: false },
    { id: 10, test: "Test 10", owner: "Mark Johnson", status: "Not Published", lastModified: "3 hours ago by You", duration: 60, description: "Sample test 10", instructions: "Follow instructions", trashed: false, archived: false },
    { id: 11, test: "Test 11", owner: "Mark Johnson", status: "Not Published", lastModified: "2 days ago by You", duration: 60, description: "Sample test 11", instructions: "Follow instructions", trashed: false, archived: false },
    { id: 12, test: "Test 12", owner: "Mark Johnson", status: "Not Published", lastModified: "1 hour ago by You", duration: 60, description: "Sample test 12", instructions: "Follow instructions", trashed: false, archived: false },
  ];

  const [selectedTest, setSelectedTest] = useState("")
  const [selectedTestId, setSelectedTestID] = useState("")
  const [editingTest, setEditingTest] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [emails, setEmails] = useState([]);
  

  const testlocation = useLocation();
  const pathParts = testlocation.pathname.split("/"); // ["", "lms-sep2", "test", "12", "movetest"]
  const pathName = pathParts[3];


  const { id } = useParams(); // id is a string from URL


  const testItem = initialData.find(item => item.id === Number(id)); // convert id to number




  const navigate = useNavigate();
  const location = useLocation();
  // const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const handleNewQuestionClick = () => {
    // const id = "1";
    // sessionStorage.setItem("testQuestionData", JSON.stringify({ id }));
    // window.open(`/lms-sep1/test/${id}/movetest/testquestionadd`, "_blank");
    setIsAddQuestionModal(true)

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

  // useOutsideClick(dropdownRef, () => {
  //   setActiveDropdown(null);
  // });

  
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAddQuestionModal, setIsAddQuestionModal] = useState(false);

  const [testInfo] = useState({
    marks: 100,
    noOfQuestions: 50,
    negativeMarks: -0.25,
    duration: "2h",
  });

  const [mode, setMode] = useState('')
  const [showDescDropdown, setShowDescDropdown] = useState(false);
  // const [showInstrDropdown, setShowInstrDropdown] = useState(false);

  const handleTagClick = (index) => {
    setShowMoreOptions(showMoreOptions === index ? null : index);
  };

  // const handleDescription = () =>{
  //   setShowDescDropdown(!showDescDropdown);
  //   setShowInstrDropdown(false)
  // }

  // const handleInstruction = () =>{
  //   setShowInstrDropdown(!showInstrDropdown);
  //   setShowDescDropdown(false)
  // }

  const [activeDropdown, setActiveDropdown] = useState(null);

  // const handleDescription = () => {
  //   setActiveDropdown((prev) => (prev === "desc" ? null : "desc"));
  //   setMode('desc');
  // };

  // const handleInstruction = () => {
  //   setActiveDropdown((prev) => (prev === "instr" ? null : "instr"));
  //   setMode('instr');
  // };
  const [data, setData] = useState(() => {
    const tests = JSON.parse(localStorage.getItem("tests"));
    const savedTests = tests
    return savedTests ? initialData : initialData;
  });

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('tests'));
    setData(stored);
  }, []);


  const openModal = (testName) => {
    setSelectedTest(testName.test)
    setSelectedTestID(testName.id)
    setIsModalOpen(true)
    // setOpenDropdownId(null)
  }

  const openShareModal = (testName) => {
    setSelectedTest(testName)
    setIsShareModalOpen(true)
    // setOpenDropdownId(null)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const refreshTests = () => {
    const stored = JSON.parse(localStorage.getItem('tests')) || [];
    setData(stored);
  };

  const handleUpdateTest = (testId, updatedFields) => {
    setData(prevData =>
      prevData.map(test =>
        test.id === testId
          ? {
            ...test,
            test: updatedFields.name || test.test,
            duration: updatedFields.duration || test.duration,
            description: updatedFields.description || test.description,
            instructions: updatedFields.instructions || test.instructions,
            // lastModified: new Date().toISOString()
          }
          : test
      )
    );
  };

  const handleRenameTest = (testId, updatedFields) => {
    setData(prevData =>
      prevData.map(test =>
        test.id === testId
          ? {
            ...test,
            test: updatedFields.name || test.test,
            // lastModified: new Date().toISOString()
          }
          : test
      )
    );
  };


  const handleActionClick = (action, testItem) => {
    switch (action) {

      case "desc":
        setShowDescDropdown(true);
        setMode('desc');
        break;

      case "instr":
        // setActiveDropdown((prev) => (prev === "instr" ? null : "instr"));
        setShowDescDropdown(true);
        setMode('instr');
        break;

      case "dispatch":
        openModal(testItem.test);
        break;

      case "edit":
        setEditingTest({
          id: testItem.id,
          name: testItem.test,
          duration: testItem.duration,
          description: testItem.description,
          instructions: testItem.instructions
        });
        setIsEditModalOpen(true);
        setModalHeading("Edit Test")
        break;

      case "rename":
        setEditingTest({
          id: testItem.id,
          name: testItem.test,
        });
        setIsRenameModalOpen(true);
        setModalHeading("Rename Test")
        break;

      case "pdf":
        setShowDescDropdown(true)
        setMode('pdf');
        
        break;

      case "copy":
        setShowDescDropdown(true)
        setMode('copy');
        setModalHeading("Copy Test")
        break;

      case "share":
        openShareModal(testItem.test);
        break;

      case "archive":
        setShowDescDropdown(true)
        setMode('archive');
        setModalHeading("Archive Test")
        break;

      case "delete":
        setShowDescDropdown(true)
        setMode('delete');
        setModalHeading("Delete Test")
        break;

      default:
        break;
    }
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

  const handleSettingsClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };


  return (
    <div className="sidebar-wrapper">
      {/* Mobile Overlay */}
      {/* {isMobileOpen && <div className="mobile-overlay" onClick={() => setIsMobileOpen(false)}></div>} */}
      {/* Sidebar Container */}
      <nav className={`test-sidebar-container ${isMobileOpen ? "mobile-open" : ""} ${pathName === "movetest" ? "AddTest-Top" : ""}`} aria-label="Test Navigation">
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

          {/* <div className=" test-sidebar-section">
            <h3 className=" test-sidebar-section snap-chat-btn">Snap Shot</h3>
          </div>

          <hr /> */}

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
                        to="#"
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
                            <span className="tag-dropdown-toggle" onClick={() => { handleTagClick(index) }}></span>
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

          <hr />
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
                <div className={`sidebar-contents ${isActive("") || activeDropdown === "desc" ? "active" : ""}`} onClick={() => handleActionClick("desc")}>
                  <div className="d-flex align-items-center gap-2 w-100 justify-content-between">
                    <div className="d-flex align-items-center gap-2" >
                      <FileText className="icon" size={20} />
                      <span className="sidebar-letters">Description</span>
                    </div>
                  </div>
                </div>
              </li>

              <li className="dropdown-container">
                <div className={`sidebar-contents ${isActive("") || activeDropdown === "instr" ? "active" : ""}`} onClick={() => handleActionClick("instr")}>
                  <div className="d-flex align-items-center gap-2 w-100 justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <BookOpen className="icon" size={20} />
                      <span className="sidebar-letters">Instruction</span>
                    </div>
                    {/* <div className="dropdown-icon-container">
                      <button className="dropdown-toggle3" >
                        <MoreVertical size={16} />
                      </button>
                    </div> */}
                  </div>
                </div>

                {/* {activeDropdown === "instr" && (
                  <TagActionsDropdown
                    isOpen={true}
                    mode="instr"
                    onEdit={() => { setShowDescDropdown(true) }}
                    onRemove={() => console.log("Remove Description")}
                    onClose={() => setActiveDropdown(null)}
                  />
                )} */}

              </li>

            </ul>
          </div>

          <hr />
          <div className="test-sidebar-section">
            {/* <h3 className="sidebar-section-title">Actions</h3> */}
            <div className="settings-dropdown-container" ref={dropdownRef}>
              {/* Settings Button */}
              <button
                className="settings-trigger-btn sidebar-contents"
                onClick={handleSettingsClick}
                aria-label="Test settings"
                aria-expanded={isDropdownOpen}
              >
                <FontAwesomeIcon icon={faGear} className="icon" size="lg" />
                Settings <span className="tag-dropdown-toggle ms-auto"></span>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="settings-dropdown-menu">
                  <ul className="test-sidebar-menu">
                    <li>
                      <button
                        className="dropdown-menu-item sidebar-contents"
                         onClick={() => openModal(testItem)}
                      >
                        <Send className="icon" size={18} />
                        <span className="dropdown-text">Published</span>
                      </button>
                    </li>
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
                        onClick={()=>handleActionClick("pdf")}
                      >
                        <FaFilePdf className="icon" size={18} />
                        <span className="dropdown-text">Download</span>
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-menu-item sidebar-contents"
                        onClick={() => handleActionClick("rename", testItem)}
                      >
                        <BiSolidRename className="icon" size={18} />
                        <span className="dropdown-text">Rename</span>
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-menu-item sidebar-contents"
                       onClick={() => openShareModal(testItem.test)}
                      >
                        <Share2 className="icon" size={18} />
                        <span className="dropdown-text">Shared with me</span>
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-menu-item sidebar-contents"
                        onClick={()=>handleActionClick("archive")}
                      >
                        <Archive className=" icon" size={18} />
                        <span className="dropdown-text">Archived</span>
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-menu-item sidebar-contents"
                        onClick={()=>handleActionClick("delete")}
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

        <AddTagsComponent
          isOpen={isTagModalOpen}
          onClose={() => setIsTagModalOpen(false)}
        />

        
      </nav>

      {/* Mobile Toggle Button */}
      {/* <button
        className={`mobile-toggle-btn ${isMobileOpen ? "sidebar-open" : ""}`}
        onClick={toggleMobileSidebar}
        aria-label="Toggle sidebar"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button> */}


      <AddQuestionModal 
        open={isAddQuestionModal}
        close={()=> setIsAddQuestionModal(false)}
        tags={tags} 
      />


      <AddFolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onAddFolder={handleAddFolder}
        heading={modalHeading}
        selectedSection={selectedSection}
      />


      {/* <NewTestModal
        isOpen={showDescDropdown}
        mode={mode}
        onSubmit={() => { setShowDescDropdown(false) }}
        onClose={() => { setShowDescDropdown(false) }}
        initialName={testItem.test}
        initialId={testItem.id}
        initialDuration={testItem.duration}
        initialDescription={testItem.description}
        initialInstructions={testItem.instructions}
        heading={modalHeading}
      /> */}

      <PublishModal
        isOpen={isModalOpen}
        tags={tags} 
        onClose={closeModal}
        selectedTest={selectedTest}
        selectedTestId={selectedTestId}
        onPublish={refreshTests}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        emails={emails}
        setEmails={setEmails}
        testName={selectedTest}
      />

      {isEditModalOpen && (
        <NewTestModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTest(null);
          }}
          initialName={editingTest?.name || ""}
          initialDuration={editingTest?.duration || 60}
          initialDescription={editingTest?.description || ""}
          initialInstructions={editingTest?.instructions || ""}
          onSubmit={(updatedFields) => {
            handleUpdateTest(editingTest.id, updatedFields);
            setIsEditModalOpen(false);
            setEditingTest(null);
          }}
          heading={modalHeading}
          mode="edit"
        />
      )}


      {isRenameModalOpen && (
        <NewTestModal
          isOpen={isRenameModalOpen}
          onClose={() => { setIsRenameModalOpen(false); setEditingTest(null); }}
          initialName={editingTest?.name || ""}
          mode="rename"
          onSubmit={(updatedFields) => {
            // updatedFields will be { name: 'new name' }
            handleRenameTest(editingTest.id, updatedFields);
            setIsRenameModalOpen(false);
            setEditingTest(null);
          }}
          heading={modalHeading}
        />
      )}
    </div>
  );
};

export default TestAddSidebar;