"use client"

import "./Questionindex.css"
import DataTable from "../../../ReusableComponents/TableComponent/TableComponent"
import React, { useState, useEffect } from "react"
import { MdOutlineArchive } from "react-icons/md"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import PaginationButtons from "../../../ReusableComponents/Pagination/PaginationButton"
import PaginationInfo from "../../../ReusableComponents/Pagination/PaginationInfo"
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

import { Link } from "react-router-dom"
import { HiDotsVertical } from "react-icons/hi";
import { Helmet } from "react-helmet";
const Questionindex = () => {
  // Static rows for the table with IDs
  const data = [
    { id: 1, name: "QB 1", questions: 10, lastModified: "2 days ago by You" },
    { id: 2, name: "QB 2", questions: 10, lastModified: "2 days ago by You" },
    { id: 3, name: "QB 3", questions: 15, lastModified: "2 days ago by You" },
    { id: 4, name: "QB 4", questions: 15, lastModified: "1 day ago by You" },
    { id: 5, name: "QB 5", questions: 15, lastModified: "1 day ago by You" },
    { id: 6, name: "QB 6", questions: 15, lastModified: "1 day ago by You" },
    { id: 7, name: "QB 7", questions: 15, lastModified: "1 day ago by You" },
    { id: 8, name: "QB 8", questions: 15, lastModified: "1 day ago by You" },
    { id: 9, name: "QB 9", questions: 15, lastModified: "1 day ago by You" },
    { id: 10, name: "QB 10", questions: 15, lastModified: "1 day ago by You" },
    { id: 11, name: "QB 11", questions: 15, lastModified: "1 day ago by You" },
    { id: 12, name: "QB 12", questions: 15, lastModified: "1 day ago by You" },
  ]

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
  const [isMobile, setIsMobile] = useState(false)

  // Filter data based on search
  const getFilteredData = () => {
    return data.filter((qb) => {
      const matchesSearch = searchQuery === "" ||
        qb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qb.questions.toString().includes(searchQuery) ||
        qb.lastModified.toLowerCase().includes(searchQuery.toLowerCase())

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
    if (fullViewMode) {
      return filteredData
    }
    const startIndex = (currentPage - 1) * rowsPerPage
    return filteredData.slice(startIndex, startIndex + rowsPerPage)
  }

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".mobile-actions-dropdown")) {
        setOpenDropdownId(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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

  const handleActionClick = (action, row) => {
    // Close dropdown first
    setOpenDropdownId(null)
          console.log(action)
    // Then execute the action
    switch (action) {
      case "pdf":
        console.log("PDF download for", row.name)
        break
      case "folder":
        console.log("Add to folder for", row.name)
        break
      case "edit":
        console.log("Edit action for", row.name)
        break
      case "archive":
        console.log("Archive action for", row.name)
        break
      case "delete":
        console.log("Delete action for", row.name)
        break
      default:
        break
    }
  }

  const columns = [
    {
      name: (
        <div className="flex items-center">
          <span>QB Names</span>
        </div>
      ),
      selector: "name",
      width: "200px", 
      cell: (row) => (
        <div className="flex items-center">
          <Link to={`/QuestionBank/${row.id}/add`}>
            <span className="row-link">{row.name}</span>
          </Link>
        </div>
      ),
    },
    {
      name: <div className="cursor-pointer">Questions</div>,
      selector: "questions",
      sortable: true,
      width: "150px", 
    },
    {
      name: <div className="cursor-pointer">Last Modified</div>,
      selector: "lastModified",
      sortable: true,
      width: "200px", 
    },
    {
      name: "Actions",
      selector: "actions",
      sortable: false,
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
                    <FaFilePdf />
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
              <button className="test-action-button pdf" aria-label="Download PDF">
                <FaFilePdf />
                <span className="tooltip-text">Download PDF</span>
              </button>
              <button className="test-action-button copy" aria-label="Add to Folder">
                <FaFolderPlus />
                <span className="tooltip-text">Add to Folder</span>
              </button>
              <button
                className="test-action-button edit"
                aria-label="Edit"
                onClick={(e) => {
                  e.stopPropagation()
                  // Handle edit action
                }}
              >
                <FaEdit />
                <span className="tooltip-text">Edit</span>
              </button>
              <button className="test-action-button archive" aria-label="Archive">
                <FaArchive />
                <span className="tooltip-text">Archive</span>
              </button>
              <button className="test-action-button delete" aria-label="Delete">
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
        <title> QuestionBanks</title>
        <meta name="description" content="Question Banks List" />
      </Helmet>
      <div className="questionbank-index-wrapper">
        <div className="questionbank-index-container">
          <div className="test-index-header">
            <h1 className="breadcrumb">All Question Bank Lists</h1>
          </div>

          <div className="my-data-table">
            <DataTable
              columns={columns}
              data={getCurrentPageData()}
              availableActions={["delete", "archive", "download", "tag", "more"]}
              enableToggle={false}
              searchoption={true}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
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
      </div>
    </>
  )
}

export default Questionindex