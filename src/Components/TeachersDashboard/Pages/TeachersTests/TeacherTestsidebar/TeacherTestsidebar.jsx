"use client";

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Plus,
  FileText,
  Share2,
  Send,
  Archive,
  Trash2,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Menu,
  Tag,
} from "lucide-react";

import { getNextId } from "../../../../../utils/idGenerator";
import { useSelector, useDispatch } from "react-redux";
import { addNewTest } from "../../../../../slices/allTestSlice";
import NewTestModal from "../../../../ReusableComponents/NewTestModal/NewTestModal";
import AddTagModal from "../../../../ReusableComponents/AddTagModal/AddTagModal";
import TagActionsDropdown from "../../../../ReusableComponents/TagActionsDropdown/TagActionsDropdown";


const TecaherTestSidebar = ({
  tags = [],
  uncategorizedCount,
  isMobileOpen,
  setIsMobileOpen,
  onTagClick,
  onUncategorizedClick,
  activeTag,
  setTags,
  newTest,
  onCreateTest
}) => {

  const dispatch = useDispatch();
  
  //Open New Test 
  const isNewTestModalOpen = useSelector((state) => state.AllTest.openNewtest);

  const [isNewTagModalOpen, setIsNewTagModalOpen] = useState(false);
  // const [isNewTestModalOpen, setIsNewTestModalOpen] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(null);
  // const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Alltest");
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState(null);

  const [modalHeading, setModalHeading] = useState("");
  const [editingTag, setEditingTag] = useState(null);
  const [mode, setMode] = useState("")

  
  // const [tags, setTags] = useState(() => {
  //   const storedTags = localStorage.getItem("tags");
  //   return storedTags ? JSON.parse(storedTags) : [];
  // });



  // useEffect(() => {
  //   localStorage.setItem('tags', JSON.stringify(tags));
  // }, [tags]);


  const location = useLocation();

  useEffect(() => {
    // Get path like /test/archived → extract the last part
    const currentPath = location.pathname.split("/").pop();
    console.log(currentPath);
    
    setActiveSection(currentPath === "test" ? "Alltest" : currentPath || "Alltest");
  }, [location]);


  const handleSetActive = (section) => {
    setActiveSection(section);
    setIsMobileOpen(false);
  };

  const handleSetActiveTag = (tag) => {
    setActiveTag(tag);
    setIsMobileOpen(false);
  };

  const handleTagClick = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMoreOptions(showMoreOptions === index ? null : index);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleAddTag = ({ name, color }) => {
    console.log("name", name, "color", color);

    if (editingTag) {
      setTags(tags.map(tag =>
        tag.id === editingTag.id ? { ...tag, name, color } : tag
      ));
      setEditingTag(null);
    } else {
      setTags([...tags, {
        id: getNextId('tags'),
        name,
        color,
        questions: []
      }]);
    }
    setIsNewTagModalOpen(false);
  };

 
  // Remove tag function (updates state + localStorage)
  const removeTag = (removeTag) => {
    setTags(prev => prev.filter(tag => tag.id !== removeTag.id)); // ✅ updates parent state
  };

  const handleEditTag = (tag) => {
    setEditingTag(tag);
    setModalHeading("Edit Tag");
    setIsNewTagModalOpen(true);
  };

  const handleRemoveTag = (tag) => {
    setSelectedTagId(tag);
    setModalHeading("Delete Tag");
    setIsRemoveModalOpen(true);
  };


  return (
    <div className="sidebar-wrapper">
      {/* {isMobileOpen && <div className="mobile-overlay-test" onClick={() => setIsMobileOpen(false)} />} */}

      <nav className={`test-sidebar-container ${isMobileOpen ? "mobile-open" : ""}`} aria-label="Main Navigation">
        <div className="test-sidebar-header">
          <div className="w-100 d-flex justify-content-center">
            <button
              onClick={() => dispatch(addNewTest(true))}
              className="allbuttons"
              aria-label="Create New Test"
            >
              <span className="sidebar-letters">New Test</span>
            </button>
          </div>
        </div>

        <div className="test-sidebar-scroll">
          <div className="test-sidebar-section">
            <ul className="test-sidebar-menu">
              <li>
                <Link
                  to="/teachers-dashboard/tests/"
                  className={`sidebar-contents ${activeSection === "/teachers-dashboard/tests/" ? "active" : ""}`}
                  aria-label="All Tests"
                  onClick={() => handleSetActive("Alltest")}
                >
                  <FileText className="icon" size={18} />
                  <span className="sidebar-letters">All Tests</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/teachers-dashboard/tests/share-tests"
                  className={`sidebar-contents 
                    ${activeSection === "/teachers-dashboard/tests/share-tests" ? "active" : ""}`}
                  aria-label="Shared with me"
                //   onClick={() => handleSetActive("shared-with-me")}
                >
                  <Share2 className="icon" size={18} />
                  <span className="sidebar-letters">Shared with me</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/teachers-dashboard/tests/publish"
                  className={`sidebar-contents 
                    ${activeSection === "/teachers-dashboard/tests/publish" ? "active" : ""}`}
                  aria-label="Dispatched"
                //   onClick={() => handleSetActive("dispatched")}
                >
                  <Send className="icon" size={18} />
                  <span className="sidebar-letters">Published</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/teachers-dashboard/tests/archive"
                  className={`sidebar-contents ${activeSection === "/teachers-dashboard/tests/archive" ? "active" : ""}`}
                  aria-label="Archived"
                //   onClick={() => handleSetActive("archived")}
                >
                  <Archive className="icon" size={18} />
                  <span className="sidebar-letters">Archived</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/teachers-dashboard/tests/trash"
                  className={`sidebar-contents ${activeSection === "/teachers-dashboard/tests/trash" ? "active" : ""}`}
                  aria-label="Trashed"
                //   onClick={() => handleSetActive("trashed")}
                >
                  <Trash2 className="icon" size={18} />
                  <span className="sidebar-letters">Trashed</span>
                </Link>
              </li>
            </ul>
          </div>

          <hr />

          <div className="test-sidebar-section">
            <li className="sidebar-section-title">Tags</li>
            <button
              className="newtag"
              aria-label="Create New Tag"
              onClick={() => {
                setIsNewTagModalOpen(true);
                setModalHeading("Create New Tag");
                setEditingTag(null);
              }}
            >
              <Plus className="icon" size={18} />
              <span className="sidebar-letters">New Tag</span>
            </button>

            {/* <ul className="test-sidebar-menu tags">
              {tags?.map((tag, index) =>
              (
                <li key={tag.id} className="tag-item">
                  <Link
                    className={`sidebar-contents ${activeTag === tag.name ? "active" : ""}`}
                    onClick={() => onTagClick(tag.name)}
                  >
                    < Tag className="icon" size={18} style={{ color: tag.color }} />
                    <div className="w-100 d-flex justify-content-between align-items-center">
                      <span className="sidebar-letters tag-letters-container">
                        <span className="tag-name-wrapper">
                          <span className="tag-name-text">
                            {tag.name}
                          </span>
                        </span>
                        <span className="tag-count">
                          ({tag.questions?.length})
                        </span>
                      </span>
                      <button
                        className="tag-button"
                        type="button"
                        onClick={(e) => handleTagClick(e, index)}
                      >
                        <span className="tag-dropdown-toggle"> </span>
                      </button>

                      <TagActionsDropdown
                        isOpen={showMoreOptions === index}
                        onEdit={() => handleEditTag(tag)}
                        onRemove={() => handleRemoveTag(tag)}
                        onClose={() => setShowMoreOptions(null)}
                        tagId={tag.id}
                        tagName={tag.name}
                        tagColor={tag.color}
                      />

                    </div>
                  </Link>
                </li>
              )
              )}
            </ul> */}
            <ul className="test-sidebar-menu tags">
              {tags?.map((tag, index) => (
                <li key={`${tag.id || tag.name}-${index}`} className="tag-item">
                  <Link
                    className={`sidebar-contents ${activeTag === tag.name ? "active" : ""}`}
                    onClick={() => onTagClick(tag.name)}
                  >
                    <Tag className="icon" size={18} style={{ color: tag.color }} />
                    <div className="w-100 d-flex justify-content-between align-items-center">
                      <span className="sidebar-letters tag-letters-container">
                        <span className="tag-name-wrapper">
                          <span className="tag-name-text">{tag.name}</span>
                        </span>
                        <span className="tag-count">({tag.questions?.length})</span>
                      </span>
                      <button
                        className="tag-button"
                        type="button"
                        onClick={(e) => handleTagClick(e, index)}
                      >
                        <span className="tag-dropdown-toggle"> </span>
                      </button>

                      <TagActionsDropdown
                        isOpen={showMoreOptions === index}
                        onEdit={() => handleEditTag(tag)}
                        onRemove={() => handleRemoveTag(tag)}
                        onClose={() => setShowMoreOptions(null)}
                        tagId={tag.id}
                        tagName={tag.name}
                        tagColor={tag.color}
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <p
              className={`sidebar-contents ${activeTag === "uncategorized" ? "active" : ""}`}
              style={{ fontStyle: "italic" }}
              onClick={onUncategorizedClick}
            >
              Uncategorized<span className="number">({uncategorizedCount})</span>
            </p>
          </div>

        </div>

      </nav>


      <AddTagModal
        isOpen={isNewTagModalOpen}
        onClose={() => {
          setIsNewTagModalOpen(false);
          setEditingTag(null);
        }}
        onAddTag={handleAddTag}
        heading={modalHeading}
        selectedSection={editingTag}
      />

      <NewTestModal
        isOpen={isNewTestModalOpen}
        onClose={() => dispatch(addNewTest(false))}
        onSubmit={(testData) => {
          onCreateTest(testData);
          dispatch(addNewTest(false));
        }}
        mode="create"
      />

      <NewTestModal
        isOpen={isRemoveModalOpen}
        onClose={() => {
          setIsRemoveModalOpen(false);
          setSelectedTagId(null);
        }}
        mode="delete"
        selectedTag={selectedTagId}
        heading={modalHeading}
        onSubmit={() => {
          removeTag(selectedTagId); // ✅ must use selectedTagId
          setIsRemoveModalOpen(false);
          setSelectedTagId(null);
        }}
      />

    </div>
  );
};

export default TecaherTestSidebar;