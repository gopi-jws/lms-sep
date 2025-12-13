"use client"
import { useLocation, useParams } from "react-router-dom";
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react"
import { FaPaperPlane, FaCopy, FaFilePdf, FaShare, FaArchive, FaTrashAlt, FaEdit, FaTag } from "react-icons/fa"
import { BiSolidRename } from "react-icons/bi"
import { HiDotsVertical } from "react-icons/hi"
import "./TestIndex.css"
import ShareModal from "../../../ReusableComponents/TestShareModal/ShareModal"
import { Link } from "react-router-dom"
import TestSidebar from "../TestSidebar/TestSidebar"
import DataTable from "../../../ReusableComponents/TableComponent/TableComponent"
import PaginationButtons from "../../../ReusableComponents/Pagination/PaginationButton"
import PaginationInfo from "../../../ReusableComponents/Pagination/PaginationInfo"
import PublishModal from "../../../ReusableComponents/PublishModal/PublishModal"
import Header from "../../../header/header"
import { Helmet } from "react-helmet"
import AddTagModal from "../../../ReusableComponents/AddTagModal/AddTagModal"
import NewTestModal from "../../../ReusableComponents/NewTestModal/NewTestModal"
import { getTimeAgo } from "../../../../utils/time-utils"
import { getNextId } from "../../../../utils/idGenerator"
import NotificationShared from "../../../ReusableComponents/notificationShared/notficationShared"
import TestAddSidebar from "../TestAddSideabr/TestAddSideabr";
import { VscTriangleDown } from "react-icons/vsc";


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



const TestIndex = () => {
  const { pathname } = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [emails, setEmails] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [tagColor, setTagColor] = useState("#ff0000")
  const [isTagModalOpen, setIsTagModalOpen] = useState(false)
  const [showTagOptions, setShowTagOptions] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [isCustomColor, setIsCustomColor] = useState(false)
  const [customColor, setCustomColor] = useState("#000000")
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [showButtons, setShowButtons] = useState(true)
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [selectedTest, setSelectedTest] = useState("")
  const [selectedTestId, setSelectedTestID] = useState("")
  const [showTooltip, setShowTooltip] = useState(false)
  const [dataTableVisible, setDataTableVisible] = useState(false)
  const [selectedQuestions, setSelectedQuestions] = useState([])
  const [isTagQuestionsModalOpen, setIsTagQuestionsModalOpen] = useState(false)
  const [currentTag, setCurrentTag] = useState(null)
  const [filteredData, setFilteredData] = useState(initialData)
  const [activeTag, setActiveTag] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filteredCount, setFilteredCount] = useState(initialData.length)
  const [fullViewMode, setFullViewMode] = useState(false)
  const [openDropdownId, setOpenDropdownId] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isArchivedModalOpen, setIsArchivedModalOpen] = useState(false)
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false)
  const [editingTest, setEditingTest] = useState([])
  const [modalHeading, setModalHeading] = useState("");
  const [isNewTestModalOpen, setIsNewTestModalOpen] = useState(false)
  const [isTagRemoveModelOpen, setIsTagRemoveModelOpen] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [ispinning, setIsSpinning] = useState(null)
  // const getSortedTests = () => {
  //   const tests = JSON.parse(localStorage.getItem("tests")) || [];

  //   return tests.sort((a, b) => {

  //     if (a.status === "Published" && b.status !== "Published") return -1;
  //     if (a.status !== "Published" && b.status === "Published") return 1;
  //     if (a.status === "Published" && b.status === "Published") {
  //       return new Date(b.lastModified) - new Date(a.lastModified);
  //     }
  //     return new Date(b.lastModified) - new Date(a.lastModified);
  //   });
  // };

  // const [data, setData] = useState(() => {
  //   const savedTests = JSON.parse(localStorage.getItem("tests"));
  //   return savedTests || initialData;
  // });

  const [data, setData] = useState(() => {
    const tests = JSON.parse(localStorage.getItem("tests"));
    const savedTests = tests
    return savedTests ? initialData : initialData;
  });

  // useEffect(() => {
  //   localStorage.setItem("tests", JSON.stringify(data));
  // }, [data]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('tests'));
    setData(stored);
  }, []);

  const [tags, setTags] = useState(() => {
    ///localStorage.removeItem('testTags')
    const savedTags = localStorage.getItem("testTags")
    return savedTags ? JSON.parse(savedTags) : [
      { id: 1, name: "Important", color: "#FF0000", questions: [] },
      { id: 2, name: "Review", color: "#FF9900", questions: [] },
      { id: 3, name: "Completed", color: "#008000", questions: [] },
    ]
  })
  
  useEffect(() => {
    localStorage.setItem("testTags", JSON.stringify(tags))
  }, [tags])


  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1); // force re-render
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const uncategorizedCount = data.length - new Set(
    tags.flatMap(tag => tag.questions)
  ).size
  const refreshTests = () => {
    const stored = JSON.parse(localStorage.getItem('tests')) || [];
    setData(stored);
  };
  useEffect(() => {
    let result = data

    if (activeTag) {
      if (activeTag === "uncategorized") {
        const allTaggedQuestions = tags.flatMap((tag) => tag.questions)
        result = result.filter((test) => !allTaggedQuestions.includes(test.id))
      } else {
        const tag = tags.find((t) => t.name === activeTag)
        if (tag) {
          result = result.filter((test) => tag.questions.includes(test.id))
        }
      }
    }

    if (searchQuery) {
      result = result.filter((test) => {
        return (
          test.test.toLowerCase().includes(searchQuery.toLowerCase()) ||
          test.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
          test.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
          test.lastModified.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })
    }

    if (filterStatus) {
      result = result.filter((test) => test.status === filterStatus)
    }

    setFilteredData(result)
    setFilteredCount(result.length)
  }, [activeTag, searchQuery, filterStatus, tags, data])


  const getCurrentPageData = () => {
    const dataToUse = sortedFilteredData;

    if (fullViewMode) {
      return dataToUse;
    }

    const startIndex = (currentPage - 1) * rowsPerPage;
    return dataToUse.slice(startIndex, startIndex + rowsPerPage);
  };


  const showPaginationButtons = !fullViewMode && rowsPerPage < filteredData.length

  const handleSearchChange = (value) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleFilterStatusChange = (value) => {
    setFilterStatus(value)
    setCurrentPage(1)
  }

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".mobile-actions-dropdown")) {
        setOpenDropdownId(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const openModal = (testName) => {
    setSelectedTest(testName.test)
    setSelectedTestID(testName.id)
    setIsModalOpen(true)
    setOpenDropdownId(null)
  }

  const closeModal = () => {
    setIsModalOpen(false)
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

  const handleOpenModal = (testName) => {
    setSelectedTest(testName)
    setIsModalOpen(true)
  }

  const tagOptionsRef = useRef(null)
  const moreOptionsRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tagOptionsRef.current && !tagOptionsRef.current.contains(event.target)) {
        setShowTagOptions(false)
      }
      if (moreOptionsRef.current && !moreOptionsRef.current.contains(event.target)) {
        setShowMoreOptions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const openShareModal = (testName) => {
    setSelectedTest(testName)
    setIsShareModalOpen(true)
    setOpenDropdownId(null)
  }

  const loadMore = () => {
    const newRows = rowsPerPage + 5
    setRowsPerPage(Math.min(newRows, filteredData.length))
  }

  const toggleFullView = () => {
    if (!fullViewMode) {
      setRowsPerPage(filteredData.length)
    } else {
      setRowsPerPage(5)
    }
    setFullViewMode(!fullViewMode)
  }

  const toggleDropdown = (rowId) => {
    setOpenDropdownId(openDropdownId === rowId ? null : rowId)
  }

  const handleAddTag = (newTag) => {
    const tagWithId = {
      id: getNextId('testTags'),
      ...newTag,
      questions: newTag.questions || []
    }
    setTags(prev => [...prev, tagWithId])
  }

  const handleAddQuestionsToTag = (tagName, questionIds) => {
    setTags(prevTags =>
      prevTags.map(tag => {
        if (tag.name === tagName) {
          const questionSet = new Set(tag.questions);
          questionIds.forEach(id => questionSet.add(id));
          return {
            ...tag,
            questions: Array.from(questionSet)
          };
        }
        return tag;
      })
    );
    console.log("tagssssss", tags);
  };

  const handleRemoveQuestionFromTag = (tagName, questionId) => {
    setTags(prevTags =>
      prevTags.map(tag => {
        if (tag.name === tagName) {
          return {
            ...tag,
            questions: tag.questions.filter(id => id !== questionId)
          };
        }
        return tag;
      })
    );
  };

  const handleUpdateTest = (testId, updatedFields) => {
    console.log(testId);
    console.log(updatedFields);

    setData(prevData =>
      prevData.map(test =>
        test.id === testId
          ? {
            ...test,
            test: updatedFields.name || test.test,
            duration: updatedFields.duration || test.duration,
            description: updatedFields.description || test.description,
            instructions: updatedFields.instructions || test.instructions,
            lastModified: new Date().toISOString()
          }
          : test
      )
    );
  };

  const handleRenameTest = (testId, updatedFields) => {
    setData(prevData =>
      prevData.map(test =>
        test.id === testId
          ? {
            ...test,
            test: updatedFields.name || test.test,
            // lastModified: new Date().toISOString()
          }
          : test
      )
    );
  };


  const handleCopyTest = (testId, newName, selectedTags = []) => {
    let testToCopy = data.find(test => test.id === testId);
    console.log(testToCopy.test);

    if (testToCopy) {
      const newTestId = Date.now();
      const newTest = {
        ...testToCopy,
        id: newTestId,
        test: newName || `${testToCopy.test}`,
        // lastModified: new Date().toISOString(),
        status: "Not Published"
      };


      const originalIndex = data.findIndex(test => test.id === testId);

      // 1️⃣ Update main data with the new test
      setData(prevData => [
        ...prevData.slice(0, originalIndex + 1),
        newTest,
        ...prevData.slice(originalIndex + 1)
      ]);

      // 2️⃣ Update tags so selected ones include the new testId
      setTags(prevTags =>
        prevTags.map(tag =>
          selectedTags.includes(tag.id)
            ? { ...tag, questions: [...tag.questions, newTestId] }
            : tag
        )
      );
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };



  const handleCreateTest = (testData) => {

    console.log(testData.lastModified);
    
    const newTest = {
      id: Date.now(),
      test: testData.name,
      owner: "You",
      status: "Not Published",
      lastModified: getTimeAgo(testData.lastModified),
      duration: testData.duration,
      description: testData.description,
      instructions: testData.instructions
    };
    setData(prev => [...prev, newTest]);
  };


  const handleDownloadPdf = (row) => {
    setIsSpinning(row.id)
    setTimeout(() => {
      setIsSpinning(null)
    }, 2000);
  }


  // Add this useEffect for persisting data
  useEffect(() => {
    localStorage.setItem("tests", JSON.stringify(data));
    localStorage.setItem("testTags", JSON.stringify(tags));
  }, [data, tags]);


  useEffect(() => {
    let result = data

    if (activeTag) {
      if (activeTag === "uncategorized") {
        const allTaggedQuestions = tags.flatMap(tag => tag.questions)
        result = result.filter(test => !allTaggedQuestions.includes(test.id))
      } else {
        const tag = tags.find(t => t.name === activeTag)
        if (tag) {
          result = result.filter(test => tag.questions.includes(test.id))
        }
      }
    }

    setFilteredData(result)
  }, [activeTag, tags, data])


  const handleBulkTagAction = (selectedRowIds) => {
    setSelectedQuestions(selectedRowIds)
    setIsTagQuestionsModalOpen(true)
  }

  const handleTagClick = (tagName) => {
    setActiveTag(tagName)
  }

  const handleUncategorizedClick = () => {
    setActiveTag("uncategorized")
  }
  const handleArchiveTest = (testId) => {

    setData(prevData =>
      prevData.filter(test =>
        !testId.some(st => st.id === test.id) // remove all selected ids
      )
    )
    // setData(prevData =>
    //   prevData.map(test =>
    //     test.id === testId
    //       ? { ...test, archived: true,
    //         //  lastModified: new Date().toISOString() 
    //         }
    //       : test
    //   )
    // );

    // Store archived test in localStorage 'archivetags' array only if not already present
    const archivedTest = data.find(test => test.id === testId);
    if (archivedTest) {
      const archivedTags = JSON.parse(localStorage.getItem("archivetags") || "[]");
      const alreadyArchived = archivedTags.some(test => test.id === testId);
      if (!alreadyArchived) {
        localStorage.setItem("archivetags", JSON.stringify([...archivedTags, { ...archivedTest, archived: true, lastModified: new Date().toISOString() }]));
      }
    }
  };


  const handleDeleteTest = (testId) => {
    setData(prevData =>
      prevData.filter(test =>
        !testId.some(st => st.id === test.id) // remove all selected ids
      )
    )


    // Store deleted test in localStorage 'trashedTags' array only if not already present
    const trashedTest = data.find(test => test.id === testId);
    if (trashedTest) {
      const trashedTags = JSON.parse(localStorage.getItem("trashedTags") || "[]");
      const alreadyTrashed = trashedTags.some(test => test.id === testId);
      if (!alreadyTrashed) {
        localStorage.setItem("trashedTags", JSON.stringify([...trashedTags, { ...trashedTest, deleted: true, lastModified: new Date().toISOString() }]));
      }
    }
  };

  const handlePermanentDelete = (testId) => {
    setData(prevData => prevData.filter(test => test.id !== testId));
  };

  const handleRestoreTest = (testId) => {
    setData(prevData =>
      prevData.map(test =>
        test.id === testId
          ? { ...test, trashed: false, lastModified: new Date().toISOString() }
          : test
      )
    );
  };

  const getTimeFromString = (text) => {
    const now = new Date();

    // Prevent error if text is null, undefined, or not a string
    if (!text || typeof text !== "string") return now.getTime();

    const match = text.match(/(\d+)\s+(hour|hours|day|days)/i);
    if (!match) return now.getTime();

    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();

    if (unit.startsWith("hour")) return now.getTime() - value * 60 * 60 * 1000;
    if (unit.startsWith("day")) return now.getTime() - value * 24 * 60 * 60 * 1000;

    return now.getTime();
  };

  const sortedFilteredData = [...filteredData].sort(
    (a, b) => getTimeFromString(b?.lastModified) - getTimeFromString(a?.lastModified)
  );


  //creat new test 
  const handleNewTest = () =>{
    console.log("sdeftertg");
    
    setIsNewTestModalOpen(true);  
  }



  const handleActionClick = (action, row) => {
    setOpenDropdownId(null);

    switch (action) {
      case "dispatch":
        openModal(row.test);
        break;
      case "edit":
        setModalHeading("Edit Test");
        setEditingTest({
          id: row.id,
          name: row.test,
          duration: row.duration,
          description: row.description,
          instructions: row.instructions
        });
        setIsEditModalOpen(true);
        break;
      case "rename":
        setModalHeading("Rename Test");
        setEditingTest({
          id: row.id,
          name: row.test,
        });
        setIsRenameModalOpen(true);
        break;
      case "pdf":
        handleDownloadPdf(row);
        break;
      case "zip":
        handleDownloadZip(row);
        break;
      case "copy":
        // handleCopyTest(row.id);
        setEditingTest({
          id: row.id,
          name: row.test,
        });
        setIsCopyModalOpen(true);
        setModalHeading("Copy Test");
        break;
      case "share":
        openShareModal(row.test);
        setModalHeading("Share Test");
        break;
      case "archive":
        setEditingTest([{ id: row.id, name: row.test }]);
        setModalHeading("Archive Test");
        setIsArchivedModalOpen(true)
        break;
      case "delete":
        setEditingTest([{ id: row.id, name: row.test }]);
        setModalHeading("Delete Test");
        setIsDeleteModalOpen(true);
        break;
      case "restore":
        handleRestoreTest(row.id);
        break;
      case "permanent-delete":
        handlePermanentDelete(row.id);
        break;
      default:
        break;
    }
  };


  const columns = [
    {
      name: "Test Names",
      selector: "test",
      sortable: true,
      width: "150px", // Set fixed width
      cell: (row) => (
        <div className="flex items-center">
          <Link to={`/test/${row.id}/movetest`} state={{ testName: row.test, testId: row.id }}>
            <span className="row-link">{row.test}</span>
          </Link>
          <div className="question-tags">
            {tags
              .filter(tag => tag.questions?.includes(row.id))
              .map(tag => (
                <div key={tag.id} className="question-tag-container">
                  <div className="question-tag">
                    <span
                      className="tag-color-dot"
                      style={{ backgroundColor: tag.color }}
                    ></span>
                    <span className="index-tag-name">{tag.name}</span>
                  </div>
                  <span
                    className="tag-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveQuestionFromTag(tag.name, row.id);
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
      name: "Owner",
      selector: "owner",
      sortable: true,
       width: "70px",
    },
    // {
    //   name: "Status",
    //   selector: "status",
    //   sortable: true,
    //   width: "150px",
    // },
    {
      name: "Last Modified",
      selector: "lastModified",
      sortable: true,
       width: "70px",
      cell: (row) => <div>{row.lastModified}</div>  // <-- render static string directly
    },
    {
      name: "Actions",
      selector: "actions",
      sortable: false,
      width: "120px",
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
                  <button className="mobile-action-item dispatch" onClick={() => handleActionClick("dispatch", row)}>
                    <FaPaperPlane />
                    <span>Publish</span>
                  </button>
                  <button className="mobile-action-item edit" onClick={() => handleActionClick("edit", row)}>
                    <FaEdit />
                    <span>Edit</span>
                  </button>
                  <button className="mobile-action-item pdf" onClick={() => handleActionClick("pdf", row)}>
                    <FaFilePdf />
                    <span>Download PDF</span>
                  </button>
                  <button className="mobile-action-item copy" onClick={() => handleActionClick("copy", row)}>
                    <FaCopy />
                    <span>Copy</span>
                  </button>
                  <button className="mobile-action-item rename" onClick={() => handleActionClick("rename", row)}>
                    <BiSolidRename />
                    <span>Rename</span>
                  </button>
                  <button className="mobile-action-item share" onClick={() => handleActionClick("share", row)}>
                    <FaShare />
                    <span>Share</span>
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
            <div className="flex">
              {/* <button className="test-action-button dispatch" aria-label="Published" disabled={row.status === 'Published'} onClick={() => openModal(row)} style={{
                opacity: row.status === 'Published' ? 0.5 : 1,
                cursor: row.status === 'Published' ? 'not-allowed' : 'pointer',
              }}> */}
                <button className="test-action-button dispatch" aria-label="Published" onClick={() => openModal(row)} style={{
                  opacity: 1,
                  cursor: 'pointer',
                }}>
                <FaPaperPlane />
                <span className="tooltip-text">Publish</span>
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
                className="test-action-button pdf"
                aria-label="Download PDF"
                onClick={() => { handleActionClick("pdf", row) }}
              >
                {ispinning === row.id ? (
                  <div className="spinner"></div>
                ) : (
                  <FaFilePdf />
                )}
                <span className="tooltip-text">Download PDF</span>
              </button>
              <button
                className="test-action-button copy"
                aria-label="Copy"
                onClick={() => handleActionClick("copy", row)}
              >
                <FaCopy />
                <span className="tooltip-text">Copy</span>
              </button>
              <button
                className="test-action-button rename"
                aria-label="Rename"
                onClick={() => handleActionClick("rename", row)}
              >
                <BiSolidRename />
                <span className="tooltip-text">Rename</span>
              </button>
              <button className="test-action-button share" aria-label="Share" onClick={() => openShareModal(row.test)}>
                <FaShare />
                <span className="tooltip-text">Share</span>
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
  ]

  return (
    <>
      <Helmet>
        <title>Tests</title>
        <meta name="description" content="Tests" />
      </Helmet>

      <div className="test-index-wrapper">
        <NotificationShared
          sender="Akash"
          projectName="Numerical Analysis Assignment-I"
          testId={1}
        />

        <div className="test-index-header-moblie">
          <h1 className="breadcrumb">All Tests</h1>
          <VscTriangleDown onClick={toggleMobileSidebar} ref={toggleRef} className="TriagbleDown" />
        </div>

        <div  ref={sidebarRef} >
          <TestSidebar
            tags={tags}
            setTags={setTags}
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
            uncategorizedCount={uncategorizedCount}
            onTagClick={handleTagClick}
            onUncategorizedClick={handleUncategorizedClick}
            activeTag={activeTag}
            // newTest={handleNewTest}
            // onAddTag={handleAddTag}
            onCreateTest={handleCreateTest}
            archivedCount={data.filter(test => test.archived).length}
            trashedCount={data.filter(test => test.trashed).length}
          />
        </div>

        <div className="test-index-container">
          <div className="test-index-header">
            <h1 className="breadcrumb desktop-title">All Tests</h1>

            {/* Mobile dropdown button */}
            <div className="mobile-title">
              <button
                className="mobile-dropdown-btn"
                onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              >
                {activeTag || "All Tests"} ▼
              </button>

              {showMobileSidebar && (
                <div className="mobile-sidebar-dropdown">
                  <div className="test-sidebar-container">
                    <TestSidebar
                      className="d-block d-md-none"
                      tags={tags}
                      setTags={setTags}
                      uncategorizedCount={uncategorizedCount}
                      onTagClick={handleTagClick}
                      onUncategorizedClick={handleUncategorizedClick}
                      activeTag={activeTag}
                      onCreateTest={handleCreateTest}
                      archivedCount={data.filter((test) => test.archived).length}
                      trashedCount={data.filter((test) => test.trashed).length}
                    />
                  </div>
                </div>
              )}
            </div>

            {activeTag && (
              <div className="active-tag-indicator">
                Showing tests for:{" "}
                <span style={{ color: tags.find((t) => t.name === activeTag)?.color || "#666" }}>
                  {activeTag === "uncategorized" ? "Uncategorized" : activeTag}
                </span>
              </div>
            )}
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
              filterType={filterStatus}
              onFilterTypeChange={handleFilterStatusChange}
              tags={tags}
              onBulkTagAction={(selectedIds) => {
                setSelectedQuestions(selectedIds);
                setIsTagQuestionsModalOpen(true);
              }}
              onAddTag={handleAddTag}
              onAddQuestionsToTag={handleAddQuestionsToTag}
              setModalHeading={setModalHeading}
              setIsRenameModalOpen={setIsRenameModalOpen}
              setIsCopyModalOpen={setIsCopyModalOpen}
              setEditingTest={setEditingTest}
              setIsDeleteModalOpen={setIsDeleteModalOpen}
              setIsArchivedModalOpen={setIsArchivedModalOpen}
              allQuestions={data}
              modalType="test"
            />
          </div>

          <ShareModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            emails={emails}
            setEmails={setEmails}
            testName={selectedTest}
          />
        </div>

        <PublishModal isOpen={isModalOpen} tags={tags} onClose={closeModal} selectedTest={selectedTest} selectedTestId={selectedTestId} onPublish={refreshTests} />
        <AddTagModal
          isOpen={isTagQuestionsModalOpen}
          onClose={() => setIsTagQuestionsModalOpen(false)}
          tags={tags}
          selectedQuestions={selectedQuestions}
          onAddQuestions={handleAddQuestionsToTag}
          onAddTag={handleAddTag}
          allQuestions={data}
        />

        {isEditModalOpen && (
          <NewTestModal
            heading={modalHeading}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingTest(null);
            }}
            initialName={editingTest?.name || ""}
            initialDuration={editingTest?.duration || 60}
            initialDescription={editingTest?.description || ""}
            initialInstructions={editingTest?.instructions || ""}
            onSubmit={(updatedFields) => {
              handleUpdateTest(editingTest.id, updatedFields);
              setIsEditModalOpen(false);
              setEditingTest(null);
            }}
            mode="edit"
          />
        )}

        {isRenameModalOpen && (
          <NewTestModal
            heading={modalHeading}
            isOpen={isRenameModalOpen}
            onClose={() => { setIsRenameModalOpen(false); setEditingTest(null); }}
            initialName={editingTest?.name || ""}
            mode="rename"
            onSubmit={(updatedFields) => {
              // updatedFields will be { name: 'new name' }
              handleRenameTest(editingTest.id, updatedFields);
              setIsRenameModalOpen(false);
              setEditingTest(null);
            }}
          />
        )}

        {/* {isNewTestModalOpen && (
          <NewTestModal
            heading="Create New Test"
            isOpen={isNewTestModalOpen}
            onClose={() => setIsNewTestModalOpen(false)}
            onSubmit={handleCreateTest}
            mode="create"
          />
        )} */}

        {isDeleteModalOpen && (
          <NewTestModal
            isOpen={isDeleteModalOpen}
            onClose={() => { setIsDeleteModalOpen(false); setEditingTest(null); }}
            selectedTest={editingTest}
            heading={modalHeading}
            onSubmit={(deleteTests) => {
              handleDeleteTest(deleteTests)
              setIsDeleteModalOpen(false)
            }}
            mode="delete"
          />
        )

        }

        {isCopyModalOpen && (
          <NewTestModal
            heading={modalHeading}
            isOpen={isCopyModalOpen}
            onClose={() => setIsCopyModalOpen(false)}
            initialName={editingTest?.name || ""}
            initialId={editingTest?.id || ""}
            mode="copy"
            onSubmit={(data) => handleCopyTest(editingTest.id, data.name, data.tags)}
          />
        )}

        {isArchivedModalOpen && (
          <NewTestModal
            heading={modalHeading}
            isOpen={isArchivedModalOpen}
            onClose={() => { setIsArchivedModalOpen(false); setEditingTest(null); }}
            selectedTest={editingTest}
            onSubmit={(archivedTests) => {
              handleArchiveTest(archivedTests);
              setIsArchivedModalOpen(false)
            }}
            mode="archive"
          />
        )}
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

    </>
  );
};

export default TestIndex