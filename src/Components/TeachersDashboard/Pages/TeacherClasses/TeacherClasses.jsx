import React, { useState, useEffect, useRef } from "react";
import {
    FaCog,
    FaEdit,
    FaArchive,
    FaTrashAlt
} from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { VscTriangleDown } from "react-icons/vsc";
import TeacherClassSidebar from "./TeacherClassSidebar/TeacherClassSidebar";
import DataTable from "../../../ReusableComponents/TableComponent/TableComponent";
import PaginationButtons from "../../../ReusableComponents/Pagination/PaginationButton";
import PaginationInfo from "../../../ReusableComponents/Pagination/PaginationInfo";



const TeacherClasses = () => {
    // Sample data - replace later with API data if needed
    const data = [
        { id: "1", name: "Class 1", strength: 30, maximumallowed: 50, expiryDate: new Date(2024, 5, 30) },
        { id: "2", name: "Class 2", strength: 25, maximumallowed: 100, expiryDate: new Date(2024, 6, 15) },
        { id: "3", name: "Class 3", strength: 28, maximumallowed: 70, expiryDate: new Date(2024, 7, 1) },
        { id: "4", name: "Class 4", strength: 28, maximumallowed: 70, expiryDate: new Date(2024, 7, 1) },
    ];

    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCount, setFilteredCount] = useState(data.length);
    const [fullViewMode, setFullViewMode] = useState(false);
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [isMobile, setIsMobile] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const sidebarRef = useRef(null);
    const toggleRef = useRef(null);

    // Detect screen size
    useEffect(() => {
        const updateWidth = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", updateWidth);
        updateWidth();
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    // Detect mobile version
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Handle outside click (close mobile sidebar)
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!isMobileOpen) return;

            const sidebar = sidebarRef.current;
            const toggle = toggleRef.current;

            if (!sidebar || !toggle) return;

            const outsideSidebar = !sidebar.contains(e.target);
            const outsideToggle = !toggle.contains(e.target);

            if (outsideSidebar && outsideToggle) {
                setIsMobileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMobileOpen]);

    // Toggle mobile sidebar
    const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

    // Search filter
    const getFilteredData = () => {
        return data.filter((cls) => {
            const s = searchQuery.toLowerCase();
            return (
                cls.name.toLowerCase().includes(s) ||
                cls.strength.toString().includes(s) ||
                cls.maximumallowed.toString().includes(s) ||
                cls.expiryDate.toLocaleDateString().includes(s)
            );
        });
    };

    const filteredData = getFilteredData();

    useEffect(() => {
        setFilteredCount(filteredData.length);
    }, [filteredData.length]);

    const getCurrentPageData = () => {
        if (fullViewMode) return filteredData;
        const startIndex = (currentPage - 1) * rowsPerPage;
        return filteredData.slice(startIndex, startIndex + rowsPerPage);
    };

    const showPaginationButtons = !fullViewMode && rowsPerPage < filteredData.length;

    const toggleDropdown = (rowId) => {
        setOpenDropdownId(openDropdownId === rowId ? null : rowId);
    };

    const handleActionClick = (action, row) => {
        setOpenDropdownId(null);
        console.log(`Teacher ${action} →`, row.name);
    };

    const loadMore = () => {
        setRowsPerPage(Math.min(rowsPerPage + 5, filteredData.length));
    };

    const toggleFullView = () => {
        if (!fullViewMode) setRowsPerPage(filteredData.length);
        else setRowsPerPage(5);
        setFullViewMode(!fullViewMode);
    };

    const nameColumnValue = screenWidth <= 984 ? "100px" : "250px";
    const maxColumnValue = screenWidth <= 984 ? "70px" : "120px";

    const columns = [
        {
            name: "Class Name",
            selector: "name",
            width: nameColumnValue,
            cell: (row) => (
                <Link to={`/teachers-dashboard/classes/${row.id}/class-students`} state={{ className: row.name }}>
                    <span className="row-link">{row.name}</span>
                </Link>
            ),
        },
        {
            name: "Strength",
            selector: "strength",
            width: "70px",
        },
        {
            name: "Maximum Allowed",
            selector: "maximumallowed",
            width: maxColumnValue,
        },
        {
            name: "Expiry",
            selector: "expiryDate",
            width: "70px",
            cell: (row) => row.expiryDate.toLocaleDateString(),
        },
        {
            name: "Actions",
            selector: "actions",
            sortable: false,
            width: "50px",
            cell: (row) => (
                <div className="test-action-buttons">
                    {isMobile ? (
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
                                    <button
                                        className="mobile-action-item settings"
                                        onClick={() => handleActionClick("settings", row)}
                                    >
                                        <FaCog />
                                        <span>Settings</span>
                                    </button>
                                    <button
                                        className="mobile-action-item rename"
                                        onClick={() => handleActionClick("rename", row)}
                                    >
                                        <FaEdit />
                                        <span>Rename</span>
                                    </button>
                                    <button
                                        className="mobile-action-item archive"
                                        onClick={() => handleActionClick("archive", row)}
                                    >
                                        <FaArchive />
                                        <span>Archive</span>
                                    </button>
                                    <button
                                        className="mobile-action-item delete"
                                        onClick={() => handleActionClick("delete", row)}
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
                                className="test-action-button settings"
                                aria-label="Settings"
                                onClick={() => handleActionClick("settings", row)}
                            >
                                <FaCog />
                                <span className="tooltip-text">Settings</span>
                            </button>
                            <button
                                className="test-action-button rename"
                                aria-label="Rename"
                                onClick={() => handleActionClick("rename", row)}
                            >
                                <FaEdit />
                                <span className="tooltip-text">Rename</span>
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
                                onClick={() => handleActionClick("delete", row)}
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
            <Helmet>
                <title>Teacher Classes</title>
            </Helmet>

            <div className="test-index-wrapper">
                {/* MOBILE TOP HEADER */}
                <div className="test-index-header-moblie">
                    <h1 className="breadcrumb">Classes</h1>
                    <VscTriangleDown onClick={toggleMobileSidebar} ref={toggleRef} />
                </div>

                {/* SIDEBAR */}
                <div ref={sidebarRef}>
                    <TeacherClassSidebar
                        isMobileOpen={isMobileOpen}
                        setIsMobileOpen={setIsMobileOpen}
                    />
                </div>

                {/* MAIN CONTENT */}
                <div className="test-index-container">
                    <div className="test-index-header">
                        <h1 className="breadcrumb">Classes</h1>
                    </div>

                    <div className="my-data-table">
                        <DataTable
                            columns={columns}
                            data={getCurrentPageData()}
                            searchoption={true}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            enableToggle={false}
                            availableActions={["delete", "archive"]}
                        />
                    </div>
                </div>

                {/* PAGINATION */}
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
                    label="Classes"
                    totalItems={data.length}
                    isSearching={searchQuery.length > 0}
                />
            </div>
        </>
    );
};

export default TeacherClasses;
