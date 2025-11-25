import React, { useState, useRef, useEffect } from "react";
import { Trash2, Archive, Download, Check ,RotateCcw } from "lucide-react";
import { BiSolidTag } from "react-icons/bi";
import "./BulkAction.css";
import AddTagModal from "../../ReusableComponents/AddTagModal/AddTagModal";
import AddFolderModal from "../../ReusableComponents/AddFolderModal/AddFolderModal";

import PropTypes from 'prop-types';
import NewTestModal from "../../ReusableComponents/NewTestModal/NewTestModal";
import NewQBModal from "../../ReusableComponents/NewQBModal/NewQBModal";
import { toast } from "react-toastify";
import { getNextId } from "../../../utils/idGenerator";

const BulkActions = ({
  selectedRows = [],
  availableActions = [],
  tags = [],
  folder = [],
  onAddQuestionsToTag = () => toast.warn("Add to tag functionality not implemented"),
  onAddQBToFolder = () => toast.warn("Add to FOlder functionality not implemented" ),
  onAddFolder = () => toast.warn("Add folder functionality not implemented"),
  onAddTag = () => toast.warn("Add tag functionality not implemented"),
  allQuestions = [],
  onCopyTest = () => toast.warn("Copy test functionality not implemented"),
  onUpdateTest = () => toast.warn("Update test functionality not implemented"),
  onDelete = () => toast.warn("Delete functionality not implemented"),
  onArchive = () => toast.warn("Archive functionality not implemented"),
  onDownload = () => toast.warn("Download functionality not implemented"),
  setModalHeading,
  setIsRenameModalOpen,
  setIsCopyModalOpen,
  setIsDeleteModalOpen,
  setIsArchivedModalOpen,
  setEditingTest,
  setEditingQB,
  modalType,
}) => {

  
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const [isNewTagModalOpen, setIsNewTagModalOpen] = useState(false);
  const [previousName, setPreviousName] = useState('');
  const [recentlyTagged, setRecentlyTagged] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentlyFolder, setRecentlyFolder] = useState({});

   
  console.log(availableActions + "availableActions");
  
  

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
      // else if ((newQuestions.length > 0) && (tags.some(tag => 'QB' in tag))) {
      //   console.log("QBBBBB-----------------------------------------------------");
      //   console.log("tagName", tagName, 'newQuestions', newQuestions);
      //   onAddQBToFolder(tagName, newQuestions);
      // }
      else {
        toast.info("All selected questions already exist in this tag");
      } setActiveDropdown(null);

    } catch (error) {
      toast.error("Failed to add questions to tag");
      console.error("Error in handleAddToTag:", error);
    }
  };


const handleAddToFolder = (folderName) => {
  try {
    const selectedFolder = folder.find(f => f.name === folderName);

    if (!selectedFolder) {
      toast.error("Folder not found");
      return;
    }

    // --- EXACT SAME LOGIC AS TAG ---
    const newQuestions = selectedRows.filter(id => {
      return !selectedFolder.QB.includes(id);
    });

    setRecentlyFolder(prev => ({
      ...prev,
      [folderName]: Date.now()
    }));

    setTimeout(() => {
      setRecentlyFolder(prev => {
        const newState = { ...prev };
        delete newState[folderName];
        return newState;
      });
    }, 2000);

    console.log("FOLDER:", folderName, "NEW:", newQuestions);

    // --- SAME TAG LOGIC BUT FOR FOLDER ---
    if (newQuestions.length > 0) {
      onAddQBToFolder(folderName, newQuestions);
    } else {
      toast.info("All selected questions already exist in this folder");
    }

    setActiveDropdown(null);

  } catch (error) {
    toast.error("Failed to add questions to folder");
    console.error("Error in handleAddToFolder:", error);
  }
};



  const renderActionButton = (action, index, isLastVisible) => {

    console.log("action" + action);
    
    const baseClass = `tube-action-button ${isLastVisible ? "last-visible" : ""}`;
    const handleActionClick = (e) => {
      e.stopPropagation();
      switch (action) {
        case "delete":

              if (modalType === "test") {
                const selectedTests = selectedRows.map(value => {
                  const test = allQuestions?.find(q => q.id === value);
                  return { id: test.id, name: test.test };
                });
                setModalHeading("Delete Tests")
                setEditingTest(selectedTests)

              } else {
                const selectedQB = selectedRows.map(value => {
                  const test = allQuestions?.find(q => q.id === value);
                  return { id: test.id, name: test.name };
                });
                setModalHeading("Delete QBs")
                setEditingQB(selectedQB); 
              }
              setIsDeleteModalOpen(true);
            
    
          // const activeTags = JSON.parse(localStorage.getItem("tests")) || [];
          // const trashedTags = JSON.parse(localStorage.getItem("trashedTags")) || [];

          // Get selected items by index
          // const itemsToDelete = selectedRows
          //   .map(index => activeTags[index - 1])
          //   .filter(item => item); // remove undefined
          // const trashedIds = new Set(trashedTags.map(item => item.id));
          // // Filter out items that are already trashed
          // const newItemsToAdd = itemsToDelete
          //   .filter(item => !trashedIds.has(item.id))
          //   .map(item => ({
          //     ...item,
          //     _id: item.id,// ✅ Add _id key

          //   }));


          // const updatedTrashedTags = [...trashedTags, ...newItemsToAdd];
          // localStorage.setItem("trashedTags", JSON.stringify(updatedTrashedTags));


          // Update original activeTags array
          // const updatedActiveTags = activeTags.map(item =>
          //   newItemsToAdd.find(newItem => newItem.id === item.id)
          //     ? { ...item, trashed: true }
          //     : item
          // );
          // localStorage.setItem("tests", JSON.stringify(updatedActiveTags));


          // ✅ Update original testTags with archived: true
          // const updatedTrashTags = activeTags.map(item =>
          //   newItemsToAdd.find(newItem => newItem.id === item.id)
          //     ? { ...item, trashed: true }
          //     : item
          // );
          // localStorage.setItem("tests", JSON.stringify(updatedTrashTags));


          // ✅ Remove all selected items from activeTags (even if some were already trashed)--upcoming
          // const updatedActiveTags = activeTags.filter((_, index) => !selectedRows.includes(index));
          // localStorage.setItem("tests", JSON.stringify(updatedActiveTags));
          break;


        case "archive":

          if (modalType === "test") {
            const selectedTests = selectedRows.map(value => {
              const test = allQuestions?.find(q => q.id === value);
              return { id: test.id, name: test.test };
            });
            setModalHeading("Archive Tests")
            setEditingTest(selectedTests)
            
          } else {
            const selectedQB = selectedRows.map(value => {
              const test = allQuestions?.find(q => q.id === value);
              return { id: test.id, name: test.name };
            }); 
            setModalHeading("Archive QBs")
            setEditingQB(selectedQB);
          }

          setIsArchivedModalOpen(true);

          // if (selectedRows.length === 1) {
          //   const testId = Number(selectedRows[0]);
          //   const test = allQuestions?.find(q => q.id === testId);

          //   if (test) {
          //     if (modalType === "test") {
          //       setEditingTest({ id: test.id, name: test.test });
          //     } else {
          //       setEditingQB({ id: test.id, name: test.name });
          //     }
          //     setIsArchivedModalOpen(true);
          //   } else {
          //     toast.error("Test not found");
          //   }
          // }
        
        
          //onArchive(selectedRows);

          // localStorage.removeItem('archivedTestsData');
          // const archived = JSON.parse(localStorage.getItem('archivetags') || '[]');
          // const selectedIds = selectedRows.map(idx => allQuestions[idx - 1]?.id).filter(Boolean);
          // const newArchived = [...archived, ...selectedIds.filter(id => !archived.includes(id))];
          // const allTests = JSON.parse(localStorage.getItem('tests') || '[]');
          // const archivedTests = allTests.filter(test => selectedIds.includes(test.id)).map(test => ({ ...test, archived: true }));
          // const remainingTests = allTests.filter(test => !selectedIds.includes(test.id));
          // localStorage.setItem('archivetags', JSON.stringify(archivedTests));
          // const testTags = JSON.parse(localStorage.getItem("tests")) || [];
          // const archivedTags = JSON.parse(localStorage.getItem("archivetags")) || [];
          // Get selected items by index
          // const itemsToArchive = selectedRows
          //   .map(index => testTags[index - 1])
          //   .filter(item => item);
          // const archievedIds = new Set(archivedTags.map(item => item.id));
          // console.log('archivedid', archivedTags);

          // const newTagsToAdd = itemsToArchive.filter(item => !archievedIds.has(item.id));
          // const updatedArchivetags = [...archivedTags, ...newTagsToAdd];
          // localStorage.setItem("archivetags", JSON.stringify(updatedArchivetags));
          // ✅ Update original testTags with archived: true
          // const updatedTestTags = testTags.map(item =>
          //   newTagsToAdd.find(newItem => newItem.id === item.id)
          //     ? { ...item, archived: true }
          //     : item
          // );
          // localStorage.setItem("tests", JSON.stringify(updatedTestTags));


          /// Questions Archieve

          // const QB = JSON.parse(localStorage.getItem("QB")) || [];
          // const archivedQBs = JSON.parse(localStorage.getItem("archivedQues")) || [];
          // Get selected items by index
          // const qbToArchive = selectedRows
          //   .map(index => testTags[index - 1])
          //   .filter(item => item);
          // const archievedQBIds = new Set(archivedTags.map(item => item.id));
          // console.log('archivedid', archivedTags);

          // const newQBToAdd = qbToArchive.filter(item => !archievedQBIds.has(item.id));
          // const updatedArchiveQB = [...archivedTags, ...newQBToAdd];
          // localStorage.setItem("archivedQues", JSON.stringify(updatedArchiveQB));
          // ✅ Update original testTags with archived: true
          // const updatedQB = testTags.map(item =>
          //   newQBToAdd.find(newItem => newItem.id === item.id)
          //     ? { ...item, archived: true }
          //     : item
          // );
          // localStorage.setItem("QB", JSON.stringify(updatedQB));

          break;
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

  const canShowMore = availableActions.includes("more");
  const canEnableMore = selectedRows.length === 1;

  return (
    <div className="tube-bulk-actions-container" ref={dropdownRef}>
      <div className="tube-bulk-actions">
        {availableActions
          .filter(action => ["delete", "archive", "download",].includes(action))
          .map((action, index, filteredActions) => {
            
            const isLastVisible = action === lastVisibleAction;

            const isLastItem = index === filteredActions.length - 1;

            return (
              <React.Fragment key={`${action}-${index}`}>
                <div className="tube-bulk-button">
                  {renderActionButton(action, index, isLastVisible,)}
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
      {/* MORE BUTTON */}
      {/* {canShowMore && (
        <div
          className={`tube-bulk-actions more-actions ${!canEnableMore ? "disabled" : ""}`}
        >
          <button
            className={`tube-action-button dropdown-toggle2 moreoption ${activeDropdown === "more" ? "active" : ""
              }`}
            onClick={(e) => {
              e.stopPropagation();
              if (!canEnableMore) return;
              setActiveDropdown(activeDropdown === "more" ? null : "more");
            }}
          >
            More
          </button>
        </div>
      )} */}


      {/* Restore in its own container */}
      {availableActions.includes("restore") && (
        <div className="tube-bulk-actions restore-actions">
          {renderActionButton("restore", 0, false)}
        </div>
      )}

      {/* Tag Dropdown */}
      {activeDropdown === "tag" && (
        <>
          {modalType === "test" ? (
            // --- TAG MODE ---
            <div className="tag-options">
              <p className="addtotag-box-heading">Add To Tag</p>
              <ul className="tag-options-list">
                {tags.filter(tag => "questions" in tag).map((tag) => {
                  const alreadyTaggedCount = selectedRows.filter(id =>
                    tag.questions.includes(id)
                  ).length;

                  const isRecentlyTagged =
                    recentlyTagged[tag.name] &&
                    Date.now() - recentlyTagged[tag.name] < 2000;

                  const willAddNew = selectedRows.some(id =>
                    !tag.questions.includes(id)
                  );

                  return (
                    <li
                      key={tag.id}
                      className={`tag-options-item ${alreadyTaggedCount === selectedRows.length ? "all-tagged" : ""}`}
                      onClick={() => handleAddToTag(tag.name)}
                    >
                      <div className="tag-container">
                        <span className="tick-mark">
                          {alreadyTaggedCount === selectedRows.length ? "✓" : ""}
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
                            {willAddNew ? (
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
                  onClick={() => {
                    setIsNewTagModalOpen(true);
                    setActiveDropdown(null);
                  }}
                >
                  Create New Tag
                </button>
              </div>
            </div>
          ) : (
            // --- FOLDER MODE ---
            <div className="tag-options">
              <p className="addtotag-box-heading">Add To Folder</p>
              <ul className="tag-options-list">
                {folder.filter(folder => "QB" in folder).map((folder) => {
                  const alreadyTaggedCount = selectedRows.filter(id =>
                    folder.QB.includes(id)
                  ).length;

                  const isRecentlyFolder =
                    recentlyFolder[folder.name] &&
                    Date.now() - recentlyFolder[folder.name] < 2000;

                  const willAddNew = selectedRows.some(id =>
                    !folder.QB.includes(id)
                  );

                  return (
                    <li
                      key={folder.id}
                      className={`tag-options-item ${alreadyTaggedCount === selectedRows.length ? "all-tagged" : ""}`}
                      onClick={() => handleAddToFolder(folder.name)}
                    >
                      <div className="tag-container">
                        <span className="tick-mark">
                          {alreadyTaggedCount === selectedRows.length ? "✓" : ""}
                        </span>
                        <span className="dot-name-wrapper">
                          <span
                            className="tag-dot"
                            style={{ backgroundColor: folder.color || "#090808ff" }}
                          ></span>
                          <span className="tag-name">{folder.name}</span>
                        </span>
                        {isRecentlyFolder && (
                          <span className="tag-checkmark">
                            <Check size={16} />
                            {willAddNew ? (
                              <span className="tooltip">Added to folder</span>
                            ) : (
                              <span className="tooltip">Already in folder</span>
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
                  onClick={() => {
                    setIsNewTagModalOpen(true);
                    setActiveDropdown(null);
                  }}
                >
                  Create New Folder
                </button>
              </div>
            </div>
          )}
        </>
      )}


      {/* More Options Dropdown */}
      {/* {activeDropdown === "more" && canEnableMore &&(
        <div className="more-options">
          <ul>
            <li
              className="more-options-item"
              onClick={() => {
                try {
                  if (selectedRows.length === 1) {
                    const testId = Number(selectedRows[0]); // ensure type match
                    const test = allQuestions?.find(q => q.id === testId);
                    if (test) {
                      if(modalType === "test"){
                        setEditingTest({
                          id: test.id,
                          name: test.test,
                        });
                        setModalHeading("Rename Tests")
                        setIsRenameModalOpen(true);
                      }else{
                        setEditingQB({
                          id: test.id,
                          name: test.name,
                        });
                        setModalHeading("Rename QB")
                        setIsRenameModalOpen(true);
                      }
                     
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
            {modalType === "test" && (
              <li
                className="more-options-item"
                onClick={() => {
                  try {
                   if(selectedRows.length === 1){
                     const testId = Number(selectedRows[0]); // ensure type match
                     const test = allQuestions?.find(q => q.id === testId);
                     setEditingTest(
                      {
                        id: test.id,
                        name: test.test,
                      }
                     )
                     setModalHeading("Copy Tests")
                     setIsCopyModalOpen(true);
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
            )}
            
          </ul>
        </div>
      )} */}


      {/*Create tag and folder Modal */}
      {
        modalType === "test" && (
          <AddTagModal
            isOpen={isNewTagModalOpen}
            onClose={() => setIsNewTagModalOpen(false)}
            onAddTag={onAddTag}
            heading="Create New Tag"
          />
        )
      }

      {
        modalType !== "test" && (
          <AddFolderModal
            isOpen={isNewTagModalOpen}
            onClose={() => setIsNewTagModalOpen(false)}
            onAddFolder={onAddFolder}
            heading="Create New Folder"
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