"use client"

import React, { useState, useEffect } from "react";
import "./TrueFalseModal.css";
import 'katex/dist/katex.min.css';
import LatexRenderer, { cleanLatex } from "../../../ReusableComponents/LatexRenderer/LatexRenderer";
import useBounceModal from "../../../ReusableComponents/useBounceModal/useBounceModal";


const TrueFalseModal = ({ open, onClose, initialData }) => {
    const { modalRef, isBouncing } = useBounceModal(open);
    const [questionTitle, setQuestionTitle] = useState(initialData?.questionTitle || "");
    const [correctAnswer, setCorrectAnswer] = useState(initialData?.correctAnswer || "");
    const [questionImage, setQuestionImage] = useState(initialData?.questionImage || null);
    const [isCodeEnabled, setIsCodeEnabled] = useState(true);
    const [isLaTeXEnabled, setIsLaTeXEnabled] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle initial data when modal opens
    useEffect(() => {
        if (open && initialData) {
            setQuestionTitle(initialData.questionTitle || "");
            setQuestionImage(initialData.questionImage || null);
            setCorrectAnswer(initialData.correctAnswer || "");
            setIsCodeEnabled(initialData.isCodeEnabled || false);
            setIsLaTeXEnabled(initialData.isLaTeXEnabled || false);
        } else if (open) {
            // Reset for new question
            setQuestionTitle("");
            setQuestionImage(null);
            setCorrectAnswer("");
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

    const handleRemoveQuestionImage = () => {
        setQuestionImage(null);
        const fileInput = document.querySelector(`input[type="file"]#question-image-upload`);
        if (fileInput) fileInput.value = '';
    };

    const handleCodeToggle = () => {
        const newCodeState = !isCodeEnabled;
        setIsCodeEnabled(newCodeState);
        if (!newCodeState) setIsLaTeXEnabled(true);
        else setIsLaTeXEnabled(false);
    };

    const handleLaTeXToggle = () => {
        const newLaTeXState = !isLaTeXEnabled;
        setIsLaTeXEnabled(newLaTeXState);
        if (!newLaTeXState) setIsCodeEnabled(true);
        else setIsCodeEnabled(false);
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

        if (!correctAnswer) {
            alert("Please select a correct answer");
            return;
        }

        setIsSubmitting(true);
        try {
            const questionData = {
                questionTitle,
                questionImage,
                correctAnswer,
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
        }
    }, [isLaTeXEnabled]);

    if (!open) return null;

    return (
        <div className="true-false-modal-overlay">
            <div ref={modalRef} className={`true-false-modal-content ${isBouncing ? "bounce" : ""}`}>
                <div className="true-false-modal-header">
                    <h5>{initialData ? "Edit True/False Question" : "Add True/False Question"}</h5>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="true-false-modal-body">
                    <div className="true-false-modal-row">
                        <div className="first-column">
                            <div className="switch-container">
                                <div className="switch-wrapper">
                                    <label>Enable Code</label>
                                    <div className="switch" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            checked={isCodeEnabled}
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
                                            checked={isLaTeXEnabled}
                                            onChange={handleLaTeXToggle}
                                            disabled={isSubmitting}
                                        />
                                        <span className="slider round"></span>
                                    </div>
                                </div>
                            </div>

                            <div className="true-false-form-group row">
                                {/* Question Input */}
                                <div className="col-8">
                                    <label className="pt-3">Question :</label>
                                    {isLaTeXEnabled ? (
                                        <textarea
                                            className="true-false-form-control latex-input"
                                            rows="4"
                                            value={questionTitle}
                                            onChange={(e) => setQuestionTitle(cleanLatexInput(e.target.value))}
                                            placeholder="Enter content (supports LaTeX with $...$, $$...$$, \(...\), \[...\])"
                                            disabled={isSubmitting}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            className="true-false-form-control normal-question-input"
                                            value={questionTitle}
                                            onChange={(e) => setQuestionTitle(e.target.value)}
                                            placeholder="Enter question text"
                                            disabled={isSubmitting}
                                        />
                                    )}
                                </div>

                                {/* Question Image */}
                                <div className="col-4">
                                    <label htmlFor="" className="pt-3">Question Image</label>
                                    <div
                                        className="upload-box"
                                        onClick={() => document.getElementById("true-false-image-upload").click()}
                                    >
                                        {!questionImage ? (
                                            <div className="upload-placeholder">
                                                <span className="plus-icon">+</span>
                                                
                                            </div>
                                        ) : (
                                            <div className="image-preview-container">
                                                <img
                                                    src={questionImage}
                                                    alt="Question preview"
                                                    className="img-preview"
                                                    onError={(e) => {
                                                        e.target.style.display = "none";
                                                        e.target.nextElementSibling.style.display = "block";
                                                    }}
                                                />
                                                <button
                                                    className="btn-remove-image"
                                                    onClick={handleRemoveQuestionImage}
                                                    disabled={isSubmitting}
                                                    aria-label="Remove question image"
                                                    title="Remove image"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            id="true-false-image-upload"
                                            style={{ display: "none" }}
                                            onChange={handleQuestionImageUpload}
                                            accept="image/*"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                            </div>


                            <div className="true-false-form-group">
                                <label>Correct Answer</label>
                                <select
                                    className="true-false-form-control"
                                    value={correctAnswer}
                                    onChange={(e) => setCorrectAnswer(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                >
                                    <option value="">Select Correct Answer</option>
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                </select>
                            </div>
                        </div>

                        <div className="secound-column">
                            <div className="true-false-preview-section">
                                <div className="preview-header">
                                    <span>Live Preview</span>
                                    <div className="preview-status">
                                        {isLaTeXEnabled && <span className="latex-badge">LaTeX Enabled</span>}
                                        {isCodeEnabled && <span className="code-badge">Code Formatting</span>}
                                    </div>
                                </div>

                                <div className="preview-body">
                                    <div className="preview-question">
                                        <div className="preview-label">Question:</div>
                                        <div className="modal-preview-content">
                                            {isLaTeXEnabled ? (
                                                <LatexRenderer
                                                    content={questionTitle}
                                                    isInline={false}
                                                />
                                            ) : (
                                                questionTitle || <span className="placeholder-text">No question added yet</span>
                                            )}
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
                                            {correctAnswer ? (
                                                <span className={`answer-${correctAnswer}`}>
                                                    {correctAnswer.charAt(0).toUpperCase() + correctAnswer.slice(1)}
                                                </span>
                                            ) : (
                                                <span className="placeholder-text">Not selected yet</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="true-false-modal-footer">
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

export default TrueFalseModal;