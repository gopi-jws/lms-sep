"use client"
import React, { useState, useEffect } from "react";
import "./NumericalModal.css";
import { FaCloudUploadAlt } from "react-icons/fa";
import 'katex/dist/katex.min.css';
import LatexRenderer, { cleanLatex } from "../../../ReusableComponents/LatexRenderer/LatexRenderer";
import useBounceModal from "../../../ReusableComponents/useBounceModal/useBounceModal";
import QuestionEditor from "../../Markdown/QuestionEditor";


const NumericalModal = ({ open, onClose, initialData }) => {
    const { modalRef, isBouncing } = useBounceModal(open);
    const [questionTitle, setQuestionTitle] = useState(initialData?.questionTitle || "");
    const [correctAnswer, setCorrectAnswer] = useState(initialData?.correctAnswer || "");
    const [questionImage, setQuestionImage] = useState(initialData?.questionImage || null);
    const [answerImage, setAnswerImage] = useState(initialData?.answerImage || null);
    const [isCodeEnabled, setIsCodeEnabled] = useState(true);
    const [isLaTeXEnabled, setIsLaTeXEnabled] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCodeandLaTeXEnabled, setIsCodeandLaTexEnabled] = useState(false)

    // Handle initial data when modal opens
    useEffect(() => {
        if (open && initialData) {
            setQuestionTitle(initialData.questionTitle || "");
            setQuestionImage(initialData.questionImage || null);
            setCorrectAnswer(initialData.correctAnswer || "");
            setAnswerImage(initialData.answerImage || null);
            setIsCodeEnabled(initialData.isCodeEnabled || false);
            setIsLaTeXEnabled(initialData.isLaTeXEnabled || false);
        } else if (open) {
            // Reset for new question
            setQuestionTitle("");
            setQuestionImage(null);
            setCorrectAnswer("");
            setAnswerImage(null);
            setIsCodeEnabled(true);
            setIsLaTeXEnabled(false);
        }
    }, [open, initialData]);

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

    const handleAnswerImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("Image size should be less than 2MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setAnswerImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveQuestionImage = () => {
        setQuestionImage(null);
        const fileInput = document.querySelector(`input[type="file"]#question-image-upload`);
        if (fileInput) fileInput.value = '';
    };

    const handleRemoveAnswerImage = () => {
        setAnswerImage(null);
        const fileInput = document.querySelector(`input[type="file"]#answer-image-upload`);
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
    

    const cleanLatexInput = (text) => {
        if (!text) return '';
        return text
            .replace(/\\documentclass\{.*?\}/g, '')
            .replace(/\\usepackage\{.*?\}/g, '')
            .replace(/\\begin\{document\}/g, '')
            .replace(/\\end\{document\}/g, '')
            .replace(/\\vspace\{.*?\}/g, '');
    };

    const handleSubmit = async () => {
        if (!questionTitle.trim()) {
            alert("Please enter a question");
            return;
        }

        if (!correctAnswer.trim()) {
            alert("Please enter a correct answer");
            return;
        }

        setIsSubmitting(true);
        try {
            const questionData = {
                questionTitle,
                questionImage,
                correctAnswer,
                answerImage,
                isCodeEnabled,
                isLaTeXEnabled,
            };

            console.log("Submitting question:", questionData);
            onClose();
        } catch (error) {
            console.error("Error submitting question:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (!isLaTeXEnabled) {
            setQuestionTitle(prev => cleanLatex(prev));
            setCorrectAnswer(prev => cleanLatex(prev));
        }
    }, [isLaTeXEnabled]);

    if (!open) return null;

    return (
        <div className="numerical-modal-overlay">
            <div ref={modalRef} className={`numerical-modal-content ${isBouncing ? "bounce" : ""}`}>
                <div className="numerical-modal-header">
                    <h5>{initialData ? "Edit Numerical Question" : "Add Numerical Question"}</h5>
                    <button className="close-btn" onClick={() => { onClose(), setIsCodeEnabled(true), setIsCodeandLaTexEnabled(false), setMode('code') }}>&times;</button>
                </div>

                <div className="numerical-modal-body">
                    <div className="numerical-modal-row">
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

                            <div className="numerical-form-group numerical-qns-box">
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
                                            onChange={(e) => setQuestionTitle(e.target.value)}
                                            placeholder="Enter both Text and Latex "
                                            disabled={isSubmitting}
                                        />
                                    )}
                                </div>
                                
                                {/* Image Upload */}
                                <div className="image-upload-container numerical-image-box">
                                    <label className="image-upload-label">
                                        Image
                                    </label>

                                    <div 
                                        className="upload-box"
                                        onClick={() => document.getElementById("question-image-upload").click()}
                                    >
                                        <input
                                            type="file"
                                            id="question-image-upload"
                                            style={{ display: "none" }}
                                            onChange={handleQuestionImageUpload}
                                            accept="image/*"
                                            disabled={isSubmitting}
                                        />
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

                                    </div>
                                    
                                </div>
                            </div>

                            <div className="numerical-form-group">
                                <label>Correct Answer</label>
                                {isLaTeXEnabled ? (
                                    <textarea
                                        className="numerical-form-control latex-input"
                                        rows="2"
                                        value={correctAnswer}
                                        onChange={(e) => setCorrectAnswer(cleanLatexInput(e.target.value))}
                                        placeholder="Enter LaTeX equation for answer"
                                        disabled={isSubmitting}
                                    />
                                ) : isCodeEnabled ? (
                                        <textarea
                                            className="numerical-form-control latex-input"
                                            rows="2"
                                            value={correctAnswer}
                                            onChange={(e) => setCorrectAnswer((e.target.value))}
                                            placeholder="Enter Code equation for answer"
                                            disabled={isSubmitting}
                                        />
                                ) : (
                                    <textarea
                                        className="numerical-form-control latex-input"
                                        rows="2"
                                        value={correctAnswer}
                                        onChange={(e) => setCorrectAnswer(cleanLatexInput(e.target.value))}
                                        placeholder="Enter Code&LaTeX equation for answer"
                                        disabled={isSubmitting}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="secound-column">
                            <div className="Numericalpreview-section">
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
                                            {
                                                isCodeEnabled ? (
                                                    <QuestionEditor content={questionTitle} mode="code" />
                                                ) : isLaTeXEnabled ? (
                                                    <QuestionEditor content={questionTitle} mode="latex" />
                                                ) : (
                                                    <QuestionEditor content={questionTitle} mode="both"/>
                                                )
                                            }
                                            {questionImage && (
                                                <div className="question-image-container">
                                                    <img
                                                        src={questionImage}
                                                        alt="Question"
                                                        className="question-image"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextElementSibling.style.display = 'block';
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="preview-correct-answer">
                                        <div className="preview-label">Correct Answer:</div>
                                        <div className="answer-content">
                                            {
                                                <QuestionEditor content={correctAnswer?.trim()} mode="both" />
                                            }
                                            {answerImage && (
                                                <div className="answer-image-container">
                                                    <img
                                                        src={answerImage}
                                                        alt="Answer"
                                                        className="answer-image"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextElementSibling.style.display = 'block';
                                                        }}
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

                <div className="numerical-modal-footer">
                    <button
                        className="btn btn-cancel"
                        onClick={() => { onClose(), setIsCodeEnabled(true), setIsCodeandLaTexEnabled(false), setMode('code') }}
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

export default NumericalModal;