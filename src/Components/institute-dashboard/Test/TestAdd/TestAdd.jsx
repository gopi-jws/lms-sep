import { useState, useEffect, useMemo } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { FaEdit, FaCopy, FaTrashAlt, FaArrowRight } from "react-icons/fa"
import Modal from "react-modal"
import "./TestAdd.css"
import DataTable from "../../../ReusableComponents/TableComponent/TableComponent"
import PaginationButtons from "../../../ReusableComponents/Pagination/PaginationButton"
import PaginationInfo from "../../../ReusableComponents/Pagination/PaginationInfo"
import ColumnVisibilityDropdown from "../../../ReusableComponents/ColumnVisibilityDropdown/ColumnVisibilityDropdown"
import ActionDropdown from "../../../ReusableComponents/ActionDropdown/ActionDropdown"
import LatexRenderer from "../../../ReusableComponents/LatexRenderer/LatexRenderer"
import { Helmet } from "react-helmet"
import { Truck } from "lucide-react"

const TestAdd = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const testName = location.state?.testName || "Unknown Test"
  const INITIAL_ROWS_PER_PAGE = 10
  const data = [
    {
      id: 1,
      question: `Identify the graph of the function $$y = \\sin(x)$$ from the options below:
    <img src="https://insightsedu.in/new/3.png" alt="Sine function graph">`,
      answer: `The correct answer is option a) Sine Wave. The sine function produces a wave that oscillates between -1 and 1.`,
      type: "Single Answer ",
      marks: 3,
      owner: "Admin",
      section: "Trigonometry",
      created: "15/03/2025",
      modified: "3 weeks ago",
      options: [
        `<img src="https://insightsedu.in/new/4.png" alt="Option A"> Sine Wave`,
        `<img src="https://insightsedu.in/new/4.png" alt="Option B"> Straight Line`,
        `<img src="https://insightsedu.in/new/4.png" alt="Option C"> Parabola`,
        `<img src="https://insightsedu.in/new/4.png" alt="Option D"> Exponential Curve`
      ],
      correctAnswer: 0,
      isLaTeXEnabled: true,
      hasImages: true
    },
    {
      id: 2,
      question: `A particle moves along a path defined by:
            $$x(t) = R \\cos(\\omega t), \\quad y(t) = R \\sin(\\omega t), \\quad z(t) = kt^2$$
            Which of the following represents the arc length $$S$$?`,
      answer: `The correct solution is option D:
            $$S = \\frac{1}{4k} \\left[ 2kT \\sqrt{R ^ 2 \\omega^2 + 4k^2 T^2} + R^2 \\omega^2 \\ln\\left(\\frac{2kT + \\sqrt{R ^ 2 \\omega^2 + 4k^2 T^2}}{R\\omega}\\right) \\right]$$`,
      type: "Single Answer ",
      marks: 10,
      owner: "Admin",
      section: "Advanced Mathematics",
      created: "15/03/2025",
      modified: "1 day ago",
      options: [
        `$$S = \\frac{T}{2} \\sqrt{R ^ 2 \\omega^2 + 4k^2 T^2} + \\frac{R ^ 2 \\omega^2}{4k} \\sinh^{-1}\\left(\\frac{2kT}{R\\omega}\\right)$$`,
        `$$S = \\frac{T}{2} \\sqrt{R ^ 2 \\omega^2 + 4k^2 T^2} + \\frac{R ^ 2 \\omega^2}{4k} \\ln\\left|2kT + \\sqrt{R ^ 2\\omega^2 + 4k^2 T^2}\\right|$$`,
        `$$S = \\frac{T}{2} \\sqrt{R ^ 2 \\omega^2 + 4k^2 T^2} + \\frac{R ^ 2 \\omega^2}{4k} \\tan^{-1}\\left(\\frac{2kT}{R\\omega}\\right)$$`,
        `$$S = \\frac{1}{4k} \\left[ 2kT \\sqrt{R ^ 2 \\omega^2 + 4k^2 T^2} + R^2 \\omega^2 \\ln\\left(\\frac{2kT + \\sqrt{R ^ 2 \\omega^2 + 4k^2 T^2}}{R\\omega}\\right) \\right]$$`,
      ],
      correctAnswer: 3,
      isLaTeXEnabled: true,
    },
    {
      id: 4,
      question: `The following table shows experimental data for a reaction:
            Time (s)  Concentration (M)
            0         1.00
            10        0.82
            Determine the reaction order and rate constant.`,
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
      id: 5,
      question: `Calculate the root mean square speed of oxygen molecules (O₂) at 300 K.
            Molar mass = 32 g/mol, R = 8.314 J/(mol·K).`,
      answer: `The root mean square speed is calculated using:
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
      id: 6,
      question: `The Pythagorean theorem states $$c^2 = a^2 + b^2$$ for right triangles. true false`,
      answer: `True. The Pythagorean theorem correctly relates the sides of a right-angled triangle.`,
      type: "True or False",
      marks: 2,
      owner: "Admin",
      section: "Geometry",
      created: "16/03/2025",
      modified: "1 week ago",
      correctAnswer: true,
    },
    {
      id: 7,
      question: `एक आयाम में ऊष्मा समीकरण पर विचार करें:
            $$\\frac{\\partial u(x,t)}{\\partial t} = \\alpha \\frac{\\partial^2 u(x,t)}{\\partial x^2}$$
            सामान्य समाधान है:`,
      answer: `विकल्प a और b दोनों सही हैं। समाधान $$u(x,t) = \\sum_{n = 1}^{\\infty} A_n \\sin\\left(\\frac{n \\pi x}{L}\\right) e^{-\\alpha \\left(\\frac{n \\pi}{L}\\right)^2 t}$$ है`,
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
      isLaTeXEnabled: true,
    },
    {
      id: 8,
      question: `సత్యనారాయణ వ్యవసాయం లో ఏ మూడు భాగాలు ఉంటాయి?`,
      answer: `రబి, ఖరీఫ్, బోనాల`,
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
      question: `In Python, what will be the output of the following code?`,
      answer: `The correct solution is option A:`,
      type: "Descriptive ",
      options: ["120", "24", "60", "Runtime Error"],
      correctAnswer: 0,
       owner: "Admin",
      isLaTeXEnabled: false,
      hasCode: true,
      code: `def factorial(n):
            if n == 0:
            return 1
            else:
            return n * factorial(n-1)
  
            result = factorial(5)
            print(result)`,
    },
    {
      id: 10,
      question: `Which of the following are prime numbers? (Select all that apply)`,
      answer: `The prime numbers in the list are 2, 7, and 13.`,
      type: "Multiple Answer ",
      marks: 3,
      owner: "Admin",
      section: "Mathematics",
      created: "18/03/2025",
      modified: "1 day ago",
      options: [
        "2",
        "4",
        "7",
        "9",
        "13",
        "15"
      ],
      correctAnswers: [0, 2, 4], // Indices of correct options
      isLaTeXEnabled: false
    }
  ];


  // State declarations
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("")
  const [rowsPerPage, setRowsPerPage] = useState(INITIAL_ROWS_PER_PAGE)
  const [fullViewMode, setFullViewMode] = useState(false)
  const [expandedRows, setExpandedRows] = useState([])
  const [showSolutions, setShowSolutions] = useState({});
  const [filteredCount, setFilteredCount] = useState(data.length)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([])
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [isDropdownOpen, setDropdownOpen] = useState(false)


  const getFilteredData = () => {
    return data.filter((question) => {
      const matchesSearch =
        searchQuery === "" ||
        (question.question || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (question.answer || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (question.type || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (question.owner || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = filterType === "" || question.type === filterType;

      return matchesSearch && matchesType;
    });
  };

  const toggleSolution = (id) => {
    setShowSolutions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredData = getFilteredData()

  useEffect(() => {
    setFilteredCount(filteredData.length)
  }, [filteredData.length])

  const getCurrentPageData = () => {
    if (fullViewMode) {
      return filteredData
    }
    const startIndex = (currentPage - 1) * rowsPerPage
    return filteredData.slice(startIndex, startIndex + rowsPerPage)
  }

  const showPaginationButtons = !fullViewMode && rowsPerPage < filteredData.length

  const handleSearchChange = (value) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleFilterTypeChange = (value) => {
    setFilterType(value)
    setCurrentPage(1)
  }

  const toggleRowExpansion = (rowId) => {
    setExpandedRows((prev) => {
      if (prev.includes(rowId)) {
        return prev.filter((id) => id !== rowId)
      } else {
        return [...prev, rowId]
      }
    })
  }

  const loadMore = () => {
    const newRows = rowsPerPage + 10
    setRowsPerPage(Math.min(newRows, filteredData.length))
  }

  const toggleFullView = () => {
    if (!fullViewMode) {
      // Entering full view mode
      setRowsPerPage(filteredData.length);
      // Auto-expand all rows
      setExpandedRows(filteredData.map(row => row.id));
    } else {
      // Exiting full view mode
      setRowsPerPage(INITIAL_ROWS_PER_PAGE);
      setExpandedRows([]); // Collapse all rows
    }
    setFullViewMode(!fullViewMode);
  };
  
  // Question CRUD operations
  const handleAddQuestion = () => {
    console.log("Add question")
  }

  const handleEditQuestion = (questionId) => {
    const question = data.find((q) => q.id === questionId)
    setSelectedQuestion(question)
    setModalIsOpen(true)
  }

  const handleUpdateQuestion = (questionId) => {
    console.log("Update question", questionId)
  }

  const handlemoveQuestion = (questionId) => {
    console.log("Move question", questionId)
  }

  const handleDeleteQuestion = (questionId) => {
    console.log("Delete question", questionId)
  }

  const handleCopyQuestion = (questionId) => {
    console.log("Copy question", questionId)
  }

  const handleSetMarks = (questionId) => {
    console.log("Set marks for question", questionId)
  }

  const handleViewDetails = (questionId) => {
    const question = data.find((q) => q.id === questionId)
    setSelectedQuestion(question)
    setModalIsOpen(true)
  }

  // Handle action from dropdown
  const handleActionFromDropdown = (actionType, questionId) => {
    switch (actionType) {
      case "update":
        handleUpdateQuestion(questionId)
        break
      case "copy":
        handleCopyQuestion(questionId)
        break
      case "move":
        handlemoveQuestion(questionId)
        break
      case "setmarks":
        handleSetMarks(questionId)
        break
      case "view":
        handleViewDetails(questionId)
        break
      case "delete":
        handleDeleteQuestion(questionId)
        break
      default:
        console.log("Unknown action:", actionType)
    }
  }


  // Column visibility state - only Questions visible by default
  const [columnVisibility, setColumnVisibility] = useState({
    id: true,
    questions: true,
    owner: true,
    type: true,
    marks: true,
    actions: true,
  })


const columns = useMemo(() => [
  {
    name: "QId",
    selector: "id",
    sortable: true,
    isVisible: columnVisibility.id,
  },
  {
    name: "Owner",
    selector: "owner",
    sortable: true,
    isVisible: columnVisibility.owner,
  },
  {
    name: "Type",
    selector: "type",
    sortable: true,
    cell: (row) => (
      <span className={`type-badge ${row.type.toLowerCase().replace("/", "")}`}>
        {row.type}
      </span>
    ),
    isVisible: columnVisibility.type,
  },
  {
    name: "Marks",
    selector: "marks",
    sortable: true,
    cell: (row) =>
      row.marks ? <span className="marks-display">{row.marks}</span> : "N/A",
    isVisible: columnVisibility.marks,
  },
  {
    name: "Actions",
    selector: "actions",
    sortable: false,
    cell: (row) => (
      <div className="test-action-buttons flex">
        <div className="desktop-actions">
          <button
            className="test-action-button copy"
            aria-label="Copy"
            onClick={(e) => {
              e.stopPropagation();
              handleCopyQuestion(row.id);
            }}
          >
            <FaCopy />
            <span className="tooltip-text">Copy</span>
          </button>
          <button
            className="test-action-button edit"
            aria-label="Edit"
            onClick={(e) => {
              e.stopPropagation();
              handleEditQuestion(row.id);
            }}
          >
            <FaEdit />
            <span className="tooltip-text">Edit</span>
          </button>
          <button
            className="test-action-button delete"
            aria-label="Delete"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteQuestion(row.id);
            }}
          >
            <FaTrashAlt />
            <span className="tooltip-text">Delete</span>
          </button>
          <button
            className="test-action-button add-to-test"
            aria-label="Move to Test"
            onClick={(e) => {
              e.stopPropagation();
              handlemoveQuestion(row.id);
            }}
          >
            <FaArrowRight />
            <span className="tooltip-text">Move to Section</span>
          </button>
          <button
            className="test-action-button set-mark"
            aria-label="Set Mark"
            onClick={(e) => {
              e.stopPropagation();
              handleSetMarks(row.id);
            }}
          >
            <span className="mark-symbol">M</span>
            <span className="tooltip-text">Set Mark</span>
          </button>
        </div>
        <div className="mobile-actions">
          <ActionDropdown questionId={row.id} onAction={handleActionFromDropdown} />
        </div>
      </div>
    ),
    isVisible: columnVisibility.actions,
  },

  // // 🔹 NEW Questions column (second line always visible)
  // {
  //   name: "Questions",
  //   selector: (row) => row?.id || "N/A",
  //   sortable: false,
  //   cell: (row) => (
  //     <div className="w-full text-left mt-2">
  //       <LatexRenderer content={row.question || "No Question"} />
  //     </div>
  //   ),
  //   isVisible: columnVisibility.questions,
  // },
], [columnVisibility]);


  // Toggle column visibility function
  // const toggleColumnVisibility = (columnSelector) => {
  //   setColumnVisibility((prev) => ({
  //     ...prev,
  //     [columnSelector]: !prev[columnSelector],
  //   }))
  // }

  const visibleColumns = columns.filter((column) => column.isVisible)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".testadd-column-dropdown")) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (!fullViewMode) {
      setExpandedRows([])
    }
  }, [searchQuery, filterType])

  return (
    <>
      <Helmet>
        <title>Questions</title>
        <meta name="description" content="Questions" />
      </Helmet>
   
      <div className="testadd-index-wrapper">
        <div className="testadd-index-container">
          <div className="test-index-header">
            <h3 className="breadcrumb">Test {id} Questions</h3>
            {/* <div className="columnvisibility-wrapper">
              <ColumnVisibilityDropdown columns={columns} onToggleColumn={toggleColumnVisibility} />
            </div> */}
          </div>

          <div className="my-data-table">
            <DataTable
              columns={visibleColumns}
              data={getCurrentPageData()}
              questionActions={["delete", "changeSection", "setMarks"]}
              enableToggle={true}
              fullViewMode={fullViewMode}
              expandedRows={expandedRows}
              setExpandedRows={setExpandedRows}
              searchoption={true}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              filterType={filterType}
              onFilterTypeChange={handleFilterTypeChange}
              showQuestionRow={true}
              customStyles={{
                rows: {
                  style: { minHeight: "60px" },
                },
              }}
              onRowClicked={(row, e) => {
                // Allow toggling even in full view mode
                if (fullViewMode) {
                  e.stopPropagation();
                  setExpandedRows(prev =>
                    prev.includes(row.id)
                      ? prev.filter(id => id !== row.id)
                      : [...prev, row.id]
                  );
                }
              }}
            />
          </div>

          <Modal
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
          </Modal>
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
        label="Questions"
        totalItems={data.length}
        isSearching={searchQuery.length > 0 || filterType.length > 0}
      />
    </>
  )
}

export default TestAdd