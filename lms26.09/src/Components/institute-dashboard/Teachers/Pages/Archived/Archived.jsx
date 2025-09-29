import DataTable from "../../../../ReusableComponents/TableComponent/TableComponent";
import React, { useState, useEffect } from "react";
import { MdOutlineArchive } from "react-icons/md";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PaginationButtons from "../../../../ReusableComponents/Pagination/PaginationButton";
import PaginationInfo from "../../../../ReusableComponents/Pagination/PaginationInfo";
import {
  FaPaperPlane,
  FaCopy,
  FaFilePdf,
  FaArchive,
  FaTrashAlt,
  FaFolderPlus,
  FaSearch,
  FaTrash,
  FaShare,
  FaTag,
  FaEllipsisH,
  FaDownload,
  FaPlus,
  FaCheck,
  FaTimes,
  FaChevronDown,

  FaArrowUp,
  FaUserCheck,
  FaUserTimes,
  FaUsers
} from "react-icons/fa";
import { RiInboxUnarchiveFill } from "react-icons/ri";

import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import ToggleSwitch from "../../../../ReusableComponents/ToggleSwitch/ToggleSwitch";

const Archived = () => {
  const initialData = [
    { id: 1, name: "John Doe", email: 'teacher1@example.com', date: '26-12-2024', status: 'inactive' },
    { id: 2, name: "Jane Smith", email: 'teacher2@example.com', date: '27-12-2024', status: 'active' },
   
  ];

  // State management
  const [data, setData] = useState(initialData);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [fullViewMode, setFullViewMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [currentView, setCurrentView] = useState("all"); // 'all', 'active', 'inactive'

  // Check if screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
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

  // Filter data based on search and status
  const getFilteredData = () => {
    let filteredData = data;

    // Filter by current view
    if (currentView === "active") {
      filteredData = filteredData.filter((teacher) => teacher.status === "active");
    } else if (currentView === "inactive") {
      filteredData = filteredData.filter((teacher) => teacher.status === "inactive");
    }

    // Apply search and status filters
    return filteredData.filter((teacher) => {
      const matchesSearch =
        searchQuery === "" ||
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.date.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filterStatus === "" || teacher.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  };

  const filteredData = getFilteredData();

  // Get current page data
  const getCurrentPageData = () => {
    if (fullViewMode) {
      return filteredData;
    }
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  };

  // Toggle teacher status
  const toggleTeacherStatus = (teacherId) => {
    setData(prevData =>
      prevData.map(teacher =>
        teacher.id === teacherId
          ? { ...teacher, status: teacher.status === "active" ? "inactive" : "active" }
          : teacher
      )
    );

    const teacher = data.find(t => t.id === teacherId);
    toast.success(
      `Teacher ${teacher.name} has been ${teacher.status === "active" ? "deactivated" : "activated"}`,
      { position: "top-right", autoClose: 3000 }
    );
  };

  const handleArchive = (teacher) => {
    toast.info(`Archiving teacher ${teacher.name}`, { autoClose: 2000 });
    setOpenDropdownId(null); // Close dropdown after action
  };

  const handleDelete = (teacher) => {
    toast.warning(`Deleting teacher ${teacher.name}`, { autoClose: 2000 });
    setOpenDropdownId(null); // Close dropdown after action
  };

  const toggleDropdown = (rowId) => {
    setOpenDropdownId(openDropdownId === rowId ? null : rowId);
  };

  // Get counts for different views
  const activeCount = data.filter((teacher) => teacher.status === "active").length;
  const inactiveCount = data.filter((teacher) => teacher.status === "inactive").length;
  const totalCount = data.length;

  const columns = [
    {
      name: "Teacher Names",
      selector: "name",
      width: "200px",
      cell: (row) => (
        <Link to={`/teacher/${row.id}`} className="row-link">
          {row.name}
        </Link>
      ),
    },
    {
      name: "Teacher Emails",
      selector: "email",
      width: "250px", 
    },
    {
      name: "Added Date",
      selector: "date",
      width: "150px", 
    },
    {
      name: "Status",
      selector: "status",
      width: "150px", 
      cell: (row) => (
        <span className={`status-text ${row.status === "active" ? "active" : "inactive"}`}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
    },
    {
      name: "Actions",
      selector: "actions",
      width: "200px",
      cell: (row) => (
        <div className="action-button-group">
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
                  <div className="mobile-action-item">
                    <ToggleSwitch
                      isActive={row.status === "active"}
                      onToggle={() => toggleTeacherStatus(row.id)}
                    />
                    <span>{row.status === "active" ? "Deactivate" : "Activate"}</span>
                  </div>
                  <button
                    className="mobile-action-item archive"
                    onClick={() => handleArchive(row)}
                  >
                    <RiInboxUnarchiveFill />
                    <span> Un Archive</span>
                  </button>
                  <button
                    className="mobile-action-item delete"
                    onClick={() => handleDelete(row)}
                  >
                    <FaTrashAlt />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* <ToggleSwitch
                className="test-action-button"
                isActive={row.status === "active"}
                onToggle={() => toggleTeacherStatus(row.id)}
              /> */}
              <button
                className="test-action-button archive"
                onClick={() => handleArchive(row)}
                title="Archive teacher"
              >
                 <RiInboxUnarchiveFill />
                <span className="tooltip-text">Un Archive</span>
              </button>
              <button
                className="test-action-button delete"
                onClick={() => handleDelete(row)}
                title="Delete teacher"
              >
                <FaTrashAlt />
                <span className="tooltip-text">Delete</span>
              </button>
            </>
          )}
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Teachers</title>
        <meta name="description" content="Teachers" />
      </Helmet>
      <div className="test-index-wrapper">
        <div className="test-index-container">
          <div className="test-index-header">
            <h1 className="breadcrumb"> Teachers Archived Lists</h1>

          </div>

          <div className="my-data-table">
            <DataTable
              columns={columns}
              data={getCurrentPageData()}
              searchoption={true}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        </div>

        {!fullViewMode && rowsPerPage < filteredData.length && (
          <PaginationButtons
            filteredQuestions={filteredData}
            rowsPerPage={rowsPerPage}
            currentPage={currentPage}
            loadMore={() => setRowsPerPage(prev => Math.min(prev + 5, filteredData.length))}
            fullView={() => {
              setRowsPerPage(filteredData.length);
              setFullViewMode(true);
            }}
            fullViewMode={fullViewMode}
          />
        )}

        <PaginationInfo
          filteredQuestions={filteredData}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          label="Teachers"
          totalItems={data.length}
          isSearching={searchQuery.length > 0}
        />
      </div>
    </>
  );
};

export default Archived;