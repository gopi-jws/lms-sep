import React, { useState, useEffect, useRef, useMemo } from "react";

import useBounceModal from "../useBounceModal/useBounceModal";
import "./AddQuestionModal.css";
import DataTable from "../TableComponent/TableComponent";
import { IoIosArrowDown } from "react-icons/io";
import { useSelector } from "react-redux";

const AddQuestionModal = ({ open, close, tags }) => {
    if (!open) return null;

    console.log(tags);
    

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
                { text: "Option A", image: `https://insightsedu.in/new/4.png` },
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
        ~~~`,
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
        {
            id: 9,
            question: `Calculate the root mean square speed of oxygen molecules (O₂) at 300 K.
            Molar mass = 32 g/mol, R = 8.314 J/(mol·K).`,
            solution: `The prime numbers in the list are 2, 7, and 13.`,
            type: "Multiple Answer ",
            marks: 3,
            owner: "Admin",
            section: "Mathematics",
            created: "18/03/2025",
            modified: "1 day ago",
            correctAnswers: [0, 2, 4], // Indices of correct options
        }
    ];

    const QBdata = [
        { id: 1, name: "QBxdfsdfafaswsdfsdert efedrfefe 1", questions: 10, lastModified: "2 days ago by You" },
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

    const [columnVisibility, setColumnVisibility] = useState({
        id: true,
        questions: true,
        type: true,
        section: true,
        marks: true,
        modified: true,
        created: true,
        actions: true,
        category: true,
    })

    const columns = useMemo(() => [
        {
            name: "QId",
            selector: "id",
            sortable: true,
            isVisible: columnVisibility.id,
        },
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
       
    ])

    const { modalRef, isBouncing } = useBounceModal(open);

    const [isOpenQBList, setIsOpenQbList] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedQB, setSelectedQB] = useState([]);
    const [questionTypeOpen, setQuestionTypeOpen] = useState(false);
    const [isSectionOpen, setIsSectionOpen] = useState(false);
    const [marks, setMarks] = useState("");
    const [negMarks, setNegMarks] = useState("");

    const handleChange = (e) => {
        const value = e.target.value;
        if (e.target.name === "mark") {
            // Allow only numbers with up to 2 decimals
            if (value === "" || (/^\d*\.?\d{0,2}$/.test(value) && parseFloat(value) > 0)) {
                setMarks(value);
            }

        }
        else {
            // Allow only numbers with up to 2 decimals
            if (/^\d*\.?\d{0,2}$/.test(value)) {
                setNegMarks(value);
            }
        }

    };

    const numSeletionQuestion = useSelector((state) => state.AddQuestionTestModal.numberOfSelectionQuestion)
    
    const qbListRef = useRef(null);
    const filterRef = useRef(null);
    const questionTypeRef = useRef(null);
    const sectionOptRef = useRef(null);
    const addTo = useRef(null)

    const questiontype = [
        { id: 1, name: "SAQ" },
        { id: 2, name: "MAQ" },
        { id: 3, name: "Numerical" },
        { id: 4, name: "True/False" },
        { id: 5, name: "Descriptive" },
    ];

    useEffect(() => {
        const handleClickOutside = (e) => {
            // --- SECTION DROPDOWN ---
            if (
                isSectionOpen &&
                sectionOptRef.current &&
                !sectionOptRef.current.contains(e.target) &&
                addTo.current &&
                !addTo.current.contains(e.target)
            ) {
                setIsSectionOpen(false);
            }

            // --- QB LIST DROPDOWN ---
            if (
                isOpenQBList &&
                qbListRef.current &&
                !qbListRef.current.contains(e.target) &&
                !e.target.closest(".filterQB-btn") // ensure not clicking the open button
            ) {
                setIsOpenQbList(false);
            }

            // --- FILTER DROPDOWN ---
            if (
                isFilterOpen &&
                filterRef.current &&
                !filterRef.current.contains(e.target) &&
                !e.target.closest(".filterQB-btn")
            ) {
                setIsFilterOpen(false);
                setQuestionTypeOpen(false);
            }

            // --- QUESTION TYPE DROPDOWN ---
            if (
                questionTypeOpen &&
                questionTypeRef.current &&
                !questionTypeRef.current.contains(e.target) &&
                filterRef.current &&
                !filterRef.current.contains(e.target)
            ) {
                setQuestionTypeOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isSectionOpen, isOpenQBList, isFilterOpen, questionTypeOpen]);




    const handleSelectedQB = (qtn) =>{
        setSelectedQB((prev) => [...prev, qtn]);
        setIsOpenQbList(false)
    }

    const handleRemoveSelectedQB = (qtn) =>{
        setSelectedQB((prev) => prev.filter((question) => question !== qtn));
    }


    const handleSubmit = () =>{
        if(tags.length > 0 ){
            setIsSectionOpen(!isSectionOpen)
        }
    }

    return (
        <div className="Addquestion-modal-overlay">
            <div ref={modalRef} className={`mcq-modal-content ${isBouncing ? "bounce" : ""}`}>

                {/* Main Header */}
                <div className="Addquestion-modal-header">
                    <div className="tital">
                        <h5>Add Question</h5>
                        <button className="close-btn" onClick={close}>&times;</button>
                    </div>

                    <div className="header-body">
                        <div
                            ref={qbListRef}
                            className="filterQB-btn"
                            onClick={() => {
                                setIsOpenQbList(!isOpenQBList);
                                setIsFilterOpen(false);
                                setQuestionTypeOpen(false);
                            }}
                        >
                            <span className="btn-header">Selected QB</span>
                            <span className="tag-dropdown-toggle addQb-dropdown"></span>
                        </div>

                        {/* Question Bank List */}
                        {isOpenQBList && (
                            <div className="dropdrow-option qb-list" ref={qbListRef}>
                                {QBdata.map((qb) => (
                                    <div key={qb.id} className="questions-item" onClick={() => handleSelectedQB(qb.name)}>
                                        <labeles htmlFor={`qb-${qb.id}`} className="questionBank-name">
                                            {qb.name}
                                        </labeles>
                                    </div>
                                ))}
                            </div>
                        )}


                        <div
                            ref={filterRef}
                            className="filterQB-btn"
                            onClick={() => {
                                setIsFilterOpen(!isFilterOpen);
                                setIsOpenQbList(false);
                                setQuestionTypeOpen(false);
                            }}
                        >
                            <span className="btn-header">Filter by</span>
                            <span className="tag-dropdown-toggle addQb-dropdown"></span>
                        </div>

                        {/* Filter Section */}
                        {isFilterOpen && (
                            <div className="dropdrow-option filter-op" ref={filterRef}>
                                <div
                                    className="questionsType-header"
                                    onClick={() => setQuestionTypeOpen(!questionTypeOpen)}
                                    ref={questionTypeRef}
                                >
                                    <labeles className="questionBank-name">Question Types</labeles>
                                </div>

                                <div className="question-type-item">
                                    {questiontype.map((q) => (
                                        <div key={q.id} className="questions-item">
                                            <input type="checkbox" id={`qb-${q.id}`} />
                                            <labeles htmlFor={`qb-${q.id}`} className="questionBank-name">
                                                {q.name}
                                            </labeles>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        )}
                    </div>

                    {selectedQB.length > 0 && (
                        <div className="selected-qtn">
                            <div className="questionQB-tags">
                                {selectedQB.map((qtn) => (
                                    <div key={qtn.id} className="question-tag-container">
                                        <div className="question-tag questions-page-question-tag">
                                            <span
                                                className="tag-color-dot questions-page-color-dot"
                                                style={{ backgroundColor: qtn.color || "#4caf50" }} // fallback color
                                            ></span>
                                            <span className="index-tag-name questions-page-tag-name">
                                                {qtn}
                                            </span>
                                        </div>
                                        <span
                                            className="tag-remove questionpage-tag-remove"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveSelectedQB(qtn);
                                            }}
                                        >
                                            &times;
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* Body */}
                <div className="Addquestion-modal-body">
                    <DataTable 
                    columns={columns}
                    data={data}
                    showQuestionRow={true}  
                    button={false}/>
                </div>

                {/* Footer */}
                <div className="Addquestion-modal-footer">
                    <div className="respons-footer">
                        <span>Sel.Qns. : {numSeletionQuestion}</span>
                        <div className="SetMark">
                            <span>Set Mark :</span>
                            <input
                                type="number"
                                className="input-mark"
                                placeholder="Positive Mark"

                                value={marks}
                                onChange={handleChange}
                                name="mark" />

                            <input
                                type="number"
                                className="input-mark"
                                placeholder="Negative Mark"
                                value={negMarks}
                                onChange={handleChange}
                                name="negmark" />
                        </div>
                    </div>


                    <div className="action">
                        {/* <button className="btn" onClick={close}>
                            Close
                        </button> */}

                        <button className="btn create-btn" ref={addTo} onClick={() => handleSubmit()}>
                            {tags.length > 0 ? "Add to Section" : "Add to Test"}

                            {tags.length > 0 && (
                                <IoIosArrowDown
                                    size={18}
                                    style={{
                                        transform: isSectionOpen ? "rotate(180deg)" : "rotate(0deg)",
                                        transition: "transform 0.3s ease"
                                        , marginLeft: ".5rem"
                                    }}
                                />
                            )}
                        </button>

                        {isSectionOpen && (
                            <div className="dropdrow-option section" ref={sectionOptRef}>
                                <ul onClick={close}>
                                    {tags.map((tag, index) => (
                                        <li className="questions-item" key={index}>{tag}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                </div>
            </div>
            
        </div>
    );
};

export default AddQuestionModal;
