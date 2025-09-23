import React, { useState, useRef, useEffect } from "react";
import DispatchModal from "../../../Test/DispatchModal/DispatchModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FaPaperPlane,
  FaCopy,
  FaFilePdf,
  FaArchive,
  FaTrashAlt,
  FaSearch,
  FaTrash,
  FaShare,
  FaTag,
  FaEllipsisH,
  FaDownload,
  FaPlus,
  FaCheck,
  FaTimes,
  FaRegWindowRestore,
  FaEdit,

  FaArrowUp,
  FaArrowDown
} from "react-icons/fa";
import { ArchiveRestore } from 'lucide-react';
import ShareModal from "../ShareModal/ShareModal";
import { Link } from "react-router-dom";
import TablePagination from "../../../../../TablePagination";
import DataTable from "../../../../ReusableComponents/TableComponent/TableComponent";
import PaginationButtons from "../../../../ReusableComponents/Pagination/PaginationButton";
import PaginationInfo from "../../../../ReusableComponents/Pagination/PaginationInfo";
import { getTimeAgo } from "../../../../../utils/time-utils";
const getTrashed = () => {
  const archived = JSON.parse(localStorage.getItem("trashedTags"));
  //localStorage.removeItem('trashedTags')
  if (archived?.length > 0) {
    var sortedList = archived.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
  } try {
    return sortedList ? sortedList : [];
  } catch {
    return [];
  }
};

const mockScheduledTests = [
  { date: "2025-01-05", time: "10:30 AM" },
  { date: "2025-01-06", time: "2:00 PM" },
];


const Trashed = () => {
  const [data, setData] = useState(getTrashed());
  useEffect(() => {
    const handleStorageChange = () => {
      setData(getTrashed());
    };
    window.addEventListener("storage", handleStorageChange);
    // Optionally, update data on page refresh
    handleStorageChange();
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [emails, setEmails] = useState([]);
  const [showTagOptions, setShowTagOptions] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showButtons, setShowButtons] = useState(true);
  const [selectedTest, setSelectedTest] = useState("");

  // Search and filter related state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filteredCount, setFilteredCount] = useState(data.length);
  const [fullViewMode, setFullViewMode] = useState(false);

  const tagOptionsRef = useRef(null);
  const moreOptionsRef = useRef(null);
  // New state for mobile dropdown
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  // Filter data based on search and status
  const getFilteredData = () => {
    return data.filter((test) => {
      const matchesSearch = searchQuery === "" ||
        test.test.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.lastModified.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filterStatus === "" || test.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  };

  const filteredData = getFilteredData();
  const [tags, setTags] = useState(() => {
    const savedTags = localStorage.getItem("testTags")
    return savedTags ? JSON.parse(savedTags) : [
      { id: 1, name: "Important", color: "#FF0000", questions: [] },
      { id: 2, name: "Review", color: "#FF9900", questions: [] },
      { id: 3, name: "Completed", color: "#008000", questions: [] },
    ]
  })
  // Update filtered count when data changes
  useEffect(() => {
    setFilteredCount(filteredData.length);
  }, [filteredData.length]);

  // Get current page data
  const getCurrentPageData = () => {
    if (fullViewMode) {
      return filteredData;
    }
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  };

  // Load trashed items from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("trashedTags")) || [];
    setData(stored);
  }, []);

  // Restore handler: remove from trashedTags, add to tags, set deleted=false
  const handleRestoreTag = (row) => {
    const tests = JSON.parse(localStorage.getItem("tests") || "[]");
    const updatedTags = tests.map((item) =>
      item.id === row.id
        ? { ...item, trashed: false }
        : item
    );
    localStorage.setItem("tests", JSON.stringify(updatedTags));

    const itemToRestore = data.find(item => item.id === row.id);
    if (!itemToRestore) return;
    // Remove from trashed
    const updatedTrash = data.filter(item => item.id !== row.id);
    localStorage.setItem("trashedTags", JSON.stringify(updatedTrash));
    setData(updatedTrash);
    // Add to active
    const activeItems = JSON.parse(localStorage.getItem("tags")) || [];
    activeItems.push(itemToRestore);
    localStorage.setItem("tags", JSON.stringify(activeItems));
  };


  // Check if we should show pagination buttons
  const showPaginationButtons = !fullViewMode && rowsPerPage < filteredData.length;

  // Handle search change
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle filter status change
  const handleFilterStatusChange = (value) => {
    setFilterStatus(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.mobile-actions-dropdown')) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openModal = (testName) => {
    setSelectedTest(testName);
    setIsModalOpen(true);
    setOpenDropdownId(null); // Close dropdown when action is taken
  };

  const toggleDropdown = (rowId) => {
    setOpenDropdownId(openDropdownId === rowId ? null : rowId);
  };
  const openShareModal = (testName) => {
    setSelectedTest(testName);
    setIsShareModalOpen(true);
    setOpenDropdownId(null); // Close dropdown when action is taken
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tagOptionsRef.current && !tagOptionsRef.current.contains(event.target)) {
        setShowTagOptions(false);
      }
      if (moreOptionsRef.current && !moreOptionsRef.current.contains(event.target)) {
        setShowMoreOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Pagination functions
  const loadMore = () => {
    const newRows = rowsPerPage + 5;
    setRowsPerPage(Math.min(newRows, filteredData.length));
  };

  const toggleFullView = () => {
    if (!fullViewMode) {
      // Enter Full View mode
      setRowsPerPage(filteredData.length);
    } else {
      // Exit Full View mode
      setRowsPerPage(5);
    }
    setFullViewMode(!fullViewMode);
  };

  // Functions to handle Restore and Delete actions
  const handleRestore = (row) => {
    console.log("Restore action for:", row);
  };

  const handleDelete = (row) => {
    console.log("Delete action for:", row);
  };
  const handleActionClick = (action, row) => {
    // Close dropdown first
    setOpenDropdownId(null);

    // Then execute the action
    switch (action) {
      case 'dispatch':
        openModal(row.test);
        break;
      case 'share':
        openShareModal(row.test);
        break;
      case 'copy':
        console.log('Copy action for', row.test);
        break;
      case 'pdf':
        console.log('PDF download for', row.test);
        break;
      case 'archive':
        console.log('Archive action for', row.test);
        break;
      case 'delete':
        console.log('Delete action for', row.test);
        break;
      default:
        break;
    }
  };
  const columns = [
    // {
    //   name: (
    //     <div>
    //       Test Names
    //     </div>
    //   ),
    //   selector: "test",
    //   sortable: true,
    //   width: "250px",
    //   cell: (row) => (
    //     <div style={{ display: "flex", alignItems: "center" }}>
    //       <Link to={`/test/${row.id}/movetest`} state={{ testName: row.test, testId: row.id }}>
    //         <span className="row-link">{row.test}</span>
    //       </Link>
    //     </div>
    //   ),
    // },
    {
      name: "Test Names",
      selector: "test",
      width: "170px", // Set fixed width
      cell: (row) => (
        <div className="flex items-center">
          <Link to={`/test/${row.id}/movetest`} state={{ testName: row.test, testId: row.id }}>
            <span className="row-link">{row.test}</span>
          </Link>
          <div className="question-tags">
            {tags.filter(tag => (tag.questions?.includes(row.id)))
              .map(tag => (
                <div key={tag.id} className="question-tag-container">
                  <div className="question-tag">
                    <span
                      className="tag-color-dot"
                      style={{ backgroundColor: tag.color }}
                    ></span>
                    <span className="index-tag-name">{tag.name}</span>
                  </div>
                  {/* <span
                        className="tag-remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveQuestionFromTag(tag.name, row.id);
                        }}
                      >
                        &times;
                      </span> */}
                </div>
              ))}
          </div>
        </div>
      ),
    },
    {
      name: (
        <div>
          Owner
        </div>
      ),
      selector: "owner",
      sortable: false,
    },
    {
      name: (
        <div>
          Status
        </div>
      ),
      selector: "status",
      sortable: true,
    },
    {
      name: (
        <div>
          Last Modified
        </div>
      ),
      selector: "lastModified",
      sortable: true,
      cell: (row) => <div>{getTimeAgo(row.lastModified)}</div>
    },
    {
      name: "Actions",
      selector: "actions",
      sortable: false,
      cell: (row) => (
        <div className="test-action-buttons">
          {isMobile ? (
            <div className="mobile-actions-dropdown">
              <button
                className="test-action-button mobile-menu-trigger"
                onClick={() => toggleDropdown(row.id)}
                aria-label="More actions"
              >
                <FaEllipsisH />
              </button>

              {openDropdownId === row.id && (
                <div className="mobile-actions-menu">
                  <button
                    className="mobile-action-item archive"
                    onClick={() => handleRestore(row)}
                  >
                    <FaRegWindowRestore />
                    <span> ReStore</span>
                  </button>
                  <button
                    className="mobile-action-item delete"
                    onClick={() => handleActionClick('delete', row)}
                  >
                    <FaTrashAlt />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                className="test-action-button dispatch"
                aria-label="Archive"
                onClick={() => handleRestoreTag(row)}
              >
                <FaRegWindowRestore />
                <span className="tooltip-text"> ReStore</span>
              </button>
              <button
                className="test-action-button dispatch"
                aria-label="Dispatch"
                onClick={() => handleActionClick('delete', row)}
              >
                <FaTrashAlt />
                <span className="tooltip-text">Delete</span>
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];


  return (
    <>
      <div className="test-index-wrapper">
        <div className="test-index-container">
          <div className="test-index-header">
            <h1 className="breadcrumb">Trashed</h1>
          </div>

          <div className="my-data-table">
            <DataTable
              columns={columns}
              data={getCurrentPageData()}
              availableActions={["delete", "download", "tag","restore"]}
              searchoption={true}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              filterType={filterStatus}
              onFilterTypeChange={handleFilterStatusChange}
            />
          </div>

          <ShareModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            emails={emails}
            setEmails={setEmails}
          />

          <DispatchModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            scheduledTests={mockScheduledTests}
          />
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
          label="Tests"
          totalItems={data.length}
          isSearching={searchQuery.length > 0 || filterStatus.length > 0}
        />
      </div>
    </>
  );
};

export default Trashed;