"use client"

import { VscTriangleDown } from "react-icons/vsc";
import React, { useState, useEffect ,useRef} from "react"


import {
  FaPaperPlane,
  FaCopy,
  FaFilePdf,
  FaArchive,
  FaTrashAlt,
  FaFolderPlus,
  FaEdit,
  FaEllipsisH,
} from "react-icons/fa"
import TeacherQuestionBankSidebar from "./TeacherQuestionBankSidebar/TeacherQuestionBankSidebar"
import { Link } from "react-router-dom"
import { HiDotsVertical } from "react-icons/hi";
import { Helmet } from "react-helmet";
import DataTable from "../../../ReusableComponents/TableComponent/TableComponent";
import PaginationButtons from "../../../ReusableComponents/Pagination/PaginationButton";
import PaginationInfo from "../../../ReusableComponents/Pagination/PaginationInfo";
import NewQBModal from "../../../ReusableComponents/NewQBModal/NewQBModal";


const TeachersQuestionBanks = () => {
  // Static rows for the table with IDs (now with tags array)
  const data = [
    { id: 1, name: "QB1", questions: 10, lastModified: "2 days ago by You", tags: ["math","easy"] },
    { id: 2, name: "QB2", questions: 10, lastModified: "2 days ago by You", tags: [] },
    { id: 3, name: "QB3", questions: 15, lastModified: "2 days ago by You", tags: ["physics"] },
    { id: 4, name: "QB4", questions: 15, lastModified: "1 day ago by You", tags: [] },
    { id: 5, name: "QB5", questions: 15, lastModified: "1 day ago by You", tags: [] },
    { id: 6, name: "QB6", questions: 15, lastModified: "1 day ago by You", tags: [] },
    { id: 7, name: "QB7", questions: 15, lastModified: "1 day ago by You", tags: [] },
    { id: 8, name: "QB8", questions: 15, lastModified: "1 day ago by You", tags: [] },
    { id: 9, name: "QB9", questions: 15, lastModified: "1 day ago by You", tags: [] },
    { id: 10, name: "QB10", questions: 15, lastModified: "1 day ago by You", tags: [] },
  ]
  const [foldersIteam, setFoldersIteam] = useState([
    {id:1, name: "Math Folder", color: "#9c27b0" ,QB:[]}, 
    {id:2, name: "Science Folder", color: "#2196f3" ,QB:[]}])
  const [qbs, setQBs] = useState([]);
  const [modalHeading, setModalHeading] = useState("");
  const [editingQB,setEditingQB] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false)
  const [isArchivedModalOpen, setIsArchivedModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // dataItem will contain tags now
  const [dataItem,setDataItem] = useState(data);
  const [ispinning, setIsSpinning] = useState(null);
  //new Question Bank Add
  const [isQbModalOpen, setIsQbModalOpen] = useState(false);

  const [isMobileOpen, setIsMobileOpen] = useState(false);
 

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [showButtons, setShowButtons] = useState(true)
  const [dataTableVisible, setDataTableVisible] = useState(false)
  const [fullViewMode, setFullViewMode] = useState(false)

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredCount, setFilteredCount] = useState(data.length)

  // Mobile dropdown state
  const [openDropdownId, setOpenDropdownId] = useState(null)
  const [isMobile, setIsMobile] = useState(false);

  // Filter data based on search (now also searches tags)
  const getFilteredData = () => {
    return dataItem.filter((qb) => {
      const matchesSearch = searchQuery === "" ||
        qb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qb.questions.toString().includes(searchQuery) ||
        qb.lastModified.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // search in tags
        (qb.tags && qb.tags.join(" ").toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesSearch
    })
  }

  const filteredData = getFilteredData()

  // Update filtered count when data changes
  useEffect(() => {
    setFilteredCount(filteredData.length)
  }, [filteredData.length])

  // Get current page data
  const getCurrentPageData = () => {
    const dataToUse = sortedFilteredData;

    if (fullViewMode) {
      return dataToUse;
    }

    const startIndex = (currentPage - 1) * rowsPerPage;
    return dataToUse.slice(startIndex, startIndex + rowsPerPage);
  };

  // Check if we should show pagination buttons
  const showPaginationButtons = !fullViewMode && rowsPerPage < filteredData.length

  // Handle search change
  const handleSearchChange = (value) => {
    setSearchQuery(value)
    setCurrentPage(1) // Reset to first page when searching
  }

  // Check if screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])


  // Add refs at the top of your component
  const sidebarRef = useRef(null);
  const toggleRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Only handle clicks when sidebar is open
      if (!isMobileOpen) return;

      const sidebar = sidebarRef.current;
      const toggle = toggleRef.current;

      // If we don't have refs, don't do anything
      if (!sidebar || !toggle) return;

      // Check if click is outside both sidebar and toggle button
      const isOutsideSidebar = !sidebar.contains(e.target);
      const isOutsideToggle = !toggle.contains(e.target);

      if (isOutsideSidebar && isOutsideToggle) {
        console.log('Closing sidebar - click was outside');
        setIsMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileOpen]);



  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);  
  };

  // Pagination functions
  const loadMore = () => {
    const newRows = rowsPerPage + 5
    setRowsPerPage(Math.min(newRows, filteredData.length))
  }

  const toggleFullView = () => {
    if (!fullViewMode) {
      // Enter Full View mode
      setRowsPerPage(filteredData.length)
    } else {
      // Exit Full View mode
      setRowsPerPage(5)
    }
    setFullViewMode(!fullViewMode)
  }

  const toggleDropdown = (rowId) => {
    setOpenDropdownId(openDropdownId === rowId ? null : rowId)
  }

  const handleNewQuestionBank = () =>{
    // open modal in create mode
    setModalHeading("Create New QB")
    setEditingQB(null)
    setIsQbModalOpen(true)    
  }


  // Function to create a new QB
  // qbData should include { id, name, questions, lastModified, tags }
  const handleCreateQB = (qbData) => {
    console.log("New QB created:", qbData);
    // ensure tags field exists (array)
    const normalized = { ...qbData, tags: qbData.tags ? qbData.tags : [] }
    setDataItem((prev) => [...prev, normalized]);
    setIsQbModalOpen(false);
  };


//Question Bank Name Edit
  const handleUpdateQB = (QBId, updatedFields) => {    
    setDataItem(prevData =>
      prevData.map(qb =>
        qb.id === QBId
          ? { ...qb, ...updatedFields} // updatedFields may include tags now
          : qb
      )
    );
  };

  //Question Bank handleArchiveQB   
  const handleArchiveQB = (QBId) =>{
    setDataItem(prevData =>
      prevData.filter(QB =>
        !QBId.some(st => st.id === QB.id) // remove all selected ids
      ))
  }

  //Question Bank handleDeletedQB 
  const handleDeleteQB = (QBId) => {
    // setDataItem(prevData => prevData.filter(qb => qb.id !== QBId));
    setDataItem(prevData =>
      prevData.filter(QB =>
        !QBId.some(st => st.id === QB.id) // remove all selected ids
      ))
  }

  //Pdf Download
  const handleDownloadPdf = (row) => {
    setIsSpinning(row.id)
    setTimeout(() => {
      setIsSpinning(null)
    }, 2000);
  }

  
  //add to folder
  const handleAddFolder = ({ name, color }) => {
      setFoldersIteam(prev => [
        ...prev,
        {
          id: prev.length > 0 ? Math.max(...prev.map(f => f.id)) + 1 : 1,
          name,
          color,
          QB:[]
        },
      ]);
  };

  const handleAddToFolder = (folderName, questionIds) => {

    console.log(folderName,questionIds);
    
  setFoldersIteam(prevFolders =>
    prevFolders.map(folder => {
      if (folder.name === folderName) {
        const qbSet = new Set(folder.QB);
        questionIds.forEach(id => qbSet.add(id));
        return {
          ...folder,
          QB: Array.from(qbSet)
        };
      }
      return folder;
    })
  );
};

const handleRemoveQuestionFromFolder = (folderName, questionId) => {
  setFoldersIteam(prev =>
    prev.map(folder => {
      if (folder.name === folderName) {
        return {
          ...folder,
          QB: folder.QB.filter(id => id !== questionId)
        };
      }
      return folder;
    })
  );
};




  const handleActionClick = (action, row) => {
    // Close dropdown first
    setOpenDropdownId(null)
    // Then execute the action
    switch (action) {
      case "pdf":
        handleDownloadPdf(row);
        break
      case "folder":
        console.log("Add to folder for", row.name)
        break
      case "rename":
        setEditingQB({
          id: row.id,
          name: row.test,
        });
        setModalHeading("Rename QB")
        setIsRenameModalOpen(true);
        break;
      case "edit":
        // open modal in edit mode and pass initial tags
        setEditingQB({
          id: row.id,
          name: row.name,
          questions: row.questions,
          lastModified: row.lastModified,
          tags: row.tags || []
        });
        setModalHeading("Edit QB")
        setIsEditModalOpen(true);
        break
      case "archive":
        setEditingQB([{ id: row.id, name: row.name }]);
        setModalHeading("Archive QB")
        setIsArchivedModalOpen(true)
        break
      case "delete":
        setEditingQB([{ id: row.id, name: row.name }]);
        setModalHeading("Delete QB")
        setIsDeleteModalOpen(true)
        break
      default:
        break
    }
  }

  const getTimeFromString = (text) => {
    const now = new Date();

    // 🧩 Prevent crash if text is missing or not a string
    if (!text || typeof text !== "string") return now.getTime();

    const match = text.match(/(\d+)\s+(hour|hours|day|days)/i);
    if (!match) return now.getTime();

    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();

    if (unit.startsWith("hour")) return now.getTime() - value * 60 * 60 * 1000;
    if (unit.startsWith("day")) return now.getTime() - value * 24 * 60 * 60 * 1000;

    return now.getTime();
  };

  //console.log("getTimeFromString" + getTimeFromString);
  


  const sortedFilteredData = [...filteredData].sort((a, b) =>
    getTimeFromString(b?.lastModified) - getTimeFromString(a?.lastModified)
  );




  const columns = [
    {
      name: (
        <div className="flex items-center">
          <span>QB Names</span>
        </div>
      ),
      selector: "name",
      width: "150px", 
      cell: (row) => (
        <div className="flex items-center qb-name-cell">
          <Link to={`questions`}>
            <span className="row-link">{row.name}</span>
          </Link>

          {/* TAGS: display small chips beside name */}
         <div className="question-tags">
  {foldersIteam
    .filter(folder => folder.QB?.includes(row.id))
    .map(folder => (
      <div key={folder.id} className="question-tag-container">
        <div className="question-tag">
          <span
            className="tag-color-dot"
            style={{ backgroundColor: folder.color }}
          ></span>
          <span className="index-tag-name">{folder.name}</span>
        </div>
        <span
          className="tag-remove"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveQuestionFromFolder(folder.name, row.id);
          }}
        >
          &times;
        </span>
      </div>
    ))}
</div>

        </div>
      ),
    },
    {
      name: "Questions" ,
      selector: "questions",
      sortable: true,
      width: "70px", 
    },
    {
      name: <div className="cursor-pointer">Last Modified</div>,
      selector: "lastModified",
      sortable: true,
      width: "70px", 
    },
    {
      name: "Actions",
      selector: "actions",
      sortable: false,
      width: "70px", 
      cell: (row) => (
        <div className="test-action-buttons">
          {isMobile ? (
            // Mobile: Show three dots dropdown
            <div className="mobile-actions-dropdown">
              <button
                className="test-action-button mobile-menu-trigger"
                onClick={() => toggleDropdown(row.id)}
                aria-label="More actions"
              >
                <HiDotsVertical />
              </button>

              {openDropdownId === row.id && (
                <div className="mobile-actions-menu">
                  <button className="mobile-action-item pdf" onClick={() => handleActionClick("pdf", row)}>
                        {ispinning === row.id ? (
                        <div className="spinner"></div>
                      ) : (
                        <FaFilePdf />
                      )}
                    <span>Download PDF</span>
                  </button>
                  <button className="mobile-action-item folder" onClick={() => handleActionClick("folder", row)}>
                    <FaFolderPlus />
                    <span>Add to Folder</span>
                  </button>
                  <button className="mobile-action-item edit" onClick={() => handleActionClick("edit", row)}>
                    <FaEdit />
                    <span>Edit</span>
                  </button>
                  <button className="mobile-action-item archive" onClick={() => handleActionClick("archive", row)}>
                    <FaArchive />
                    <span>Archive</span>
                  </button>
                  <button className="mobile-action-item delete" onClick={() => handleActionClick("delete", row)}>
                    <FaTrashAlt />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Desktop: Show all buttons inline
            <div className="flex ">
              <button 
                className="test-action-button pdf" 
                aria-label="Download PDF"
                onClick={() => handleActionClick("pdf", row)}
                >
                  {ispinning === row.id ? (
                    <div className="spinner"></div>
                  ) : (
                    <FaFilePdf />
                  )}
                <span className="tooltip-text">Download PDF</span>
              </button>
              <button className="test-action-button copy" aria-label="Add to Folder">
                <FaFolderPlus />
                <span className="tooltip-text">Add to Folder</span>
              </button>
              <button
                className="test-action-button edit"
                aria-label="Edit"
                onClick={() => handleActionClick("edit", row)}
              >
                <FaEdit />
                <span className="tooltip-text">Edit</span>
              </button>
              <button 
                className="test-action-button archive" 
                aria-label="Archive"
                onClick={() => handleActionClick("archive", row)}
              >
                <FaArchive />
                <span className="tooltip-text">Archive</span>
              </button>
              <button 
                className="test-action-button delete" 
                aria-label="Delete"
                onClick={() => handleActionClick("delete", row)}>
                <FaTrashAlt />
                <span className="tooltip-text">Delete</span>
              </button>
            </div>
          )}
        </div>
      ),
    },
  ]

  return (
    <>
      <Helmet>
        <title>My Question Banks - Teacher</title>
        <meta name="description" content="Teacher Question Banks List" />
      </Helmet>
      
      <div className="questionbank-index-wrapper">
        
        <div className="test-index-header-moblie">
          <h1 className="breadcrumb">My Question Banks</h1>
          <VscTriangleDown onClick={toggleMobileSidebar} ref={toggleRef} className="TriagbleDown" />
        </div>
         
        <div ref={sidebarRef}>
          <TeacherQuestionBankSidebar
            foldersIteam={foldersIteam}
            setFoldersIteam={setFoldersIteam}
            createNewQuestionBank={handleNewQuestionBank}
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
          />
        </div>
       
        <div className="questionbank-index-container">

       
          {/* {isMobileOpen && (
            <div ref={sidebarRef}>
              <Sidebar
                foldersIteam={foldersIteam}
                setFoldersIteam={setFoldersIteam}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
                createNewQuestionBank={handleNewQuestionBank}
              />
            </div>
          )} */}
          
        
          <div className="test-index-header">
            <h1 className="breadcrumb">My Question Banks</h1>
          </div>

         
          <div className="my-data-table">
            <DataTable
              columns={columns}
              data={getCurrentPageData()}
              folder={foldersIteam}
              onAddFolder={handleAddFolder}
              availableActions={["delete", "archive", "download", "tag", "more"]}
              setModalHeading={setModalHeading}
              enableToggle={false}
              searchoption={true}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              allQuestions={data}
              modalType="QB"
              onAddQBToFolder={handleAddToFolder}
              setIsQbModalOpen={setIsQbModalOpen}
              setIsRenameModalOpen={setIsRenameModalOpen}
              setEditingQB={setEditingQB}
              setIsDeleteModalOpen={setIsDeleteModalOpen}
              setIsArchivedModalOpen={setIsArchivedModalOpen}
              newQuestioBank ={handleNewQuestionBank}
            />
          </div>
        </div>

        {showPaginationButtons && (
          <PaginationButtons
            filteredQuestions={filteredData}
            rowsPerPage={rowsPerPage}
            currentPage={currentPage}
            loadMore={loadMore}
            fullView={toggleFullView}
            fullViewMode={fullViewMode}
          />
        )}

        <PaginationInfo
          filteredQuestions={filteredData}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          label="Question Banks"
          totalItems={data.length}
          isSearching={searchQuery.length > 0}
        />

         {/* Create Modal (open via handleNewQuestionBank) */}
        {isQbModalOpen && (
          <NewQBModal
            heading={modalHeading || "Create New QB"}
            isOpen={isQbModalOpen}
            onClose={() => setIsQbModalOpen(false)}
            // For create mode, send empty initial values and an empty tags array
            initialName={""}
            initialQuestions={0}
            initialTags={[]} // <-- IMPORTANT: modal should accept this prop to prefill tags
            onSubmit={(qbData) => {
              // Expect qbData to contain name, questions, lastModified(optional), tags (array)
              // Normalize id and lastModified if not provided
              const newId = Math.max(0, ...dataItem.map(d => d.id)) + 1;
              const normalized = {
                id: newId,
                name: qbData.name || `QB ${newId}`,
                questions: qbData.questions ?? 0,
                lastModified: qbData.lastModified || "just now",
                tags: qbData.tags ? qbData.tags : []
              };
              handleCreateQB(normalized);
            }}
            mode="create"
          />
        )}

        {isEditModalOpen && editingQB && (
          <NewQBModal
            heading={modalHeading || "Edit QB"}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingQB(null);
            }}
            // Prefill the modal with existing QB fields including tags
            initialName={editingQB.name || ""}
            initialQuestions={editingQB.questions || 0}
            initialTags={editingQB.tags || []} // <-- modal should accept this
            onSubmit={(updatedFields) => {
              // updatedFields should include tags array if changed
              handleUpdateQB(editingQB.id, {
                name: updatedFields.name,
                questions: updatedFields.questions,
                lastModified: updatedFields.lastModified || editingQB.lastModified,
                tags: updatedFields.tags ? updatedFields.tags : editingQB.tags || []
              });
              setIsEditModalOpen(false);
              setEditingQB(null);
            }}
            mode="edit"
          />
        )}

        {isArchivedModalOpen && (
          <NewQBModal
            heading={modalHeading}
            isOpen={isArchivedModalOpen}
            onClose={() => { setIsArchivedModalOpen(false); setEditingQB(null); }}
            selectedTest={editingQB}
            onSubmit={(editingQB) => {
              handleArchiveQB(editingQB);
              setIsArchivedModalOpen(false)
            }}
            mode="archive"
          />
        )}

          {isDeleteModalOpen && (
            <NewQBModal
            heading={modalHeading}
            isOpen={isDeleteModalOpen}
            onClose={() => { setIsDeleteModalOpen(false); setEditingQB(null); }}
            selectedTest={editingQB}
            onSubmit={(selectedTest) => {
                handleDeleteQB(selectedTest);
                setIsDeleteModalOpen(false)
              }}
            mode="delete"
            />
         )}

        {isRenameModalOpen && (
          <NewQBModal
            heading={modalHeading}
            isOpen={isRenameModalOpen}
            onClose={() => {
              setIsRenameModalOpen(false);
              setEditingQB(null);
            }}
            initialName={editingQB?.name || ""}
            onSubmit={(updatedFields) => {
              handleUpdateQB(editingQB.id, updatedFields);
              setIsRenameModalOpen(false);
              setEditingQB(null);
            }}
            mode="rename"
          />
          )}

      </div>
    </>
  )
}

export default TeachersQuestionBanks