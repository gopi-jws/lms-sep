"use client"
import React, { useState, useEffect } from "react";
import "./DescriptiveModal.css";
import 'katex/dist/katex.min.css';
import { FaCloudUploadAlt } from "react-icons/fa";
import LatexRenderer, { cleanLatex } from "../../../ReusableComponents/LatexRenderer/LatexRenderer";
import useBounceModal from "../../../ReusableComponents/useBounceModal/useBounceModal";
import QuestionEditor from "../../Markdown/QuestionEditor";

const DescriptiveModal = ({ open, onClose, initialData }) => {
    const { modalRef, isBouncing } = useBounceModal(open);
    const [questionTitle, setQuestionTitle] = useState(initialData?.questionTitle || "");
    const [questionImage, setQuestionImage] = useState(initialData?.questionImage || null);
    const [isCodeEnabled, setIsCodeEnabled] = useState(true);
    const [isLaTeXEnabled, setIsLaTeXEnabled] = useState(false);
    const [isCodeandLaTeXEnabled, setIsCodeandLaTexEnabled] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle initial data when modal opens
    useEffect(() => {
        if (open && initialData) {
            setQuestionTitle(initialData.questionTitle || "");
            setQuestionImage(initialData.questionImage || null);
            setIsCodeEnabled(initialData.isCodeEnabled || false);
            setIsLaTeXEnabled(initialData.isLaTeXEnabled || false);
        } else if (open) {
            // Reset for new question
            setQuestionTitle("");
            setQuestionImage(null);
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

        setIsSubmitting(true);
        try {
            const questionData = {
                questionTitle,
                questionImage,
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
        <div className="descriptive-modal-overlay">
            <div ref={modalRef} className={`descriptive-modal-content ${isBouncing ? "bounce" : ""}`}>
                <div className="descriptive-modal-header">
                    <h5>{initialData ? "Edit Descriptive Question" : "Add Descriptive Question"}</h5>
                    <button className="close-btn" onClick={() => { onClose(), setIsCodeEnabled(true), setIsCodeandLaTexEnabled(false), setMode('code') }}>&times;</button>
                </div>

                <div className="descriptive-modal-body">
                    <div className="descriptive-modal-row">
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

                            <div className="descriptive-form-group descriptive-qns-box">

                                <div className="div">
                                    <label className="pt-3">Question : </label>
                                    {isLaTeXEnabled ? (
                                        <textarea
                                            className="mcq-form-control latex-input"
                                            rows="6"
                                            value={questionTitle}
                                            onChange={({ target: { value } }) => setQuestionTitle(value)}
                                            placeholder="Enter content (supports LaTeX with $...$, $$...$$, \(...\), \[...\])"
                                            disabled={isSubmitting}
                                        />
                                    ) : isCodeEnabled ? (
                                        <textarea
                                            rows="6"
                                            className="mcq-form-control"
                                            style={{ width: "450px", padding: "10px", minHeight: "100px" }}
                                            value={questionTitle}
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
                            
                                <div className="image-upload-container descriptive-image-box">
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
                                            className="descriptive-form-control"
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
                        </div>

                        <div className="secound-column">
                            <div className="Descriptivepreview-section">
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="descriptive-modal-footer">
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

export default DescriptiveModal;