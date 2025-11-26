"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import DataTable from "../../../../../../../ReusableComponents/TableComponent/TableComponent"
import PaginationButtons from "../../../../../../../ReusableComponents/Pagination/PaginationButton"
import PaginationInfo from "../../../../../../../ReusableComponents/Pagination/PaginationInfo"
import TestSidebar from "../../StudetentTestSidebar/Sidebar"
// import "./TestList.css"
import { CiPlay1 } from "react-icons/ci"
import { ClipboardCheck, ChevronRight } from "lucide-react"
import Scheduled from "../../../../../../../institute-dashboard/dashboard/Pages/Sheduled/Sheduled"

// Sample data
const testData = [
    {
        id: 1,
        test: "Mathematics Final",
        owner: "John Doe",
        hours: 2,
        status: "Scheduled",
        time: "10:00 AM - 12:00 PM",
        type: "scheduled",
        startTime: "2023-06-15T10:00:00",
        endTime: "2023-06-15T12:00:00",
    },
    {
        id: 2,
        test: "Science Quiz",
        owner: "Jane Smith",
        hours: 1,
        status: "Live",
        time: "Ongoing",
        type: "live",
        startTime: "2025-03-27T03:00:00",
        endTime: "2025-03-27T05:00:00",
    },
    {
        id: 3,
        test: "History Midterm",
        owner: "Mark Johnson",
        hours: 1.5,
        status: "Scheduled",
        time: "Starts in 2 hours",
        type: "scheduled",
        startTime: "2023-06-15T14:00:00",
        endTime: "2023-06-15T15:30:00",
    },
    {
        id: 4,
        test: "English Essay",
        owner: "Sarah Williams",
        hours: 3,
        status: "Unscheduled",
        time: "Not scheduled",
        type: "unscheduled",
    },
    {
        id: 5,
        test: "Physics Test",
        owner: "Robert Brown",
        hours: 2,
        status: "Scheduled",
        time: "Starts tomorrow",
        type: "scheduled",
        startTime: "2023-06-16T10:00:00",
        endTime: "2023-06-16T12:00:00",
    },
    {
        id: 6,
        test: "Chemistry Lab",
        owner: "Emily Davis",
        hours: 2.5,
        status: "Live",
        time: "Ongoing",
        type: "live",
        startTime: "2023-06-15T08:30:00",
        endTime: "2023-06-15T11:00:00",
    },
]

// Countdown component for live tests
const RemainingTimeCounter = ({ endTime }) => {
    const [timeRemaining, setTimeRemaining] = useState("")

    useEffect(() => {
        const updateRemainingTime = () => {
            const now = new Date()
            const end = new Date(endTime)
            const diff = end - now

            if (diff <= 0) {
                setTimeRemaining("00:00:00")
                return
            }

            const hours = Math.floor(diff / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((diff % (1000 * 60)) / 1000)

            setTimeRemaining(
                `${hours.toString().padStart(2, "0")}:${minutes
                    .toString()
                    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
            )
        }

        updateRemainingTime()
        const interval = setInterval(updateRemainingTime, 1000)
        return () => clearInterval(interval)
    }, [endTime])

    return <span className="countdown-timer">{timeRemaining}</span>
}

const LiveTest = () => {
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [currentPage, setCurrentPage] = useState(1)
    const [activeTab, setActiveTab] = useState("live")
    const [showButtons, setShowButtons] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const sidebarRef = useRef(null)
    const toggleRef = useRef(null)

    const navigate = useNavigate()

    // Mobile sidebar toggle outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!isMobileOpen) return
            const sidebar = sidebarRef.current
            const toggle = toggleRef.current
            if (!sidebar || !toggle) return
            if (!sidebar.contains(e.target) && !toggle.contains(e.target)) setIsMobileOpen(false)
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isMobileOpen])

    const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen)

    // Filter data based on active tab
    let filteredData = testData.filter(test => test.type === activeTab);

    useEffect(() => {
        setActiveTab("live");
    }, []);


    // Apply search filter
    if (searchQuery) {
        filteredData = filteredData.filter((test) => {
            return (
                test.test.toLowerCase().includes(searchQuery.toLowerCase()) ||
                test.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                test.status.toLowerCase().includes(searchQuery.toLowerCase())
            )
        })
    }

    const paginatedData = filteredData.slice(0, rowsPerPage)

    const loadMore = () => {
        setRowsPerPage((prevRows) => {
            const newRows = prevRows + 5
            if (newRows >= filteredData.length) setShowButtons(false)
            return newRows
        })
    }

    const fullView = () => {
        setRowsPerPage(filteredData.length)
        setShowButtons(false)
    }

    const handleStartTest = (test) => {
        if (test.type === "scheduled" || test.type === "live") {
            localStorage.setItem(
                "currentTestTiming",
                JSON.stringify({
                    startTime: test.startTime,
                    endTime: test.endTime,
                    type: test.type,
                })
            )
        }
        navigate(`/student/tests/${test.id}/attempt`)
    }

    const formatScheduledTime = (startTime, endTime) => {
        const start = new Date(startTime)
        const end = new Date(endTime)
        const options = { hour: "2-digit", minute: "2-digit", hour12: true }
        return `${start.toLocaleTimeString([], options)} - ${end.toLocaleTimeString([], options)}`
    }

    const handleSearchChange = (value) => {
        setSearchQuery(value)
        setCurrentPage(1)
    }

    const columns = [
        {
            name: "Test Name",
            selector: "test",
            cell: (row) => (
                <div className="test-name-cell">
                    <span className="test-name-link" onClick={() => handleStartTest(row)}>
                        {row.test}
                    </span>
                </div>
            ),
            sortable: true,
        },
        {
            name: "Owner",
            selector: "owner",
            cell: (row) => <div className="owner-cell">{row.owner}</div>,
            sortable: true,
        },
        {
            name: "Duration",
            selector: "hours",
            cell: (row) => <div className="duration-cell">{row.hours} hrs</div>,
            sortable: true,
        },
        {
            name: "Status",
            selector: "status",
            cell: (row) => <div className={`status-cell ${row.status.toLowerCase()}`}>{row.status}</div>,
            sortable: true,
        },
        {
            name: "Time",
            selector: "time",
            cell: (row) => {
                if (row.type === "live") return <RemainingTimeCounter endTime={row.endTime} />
                if (row.type === "scheduled") return <span>{formatScheduledTime(row.startTime, row.endTime)}</span>
                return <span>Not scheduled</span>
            },
            sortable: true,
        },
        {
            name: "Actions",
            width: "138px",
            cell: (row) => (
                <button
                    className={`action-button ${row.type === "live" ? "live-action" : ""}`}
                    onClick={() => handleStartTest(row)}
                >
                    <CiPlay1 className="action-icon" />
                    {row.type === "live" ? "Join Now" : "Start Test"}
                </button>
            ),
        },
    ]

    return (
        <div className="div" style={{ position: "relative" }}>
            {/* Sidebar */}
            <div ref={sidebarRef} className="header-moblile-sideBar">
                <TestSidebar isMobileOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
            </div>

            {/* Main Dashboard */}
            <div className="dashboard-container">
                <div className="test-index-container">
                    <div className="test-index-header">
                        <h3>Live Tests</h3>
                    </div>

                    <div className="my-data-table">
                        <DataTable
                            columns={columns}
                            data={paginatedData}
                            searchQuery={searchQuery}
                            searchoption={true}
                            onSearchChange={handleSearchChange}
                        />
                    </div>

                    {showButtons && (
                        <div className="pagination-controls">
                            <PaginationButtons
                                filteredQuestions={filteredData}
                                rowsPerPage={rowsPerPage}
                                currentPage={currentPage}
                                loadMore={loadMore}
                                fullView={fullView}
                            />
                        </div>
                    )}

                    <div className="pagination-info">
                        <PaginationInfo
                            filteredQuestions={filteredData}
                            rowsPerPage={rowsPerPage}
                            currentPage={currentPage}
                            label="Tests"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LiveTest
