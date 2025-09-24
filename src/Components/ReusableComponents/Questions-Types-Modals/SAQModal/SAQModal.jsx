"use client";
import React, { useState, useEffect} from "react";
import Select from 'react-select';
import "../MCQModal/MCQModal";
import { FaPlus } from "react-icons/fa";
import { FaCloudUploadAlt } from "react-icons/fa";
import 'katex/dist/katex.min.css';
import LatexRenderer, { cleanLatex } from "../../../ReusableComponents/LatexRenderer/LatexRenderer";
import useBounceModal from "../../../ReusableComponents/useBounceModal/useBounceModal";
import CKEditorRenderer from "../../CKEditorRenderer/CKEditorRenderer";

const SAQModal = ({ open, onClose, initialData, }) => {
    const { modalRef, isBouncing } = useBounceModal(open);
    const [questionTitle, setQuestionTitle] = useState(initialData?.questionTitle || "");
    const [codeAnswers, setCodeAnswers] = useState(initialData?.codeAnswers || [{ text: "", image: null }]);
    const [latexAnswers, setLatexAnswers] = useState(initialData?.latexAnswers || [{ text: "", image: null }]);
    const [bothAnswers, setBothAnswers] = useState(initialData?.bothAnswers || [{ text: "", image: null }]);
    const [correctAnswers, setCorrectAnswers] = useState(initialData?.correctAnswers || []);
    const [isCodeEnabled, setIsCodeEnabled] = useState(true);
    const [isLaTeXEnabled, setIsLaTeXEnabled] = useState(false);
    const [isCodeandLaTeXEnabled, setIsCodeandLaTexEnabled] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [questionImage, setQuestionImage] = useState(initialData?.questionImage || null);
    const [solutionText, setSolutionText] = useState(initialData?.solutionText || "");
    const [solutionImage, setSolutionImage] = useState(initialData?.solutionImage || null);

   // Get current answers based on mode
    let currentAnswers;
    let setCurrentAnswers;

    if (isCodeandLaTeXEnabled) {
        currentAnswers = bothAnswers;
        setCurrentAnswers = setBothAnswers;
    } else if (isLaTeXEnabled) {
        currentAnswers = latexAnswers;
        setCurrentAnswers = setLatexAnswers;
    } else {
        currentAnswers = codeAnswers;
        setCurrentAnswers = setCodeAnswers;
    }
    // const currentAnswers = isLaTeXEnabled ? latexAnswers : codeAnswers;
    // const setCurrentAnswers = isLaTeXEnabled ? setLatexAnswers : setCodeAnswers;

    // Prepare options for react-select
    const answerOptions = currentAnswers.map((answer, index) => ({
        value: `answer${index + 1}`,
        label: `Option ${index + 1}: ${answer.text.substring(0, 30)}${answer.text.length > 30 ? '...' : ''}`
    }));

    // Handle initial data when modal opens
    useEffect(() => {
        if (open && initialData) {
            setQuestionTitle(initialData.questionTitle || "");
            setQuestionImage(initialData.questionImage || null);
            setCodeAnswers(initialData.codeAnswers || [{ text: "", image: null }]);
            setLatexAnswers(initialData.latexAnswers || [{ text: "", image: null }]);
            setCorrectAnswers(initialData.correctAnswers || []);
            setIsCodeEnabled(initialData.isCodeEnabled ?? true);
            setIsLaTeXEnabled(initialData.isLaTeXEnabled ?? false);
            setSolutionText(initialData.solutionText || "");
            setSolutionImage(initialData.solutionImage || null);
        } else if (open) {
            // Reset for new question
            setQuestionTitle("");
            setQuestionImage(null);
            setCodeAnswers([{ text: "", image: null }]);
            setLatexAnswers([{ text: "", image: null }]);
            setCorrectAnswers([]);
            setIsCodeEnabled(true);
            setIsLaTeXEnabled(false);
            setSolutionText("");
            setSolutionImage(null);
        }
    }, [open, initialData]);

   

    const handleCorrectAnswersChange = (selectedOptions) => {
        setCorrectAnswers(selectedOptions ? selectedOptions.map(option => option.value) : []);
    };

    const selectedCorrectAnswers = answerOptions.filter(option =>
        correctAnswers.includes(option.value)
    );

    const handleQuestionImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("Image size should be less than 2MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setQuestionImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveQuestionImage = () => {
        setQuestionImage(null);
        const fileInput = document.querySelector(`input[type="file"]#question-image-upload`);
        if (fileInput) fileInput.value = '';
    };

    const [mode, setMode] = useState("code"); // "code" | "latex" | "both"

    const handleCodeToggle = () => {
        if (mode === "code") {
            setMode("latex"); // toggle to latex if already code
            setIsCodeEnabled(false)
            setIsLaTeXEnabled(true)
            setIsCodeandLaTexEnabled(false)
            setQuestionTitle('')
        } else {
            setMode("code"); // otherwise force code
            setIsCodeEnabled(true);
            setIsLaTeXEnabled(false);
            setIsCodeandLaTexEnabled(false)
            setQuestionTitle('')
        }
    };

    const handleLaTeXToggle = () => {
        if (mode === "latex") {
            setMode("code"); // toggle back to code if already latex
            setIsLaTeXEnabled(false)
            setIsCodeEnabled(true)
            setQuestionTitle('')
        } else {
            setMode("latex"); // otherwise force latex
            setIsLaTeXEnabled(true)
            setIsCodeandLaTexEnabled(false)
            setIsCodeEnabled(false)
            setQuestionTitle('')
        }
    };

    const handleCodeandLaTeXToggle = () => {
        if (mode === "both") {
            setMode("code"); // toggle back to code if already both
            setIsCodeandLaTexEnabled(false)
            setIsCodeEnabled(true) 
            setQuestionTitle('')
        } else {
            setMode("both"); // otherwise force both
            setIsCodeandLaTexEnabled(true)
            setIsLaTeXEnabled(false)
            setIsCodeEnabled(false)
            setQuestionTitle('')
        }
    };


    // const handleCodeToggle = () => {
    //     setIsCodeEnabled(true);
    //     setIsLaTeXEnabled(false);
    //     setIsCodeandLaTexEnabled(false);
    // };

    // const handleLaTeXToggle = () => {
    //     setIsCodeEnabled(false);
    //     setIsLaTeXEnabled(true);
    //     setIsCodeandLaTexEnabled(false);
    // };

    // const handleCodeandLaTeXToggle = () => {
    //     setIsCodeEnabled(false);
    //     setIsLaTeXEnabled(false);
    //     setIsCodeandLaTexEnabled(true);
    // };


    const addAnswerField = () => {
        if (currentAnswers.length < 10) {
            setCurrentAnswers([...currentAnswers, { text: "", image: null }]);
        } else {
            alert("Maximum of 10 answer options reached");
        }
    };

    const cleanLatexInput = (text) => {
        if (!text) return '';
        return text
            .replace(/\\documentclass\{.*?\}/g, '')
            .replace(/\\usepackage\{.*?\}/g, '')
            .replace(/\\begin\{document\}/g, '')
            .replace(/\\end\{document\}/g, '')
            .replace(/\\vspace\{.*?\}/g, '');
    };

    const handleAnswerChange = (index, field, value) => {
        const updatedAnswers = [...currentAnswers];
        updatedAnswers[index][field] = isLaTeXEnabled ? cleanLatexInput(value) : value;
        setCurrentAnswers(updatedAnswers);
        console.log(currentAnswers);       
    };

    const handleImageUpload = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("Image size should be less than 2MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedAnswers = [...currentAnswers];
                updatedAnswers[index].image = reader.result;
                setCurrentAnswers(updatedAnswers);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (index) => {
        const updatedAnswers = [...currentAnswers];
        updatedAnswers[index].image = null;
        setCurrentAnswers(updatedAnswers);
        const fileInput = document.querySelector(`input[type="file"][data-index="${index}"]`);
        if (fileInput) fileInput.value = '';
    };

    const handleSolutionImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("Image size should be less than 2MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setSolutionImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveSolutionImage = () => {
        setSolutionImage(null);
        const fileInput = document.querySelector(`input[type="file"]#solution-image-upload`);
        if (fileInput) fileInput.value = '';
    };

    const removeAnswerField = (index) => {
        if (currentAnswers.length > 1) {
            const updatedAnswers = [...currentAnswers];
            updatedAnswers.splice(index, 1);
            setCurrentAnswers(updatedAnswers);

            // Update correct answers
            const removedAnswerId = `answer${index + 1}`;
            setCorrectAnswers(prev =>
                prev.filter(id => id !== removedAnswerId)
                    .map(id => {
                        const answerNum = parseInt(id.replace("answer", ""));
                        return answerNum > index + 1
                            ? `answer${answerNum - 1}`
                            : id;
                    })
            );
        }
    };

    const handleSubmit = async () => {
        if (!questionTitle.trim()) {
            alert("Please enter a question");
            return;
        }

        if (currentAnswers.some(answer => !answer.text.trim())) {
            alert("Please fill all answer fields");
            return;
        }

        if (correctAnswers.length === 0) {
            alert("Please select at least one correct answer");
            return;
        }

        setIsSubmitting(true);
        try {
            const questionData = {
                questionTitle,
                questionImage,
                codeAnswers,
                latexAnswers,
                correctAnswers,
                isCodeEnabled,
                isLaTeXEnabled,
                solutionText,
                solutionImage
            };

            console.log("Submitting question:", questionData);
            onClose();
        } catch (error) {
            console.error("Error submitting question:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // useEffect(() => {
    //     if (!isLaTeXEnabled) {
    //         setQuestionTitle(prev => cleanLatex(prev));
    //         setCodeAnswers(prev => prev.map(answer => ({
    //             ...answer,
    //             text: cleanLatex(answer.text)
    //         })));
    //         setSolutionText(prev => cleanLatex(prev));
    //     }
    // }, [isLaTeXEnabled]);

    if (!open) return null;

    return (
        <div className="mcq-modal-overlay">
            <div ref={modalRef} className={`mcq-modal-content ${isBouncing ? "bounce" : ""}`}>
                <div className="mcq-modal-header">
                    <h5>{initialData ? "Edit SAQ Question" : "Add SAQ Question"}</h5>

                    <button className="close-btn" onClick={() => { onClose(), setIsCodeEnabled(true), setIsCodeandLaTexEnabled(false), setMode('code')}}>&times;</button>
                </div>

                <div className="mcq-modal-body">
                    <div className="modal-mcq-row">
                        <div className="first-column">
                            <div className="switch-container">
                                <div className="switch-wrapper">
                                    <label>Enable Code</label>
                                    <div className="switch" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            checked={mode == "code"}
                                            onChange={handleCodeToggle}
                                            disabled={isSubmitting}
                                        />
                                        <span className="slider round"></span>
                                    </div>
                                </div>

                                <div className="switch-wrapper">
                                    <label>Enable LaTeX</label>
                                    <div className="switch" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            checked={mode === "latex"}
                                            onChange={handleLaTeXToggle}
                                            disabled={isSubmitting}
                                        />
                                        <span className="slider round"></span>
                                    </div>
                                </div>

                                <div className="switch-wrapper">
                                    <label>Enable Code&LateX</label>
                                    <div className="switch" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            checked={mode == "both"}
                                            onChange={handleCodeandLaTeXToggle}
                                            disabled={isSubmitting}
                                        />
                                        <span className="slider round"></span>
                                    </div>
                                </div>
                            </div>

                            <div className="row mcq-form-group">
                                {/* Question textarea */}
                                <div className="col-7 qns-box">
                                    <label className="pt-3">Question :</label>
                                    {isLaTeXEnabled ? (
                                        <textarea
                                            className="mcq-form-control latex-input"
                                            rows="6"
                                            value={questionTitle}
                                            // onChange={(e) => setQuestionTitle(e.target.value)}
                                            // onChange={handleChange}
                                            onChange={({ target: { value } }) => setQuestionTitle(value)}
                                            placeholder="Enter content (supports LaTeX with $...$, $$...$$, \(...\), \[...\])"
                                            disabled={isSubmitting}
                                        />
                                    ) : isCodeEnabled ? (
                                        <textarea
                                            rows="6"
                                            className="mcq-form-control"
                                            style={{ width: "145%", padding: "10px", minHeight: "100px" }}
                                            value={questionTitle}
                                           // onChange={(e) => setQuestionTitle(e.target.value)}
                                                // onChange={handleChange}
                                                onChange={({ target: { value } }) => setQuestionTitle(value)}
                                            placeholder="Enter question text"
                                            disabled={isSubmitting}
                                        />
                                    ) : (
                                        <textarea
                                            className="mcq-form-control latex-input"
                                            rows="6"
                                            value={questionTitle}
                                          //  onChange={(e) => setQuestionTitle(e.target.value)}
                                                    // onChange={handleChange} 
                                                    onChange={({ target: { value } }) => setQuestionTitle(value)} 
                                          placeholder="Enter both Text and Latex "
                                            disabled={isSubmitting}
                                        />
                                    )}
                                </div>

                                {/* Image Upload */}
                                <div className="col-5 image-box">
                                    <label className="pt-3">Image</label>
                                    <div
                                        className="upload-box"
                                        onClick={() => document.getElementById("question-image-upload").click()}
                                    >
                                        {!questionImage ? (
                                            <div className="upload-placeholder">
                                                <FaCloudUploadAlt className="upload-icon" />
                                            </div>
                                        ) : (
                                            <div className="image-preview-container">
                                                <img
                                                    src={questionImage}
                                                    alt="Question preview"
                                                    className="img-preview"
                                                />

                                                <button
                                                    className="btn-remove-image"
                                                    onClick={handleRemoveQuestionImage}
                                                    disabled={isSubmitting}
                                                    aria-label="Remove question image"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            id="question-image-upload"
                                            style={{ display: "none" }}
                                            onChange={handleQuestionImageUpload}
                                            accept="image/*"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                            </div>


                            {currentAnswers.map((answer, index) => (
                                <div className="mcq-form-group option" key={index}>
                                    <div className="answer-header">
                                        <label>Option {index + 1}</label>
                                        {index > 0 && (
                                            <button
                                                className="btn-option"
                                                onClick={() => removeAnswerField(index)}
                                                disabled={isSubmitting}
                                                title="Remove Answer"
                                            >
                                                ×
                                            </button>
                                        )}

                                        {isLaTeXEnabled ? (
                                            <textarea
                                                className="mcq-form-control option-latext-input"
                                                value={answer.text}
                                                onChange={(e) => { handleAnswerChange(index, "text", cleanLatexInput(e.target.value));}}
                                                placeholder="Enter LaTeX equation"
                                                disabled={isSubmitting}
                                            />
                                        ) : isCodeEnabled ? (
                                            <input
                                                type="text"
                                                className="mcq-form-control option-input"
                                                value={answer.text}
                                                    onChange={(e) => { handleAnswerChange(index, "text", cleanLatexInput(e.target.value)); }}
                                                placeholder="Enter answer text"
                                                disabled={isSubmitting}
                                            />
                                        ) : (
                                            <textarea
                                                className="mcq-form-control option-latext-input"
                                                value={answer.text}
                                                onChange={(e) => {handleAnswerChange(index, "text", cleanLatexInput(e.target.value));console.log(answer.text)}}
                                                placeholder="Enter both Text and LaTeX equation"
                                                disabled={isSubmitting}
                                            />
                                        )}


                                    </div>


                                    <div className="col-2 option-box">
                                        <label>
                                            {/* {answer.image ? "Change Image" : "Add Image"} */}
                                            Image
                                        </label>
                                        <div
                                            className="upload-box"
                                            onClick={() => document.querySelector(`.option-image-upload-${index}`).click()}
                                        >
                                            {!answer.image ? (
                                                <div className="upload-placeholder">
                                                    <FaCloudUploadAlt className="upload-icon" />
                                                </div>
                                            ) : (
                                                <div className="image-preview-container">
                                                    <img
                                                        src={answer.image}
                                                        alt={`Answer ${index + 1} preview`}
                                                        className="img-preview"
                                                    />

                                                    <button
                                                        className="btn-remove-image"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // prevent reopening file picker
                                                            handleRemoveImage(index);
                                                        }}
                                                        disabled={isSubmitting}
                                                        aria-label={`Remove image for Answer ${index + 1}`}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                className={`option-image-upload-${index}`}
                                                style={{ display: "none" }}
                                                onChange={(e) => handleImageUpload(e, index)}
                                                accept="image/*"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>

                                </div>
                            ))}

                            {currentAnswers.length < 10 ? (
                                <button
                                    className="btn-add-answer"
                                    onClick={addAnswerField}
                                    disabled={isSubmitting}
                                >
                                    <FaPlus className="icon" /> Add Option
                                </button>
                            ) : (
                                <div className="max-answers-message">
                                    Maximum of 10 answer options reached
                                </div>
                            )}

                            <div className="mcq-form-group">
                                <label>Correct Answer(s)</label>
                                <Select
                                    isMulti
                                    options={answerOptions}
                                    value={selectedCorrectAnswers}
                                    onChange={handleCorrectAnswersChange}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    placeholder="Select correct Option(s)..."
                                    isDisabled={isSubmitting || currentAnswers.length === 0}
                                    closeMenuOnSelect={false}
                                    hideSelectedOptions={false}
                                    noOptionsMessage={() => "No options available"}
                                />
                            </div>
                            

                             {/* Solution  */}
                            <div className="mcq-form-group option">
                                <div className="answer-header">
                                    <label>Solution :</label>

                                    {isLaTeXEnabled ? (
                                        <textarea
                                            className="mcq-form-control option-latext-input"
                                            rows="4"
                                            value={solutionText}
                                            onChange={(e) =>
                                                setSolutionText(e.target.value)
                                            }
                                            placeholder="Enter solution (supports LaTeX)"
                                            disabled={isSubmitting}
                                        />
                                    ) : isCodeEnabled ? (
                                        <textarea
                                            rows="6"
                                            className="mcq-form-control option-input"
                                            style={{ padding: "10px", minHeight: "100px" }}
                                            value={solutionText}
                                            onChange={(e) => setSolutionText(e.target.value)}
                                            placeholder="Enter solution text"
                                            disabled={isSubmitting}
                                        />
                                    ) : (
                                        <textarea
                                            className="mcq-form-control option-latext-input"
                                            rows="3"
                                            value={solutionText}
                                            onChange={(e) =>
                                                setSolutionText(e.target.value)
                                            }
                                            placeholder="Enter solution (text + LaTeX)"
                                            disabled={isSubmitting}
                                        />
                                    )}
                                </div>

                                {/* Image upload like option design */}
                                <div className="col-2 option-box">
                                    <label>{solutionImage ? "Change Image" : "Add Image"}</label>
                                    <div
                                        className="upload-box"
                                        onClick={() => document.querySelector(`#solution-image-upload`).click()}
                                    >
                                        {!solutionImage ? (
                                            <div className="upload-placeholder">
                                                <FaCloudUploadAlt className="upload-icon" />
                                            </div>
                                        ) : (
                                            <div className="image-preview-container">
                                                <img
                                                    src={solutionImage}
                                                    alt="Solution preview"
                                                    className="img-preview"
                                                />
                                                <button
                                                    className="btn-remove-image"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveSolutionImage();
                                                    }}
                                                    disabled={isSubmitting}
                                                    aria-label="Remove solution image"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            id="solution-image-upload"
                                            style={{ display: "none" }}
                                            onChange={handleSolutionImageUpload}
                                            accept="image/*"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="secound-column">
                            <div className="Mcqpreview-section">
                                <div className="preview-header">
                                    <span>Live Preview</span>
                                    <div className="preview-status">
                                        {isLaTeXEnabled && <span className="latex-badge">LaTeX Enabled</span>}
                                        {isCodeEnabled && <span className="code-badge">Code Formatting</span>}
                                        {isCodeandLaTeXEnabled && <span className="latex-code-badge">Code & LaTex Formatting</span>}
                                    </div>
                                </div>

                                <div className="preview-body">
                                    <div className="preview-question">
                                        <div className="preview-label">Question:</div>
                                        <div className="modal-preview-content">
                                            {/* {isLaTeXEnabled ? (
                                                // <LatexRenderer
                                                //     content={questionTitle}
                                                //     isInline={false}
                                                // />
                                                <CKEditorRenderer content={questionTitle} mode="latex"/>
                                            ) : (
                                                questionTitle || <span className="placeholder-text">No question added yet</span>
                                            )} */}

                                            {
                                                isCodeEnabled ? (
                                                    <CKEditorRenderer content={`<pre><code class="language-">${questionTitle}</pre></code>`} mode="code" />
                                                ) : isLaTeXEnabled ? (
                                                    <CKEditorRenderer content={questionTitle} mode="latex" />
                                                ) : (
                                                    <CKEditorRenderer content={questionTitle} mode="both" />
                                                )
                                            }

                                            {questionImage && (
                                                <div className="question-image-container">
                                                    <img
                                                        src={questionImage}
                                                        alt="Question"
                                                        className="question-image"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="preview-answers">
                                        <div className="preview-label">Options:</div>
                                        <div className="answers-list">
                                            {currentAnswers.map((answer, index) => (
                                                <div
                                                    className={`answer-item ${correctAnswers.includes(`answer${index + 1}`) ? 'correct-answer' : ''}`}
                                                    key={index}
                                                >
                                                    <div className="answer-header">
                                                        <span className="answer-number">Option {index + 1}</span>
                                                        {correctAnswers.includes(`answer${index + 1}`) && (
                                                            <span className="correct-badge">Correct</span>
                                                        )}
                                                    </div>
                                                    <div className="answer-content">
                                                        {/* {isLaTeXEnabled ? (
                                                            // <LatexRenderer content={answer.text?.trim()} />
                                                            <CKEditorRenderer content={answer.text?.trim()} />
                                                        ) : (
                                                            answer.text?.trim() || <span className="placeholder-text">Empty answer</span>
                                                        )} */}

                                                        {
                                                            isCodeEnabled ? (
                                                                currentAnswers.length === 0 ? (
                                                                    <span className="placeholder-text">Empty answer</span>
                                                                ) : (
                                                                        <CKEditorRenderer content={`<pre><code class="language-">${answer.text?.trim()}</code><pre>`} mode="code" />
                                                                )
                                                            ) : isLaTeXEnabled ? (
                                                                currentAnswers.length === 0 ? (
                                                                    <span className="placeholder-text">Empty answer</span>
                                                                ) : (
                                                                    <CKEditorRenderer content={answer.text?.trim()} mode="latex" />
                                                                )
                                                            ) : (
                                                                    currentAnswers.title === 0 ? (
                                                                    <span className="placeholder-text">Empty answer</span>

                                                                ) : (
                                                                    <CKEditorRenderer content={answer.text?.trim()} mode="both" />

                                                                )
                                                            )
                                                        }

                                                        {answer.image && (
                                                            <div className="answer-image-container">
                                                                <img
                                                                    src={answer.image}
                                                                    alt={`Answer ${index + 1}`}
                                                                    className="answer-image"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="preview-footer">
                                        <div className="preview-label">Correct Answer(s):</div>
                                        <div className="correct-answers-display">
                                            {correctAnswers.length > 0 ? (
                                                correctAnswers.map(answerId => {
                                                    const optionNum = answerId.replace('answer', '');
                                                    const answerText = currentAnswers[parseInt(optionNum) - 1]?.text || '';
                                                    return (
                                                        <div key={answerId} className="selected-answer">
                                                            <span className="answer-text">
                                                                Option {optionNum}: {answerText.substring(0, 20)}{answerText.length > 20 ? '...' : ''}
                                                            </span>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <span className="placeholder-text">Not selected yet</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="preview-solution">
                                        <div className="preview-label">Solution:</div>
                                        <div className="modal-preview-content">
                                            {/* {isLaTeXEnabled ? (
                                                <LatexRenderer
                                                    content={solutionText}
                                                    isInline={false}
                                                />
                                            ) : (
                                                solutionText || <span className="placeholder-text">No solution added yet</span>
                                            )} */}

                                            {
                                                isCodeEnabled ? (
                                                    solutionText.length === 0 ? (
                                                        <span className="placeholder-text">Empty answer</span>
                                                    ) : (
                                                            <CKEditorRenderer content={`<pre><code class="language-">${solutionText}</code><pre>`} mode="code" />
                                                    )
                                                ) : isLaTeXEnabled ? (
                                                    solutionText.length === 0 ? (
                                                        <span className="placeholder-text">Empty answer</span>
                                                    ) : (
                                                        <CKEditorRenderer content={solutionText} mode="latex" />
                                                    )
                                                ) : (
                                                    solutionText.length === 0 ? (
                                                        <span className="placeholder-text">Empty answer</span>
                                                    ) : (
                                                        <CKEditorRenderer content={solutionText} mode="both" />
                                                    )
                                                )
                                            }


                                            {solutionImage && (
                                                <div className="solution-image-container">
                                                    <img
                                                        src={solutionImage}
                                                        alt="Solution"
                                                        className="solution-image"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mcq-modal-footer">
                    <button
                        className="btn btn-cancel"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-save"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SAQModal;