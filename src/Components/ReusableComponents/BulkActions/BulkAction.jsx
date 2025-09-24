import React, { useState, useRef, useEffect } from "react";
import { Trash2, Archive, Download, Check ,RotateCcw } from "lucide-react";
import { BiSolidTag } from "react-icons/bi";
import "./BulkAction.css";
import AddTagModal from "../../ReusableComponents/AddTagModal/AddTagModal";

import PropTypes from 'prop-types';
import NewTestModal from "../../ReusableComponents/NewTestModal/NewTestModal";
import { toast } from "react-toastify";
import { getNextId } from "../../../utils/idGenerator";

const BulkActions = ({
  selectedRows = [],
  availableActions = [],
  tags = [],
  onAddQuestionsToTag = () => toast.warn("Add to tag functionality not implemented"),
  onAddQBToFolder = () => { "Add to FOlder functionality not implemented" },
  onAddTag = () => toast.warn("Add tag functionality not implemented"),
  allQuestions = [],
  onCopyTest = () => toast.warn("Copy test functionality not implemented"),
  onUpdateTest = () => toast.warn("Update test functionality not implemented"),
  onDelete = () => toast.warn("Delete functionality not implemented"),
  onArchive = () => toast.warn("Archive functionality not implemented"),
  onDownload = () => toast.warn("Download functionality not implemented"),
  isRenameModalOpen,
  setIsRenameModalOpen,
  setEditingTest
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const [isNewTagModalOpen, setIsNewTagModalOpen] = useState(false);
  const [previousName, setPreviousName] = useState('');
  const [recentlyTagged, setRecentlyTagged] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {


    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const handleAddToTag = (tagName) => {
    try {
      const tag = tags.find(t => t.name === tagName);
      if (!tag) {
        toast.error("Tag not found");
        return;
      }
      const newQuestions = selectedRows.filter(id => {
        if (tag.hasOwnProperty("questions")) {
          return !tag.questions.includes(id)
        } else if (tag.hasOwnProperty("QB")) {
          return !tag.QB.includes(id)
        }
      });
      setRecentlyTagged(prev => ({
        ...prev,
        [tagName]: Date.now()
      }));
      setTimeout(() => {
        setRecentlyTagged(prev => {
          const newState = { ...prev };
          delete newState[tagName];
          return newState;
        });
      }, 2000);
      if ((newQuestions.length > 0) && (tags.some(tag => 'questions' in tag))) {
        console.log("QQQQQQQQQQQQQQ-----------------------------------------------------");
        onAddQuestionsToTag(tagName, newQuestions);
      }
      else if ((newQuestions.length > 0) && (tags.some(tag => 'QB' in tag))) {
        console.log("QBBBBB-----------------------------------------------------");
        console.log("tagName", tagName, 'newQuestions', newQuestions);
        onAddQBToFolder(tagName, newQuestions);
      }
      else {
        toast.info("All selected questions already exist in this tag");
      } setActiveDropdown(null);
    } catch (error) {
      toast.error("Failed to add questions to tag");
      console.error("Error in handleAddToTag:", error);
    }
  };

  const renderActionButton = (action, index, isLastVisible) => {
    const baseClass = `tube-action-button ${isLastVisible ? "last-visible" : ""}`;
    const handleActionClick = (e) => {
      e.stopPropagation();
      switch (action) {
        case "delete":
          onDelete(selectedRows);
          const activeTags = JSON.parse(localStorage.getItem("tests")) || [];
          const trashedTags = JSON.parse(localStorage.getItem("trashedTags")) || [];

          // Get selected items by index
          const itemsToDelete = selectedRows
            .map(index => activeTags[index - 1])
            .filter(item => item); // remove undefined
          const trashedIds = new Set(trashedTags.map(item => item.id));
          // Filter out items that are already trashed
          const newItemsToAdd = itemsToDelete
            .filter(item => !trashedIds.has(item.id))
            .map(item => ({
              ...item,
              _id: item.id,// ✅ Add _id key

            }));
          const updatedTrashedTags = [...trashedTags, ...newItemsToAdd];
          localStorage.setItem("trashedTags", JSON.stringify(updatedTrashedTags));
          // Update original activeTags array
          const updatedActiveTags = activeTags.map(item =>
            newItemsToAdd.find(newItem => newItem.id === item.id)
              ? { ...item, trashed: true }
              : item
          );
          localStorage.setItem("tests", JSON.stringify(updatedActiveTags));
          // ✅ Update original testTags with archived: true
          const updatedTrashTags = activeTags.map(item =>
            newItemsToAdd.find(newItem => newItem.id === item.id)
              ? { ...item, trashed: true }
              : item
          );
          localStorage.setItem("tests", JSON.stringify(updatedTrashTags));
          // ✅ Remove all selected items from activeTags (even if some were already trashed)--upcoming
          // const updatedActiveTags = activeTags.filter((_, index) => !selectedRows.includes(index));
          // localStorage.setItem("tests", JSON.stringify(updatedActiveTags));
          break;
        case "archive":
          onArchive(selectedRows);

          // localStorage.removeItem('archivedTestsData');
          // const archived = JSON.parse(localStorage.getItem('archivetags') || '[]');
          // const selectedIds = selectedRows.map(idx => allQuestions[idx - 1]?.id).filter(Boolean);
          // const newArchived = [...archived, ...selectedIds.filter(id => !archived.includes(id))];
          // const allTests = JSON.parse(localStorage.getItem('tests') || '[]');
          // const archivedTests = allTests.filter(test => selectedIds.includes(test.id)).map(test => ({ ...test, archived: true }));
          // const remainingTests = allTests.filter(test => !selectedIds.includes(test.id));
          // localStorage.setItem('archivetags', JSON.stringify(archivedTests));
          const testTags = JSON.parse(localStorage.getItem("tests")) || [];
          const archivedTags = JSON.parse(localStorage.getItem("archivetags")) || [];
          // Get selected items by index
          const itemsToArchive = selectedRows
            .map(index => testTags[index - 1])
            .filter(item => item);
          const archievedIds = new Set(archivedTags.map(item => item.id));
          console.log('archivedid', archivedTags);

          const newTagsToAdd = itemsToArchive.filter(item => !archievedIds.has(item.id));
          const updatedArchivetags = [...archivedTags, ...newTagsToAdd];
          localStorage.setItem("archivetags", JSON.stringify(updatedArchivetags));
          // ✅ Update original testTags with archived: true
          const updatedTestTags = testTags.map(item =>
            newTagsToAdd.find(newItem => newItem.id === item.id)
              ? { ...item, archived: true }
              : item
          );
          localStorage.setItem("tests", JSON.stringify(updatedTestTags));


          /// Questions Archieve

          const QB = JSON.parse(localStorage.getItem("QB")) || [];
          const archivedQBs = JSON.parse(localStorage.getItem("archivedQues")) || [];
          // Get selected items by index
          const qbToArchive = selectedRows
            .map(index => testTags[index - 1])
            .filter(item => item);
          const archievedQBIds = new Set(archivedTags.map(item => item.id));
          console.log('archivedid', archivedTags);

          const newQBToAdd = qbToArchive.filter(item => !archievedQBIds.has(item.id));
          const updatedArchiveQB = [...archivedTags, ...newQBToAdd];
          localStorage.setItem("archivedQues", JSON.stringify(updatedArchiveQB));
          // ✅ Update original testTags with archived: true
          const updatedQB = testTags.map(item =>
            newQBToAdd.find(newItem => newItem.id === item.id)
              ? { ...item, archived: true }
              : item
          );
          localStorage.setItem("QB", JSON.stringify(updatedQB));
        case "download":
          onDownload(selectedRows);
          break;
        case "tag":
          toggleDropdown("tag");
          break;
        case "more":
          if (selectedRows.length === 1) toggleDropdown("more");
          break;
        default:
          break;
      }
    };


    switch (action) {
      case "delete":
        return (
          <button
            className={baseClass}
            data-tooltip="Delete"
            onClick={handleActionClick}
          >
            <Trash2 size={18} />
          </button>
        );
      case "archive":
        return (
          <button
            className={baseClass}
            data-tooltip="Archive"
            onClick={handleActionClick}
          >
            <Archive size={18} />
          </button>
        );
      case "download":
        return (
          <button
            className={baseClass}
            data-tooltip="Download"
            onClick={handleActionClick}
          >
            <Download size={18} />
          </button>
        );
      case "restore":
        return (
          <button
            className={baseClass} 
            // data-tooltip="Restore"
            onClick={handleActionClick}
          >
            Restore
          </button>
        )
      case "tag":
        return (
          <button
            className={`${baseClass} dropdown-toggle2 ${activeDropdown === "tag" ? "active" : ""}`}
            onClick={handleActionClick}
          >
            <BiSolidTag size={18} className="tag-flipped" />
          </button>
        );
      case "more":
        if (selectedRows.length === 1) {
          return (
            <button
              className={`${baseClass} dropdown-toggle2 moreoption ${activeDropdown === "more" ? "active" : ""}`}
              onClick={handleActionClick}
            >
              More
            </button>
          );
        }
        return null;
      default:
        return null;
    }
  };

  const shouldShowDivider = (index) => {
    if (index === availableActions.length - 1) return false;
    if (availableActions[index + 1] === "more") {
      return selectedRows.length === 1;
    }
    return true;
  };

  if (!selectedRows.length || !availableActions.length) return null;

  const visibleActions = availableActions.filter(action => {
    if (action === "more") return selectedRows.length === 1;
    return true;
  });
  const lastVisibleAction = visibleActions[visibleActions.length - 1];

  return (
    <div className="tube-bulk-actions-container" ref={dropdownRef}>
      <div className="tube-bulk-actions">
        {availableActions
          .filter(action => ["delete", "archive", "download"].includes(action))
          .map((action, index, filteredActions) => {
            
            const isLastVisible = action === lastVisibleAction;

            const isLastItem = index === filteredActions.length - 1;

            return (
              <React.Fragment key={`${action}-${index}`}>
                <div className="tube-bulk-button">
                  {renderActionButton(action, index, isLastVisible)}
                </div>
                {!isLastItem && <div className="tube-divider" />}
              </React.Fragment>
            );
          })}
      </div>

      {/* Tag in its own container */}
      {availableActions.includes("tag") && (
        <div className="tube-bulk-actions tag-actions">
          {renderActionButton("tag", 0, false)}
        </div>
      )}

      {/* More in its own container */}
      {availableActions.includes("more") && selectedRows.length === 1 && (
        <div className="tube-bulk-actions more-actions">
          {renderActionButton("more", 0, false)}
        </div>
      )}

      {/* Restore in its own container */}
      {availableActions.includes("restore") && (
        <div className="tube-bulk-actions restore-actions">
          {renderActionButton("restore", 0, false)}
        </div>
      )}

      {/* Tag Dropdown */}
      {activeDropdown === "tag" && (


        <div className="tag-options">
          <p className="addtotag-box-heading"  >{tags.some(tag => 'questions' in tag) ? 'Add To Tag' : 'Add To Folder'}</p>
          <ul className="tag-options-list">
            {tags.map((tag) => {


              const alreadyTaggedCount = selectedRows.filter(id => {
                if (tag.hasOwnProperty("questions")) {

                  return tag.questions.includes(id)


                } else if (tag.hasOwnProperty("QB")) {


                  return tag.QB.includes(id)
                }

              }).length;
              const isRecentlyTagged = recentlyTagged[tag.name] &&
                (Date.now() - recentlyTagged[tag.name] < 2000);
              const willAddNewQuestions = selectedRows.some(id => {
                if (tag.hasOwnProperty("questions")) {
                  return !tag.questions.includes(id);
                }
                else if (tag.hasOwnProperty("QB")) {
                  return !tag.QB.includes(id);
                }
              })
              console.log('willAddNewQuestions', willAddNewQuestions);

              return (
                <li
                  key={tag.id}
                  className={`tag-options-item ${alreadyTaggedCount === selectedRows.length ? 'all-tagged' : ''}`}
                  onClick={() => handleAddToTag(tag.name)}
                >
                  <div className="tag-container">
                    <span className="tick-mark" onClick={() => {
                      console.log("tick", alreadyTaggedCount, selectedRows.length,);
                    }}>
                      {alreadyTaggedCount === selectedRows.length ? '✓' : ''}
                    </span>
                    <span className="dot-name-wrapper">
                      <span
                        className="tag-dot"
                        style={{ backgroundColor: tag.color || "#000" }}
                      ></span>
                      <span className="tag-name">{tag.name}</span>
                    </span>
                    {isRecentlyTagged && (
                      <span className="tag-checkmark">
                        <Check size={16} />
                        {willAddNewQuestions ? (
                          <span className="tooltip">Added to tag</span>
                        ) : (
                          <span className="tooltip">Already in tag</span>
                        )}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          <div>
            <button
              className="tags-create-button"
              onClick={() => setIsNewTagModalOpen(true)}
            >
              Create New tag
            </button>
          </div>
        </div>
      )}

      {/* More Options Dropdown */}
      {activeDropdown === "more" && (
        <div className="more-options">
          <ul>
            <li
              className="more-options-item"
              onClick={() => {
                try {
                  if (selectedRows.length === 1) {
                    const test = allQuestions.find(q => q.id === selectedRows[0]);
                    if (test) {
                      setEditingTest({
                        id: test.id,
                        name: test.test,
                      });
                      setIsRenameModalOpen(true);
                    } else {
                      toast.error("Test not found");
                    }
                  }
                } catch (error) {
                  toast.error("Failed to prepare rename");
                  console.error("Rename preparation error:", error);
                }
                setActiveDropdown(null);
              }}
            >
              Rename
            </li>
            <li
              className="more-options-item"
              onClick={() => {
                try {
                  if (selectedRows.length === 1) {
                    onCopyTest(selectedRows[0]);
                  }
                } catch (error) {
                  toast.error("Failed to copy test");
                  console.error("Copy test error:", error);
                }
                setActiveDropdown(null);
              }}
            >
              Make a Copy
            </li>
          </ul>
        </div>
      )}


      {/* Modals */}
      <>
        <AddTagModal
          isOpen={isNewTagModalOpen}
          onClose={() => setIsNewTagModalOpen(false)}
          onAddFolder={onAddTag}
          heading="Create New Tag"
        />

      </>
      {/* Modal */}
      {
        isModalOpen && modelType === "test" && (
          <AddTagModal
            isOpen={isNewTagModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAddTag={onAddTag}
            heading="Create New Tag"
          />
        )
      }

      {
        isModalOpen && modelType === "QB" && (
          <AddFolderModel
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAddFolder={onAddTag}
            heading="Create New Folder"
          />
        )
      }


      {
        isRenameModalOpen && (
          <NewTestModal
            isOpen={isRenameModalOpen}
            onClose={() => setIsRenameModalOpen(false)}
            mode="rename"
            initialName={previousName}
            onSubmit={(updatedFields) => {
              try {
                const questionId = selectedRows[0];
                onUpdateTest(questionId, updatedFields);
              } catch (error) {
                toast.error("Failed to update test");
                console.error("Update test error:", error);
              }
              setIsRenameModalOpen(false);
            }}
          />
        )
      }
    </div >
  );
};

BulkActions.propTypes = {
  selectedRows: PropTypes.array.isRequired,
  availableActions: PropTypes.array.isRequired,
  tags: PropTypes.array,
  allQuestions: PropTypes.array,
  onAddQuestionsToTag: PropTypes.func,
  onAddQBToFolder: PropTypes.func,
  onAddTag: PropTypes.func,
  onCopyTest: PropTypes.func,
  onUpdateTest: PropTypes.func,
  onDelete: PropTypes.func,
  onArchive: PropTypes.func,
  onDownload: PropTypes.func,
  isRenameModalOpen: PropTypes.bool,
  setIsRenameModalOpen: PropTypes.func,
  setEditingTest: PropTypes.func
};

BulkActions.defaultProps = {
  tags: [],
  allQuestions: [],
  onAddQuestionsToTag: () => { },
  onAddQBToFolder: () => { },
  onAddTag: () => { },
  onCopyTest: () => { },
  onUpdateTest: () => { },
  onDelete: () => { },
  onArchive: () => { },
  onDownload: () => { }
};

export default BulkActions;