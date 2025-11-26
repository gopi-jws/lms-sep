import React from 'react'

import { useState, useEffect,useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArchive, FaTrashAlt, FaEllipsisH } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { VscTriangleDown } from "react-icons/vsc";
import TeacherClassDetailsSidemenu from './TeacherClassDetailsSidemenu';
import DataTable from '../../../../ReusableComponents/TableComponent/TableComponent';
import PaginationButtons from '../../../../ReusableComponents/Pagination/PaginationButton';
import PaginationInfo from '../../../../ReusableComponents/Pagination/PaginationInfo';
import ToggleSwitch from '../../../../ReusableComponents/ToggleSwitch/ToggleSwitch';


const TeacherClassDetails = () => {
  const { id } = useParams();
  const initialData = [
    { id: 1, name: "Karthick", email: "karthick.k@gmail.com", joinDate: "16/06/2023", status: "active" },
    { id: 2, name: "Manikandan", email: "manikandan.r@gmail.com", joinDate: "20/06/2023", status: "inactive" },
    { id: 3, name: "Sivakumar", email: "sivakumar.v@gmail.com", joinDate: "20/04/2023", status: "active" },
    { id: 4, name: "Dinesh", email: "dineshbabu@gmail.com", joinDate: "15/02/2023", status: "inactive" },
    { id: 5, name: "Uthaya", email: "uthaya@gmail.com", joinDate: "16/0/2023", status: "active" },
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
  const [currentView, setCurrentView] = useState("all");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
  
  
    // Mobile toggle function
    const toggleMobileSidebar = () => {
      setIsMobileOpen(!isMobileOpen)
    }

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
      filteredData = filteredData.filter((student) => student.status === "active");
    } else if (currentView === "inactive") {
      filteredData = filteredData.filter((student) => student.status === "inactive");
    }

    // Apply search and status filters
    return filteredData.filter((student) => {
      const matchesSearch =
        searchQuery === "" ||
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.joinDate.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filterStatus === "" || student.status === filterStatus;

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

  // Toggle student status
  const toggleStudentStatus = (studentId) => {
    setData(prevData =>
      prevData.map(student =>
        student.id === studentId
          ? { ...student, status: student.status === "active" ? "inactive" : "active" }
          : student
      )
    );

    const student = data.find(s => s.id === studentId);
    toast.success(
      `Student ${student.name} has been ${student.status === "active" ? "deactivated" : "activated"}`,
      { position: "top-right", autoClose: 3000, toastId: `status-${studentId}` }
    );
  };

  const handleArchive = (student) => {
    toast.info(`Archiving student ${student.name}`, { autoClose: 2000 });
    setOpenDropdownId(null);
  };

  const handleDelete = (student) => {
    toast.warning(`Deleting student ${student.name}`, { autoClose: 2000 });
    setOpenDropdownId(null);
  };

  const toggleDropdown = (rowId) => {
    setOpenDropdownId(openDropdownId === rowId ? null : rowId);
  };

  const columns = [
    {
      name: "Student Names",
      selector: "name",
      width: "120px",
      cell: (row) => (
        <Link to={`/teacher/class/${row.id}/classdetailpage`} className="row-link">
          {row.name}
        </Link>
      ),
    },
    {
      name: "Student Emails",
      selector: "email",
      width: "100px",
    },
    {
      name: "Date Of Joining",
      selector: "joinDate",
      width: "70px",
    },
    {
      name: "Status",
      selector: "status",
      width: "70px",
      cell: (row) => (
        <span className={`table-status-text ${row.status === "active" ? "active" : "inactive"}`}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
    },
    {
      name: "Actions",
      selector: "actions",
      width: "50px",
      cell: (row) => (
        <div className="actions-container">
          {isMobile ? (
            <div className="mobile-actions-dropdown">
              <button
                className="mobile-menu-trigger"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown(row.id);
                }}
                aria-label="More actions"
              >
                <HiDotsVertical />
              </button>

              {openDropdownId === row.id && (
                <div className="mobile-actions-menu">
                  {/* <div className="mobile-action-item">
                    <ToggleSwitch
                      isActive={row.status === "active"}
                      onToggle={() => toggleStudentStatus(row.id)}
                      showLabel={true}
                    />
                  </div> */}
                  <button
                    className="mobile-action-item archive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleArchive(row);
                    }}
                  >
                    <FaArchive />
                    <span>Archive</span>
                  </button>
                  <button
                    className="mobile-action-item delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(row);
                    }}
                  >
                    <FaTrashAlt />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
              // className = .desktop - actions
            <div className="">
              <button className="test-action-button ">
                  <ToggleSwitch
                    isActive={row.status === "active"}
                    onToggle={() => toggleStudentStatus(row.id)}
                  />
              </button>
             
              <button
                  className="test-action-button archive"
                onClick={(e) => {
                  e.stopPropagation();
                  handleArchive(row);
                }}
                title="Archive student"
              >
                <FaArchive />
                <span className="tooltip-text">Archive</span>
              </button>

              <button
                  className="test-action-button delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(row);
                }}
                title="Delete student"
              >
                <FaTrashAlt />
                <span className="tooltip-text">Delete</span>
              </button>
            </div>
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
        <title>My Class Students</title>
        <meta name="description" content="Teacher Class Details Page" />
      </Helmet>
      
      <div className="test-index-wrapper">
        <div className="test-index-header-moblie">
          <h1 className="breadcrumb">Class {id} Students</h1>
          <VscTriangleDown onClick={toggleMobileSidebar} ref={toggleRef} className="TriagbleDown" />
        </div>

        <div ref={sidebarRef}>
          <TeacherClassDetailsSidemenu
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
          />
        </div>


        <div className="test-index-container">
          <div className="test-index-header">
            <h1 className="breadcrumb">My Class {id} Students</h1>
          </div>

          <div className="my-data-table">
            <DataTable
              columns={columns}
              data={getCurrentPageData()}
              searchoption={true}
              searchQuery={searchQuery}
              availableActions={["delete", "archive"]}
              
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
          label="Students"
          totalItems={data.length}
          isSearching={searchQuery.length > 0}
        />
      </div>
    </>
  );
};

export default TeacherClassDetails;