
import { useState, useEffect, useMemo, useRef } from "react"
import DataTable from "../../../ReusableComponents/TableComponent/TableComponent"
import { FaCopy, FaEdit, FaTrashAlt, FaArrowRight, FaFolderPlus } from "react-icons/fa"
import PaginationButtons from "../../../ReusableComponents/Pagination/PaginationButton"
import PaginationInfo from "../../../ReusableComponents/Pagination/PaginationInfo"
import { FaPaperPlane, FaFilePdf, FaShare, FaArchive, FaTag } from "react-icons/fa"
import "./QuestionsAdd.css"

import Modal from "react-modal"
import LatexRenderer from "../../../ReusableComponents/LatexRenderer/LatexRenderer"
import "katex/dist/katex.min.css"
import { Helmet } from "react-helmet"
import QuestionAddDropdown from "../../../ReusableComponents/QuestionAddDropdown/QuestionAddDropdown"
import NewQBModal from "../../../ReusableComponents/NewQBModal/NewQBModal"
import SAQModal from "../../../ReusableComponents/Questions-Types-Modals/SAQModal/SAQModal"
import MCQModal from "../../../ReusableComponents/Questions-Types-Modals/MCQModal/MCQModal"
import NumericalModal from "../../../ReusableComponents/Questions-Types-Modals/NumericalModal/NumericalModal"
import TrueFalseModal from "../../../ReusableComponents/Questions-Types-Modals/TrueFalseModal/TrueFalseModal"
import DescriptiveModal from "../../../ReusableComponents/Questions-Types-Modals/DescriptiveModal/DescriptiveModal"
import React from "react"
import { VscTriangleDown } from "react-icons/vsc"
import AddQuestionSidebar from "./AddQuestionSidebar/AddQuestionSidebar"
import { useSelector,useDispatch } from "react-redux"
import { addNewQuestionQB,setIsSQAModalOpen,setIsModalOpen,setIsNumericalModalOpen,setIsTrueFalseModalOpen,setIsDescriptiveModalOpen } from "../../../../slices/addQuestionBank"




const QuestionsAdd = () => {

  const q1 = `<p>1. Solve the quadratic equation:</p><math math ><mrow><mi>x</mi><mo>^</mo><mn>2</mn><mo>+</mo><mn>5</mn><mi>x</mi><mo>+</mo><mn>6</mn><mo>=</mo><mn>0</mn></mrow></math><p>2. Write a Python function to add two numbers:</p><pre><code class="language-python">def add(a, b):
  return a + b</code></pre>`
  const data = [
    {
      id: 1,
      question: `Identify the graph of the function $$y = \\sin(x)$$ from the options below:`,
      questionImages: [`https://insightsedu.in/new/3.png`, "https://insightsedu.in/new/4.png"],
      solution: `The correct answer is option a) Sine Wave. The sine function produces a wave that oscillates between -1 and 1.`,
      solutionImage: `https://insightsedu.in/new/3.png`,
      type: "Single Answer",
      marks: 3,
      owner: "Admin",
      section: "Trigonometry",
      created: "15/03/2025",
      modified: "3 weeks ago",
      options: [
        {text:"Option A", image :`https://insightsedu.in/new/4.png`},
        { text: "Option B", image: `https://insightsedu.in/new/4.png` }, 
        { text: "Option C", image: `https://insightsedu.in/new/4.png` }, 
        { text: "Option B", image: `https://insightsedu.in/new/4.png` },
      ],
      correctAnswer: 0,
      hasImages: true,
    },
    {
      id: 2,
      question: `A particle moves along a path defined by:
            $$x(t) = R \\cos(\\omega t), \\quad y(t) = R \\sin(\\omega t), \\quad z(t) = kt^2$$
            Which of the following represents the arc length $$S$$?`,
      solution: `The correct solution is option D:
            $$S = \\frac{1}{4k} \\left[ 2kT \\sqrt{R ^ 2 \\omega^2 + 4k^2 T^2} + R^2 \\omega^2 \\ln\\left(\\frac{2kT + \\sqrt{R ^ 2 \\omega^2 + 4k^2 T^2}}{R\\omega}\\right) \\right]$$`,
      type: "Single Answer",
      marks: 10,
      owner: "Admin",
      section: "Advanced Mathematics",
      created: "15/03/2025",
      modified: "1 day ago",
      options: [
        { text: "$$S = \\frac{T}{2} \\sqrt{R ^ 2 \\omega^2 + 4k^2 T^2} + \\frac{R ^ 2 \\omega^2}{4k} \\sinh^{-1}\\left(\\frac{2kT}{R\\omega}\\right)$$", image: `` },
        { text: "$$S = \\frac{T}{2} \\sqrt{R ^ 2 \\omega^2 + 4k^2 T^2} + \\frac{R ^ 2 \\omega^2}{4k} \\ln\\left|2kT + \\sqrt{R ^ 2\\omega^2 + 4k^2 T^2}\\right|$$", image: `` },
        { text: "$$S = \\frac{1}{4k} \\left[ 2kT \\sqrt{R ^ 2 \\omega^2 + 4k^2 T^2} + R^2 \\omega^2 \\ln\\left(\\frac{2kT + \\sqrt{R ^ 2 \\omega^2 + 4k^2 T^2}}{R\\omega}\\right) \\right]$$", image: `` },
        { text: "$$S = \\frac{1}{4k} \\left[ 2kT \\sqrt{R ^ 2 \\omega^2 + 4k^2 T^2} + R^2 \\omega^2 \\ln\\left(\\frac{2kT + \\sqrt{R ^ 2 \\omega^2 + 4k^2 T^2}}{R\\omega}\\right) \\right]$$", image: `` },
      ],
      correctAnswer: 3,
    },
    {
      id: 3,
      question: `The following table shows experimental data for a reaction:
            Time (s)  Concentration (M)
            0         1.00
            10        0.82
            Determine the reaction order and rate constant.`,
      solution: `The correct solution is option D : 0`,
      type: "Descriptive ",
      isLaTeXEnabled: false,
      section: "Table",
      owner: "Admin",
      hasTables: true,
      created: "16/03/2025",
      modified: "3 days ago",
      options: [
        "First order, k = 0.022 s⁻¹",
        "Zero order, k = 0.18 M/s",
        "Second order, k = 0.12 M⁻¹s⁻¹",
        "Cannot be determined",
      ],
      correctAnswer: 0,
    },
    {
      id: 4,
      question: `Calculate the root mean square speed of oxygen molecules (O₂) at 300 K.
            Molar mass = 32 g/mol, R = 8.314 J/(mol·K).`,
      solution: `The root mean square speed is calculated using:
            $$v_{rms} = \\sqrt{\\frac{3RT}{M}}$$
            Result: 483.56 m/s`,
      type: "Numerical Answer ",
      marks: 5,
      owner: "Admin",
      section: "Thermodynamics",
      created: "16/03/2025",
      modified: "3 days ago",
      correctAnswer: "483.56 m/s",
      tolerance: "±5%",
      isLaTeXEnabled: true,
      units: "m/s",
    },
    {
      id: 5,
      question: `The Pythagorean theorem states $$c^2 = a^2 + b^2$$ for right triangles. true false`,
      solution: `True. The Pythagorean theorem correctly relates the sides of a right-angled triangle.`,
      type: "True or False",
      marks: 2,
      owner: "Admin",
      section: "Geometry",
      created: "16/03/2025",
      modified: "1 week ago",
      correctAnswer: true,
    },
    {
      id: 6,
      question: `एक आयाम में ऊष्मा समीकरण पर विचार करें:
            $$\\frac{\\partial u(x,t)}{\\partial t} = \\alpha \\frac{\\partial^2 u(x,t)}{\\partial x^2}$$
            सामान्य समाधान है:`,
      solution: `विकल्प a और b दोनों सही हैं। समाधान $$u(x,t) = \\sum_{n = 1}^{\\infty} A_n \\sin\\left(\\frac{n \\pi x}{L}\\right) e^{-\\alpha \\left(\\frac{n \\pi}{L}\\right)^2 t}$$ है`,
      type: "Single Answer ",
      marks: 7,
      owner: "Admin",
      section: "गणित (हिंदी)",
      created: "15/03/2025",
      modified: "1 week ago",
      options: [
        "$$u(x,t) = \\sum_{n = 1}^{\\infty} A_n \\sin\\left(\\frac{n \\pi x}{L}\\right) e^{-\\alpha \\left(\\frac{n \\pi}{L}\\right)^2 t}$$",
        "स्वदेशी मान $$\\lambda_n = \\left(\\frac{n \\pi}{L}\\right)^2$$",
        "विकल्प a और b दोनों सही हैं",
        "समाधान को स्वदेशी मानों के रूप में व्यक्त नहीं किया जा सकता",
      ],
      correctAnswer: 2,
    },
    {
      id: 7,
      question: `సత్యనారాయణ వ్యవసాయం లో ఏ మూడు భాగాలు ఉంటాయి?`,
      solution: `రబి, ఖరీఫ్, బోనాల`,
      type: "Single Answer ",
      marks: 2,
      owner: "Admin",
      section: "వ్యవసాయం (తెలుగు)",
      created: "15/03/2025",
      modified: "2 weeks ago",
      options: ["రబి, ఖరీఫ్, బోనాల", "శీతకాల, వేసవికాల, ఆదివార", "పంటల్ని వేరే విభజించలేదు", "ఉష్ణకటిన, ట్రోపికల్, మాన్సూన్"],
      correctAnswer: 0,
      isLaTeXEnabled: false,
    },
    {
      id: 9,
      question: `In Python, what will be the output of the following code? 
      
      ~~~python
        fruits = ["apple", "banana", "cherry"]
        for x in fruits:
            print(x)
            if x == "banana":
                break
        ~~~ `,
      solution: `The correct solution is option A:`,
      type: "Descriptive ",
      options: ["120", "24", "60", "Runtime Error"],
      correctAnswer: 0,
      hasCode: true,
      code: `~~~python
fruits = ["apple", "banana", "cherry"]
for x in fruits:
    print(x)
    if x == "banana":
        break
~~~`,
      
    },
    // {
    //   id: 9,
    //   question: `Calculate the root mean square speed of oxygen molecules (O₂) at 300 K.
    //         Molar mass = 32 g/mol, R = 8.314 J/(mol·K).`,
    //   solution: `The prime numbers in the list are 2, 7, and 13.`,
    //   type: "Multiple Answer ",
    //   marks: 3,
    //   owner: "Admin",
    //   section: "Mathematics",
    //   created: "18/03/2025",
    //   modified: "1 day ago",
    //   correctAnswers: [0, 2, 4], // Indices of correct options
    // }
  ];


  // State management
  const INITIAL_ROWS_PER_PAGE = 5
  const [rowsPerPage, setRowsPerPage] = useState(INITIAL_ROWS_PER_PAGE)
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedRows, setExpandedRows] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("")
  const [filterSection, setFilterSection] = useState("")
  const [filteredCount, setFilteredCount] = useState(data.length)
  const [fullViewMode, setFullViewMode] = useState(false)
  const [allRowsExpanded, setAllRowsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [questionType, setQuestionType] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState("");
  const [modalHeading, setModalHeading] = useState("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);


  // Get the value for Redux
  const dispatch = useDispatch();
  const isSQAModalOpen = useSelector((state) => state.AddQuestionQB.isSQAModalOpen);
  const isModalOpen = useSelector((state) => state.AddQuestionQB.isModalOpen);
  const isNumericalModalOpen = useSelector((state) => state.AddQuestionQB.isNumericalModalOpen);
  const isTrueFalseModalOpen = useSelector((state) => state.AddQuestionQB.isTrueFalseModalOpen);
  const isDescriptiveModalOpen = useSelector((state) => state.AddQuestionQB.isDescriptiveModalOpen);


  const openEditModal = () => {
    setSelectedTest({
      id: 1,
      name: "Question Bank 1",
    });

    setModalHeading("Edit QB");
    setShowEditModal(true);
  };


  const closeAllModals = () => {
    setShowEditModal(false);
  };

  const [tags, setTags] = useState([
    // Example initial state (can come from API)
    { id: 1, name: "Folder 1", color: "#f00", questions: [1, 2,4,7,9] },
    { id: 2, name: "Folder 2", color: "#0f0", questions: [3,5,6,8] },
  ]);

  // Check if screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const getFilteredData = () => {
    const safeSearchQuery = (searchQuery || "").toLowerCase();

    return data.filter((question) => {
      const matchesSearch =
        safeSearchQuery === "" ||
        (question.question || "").toLowerCase().includes(safeSearchQuery) ||
        (question.answer || "").toLowerCase().includes(safeSearchQuery) ||
        (question.type || "").toLowerCase().includes(safeSearchQuery) ||
        (question.section || "").toLowerCase().includes(safeSearchQuery);

      const matchesType = filterType === "" || question.type === filterType;
      const matchesSection = filterSection === "" || question.section === filterSection;

      return matchesSearch && matchesType && matchesSection;
    });
  };

  const filteredData = getFilteredData()

  // Update filtered count when data changes
  useEffect(() => {
    setFilteredCount(filteredData.length)
  }, [filteredData.length])

  // Get current page data
  const getCurrentPageData = () => {
    // if (fullViewMode) {
    //   return filteredData
    // }
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

  // Handle filter type change
  const handleFilterTypeChange = (value) => {
    setFilterType(value)
    setCurrentPage(1) // Reset to first page when filtering
  }

  // Handle filter section change
  const handleFilterSectionChange = (value) => {
    setFilterSection(value)
    setCurrentPage(1) // Reset to first page when filtering
  }

  // Handle individual row expansion toggle
  const toggleRowExpansion = (rowId) => {
    setExpandedRows((prev) => {
      if (prev.includes(rowId)) {
        return prev.filter((id) => id !== rowId)
      } else {
        return [...prev, rowId]
      }
    })
  }

  // Toggle full view mode
  const toggleFullView = () => {
    // if (!fullViewMode) {
    //   // Enter Full View mode
    //   setRowsPerPage(filteredData.length)
    //   setAllRowsExpanded(true)
    //   setExpandedRows(filteredData.map((q) => q.id))
    // } else {
    //   // Exit Full View mode
    //   setRowsPerPage(INITIAL_ROWS_PER_PAGE)
    //   setAllRowsExpanded(false)
    //   setExpandedRows([])
    // }
    setFullViewMode(!fullViewMode)
  }
 

  // const handleAddQuestionAction = (actionType, questionId) => {
  //   console.log(`Add action: ${actionType} for question ID: ${questionId}`);
  //   // Implement your add question logic here
  // };

  // Handle action from dropdown
  const handleAction = (actionType, questionId) => {
    const row = data.find((q) => q.id === questionId)
    switch (actionType) {
      case "copy":
        console.log("Copy action for", questionId)
        break
      case "edit":
        console.log(row);
        setSelectedQuestion(row);
        setQuestionType(row.type);
        setModalIsOpen(true);
        break
      case "move":
        console.log("Move to test action for", questionId)
        break
      case "folder":
        console.log("Add to section action for", questionId)
        break
      case "delete":
        console.log("Delete action for", questionId)
        break
      default:
        console.log("Unknown action:", actionType)
    }
  }

  // Define columns with visibility state

  const handleAddQuestionToTag = (tagId, questionId) => {
  setTags(prevTags =>
    prevTags.map(tag =>
      tag.id === tagId
        ? { ...tag, questions: [...tag.questions, questionId] }
        : tag
    )
  );
};

const handleRemoveQuestionFromTag = (tagName, questionId) => {
  setTags(prevTags =>
    prevTags.map(tag =>
      tag.name === tagName
        ? { ...tag, questions: tag.questions.filter(id => id !== questionId) }
        : tag
    )
  );
};

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen)
  }


  // Column visibility state - only Questions visible by default
  const [columnVisibility, setColumnVisibility] = useState({
    id: true,
    questions: true,
    type: true,
    section: true,
    marks: true,
    modified: true,
    created: true,
    actions: true,
    category:true,
  })

  const columns = useMemo(() => [
    {
      name: "QId",
      selector: "id",
      sortable: true,
      isVisible: columnVisibility.id,
    },
    // {
    //   name: "Questions",
    //   selector: (row) => row?.id || "N/A", // Always use ID as selector
    //   sortable: true,
    //   cell: (row) => {
    //     const visibleColumnCount = columns.filter(col => col.isVisible).length;
    //     const isExpanded = expandedRows.includes(row.id);

    //     // Show only ID if more than 3 columns are visible
    //     if (visibleColumnCount > 3) {
    //       return <span>{row.id}</span>;
    //     }

    //     // Otherwise show question (truncated if not expanded)
    //     const shouldTruncate = !isExpanded && row.question?.length > 50;
    //     const displayedContent = shouldTruncate
    //       ? row.question.slice(0, 50) + "..."
    //       : row.question;

    //     return (
    //       <div
    //         className="flex items-center cursor-pointer"
    //         onClick={(e) => {
    //           e.stopPropagation();
    //           toggleRowExpansion(row.id);
    //         }}
    //       >
    //         <div className={`row-link ${shouldTruncate ? "truncate-inline" : "expanded-content"}`}>
    //           <LatexRenderer content={displayedContent} />
    //         </div>
    //       </div>
    //     );
    //   },
    //   isVisible: columnVisibility.questions,
    // },
    {
      name: "Type",
      selector: "type",
      sortable: true,
      cell: (row) => <span className={`type-badge ${row.type.toLowerCase().replace("/", "")}`}>{row.type}</span>,
      isVisible: columnVisibility.type,
    },
    {
      name: "Section",
      selector: "section",
      sortable: true,
      isVisible: columnVisibility.section,
    },
    {
      name: "Marks",
      selector: "marks",
      sortable: true,
      cell: (row) => row.marks ? <span className="marks-display">{row.marks}</span> : "N/A",
      isVisible: columnVisibility.marks,
    },
    // {
    //   name: "Modified",
    //   selector: "modified",
    //   sortable: true,
    //   isVisible: columnVisibility.modified,
    // },
    // {
    //   name: "Created",
    //   selector: "created",
    //   sortable: true,
    //   isVisible: columnVisibility.created,
    // },

    {
      name: "",
      selector: "category",
      sortable: true,
      cell: (row) => (
        <div className="question-tags">
          {tags
            .filter(tag => tag.questions?.includes(row.id)) // only tags for this question
            .map(tag => (
              <div key={tag.id} className="question-tag-container">
                <div className="question-tag questions-page-question-tag">
                  <span
                    className="tag-color-dot questions-page-color-dot"
                    style={{ backgroundColor: tag.color }}
                  ></span>
                  <span className="index-tag-name questions-page-tag-name">{tag.name}</span>
                </div>
                <span
                  className="tag-remove questionpage-tag-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveQuestionFromTag(tag.name, row.id); // dynamically remove tag
                  }}
                >
                  &times;
                </span>
              </div>
            ))}
        </div>
      ),
      isVisible: columnVisibility.category,
    },

    {
      name: "Actions",
      selector: "actions",
      cell: (row) => (
        <div className="test-action-buttons flex">
          <div className="desktop-actions">
            <button
              className="test-action-button copy"
              aria-label="Copy"
              onClick={(e) => {
                e.stopPropagation()
                handleAction("copy", row.id)
              }}
            >
              <FaCopy />
              <span className="tooltip-text">Copy</span>
            </button>
            <button
              className="test-action-button edit"
              aria-label="Edit"
              onClick={(e) => {
                e.stopPropagation()
                handleAction("edit", row.id)
              }}
            >
              <FaEdit />
              <span className="tooltip-text">Edit</span>
            </button>
            <button
              className="test-action-button move"
              aria-label="Move to Test"
              onClick={(e) => {
                e.stopPropagation()
                handleAction("move", row.id)
              }}
            >
              <FaArrowRight />
              <span className="tooltip-text">Move to Test</span>
            </button>
            <button
              className="test-action-button folder"
              aria-label="Add to Section"
              onClick={(e) => {
                e.stopPropagation()
                handleAction("folder", row.id)
              }}
            >
              <FaFolderPlus />
              <span className="tooltip-text">Add to Section</span>
            </button>
            <button
              className="test-action-button delete"
              aria-label="Delete"
              onClick={(e) => {
                e.stopPropagation()
                handleAction("delete", row.id)
              }}
            >
              <FaTrashAlt />
              <span className="tooltip-text">Delete</span>
            </button>
          </div>
          <div className="mobile-actions">
            <QuestionAddDropdown onAddAction={(actionType) => handleAction(actionType, row.id)} />
          </div>
        </div>
      ),
      isVisible: columnVisibility.actions,
    },
  ])

  const CustomRow = ({ data, isExpanded }) => {
    const maxLength = 200; // Maximum characters before truncating
    const question = data.question || "No Question";

    // Show full question if row is expanded, otherwise truncate
    const displayedQuestion =
      isExpanded || question.length <= maxLength
        ? question
        : question.slice(0, maxLength) + "...";

    return (
      <div className="p-2 border-b">
        <div className="mt-1 text-gray-700">
          <LatexRenderer content={displayedQuestion} />
        </div>
      </div>
    );
  };


  // Toggle column visibility function
  // const toggleColumnVisibility = (columnSelector) => {
  //   setColumnVisibility((prev) => ({
  //     ...prev,
  //     [columnSelector]: !prev[columnSelector],
  //   }))
  // }

  const visibleColumns = columns.filter((column) => column.isVisible)

  // Reset expanded rows when search changes
  useEffect(() => {
    if (!fullViewMode) {
      setExpandedRows([])
    }
  }, [searchQuery, filterType, filterSection]);

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
          setIsMobileOpen(false);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMobileOpen])

  return (
    <>
      <Helmet>
        <title>Questions</title>
        <meta name="description" content="Questions in QuestionBanks" />
      </Helmet>
      <div className="questionsadd-index-wrapper">

        <div className="test-index-header-moblie">
          <h1 className="breadcrumb">QB 1 Questions</h1>
          <VscTriangleDown onClick={toggleMobileSidebar} ref={toggleRef} className="TriagbleDown" />

          <div className="test-header-icons">
            <button className="test-action-button header-icon-hover edit" onClick={() => openEditModal(selectedTest)}>
              <FaEdit />
              <span className="tooltip-text">Edit</span>
            </button>

            <button className="test-action-button header-icon-hover pdf" onClick={() => openDownloadModal(selectedTest)}>
              <FaFilePdf />
              <span className="tooltip-text">Download PDF</span>
            </button>
          </div>
        </div>

        <div ref={sidebarRef}>
          <AddQuestionSidebar
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
            hideQuestionType={true}
          />
        </div>

        <div className="questionsadd-index-container">
       
          <div className="test-index-header">
            <h1 className="breadcrumb">QB 1 Questions</h1>

            <div className="test-header-icons">

              <button className="test-action-button header-icon-hover  edit" onClick={() => openEditModal(selectedTest)}>
                <FaEdit />
                <span className="tooltip-text">Edit</span>
              </button>

              <button className="test-action-button header-icon-hover pdf" onClick={() => openDownloadModal(selectedTest)}>
                <FaFilePdf />
                <span className="tooltip-text">Download PDF</span>
              </button>
      
            </div>
          </div>
         

          <div className="my-data-table">
            <DataTable
              columns={visibleColumns}
              data={getCurrentPageData()}
              enableToggle={true}
              availableActions={["delete", "archive", "download", "tag", "more"]}
              fullViewMode={fullViewMode}
              allRowsExpanded={allRowsExpanded}
              expandedRows={expandedRows}
              setExpandedRows={setExpandedRows}
              searchoption={true}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              filterType={filterType}
              onFilterTypeChange={handleFilterTypeChange}
              filterSection={filterSection}
              onFilterSectionChange={handleFilterSectionChange}
              showQuestionRow={true}
            />
          </div>

          {/* <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            className="modal-content"
            overlayClassName="modal-overlay"
          >
            {selectedQuestion && (
              <div className="question-detail-modal">
                <h3>Question Details</h3>
                <div className="question-content">
                  <LatexRenderer content={selectedQuestion.question} />
                </div>
                {selectedQuestion.type === "MCQ" && selectedQuestion.options && (
                  <div className="mcq-options-modal">
                    <h4>Options:</h4>
                    {selectedQuestion.options.map((option, idx) => (
                      <div
                        key={idx}
                        className={`mcq-option ${selectedQuestion.correctAnswer === idx ? "correct-answer" : ""}`}
                      >
                        <LatexRenderer content={option} />
                      </div>
                    ))}
                  </div>
                )}
                <div className="answer-content">
                  <h4>Answer:</h4>
                  <LatexRenderer content={selectedQuestion.answer} />
                </div>
                <div className="modal-footer">
                  <button onClick={() => setModalIsOpen(false)}>Close</button>
                </div>
              </div>
            )}
          </Modal> */}

        </div>
      </div>

      <NewQBModal
        isOpen={showEditModal}
        onClose={closeAllModals}
        testData={selectedTest}
        setTestData={setSelectedTest}
        mode="edit"
        heading={modalHeading}
      />

      {/* {showPaginationButtons && (
        <PaginationButtons
          filteredQuestions={filteredData}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          loadMore={() => setRowsPerPage((prev) => Math.min(prev + 10, filteredData.length))}
          fullView={toggleFullView}
          fullViewMode={fullViewMode}
        />
      )} */}

      <PaginationButtons
        filteredQuestions={filteredData}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        loadMore={() => setRowsPerPage((prev) => Math.min(prev + 10, filteredData.length))}
        fullView={toggleFullView}
        fullViewMode={fullViewMode}
      />

      <PaginationInfo
        filteredQuestions={filteredData}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        label="Questions"
        totalItems={data.length}
        isSearching={searchQuery.length > 0 || filterType.length > 0 || filterSection.length > 0}
      />

      {questionType === "Single Answer" && (
        <SAQModal open={modalIsOpen} onClose={() => { setModalIsOpen(false) }} initialData = {selectedQuestion} />
      )}

      {
        (() => {
          switch (questionType) {
            case "SAQ":
              return (
                <SAQModal
                  open={modalIsOpen}
                  onClose={() => setModalIsOpen(false)}
                  initialData={selectedQuestion}
                />
              );

            case "MCQ":
              return (
                <MCQModal
                  open={modalIsOpen}
                  onClose={() => setModalIsOpen(false)}
                  initialData={selectedQuestion}
                />
              );

            case "Numerical":
              return (
                <NumericalModal
                  open={modalIsOpen}
                  onClose={() => setModalIsOpen(false)}
                  initialData={selectedQuestion}
                />
              );

            case "True/False":
              return (
                <TrueORFalseModal
                  open={modalIsOpen}
                  onClose={() => setModalIsOpen(false)}
                  initialData={selectedQuestion}
                />
              );

            case "Descriptive":
              return (
                <DescriptiveModal
                  open={modalIsOpen}
                  onClose={() => setModalIsOpen(false)}
                  initialData={selectedQuestion}
                />
              );

            default:
              return null;
          }
        })()
      }

      {/* New Question */}
      <SAQModal open={isSQAModalOpen} onClose={() => { dispatch(setIsSQAModalOpen(false));}} />
      <MCQModal open={isModalOpen} onClose={() => { dispatch(setIsModalOpen(false));}} />
      <NumericalModal open={isNumericalModalOpen} onClose={() => { dispatch(setIsNumericalModalOpen(false));}} />
      <TrueFalseModal open={isTrueFalseModalOpen} onClose={() => { dispatch(setIsTrueFalseModalOpen(false));}} />
      <DescriptiveModal open={isDescriptiveModalOpen} onClose={() => { dispatch(setIsDescriptiveModalOpen(false));}} />

    </>
  )
}

export default QuestionsAdd
