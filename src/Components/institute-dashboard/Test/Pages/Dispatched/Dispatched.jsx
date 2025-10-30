import React, { useState, useRef, useEffect } from "react";
import DispatchModal from "../../DispatchModal/DispatchModal";
import PublishModal from "../../../../ReusableComponents/PublishModal/PublishModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { VscTriangleDown } from "react-icons/vsc";
import TestSidebar from "../../TestSidebar/TestSidebar";
import Modal from "react-modal"
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
  FaEdit,
  FaArrowUp,
  FaArrowDown
} from "react-icons/fa";
import ShareModal from "../ShareModal/ShareModal";

import { Link } from "react-router-dom";
import DataTable from "../../../../ReusableComponents/TableComponent/TableComponent";
import PaginationButtons from "../../../../ReusableComponents/Pagination/PaginationButton";
import PaginationInfo from "../../../../ReusableComponents/Pagination/PaginationInfo";
import { getTimeAgo } from "../../../../../utils/time-utils";

const initital = [
  // { id: 1, test: "Test 1", owner: "John Doe", status: "Published", lastModified: "2 days ago by You" },
  // { id: 2, test: "Test 2", owner: "Jane Smith", status: "Published", lastModified: "1 month ago by You" },
  // { id: 3, test: "Test 3", owner: "Mark Johnson", status: "Published", lastModified: "5 days ago by You" },
  // { id: 4, test: "Test 4", owner: "Mark Johnson", status: "Published", lastModified: "30 mns ago by You" },
  // { id: 5, test: "Test 5", owner: "Mark Johnson", status: "Published", lastModified: "2 month ago by You" },
  // { id: 6, test: "Test 6", owner: "Mark Johnson", status: "Published", lastModified: "1 day ago by You" },
];



const mockScheduledTests = [
  { date: "2025-01-05", time: "10:30 AM" },
  { date: "2025-01-06", time: "2:00 PM" },
];
const getPublished = () => {
  //localStorage.removeItem('publishedTests')
  const published = JSON.parse(localStorage.getItem("publishedTests"));
  const tests = JSON.parse(localStorage.getItem("tests"));
  if (published?.length !== 0) {
    var publishedTestIds = published?.map(test => test?.testId)
    const publishedTests = tests?.filter(test =>
      publishedTestIds?.includes(test.id)
    );
    const sortedList = publishedTests.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
    try {
      return published ? sortedList : [];
    } catch {
      return [];
    }
  }
};

const Dispatched = () => {
  const [data, setData] = useState(getPublished());
  useEffect(() => {
    const handleStorageChange = () => {
      setData(getPublished());
    };
    window.addEventListener("storage", handleStorageChange);
    // Optionally, update data on page refresh
    handleStorageChange();
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  //mobile View side bar
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filteredCount, setFilteredCount] = useState(data?.length);

  // Selection and UI states
  const [selectedRows, setSelectedRows] = useState([]);
  const [tags, setTags] = useState(() => {
    const storedTags = localStorage.getItem("testTags");
    return storedTags ? JSON.parse(storedTags) : ""
  });

  // // Load trashed items from localStorage on mount
  // useEffect(() => {
  //   const stored = JSON.parse(localStorage.getItem("publishedTests")) || [];
  //   setData(stored);
  // }, []);

  // const [tags, setTags] = useState(["Urgent", "Review", "Completed"]);
  const [showTagOptions, setShowTagOptions] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showButtons, setShowButtons] = useState(true);
  const [emails, setEmails] = useState([]);
  const [selectedTest, setSelectedTest] = useState();
  const [selectedTestId, setSelectedTestID] = useState("")
  const [modalIsOpen, setModalIsOpen] = useState(false)
  
  
  const tagOptionsRef = useRef(null);
  const moreOptionsRef = useRef(null);

  // New state for mobile dropdown
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  // Filter data based on search
  const getFilteredData = () => {
    return data?.filter((item) => {
      const matchesSearch = searchQuery === "" ||
        item.test.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.lastModified.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  };

  const filteredData = getFilteredData();

  // Update filtered count when data changes
  useEffect(() => {
    setFilteredCount(filteredData.length);
  }, [filteredData?.length]);

  // Get current page data
  const getCurrentPageData = () => {
    return filteredData?.slice(0, rowsPerPage);
  };

  // Pagination functions
  const loadMore = () => {
    const newRows = rowsPerPage + 5;
    setRowsPerPage(Math.min(newRows, filteredData.length));
    if (newRows >= filteredData.length) {
      setShowButtons(false);
    }
  };

  const fullView = () => {
    setRowsPerPage(filteredData.length);
    setShowButtons(false);
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
    console.log(testName.id);
    
    setSelectedTest(testName);
    setSelectedTestID(testName.id)
    setIsModalOpen(true);
    setOpenDropdownId(null); // Close dropdown when action is taken
  };

  const handleViewDetails = (testName) => {
    
    const test = data.find((test) => test.test === testName);
    
    console.log(test);
    
    setSelectedTest(test);
    setModalIsOpen(true)
  }

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

  const toggleDropdown = (rowId) => {
    setOpenDropdownId(openDropdownId === rowId ? null : rowId);
  };
  const openShareModal = (testName) => {

    setSelectedTest(testName);
    setIsShareModalOpen(true);
    setOpenDropdownId(null); // Close dropdown when action is taken
  };

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleActionClick = (action, row) => {
    // Close dropdown first
    setOpenDropdownId(null);

    // Then execute the action
    switch (action) {
      case 'publish':
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
      case 'details':
        handleViewDetails(row.test);
        break;
      default:
        break;
    }
  };

  const columns = [
    {
      name: <div><span>Test Names</span></div>,
      selector: "test",
      sortable: true,
      width: "250px",
      cell: (row) => (
        <div className="flex items-center">
          {/* <Link to={`/test/${row.id}/movetest`} state={{ testName: row.test, testId: row.id }}>
            <span className="row-link">{row.test}</span>
          </Link> */}
          <span className="row-link" onClick={() => { handleActionClick("details",row) }}>{row.test}</span>
          <div className="question-tags">
            {tags.filter(tag => tag.questions?.includes(row.id))
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
      name: <div>Owner</div>,
      selector: "owner",
      sortable: false,
    },
    {
      name: <div>First Published</div>,
      selector: "lastModified",
      sortable: true,
      cell: (row) => <div>{getTimeAgo(row.lastModified)}</div>
    },
    {
      name: "Actions",
      selector: "actions",
      sortable: false,
      cell: (row) =>
      (
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
                    className="mobile-action-item publish"
                    onClick={() => handleActionClick('publish', row)}
                  >
                    <FaPaperPlane />
                    <span>Publish</span>
                  </button>
                  <button
                    className="mobile-action-item copy"
                    onClick={() => handleActionClick('copy', row)}
                  >
                    <FaCopy />
                    <span>Copy</span>
                  </button>
                  <button
                    className="mobile-action-item pdf"
                    onClick={() => handleActionClick('pdf', row)}
                  >
                    <FaFilePdf />
                    <span>Download PDF</span>
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
              <button className="test-action-button publish" aria-label="Publish" onClick={() => handleActionClick('publish', row)}>
                <FaPaperPlane />
                <span className="tooltip-text">Publish</span>
              </button>
              <button className="test-action-button copy" aria-label="Copy">
                <FaCopy />
                <span className="tooltip-text">Copy</span>
              </button>
              <button className="test-action-button pdf" aria-label="Download PDF">
                <FaFilePdf />
                <span className="tooltip-text">Download PDF</span>
              </button>
              <button className="test-action-button delete" aria-label="delete">
                <FaTrashAlt />
                <span className="tooltip-text">Delete</span>
              </button>

            </div>
          )}
        </div>
      )
      ,
    },
  ];

  return (
    <>
      <div className="test-index-wrapper">
        <div className="test-index-header-moblie">
          <h1 className="breadcrumb">Published</h1>
          <VscTriangleDown onClick={toggleMobileSidebar} ref={toggleRef} className="TriagbleDown" />
        </div>

        <div ref={sidebarRef}>
          <TestSidebar
            tags={tags}
            setTags={setTags}
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
          />
        </div>

        <div className="test-index-container">
        
          <div className="test-index-header">
            <h1 className="breadcrumb">Published</h1>
          </div>

          <div className="my-data-table">
            <DataTable
              columns={columns}
              setTags={setTags}
              data={getCurrentPageData()}
              availableActions={["delete", "download", "tag"]}
              searchoption={true}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterType={filterType}
              onFilterTypeChange={setFilterType}
            />
          </div>

          <ShareModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            emails={emails}
            setEmails={setEmails}
          />

          {/* <DispatchModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            scheduledTests={mockScheduledTests}
          /> */}

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            className="modal-content"
            overlayClassName="modal-overlay"
            appElement={document.getElementById('root')}
          >
            {selectedTest && (
              <div
                className="test-detail-modal"
                style={{
                  lineHeight: "1.6",
                }}
              >
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                  }}
                >
                  {selectedTest.test}
                </h3>

                <hr style={{ marginBottom: "15px" }} />

                <div style={{ color: "#555", fontSize: "15px" }}>
                  <p>
                    <strong>Owner:</strong> {selectedTest.owner}
                  </p>
                  <p>
                    <strong>Total Mark:</strong> 80
                  </p>
                  <p>
                    <strong>Duration:</strong> {selectedTest.duration}
                  </p>
                  <p>
                    <strong>Description:</strong> {selectedTest.description}
                  </p>
                  <p>
                    <strong>Instructions:</strong> {selectedTest.instructions}
                  </p>
                </div>
              </div>
            )}

          </Modal>
          <PublishModal isOpen={isModalOpen} tags={tags} onClose={closeModal} selectedTest={selectedTest} selectedTestId={selectedTestId} />
        </div>

        {showButtons && filteredData.length > 10 && (
          <PaginationButtons
            filteredQuestions={filteredData}
            rowsPerPage={rowsPerPage}
            currentPage={currentPage}
            loadMore={loadMore}
            fullView={fullView}
          />
        )}

        <PaginationInfo
          filteredQuestions={filteredData}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          label="Tests"
          totalItems={data?.length}
          isSearching={searchQuery.length > 0}
        />
      </div>
    </>
  );
};

export default Dispatched;