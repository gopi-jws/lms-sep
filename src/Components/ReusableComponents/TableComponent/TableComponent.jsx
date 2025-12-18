"use client"
import React, { useState, useEffect, useRef } from "react"
import { useLocation } from "react-router-dom";
import { FaArrowDown, FaArrowUp, FaSearch, FaPlus, FaCheck, FaMinus, FaEye } from "react-icons/fa"
import "./TableComponent.css"
import { Link } from "react-router-dom";
import {
    ListOrdered,
    Calculator,
    CheckSquare,
    AlignLeft,
} from "lucide-react";
import BulkActions from "../BulkActions/BulkAction"
import StudentBulkActions from "../StudentBulkActions/StudentBulkActions"
import QuestionEditor from "../Markdown/QuestionEditor";
import QuestionsBulkActions from "../QuestionsBulkActions/QuestionsBulkActions"
import ListOfQuestionsType from "../ListOfQuestionsType/ListOfQuestionsType";
import { useDispatch, useSelector } from "react-redux";
import { addNewTest } from "../../../slices/allTestSlice";
import { addNewQB } from "../../../slices/allQuestionBank";
import { addNewQuestionQB } from "../../../slices/addQuestionBank"
import { setIsNewClassModalOpen } from "../../../slices/allClassSlice";
import { setIsAddStudentModalOpen } from "../../../slices/addStudent";
import { setIsNewTeacherModalOpen } from "../../../slices/allTeacher";
import { setNumberofSelectionQuestion } from "../../../slices/addQuestionTestModal"
import { SetOpenAddQuestionTest } from "../../../slices/testAddSlice";



const DataTable = ({
    columns,
    data,
    tags,
    folder,
    availableActions = [],
    showQuestionRow = false,
    studentActions = [],
    questionActions = [],
    onBulkSuspend,
    onBulkTerminate,
    selectableRows = true,
    onBulkSendMessage,
    enableToggle = false,
    showColumnVisibility = false,
    onRowClicked,
    fullViewMode = false,
    searchoption = false,
    searchQuery = "",
    onSearchChange,
    filterType = "",
    onFilterTypeChange,
    expandedRows = [],
    searchPlaceholder = "Search...",
    conditionalRowStyles,
    setExpandedRows,
    sampleCandidates,
    expandableRowsComponent,
    onAddQuestionsToTag,
    onAddQBToFolder,
    onAddTag,
    onAddFolder,
    allQuestions,
    onCopyTest = () => { },
    onUpdateTest = () => { },
    onDelete = () => { },
    onArchive = () => { },
    onDownload = () => { },
    onChangeSection = () => { },
    onSetMarks = () => { },
    newQuestioBank,
    setModalHeading,
    setIsRenameModalOpen,
    setIsCopyModalOpen,
    setIsDeleteModalOpen,
    setIsArchivedModalOpen,
    setEditingTest,
    setEditingQB,
    modalType,
    button,
}) => {

    console.log(folder);
    
   
    const dispatch = useDispatch();
    // Open New Add Question 
    const isDropdownOpen = useSelector((state) => state.AddQuestionQB.openAddQuestionQB);

    const testlocation = useLocation();
    const pathParts = testlocation.pathname.split("/"); // ["", "lms-sep2", "test", "12", "movetest"]
    const pathName = pathParts[1];
    const pathLateName = pathParts[3];
    const id = pathParts[2]; // index 3 → "12"
    const trashedQb = pathParts[2];

    const initialData = [
        { id: 1, test: "Test 1", owner: "John Doe", status: "Not Published", lastModified: "2 days ago by You", duration: 60, description: "Sample test 1", instructions: "Follow the guidelines", trashed: false, archived: false },
        { id: 2, test: "Test 2", owner: "Jane Smith", status: "Not Published", lastModified: "10 hours ago by You", duration: 45, description: "Sample test 2", instructions: "Read carefully", trashed: false, archived: false },
        { id: 3, test: "Test 3", owner: "Mark Johnson", status: "Not Published", lastModified: "5 days ago by You", duration: 90, description: "Sample test 3", instructions: "Complete all sections", trashed: false, archived: false },
        { id: 4, test: "Test 4", owner: "Mark Johnson", status: "Not Published", lastModified: "8 hours ago by You", duration: 30, description: "Sample test 4", instructions: "Time-bound test", trashed: false, archived: false },
        { id: 5, test: "Test 5", owner: "Mark Johnson", status: "Not Published", lastModified: "3 days ago by You", duration: 75, description: "Sample test 5", instructions: "Answer all questions", trashed: false, archived: false },
        { id: 6, test: "Test 6", owner: "Mark Johnson", status: "Not Published", lastModified: "12 hours ago by You", duration: 60, description: "Sample test 6", instructions: "Follow instructions", trashed: false, archived: false },
        { id: 7, test: "Test 7", owner: "Mark Johnson", status: "Not Published", lastModified: "1 day ago by You", duration: 60, description: "Sample test 7", instructions: "Follow instructions", trashed: false, archived: false },
        { id: 8, test: "Test 8", owner: "Mark Johnson", status: "Not Published", lastModified: "6 hours ago by You", duration: 60, description: "Sample test 8", instructions: "Follow instructions", trashed: false, archived: false },
        { id: 9, test: "Test 9", owner: "Mark Johnson", status: "Not Published", lastModified: "4 days ago by You", duration: 60, description: "Sample test 9", instructions: "Follow instructions", trashed: false, archived: false },
        { id: 10, test: "Test 10", owner: "Mark Johnson", status: "Not Published", lastModified: "3 hours ago by You", duration: 60, description: "Sample test 10", instructions: "Follow instructions", trashed: false, archived: false },
        { id: 11, test: "Test 11", owner: "Mark Johnson", status: "Not Published", lastModified: "2 days ago by You", duration: 60, description: "Sample test 11", instructions: "Follow instructions", trashed: false, archived: false },
        { id: 12, test: "Test 12", owner: "Mark Johnson", status: "Not Published", lastModified: "1 hour ago by You", duration: 60, description: "Sample test 12", instructions: "Follow instructions", trashed: false, archived: false },
    ];
    const test = initialData.find(item => item.id == id);

    const [selectedRows, setSelectedRows] = useState([])
    const [sortColumn, setSortColumn] = useState(null)
    const [isAscending, setIsAscending] = useState(true)
    const [showTagOptions, setShowTagOptions] = useState(false)
    const [isTagModalOpen, setIsTagModalOpen] = useState(false)
    const [showMoreOptions, setShowMoreOptions] = useState(false)
    const [suspendedStates, setSuspendedStates] = useState({})
    const [terminatedStates, setTerminatedStates] = useState({})
    const [showMcqOptions, setShowMcqOptions] = useState({})
    const [expandedQuestions, setExpandedQuestions] = useState([]);
    const [showAnswers, setShowAnswers] = useState([]);
    const [buttonShow, SetButtonShow] = useState(button === false ? false : true);

    useEffect(() => {
        dispatch(setNumberofSelectionQuestion(selectedRows.length))
    }, [selectedRows])

    const location = useLocation();
    const path = location.pathname;

    // ✅ Check if "question" exists in the path
    const includesQuestion = path.toLowerCase().includes("question");

    const selectAllCheckboxRef = useRef()

    const toggleMcqOptions = (rowId, e) => {
        e?.stopPropagation()
        setShowMcqOptions(prev => ({
            ...prev,
            [rowId]: !prev[rowId]
        }))
    }

    // Screen Size

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        // ✅ Add listener
        window.addEventListener("resize", handleResize);

        // ✅ Call once on mount
        handleResize();

        // ✅ Clean up on unmount
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Define the button configuration array in a variable
    const buttonConfigs = [
        {
            key: "newQB",
            condition: pathName === "questionbank" && pathLateName !== "add",
            label: "New QB",
            action: () => dispatch(addNewQB(true)),
            aria: "Create New Question Bank",
        },
        {
            key: "newTest",
            condition: pathName === "test" && pathLateName !== "movetest",
            label: "New Test",
            action: () => dispatch(addNewTest(true)),
            aria: "Create New Test",
        },
        {
            key: "newClass",
            condition: pathName === "class" && pathLateName !== "classdetailpage",
            label: "New Class",
            action: () => dispatch(setIsNewClassModalOpen(true)),
            aria: "Create New Class",
        },
        {
            key: "newTeacher",
            condition: pathName === "teachers",
            label: "New Teacher",
            action: () => dispatch(setIsNewTeacherModalOpen(true)),
            aria: "Create New Teacher",
        },
        {
            key: "addQuestionTest",
            condition: pathLateName === "movetest",
            label: "Add Question",
            action: () => dispatch(SetOpenAddQuestionTest(true)),
            aria: "Add Question in Test",
        },
        {
            key: "newQuestionQB",
            condition: pathLateName === "add",
            label: "New Question",
            action: () => dispatch(addNewQuestionQB(!isDropdownOpen)),
            aria: "Add New Questions in Question Bank",
        },
        {
            key: "newQuestionQB",
            condition: trashedQb === "Trashed",
            label: "New Question",
            action: () => dispatch(addNewQuestionQB(!isDropdownOpen)),
            aria: "Add New Questions in Question Bank",
        },
        {
            key: "newStudent",
            condition: pathLateName === "classdetailpage",
            label: "New Student",
            action: () => dispatch(setIsAddStudentModalOpen(true)),
            aria: "Create New Student",
        },
    ];



    const toggleQuestionView = (rowId) => {
        setExpandedQuestions(prev =>
            prev.includes(rowId)
                ? prev.filter(id => id !== rowId)
                : [...prev, rowId]
        );
    };

    const toggleAnswerView = (rowId) => {
        setShowAnswers(prev =>
            prev.includes(rowId)
                ? prev.filter(id => id !== rowId)
                : [...prev, rowId]
        );
    };


    const handleSearchInputChange = (e) => {
        const value = e.target.value
        if (onSearchChange) {
            onSearchChange(value)
        }
    }

    const handleSelectAll = (event) => {

        console.log(event);

        if (event.target.checked) {
            setSelectedRows(data.map((row) => row.id))
        } else {
            setSelectedRows([])
        }
    }

    const handleRowSelect = (rowId) => {
        setSelectedRows((prevSelectedRows) =>
            prevSelectedRows.includes(rowId) ? prevSelectedRows.filter((id) => id !== rowId) : [...prevSelectedRows, rowId],
        )
    }

    useEffect(() => {
        if (selectAllCheckboxRef.current) {
            const isIndeterminate = selectedRows.length > 0 && selectedRows.length < data.length
            selectAllCheckboxRef.current.indeterminate = isIndeterminate
            selectAllCheckboxRef.current.checked = selectedRows.length === data.length && data.length > 0
        }
    }, [selectedRows, data])

    const handleSort = (column) => {
        const colDef = columns.find((col) => col.selector === column)
        if (!colDef || colDef.sortable === false) return

        const ascending = sortColumn === column ? !isAscending : true
        setSortColumn(column)
        setIsAscending(ascending)
    }

    const sortedData = [...data].sort((a, b) => {
        if (!sortColumn) return 0

        const aValue = a[sortColumn] ?? ""
        const bValue = b[sortColumn] ?? ""

        return isAscending
            ? aValue.toString().localeCompare(bValue.toString())
            : bValue.toString().localeCompare(aValue.toString())
    })

    const toggleRowExpansion = (rowId, e) => {
        e?.stopPropagation();
        if (setExpandedRows) {
            setExpandedRows(prev =>
                prev.includes(rowId)
                    ? prev.filter(id => id !== rowId)
                    : [...prev, rowId]
            );
        }
    };


    const handleExpandToggle = (rowId, e) => {
        e.stopPropagation()
        toggleRowExpansion(rowId)
    }

    const handleRowClick = (row, e) => {
        if (typeof onRowClicked === "function") {
            onRowClicked(row, e);
        }
        // Only allow toggle when not in full view mode
        // (full view mode toggles are handled by parent)
        if (enableToggle && !fullViewMode) {
            toggleRowExpansion(row.id, e);
        }
    };

    useEffect(() => {
        // Clean up selectedRows when data changes
        setSelectedRows(prev =>
            prev.filter(id => data.some(row => row.id === id))
        );
    }, [data]);


    return (
        <div className={fullViewMode ? "full-view" : ""}>

            <div className="test-index-actions">


                <div className="mobile-responsive">
                    {buttonShow && (
                        <div className="test-sidebar-header-res">
                            <div className="w-100 d-flex justify-content-center flex-wrap gap-2">
                                {buttonConfigs
                                    .filter((btn) => btn.condition)
                                    .map((btn) => (
                                        <button
                                            key={btn.key}
                                            onClick={btn.action}
                                            className="allbuttons"
                                            aria-label={btn.aria}
                                        >
                                            <span className="sidebar-letters">{btn.label}</span>
                                        </button>
                                    ))}

                                {/* ✅ ListOfQuestionsType dropdown */}
                                {isDropdownOpen && (
                                    <div className="list-of-questions-type">
                                        <ListOfQuestionsType
                                            isOpen={isDropdownOpen}
                                            onClose={() => dispatch(addNewQuestionQB(false))}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="test-search-container mb-1 d-flex justify-content-between align-items-center">
                        <div className="search-input-wrapper">
                            {searchoption && (
                                <>
                                    <input
                                        type="text"
                                        placeholder={searchPlaceholder}
                                        className="test-search-input"
                                        value={searchQuery}
                                        onChange={handleSearchInputChange}
                                    />
                                    <FaSearch className="test-search-icon" />
                                </>
                            )}
                        </div>

                        {!showQuestionRow && (
                            <div className="bulk-action-bar" style={screenWidth > 768 ? { display: "block" } : { display: "none" }}>
                                {selectedRows.length > 0 && availableActions.length > 0 && (
                                    <BulkActions
                                        selectedRows={selectedRows}
                                        tags={tags}
                                        folder={folder}
                                        setShowTagOptions={setShowTagOptions}
                                        setIsTagModalOpen={setIsTagModalOpen}
                                        showMoreOptions={showMoreOptions}
                                        setShowMoreOptions={setShowMoreOptions}
                                        studentActions={studentActions}
                                        availableActions={availableActions}
                                        onAddQuestionsToTag={onAddQuestionsToTag} // Add this
                                        onAddFolder={onAddFolder}
                                        onAddTag={onAddTag}
                                        onAddQBToFolder={onAddQBToFolder}
                                        allQuestions={allQuestions}
                                        onCopyTest={onCopyTest}
                                        onUpdateTest={onUpdateTest}
                                        onDelete={onDelete}
                                        onArchive={onArchive}
                                        setModalHeading={setModalHeading}
                                        setIsRenameModalOpen={setIsRenameModalOpen}
                                        setIsCopyModalOpen={setIsCopyModalOpen}
                                        setIsDeleteModalOpen={setIsDeleteModalOpen}
                                        setIsArchivedModalOpen={setIsArchivedModalOpen}
                                        setEditingTest={setEditingTest}
                                        setEditingQB={setEditingQB}
                                        modalType={modalType}
                                    />
                                )}
                                {selectedRows.length > 1 && studentActions.length > 0 && (
                                    <StudentBulkActions
                                        selectedRows={selectedRows.map(id => ({ id }))}
                                        studentActions={["suspend", "terminate", "sendMessage"]}
                                        onBulkSuspend={onBulkSuspend}
                                        onBulkTerminate={onBulkTerminate}
                                        onBulkSendMessage={onBulkSendMessage}
                                        suspendedStates={suspendedStates}
                                        setSuspendedStates={setSuspendedStates}
                                        terminatedStates={terminatedStates}
                                        setTerminatedStates={setTerminatedStates}
                                        allStudents={sampleCandidates}
                                    />
                                )}
                                {selectedRows.length > 1 && questionActions.length > 0 && (
                                    <QuestionsBulkActions
                                        selectedRows={selectedRows}
                                        questionActions={["delete", "changeSection", "setMarks"]}
                                        onDelete={onDelete}
                                        onChangeSection={onChangeSection}
                                        onSetMarks={onSetMarks}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {((showQuestionRow) || (screenWidth <= 768)) && (
                    <div className="test-AllSelected">

                        {selectableRows && (
                            <div className="selete-all">
                                <div className="custom-checkbox-container">
                                    <input
                                        type="checkbox"
                                        ref={selectAllCheckboxRef}
                                        onChange={(e) => {
                                            e.stopPropagation()
                                            handleSelectAll(e)
                                        }}
                                        checked={selectedRows.length === data.length && data.length > 0}
                                    />
                                    {selectedRows.length > 0 && selectedRows.length < data.length ? (
                                        <FaMinus className="checkbox-icon indeterminate-icon" />
                                    ) : selectedRows.length === data.length && data.length > 0 ? (
                                        <FaCheck className="checkbox-icon checked-icon" />
                                    ) : null}
                                </div>

                                <label>Check All</label>
                            </div>
                        )}

                        {selectedRows.length > 0 && availableActions.length > 0 && (
                            <BulkActions
                                selectedRows={selectedRows}
                                tags={tags}
                                folder={folder}
                                setShowTagOptions={setShowTagOptions}
                                setIsTagModalOpen={setIsTagModalOpen}
                                showMoreOptions={showMoreOptions}
                                setShowMoreOptions={setShowMoreOptions}
                                studentActions={studentActions}
                                availableActions={availableActions}
                                onAddQuestionsToTag={onAddQuestionsToTag} // Add this
                                onAddFolder={onAddFolder}
                                onAddTag={onAddTag}
                                onAddQBToFolder={onAddQBToFolder}
                                allQuestions={allQuestions}
                                onCopyTest={onCopyTest}
                                onUpdateTest={onUpdateTest}
                                onDelete={onDelete}
                                onArchive={onArchive}
                                setModalHeading={setModalHeading}
                                setIsRenameModalOpen={setIsRenameModalOpen}
                                setIsCopyModalOpen={setIsCopyModalOpen}
                                setIsDeleteModalOpen={setIsDeleteModalOpen}
                                setIsArchivedModalOpen={setIsArchivedModalOpen}
                                setEditingTest={setEditingTest}
                                setEditingQB={setEditingQB}
                                modalType={modalType}
                            />
                        )}

                        {selectedRows.length > 1 && studentActions.length > 0 && (
                            <StudentBulkActions
                                selectedRows={selectedRows.map(id => ({ id }))}
                                studentActions={["suspend", "terminate", "sendMessage"]}
                                onBulkSuspend={onBulkSuspend}
                                onBulkTerminate={onBulkTerminate}
                                onBulkSendMessage={onBulkSendMessage}
                                suspendedStates={suspendedStates}
                                setSuspendedStates={setSuspendedStates}
                                terminatedStates={terminatedStates}
                                setTerminatedStates={setTerminatedStates}
                                allStudents={sampleCandidates}
                            />
                        )}

                        {selectedRows.length > 1 && questionActions.length > 0 && (
                            <QuestionsBulkActions
                                selectedRows={selectedRows}
                                questionActions={["delete", "changeSection", "setMarks"]}
                                onDelete={onDelete}
                                onChangeSection={onChangeSection}
                                onSetMarks={onSetMarks}
                            />
                        )}
                    </div>
                )}
            </div>

            <div className="table-wrapper">
                <table className="custom-data-table">
                    {!showQuestionRow && (
                        <thead className="table-header">
                            <tr>
                                {selectableRows && (
                                    <th className="col-checkbox" style={{ width: "50px" }}>
                                        <div className="custom-checkbox-container">
                                            <input
                                                type="checkbox"
                                                ref={selectAllCheckboxRef}
                                                onChange={(e) => {
                                                    e.stopPropagation()
                                                    handleSelectAll(e)
                                                }}
                                                checked={selectedRows.length === data.length && data.length > 0}
                                            />
                                            {selectedRows.length > 0 && selectedRows.length < data.length ? (
                                                <FaMinus className="checkbox-icon indeterminate-icon" />
                                            ) : selectedRows.length === data.length && data.length > 0 ? (
                                                <FaCheck className="checkbox-icon checked-icon" />
                                            ) : null}
                                        </div>
                                    </th>
                                )}

                                {columns.map((col, colIndex) => (
                                    <th
                                        key={colIndex}
                                        className={`col-${typeof col.name === "string" ? col.name.toLowerCase().replace(/\s+/g, "-") : "default-column"}
     ${col.name === "Actions" ||
                                                col.name === "Timer (Counter)" ||
                                                col.name === "Countdown" ||
                                                col.name === "Hours Used"
                                                ? ""
                                                : "no-flex-end"}
`}
                                        style={{ width: col.width || "", minWidth: col.width || "" }}
                                    >
                                        <div className="table-header-content" style={{ display: "flex", alignItems: "center" }}>
                                            <span
                                                style={{ cursor: col.selector ? "pointer" : "default" }}
                                                onClick={() => col.selector && handleSort(col.selector)}
                                            >
                                                {col.name}
                                            </span>

                                            {sortColumn === col.selector && (
                                                isAscending ? (
                                                    <FaArrowUp
                                                        className="ml-2 sorting-arrow"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => col.selector && handleSort(col.selector)}
                                                    />
                                                ) : (
                                                    <FaArrowDown
                                                        className="ml-2 sorting-arrow"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => col.selector && handleSort(col.selector)}
                                                    />
                                                )
                                            )}
                                        </div>
                                    </th>
                                ))}

                            </tr>
                        </thead>
                    )}

                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (selectableRows ? 1 : 0)} className="empty-state">
                                    {/* ...empty state content */}
                                </td>
                            </tr>
                        ) : (
                            sortedData.map((row, index) => (
                                <React.Fragment key={`${row.id}-${index}`}>
                                    {/* Main row */}
                                    <tr
                                        onClick={(e) => handleRowClick(row, e)}
                                        className={`${selectedRows.includes(row.id) ? 'checked-row' : ''} question-tr `}
                                    >
                                        {selectableRows && (
                                            <td className="col-checkbox" style={{ width: "50px" }}>
                                                <div className="custom-checkbox-container">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedRows.includes(row.id)}
                                                        onChange={(e) => { e.stopPropagation(); handleRowSelect(row.id); }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                    {selectedRows.includes(row.id) && <FaCheck className="checkbox-icon checked-icon" />}
                                                </div>
                                            </td>
                                        )}


                                        {/* test question and Add Question QB Table */}
                                        {showQuestionRow && (
                                            <div className="rows-iteam">
                                                <td>
                                                    <div className="table-tq-wrapper">
                                                        {/* Non-Actions columns */}
                                                        <div className={`table-tq-columns `}>
                                                            {columns
                                                                .filter(col => col.name !== "Actions")
                                                                .map((col, colIndex) => (
                                                                    <div
                                                                        key={colIndex}
                                                                        className={`col-${typeof col.name === "string"
                                                                            ? col.name.toLowerCase().replace(/\s+/g, "-")
                                                                            : "default-column"
                                                                            }`}
                                                                    >
                                                                        <div className={showQuestionRow ? "question-td" : ""}>
                                                                            {showQuestionRow && (
                                                                                <span className="col-name">{col.name}{col.name === "" ? "" : ":"}</span>
                                                                            )}
                                                                            <div>
                                                                                <span className="col-cell">
                                                                                    {col.cell ? col.cell(row) : row[col.selector]}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                        </div>

                                                        {/* Actions column (separate div for spacing) */}
                                                        <div className="table-tq-actions">
                                                            {columns
                                                                .filter(col => col.name === "Actions")
                                                                .map((col, colIndex) => (
                                                                    <div key={colIndex} className="test-col-actions">
                                                                        <span className="col-cell">
                                                                            {col.cell ? col.cell(row) : row[col.selector]}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    </div>
                                                </td>

                                                {showQuestionRow && (
                                                    <tr
                                                        className="question-row bg-gray-50 cursor-pointer"
                                                        onClick={() => {
                                                            if (!fullViewMode) toggleQuestionView(row.id); // only toggle in normal mode
                                                        }}
                                                    >
                                                        <td
                                                            colSpan={columns.length + (selectableRows ? 1 : 0)}
                                                            className="pb-2 row-link ans-item"
                                                        >
                                                            {row.question ? (
                                                                fullViewMode || expandedQuestions.includes(row.id) ? (
                                                                    <>
                                                                        {/* ✅ Full Question (rendered in both expanded or full view mode) */}
                                                                        <QuestionEditor content={row.question} mode={row.mode} />

                                                                        {/* ✅ Question Images */}
                                                                        <div className="question-Images">
                                                                            {Array.isArray(row?.questionImages) &&
                                                                                row.questionImages.map((img, index) => (
                                                                                    <img key={index} src={img} alt={`Image ${index + 1}`} className="qtn-image" />
                                                                                ))}
                                                                        </div>


                                                                        {/* ✅ View Solution button (works same as before) */}
                                                                        {row.solution && (
                                                                            <div className="mt-2">
                                                                                <a
                                                                                    className={`view-solution-btn ${showAnswers.includes(row.id) ? "hide" : "view"
                                                                                        }`}
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation(); // prevent row collapse in normal mode
                                                                                        toggleAnswerView(row.id);
                                                                                    }}
                                                                                >
                                                                                    {showAnswers.includes(row.id)
                                                                                        ? "Hide Solution"
                                                                                        : "Solution"}
                                                                                </a>
                                                                            </div>
                                                                        )}

                                                                        {/* ✅ Answer (only show when toggled) */}
                                                                        {showAnswers.includes(row.id) && row.solution && (
                                                                            <div className="mt-2 bg-gray-100 rounded">
                                                                                <QuestionEditor content={row.solution} />
                                                                            </div>
                                                                        )}

                                                                    </>
                                                                ) : (
                                                                    // ✅ Collapsed Preview (normal mode only)
                                                                    <span className="truncate block w-full">
                                                                        {/* {row.question.split(" ").length > 50
                                                                            ? row.question.split(" ").slice(0, 80).join(" ") + "..."
                                                                            : row.question} */}
                                                                            <QuestionEditor content={
                                                                                row.question.length > 150
                                                                                    ? row.question.substring(0, 150) + "..."
                                                                                    : row.question
                                                                            } mode={row.mode} singleline={true}/>
                                                                    </span>
                                                                )
                                                            ) : (
                                                                "No Question"
                                                            )}
                                                        </td>
                                                    </tr>
                                                )}

                                            </div>
                                        )}

                                        {/* All test and Question Bank BankBank Table */}
                                        {!showQuestionRow && screenWidth >= 769 && (
                                            columns.map((col, colIndex) => (
                                                <td
                                                    key={colIndex}
                                                    className={`col-${typeof col.name === "string"
                                                        ? col.name.toLowerCase().replace(/\s+/g, "-")
                                                        : "default-column"
                                                        }`}
                                                    style={{ width: col.width || "auto", minWidth: col.width || "auto" }}
                                                >
                                                    <div className="cell-wrapper">
                                                        <span className="col-cell">
                                                            {col.cell ? col.cell(row) : row[col.selector]}
                                                        </span>
                                                    </div>
                                                </td>
                                            ))
                                        )}

                                        {/* Responsiveness  */}
                                        {!showQuestionRow && screenWidth <= 768 && (

                                            <div className="rows-iteam">
                                                <td>
                                                    <div className="table-tq-wrapper">
                                                        {/* Non-Actions columns */}
                                                        <div className="table-tq-columns">
                                                            {columns
                                                                .filter(col => col.name !== "Actions")
                                                                .map((col, colIndex) => (
                                                                    <div
                                                                        key={colIndex}
                                                                        className={`col-${typeof col.name === "string"
                                                                            ? col.name.toLowerCase().replace(/\s+/g, "-")
                                                                            : "default-column"
                                                                            }`}
                                                                    >
                                                                        <div>
                                                                            <span className="col-cell">
                                                                                {/* Labels */}
                                                                                {col.name === "Owner" && <label>Owner by -&nbsp;</label>}
                                                                                {col.name === "Questions" && <label>Questions -&nbsp;</label>}
                                                                                {col.name === "Strength" && <label>Strength -&nbsp;</label>}
                                                                                {col.name === "Maximum Allowed" && <label>Maximum Allowed -&nbsp;</label>}
                                                                                {col.name === "Expiry Date" && <label>Expiry Date -&nbsp;</label>}
                                                                                {/* Cell content */}
                                                                                {col.cell ? col.cell(row) : row[col.selector]}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                        </div>

                                                        {/* Actions column */}
                                                        <div className="table-tq-actions">
                                                            {columns
                                                                .filter(col => col.name === "Actions")
                                                                .map((col, colIndex) => (
                                                                    <div key={colIndex} className="test-col-actions">
                                                                        <span className="col-cell">
                                                                            {col.cell ? col.cell(row) : row[col.selector]}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    </div>
                                                </td>
                                            </div>

                                        )}

                                    </tr>


                                    {/* test question and question */}
                                    {showQuestionRow && (
                                        // <tr
                                        //     className="question-row  bg-gray-50 cursor-pointer"
                                        //     onClick={() => toggleQuestionView(row.id)}
                                        // >
                                        //     <td colSpan={columns.length + (selectableRows ? 1 : 0)} className="p-2 row-link">
                                        //         {row.question ? (
                                        //             expandedQuestions.includes(row.id) ? (
                                        //                 <>
                                        //                     {/* Full question */}
                                        //                      {/* the question convent to latex and code */}
                                        //                     {/* <LatexRenderer content={row.question} /> */}
                                        //                     <CKEditorRenderer content={row.question} mode={row.mode} />

                                        //                     {/* View Solution button */}
                                        //                     {row.answer && (
                                        //                         <div className="mt-2">
                                        //                             <button
                                        //                                 className={`view-solution-btn ${showAnswers.includes(row.id) ? "hide" : "view"}`}
                                        //                                 onClick={(e) => {
                                        //                                     e.stopPropagation(); // Prevent toggling question collapse
                                        //                                     toggleAnswerView(row.id);
                                        //                                 }}
                                        //                             >
                                        //                                 {showAnswers.includes(row.id) ? "Hide Solution" : "View Solution"}
                                        //                             </button>
                                        //                         </div>
                                        //                     )}

                                        //                     {/* Answer content */}
                                        //                     {showAnswers.includes(row.id) && row.answer && (
                                        //                         <div className="mt-2 p-2 bg-gray-100 rounded">
                                        //                             <LatexRenderer content={row.answer} />
                                        //                         </div>
                                        //                     )}
                                        //                 </>
                                        //             ) : (
                                        //                 // Preview: first 80 words with "..."
                                        //                 <span className="truncate">
                                        //                     {row.question.split(" ").slice(0, 80).join(" ")}...
                                        //                 </span>
                                        //             )
                                        //         ) : (
                                        //             "No Question"
                                        //         )}
                                        //     </td>
                                        // </tr>
                                        <div></div>
                                    )}



                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DataTable