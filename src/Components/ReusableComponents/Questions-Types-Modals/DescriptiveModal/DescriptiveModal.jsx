"use client"
import React, { useState, useEffect, useRef } from "react";
import "./DescriptiveModal.css";
import 'katex/dist/katex.min.css';
import { FaCloudUploadAlt, FaListOl, FaListUl, FaRedo, FaUndo } from "react-icons/fa";
import useBounceModal from "../../../ReusableComponents/useBounceModal/useBounceModal";
import QuestionEditor from "../../Markdown/QuestionEditor";

const DescriptiveModal = ({ open, onClose, initialData }) => {
    const { modalRef, isBouncing } = useBounceModal(open);
    const [questionTitle, setQuestionTitle] = useState(initialData?.questionTitle || "");
    const [questionImages, setQuestionImages] = useState(initialData?.questionImages || []);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle initial data when modal opens
    useEffect(() => {
        if (open && initialData) {
            setQuestionTitle(initialData.questionTitle || "");
            setQuestionImages(initialData.questionImages || []);
        } else if (open) {
            // Reset for new question
            setQuestionTitle("");
            setQuestionImages([]);
        }
    }, [open, initialData]);

          // Text selection state
            const [selectedField, setSelectedField] = useState(null);
            const [selectedText, setSelectedText] = useState("");
            const [selectionStart, setSelectionStart] = useState(0);
            const [selectionEnd, setSelectionEnd] = useState(0);
        
            // History for undo/redo
            const [history, setHistory] = useState({
                question: [initialData?.questionTitle || ""],
                solution: [initialData?.solutionText || ""],
                answers: initialData?.answers ? [initialData.answers] : [[{ text: "", image: null }]]
            });
            const [historyIndex, setHistoryIndex] = useState({
                question: 0,
                solution: 0,
                answers: 0
            });
        
            // Save to history
            const saveToHistory = (field, value) => {
                setHistory(prev => {
                    const newHistory = { ...prev };
                    const fieldHistory = prev[field].slice(0, historyIndex[field] + 1);
                    fieldHistory.push(value);
                    newHistory[field] = fieldHistory;
                    return newHistory;
                });
                setHistoryIndex(prev => ({ ...prev, [field]: prev[field] + 1 }));
            };
        
            // Undo functionality
            const handleUndo = (field) => {
                if (historyIndex[field] > 0) {
                    const newIndex = historyIndex[field] - 1;
                    const value = history[field][newIndex];
        
                    if (field === 'question') {
                        setQuestionTitle(value);
                    } else if (field === 'solution') {
                        setSolutionText(value);
                    } else if (field === 'answers') {
                        setAnswers(value.map(a => ({ ...a })));
                    }
        
                    setHistoryIndex(prev => ({ ...prev, [field]: newIndex }));
                }
            };
        
            // Redo functionality
            const handleRedo = (field) => {
                if (historyIndex[field] < history[field].length - 1) {
                    const newIndex = historyIndex[field] + 1;
                    const value = history[field][newIndex];
        
                    if (field === 'question') {
                        setQuestionTitle(value);
                    } else if (field === 'solution') {
                        setSolutionText(value);
                    } else if (field === 'answers') {
                        setAnswers(value.map(a => ({ ...a })));
                    }
        
                    setHistoryIndex(prev => ({ ...prev, [field]: newIndex }));
                }
            };
        
            // Handle text selection from textareas
            const handleTextSelection = (fieldName) => (e) => {
                const start = e.target.selectionStart;
                const end = e.target.selectionEnd;
                const text = e.target.value.substring(start, end);
        
                setSelectedField(fieldName);
                setSelectedText(text);
                setSelectionStart(start);
                setSelectionEnd(end);
            };
        
            // Apply formatting to selected text
            const applyFormatting = (formatType, field = null) => {
                // Use the field parameter or fall back to selectedField
                const targetField = field || selectedField;
                if (!targetField || !selectedText) return;
        
                let formattedText = selectedText;
                let before = '';
                let after = '';
        
                switch (formatType) {
                    case 'bold':
                        before = '**';
                        after = '**';
                        break;
                    case 'italic':
                        before = '*';
                        after = '*';
                        break;
                    default:
                        return;
                }
        
                formattedText = before + formattedText + after;
        
                if (targetField === 'question') {
                    const newValue = questionTitle.substring(0, selectionStart) + formattedText + questionTitle.substring(selectionEnd);
                    setQuestionTitle(newValue);
                    saveToHistory('question', newValue);
                }
                else if (targetField.startsWith('answer-')) {
                    const index = parseInt(targetField.split('-')[1]);
                    const updatedAnswers = [...answers];
                    const currentText = updatedAnswers[index].text || "";
                    const newValue = currentText.substring(0, selectionStart) + formattedText + currentText.substring(selectionEnd);
                    updatedAnswers[index].text = newValue;
                    setAnswers(updatedAnswers);
                    saveToHistory('answers', updatedAnswers);
                }
                else if (targetField === 'solution') {
                    const newValue = solutionText.substring(0, selectionStart) + formattedText + solutionText.substring(selectionEnd);
                    setSolutionText(newValue);
                    saveToHistory('solution', newValue);
                }
        
                setSelectedText("");
                setSelectedField(null);
            };
        
        
            // Refs for textareas
            const questionRef = useRef(null);
        
            const handleAutoResize = (textarea) => {
                if (!textarea) return;
                textarea.style.height = "auto";
                textarea.style.height = textarea.scrollHeight + "px";
            };
        
            // When component mounts or updates, adjust all
            useEffect(() => {
                handleAutoResize(questionRef.current);
            }, [questionTitle]);
        
            // Insert list at current line
            const insertList = (field, type, index = null) => {
                let currentValue, setValue, textarea, historyField;
        
                if (field === 'question') {
                    currentValue = questionTitle;
                    setValue = (val) => {
                        setQuestionTitle(val);
                        saveToHistory('question', val);
                    };
                    textarea = questionRef.current;
                    historyField = 'question';
                } 
                else {
                    return;
                }
        
                if (!textarea) return;
        
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
        
                // Find start and end of current line
                let lineStart = start;
                while (lineStart > 0 && currentValue[lineStart - 1] !== '\n') {
                    lineStart--;
                }
        
                let lineEnd = end;
                while (lineEnd < currentValue.length && currentValue[lineEnd] !== '\n') {
                    lineEnd++;
                }
        
                const currentLine = currentValue.substring(lineStart, lineEnd);
                const isAlreadyList = currentLine.trim().match(/^[\-\*\+]\s|^\d+\.\s/);
        
                let newLine;
                if (isAlreadyList) {
                    // Remove existing list formatting
                    newLine = currentLine.replace(/^[\-\*\+]\s|^\d+\.\s/, '').trim();
                } else {
                    // Add list formatting
                    if (type === 'bullet') {
                        newLine = '- ' + currentLine;
                    } else if (type === 'number') {
                        newLine = '1. ' + currentLine;
                    }
                }
        
                const newValue = currentValue.substring(0, lineStart) + newLine + currentValue.substring(lineEnd);
                setValue(newValue);
        
                // Set cursor position after the list marker
                setTimeout(() => {
                    textarea.focus();
                    const newCursorPos = lineStart + newLine.length;
                    textarea.setSelectionRange(newCursorPos, newCursorPos);
                }, 0);
            };
        
            // Handle Enter key for lists (auto-continue lists)
            const handleKeyDown = (field, e) => {
                if (e.key === 'Enter') {
                    const textarea = e.target;
                    const start = textarea.selectionStart;
                    const value = field === 'question' ? questionTitle : solutionText;
        
                    // Find start of current line
                    let lineStart = start - 1;
                    while (lineStart > 0 && value[lineStart] !== '\n') {
                        lineStart--;
                    }
                    if (lineStart > 0) lineStart++; // Move past the newline
        
                    const currentLine = value.substring(lineStart, start);
                    const bulletMatch = currentLine.match(/^([\-\*\+])\s/);
                    const numberMatch = currentLine.match(/^(\d+)\.\s/);
        
                    if (bulletMatch) {
                        e.preventDefault();
                        const newValue = value.substring(0, start) + '\n' + bulletMatch[1] + ' ' + value.substring(start);
                        if (field === 'question') {
                            setQuestionTitle(newValue);
                            saveToHistory('question', newValue);
                        } else {
                            setSolutionText(newValue);
                            saveToHistory('solution', newValue);
                        }
        
                        setTimeout(() => {
                            textarea.focus();
                            textarea.setSelectionRange(start + bulletMatch[1].length + 2, start + bulletMatch[1].length + 2);
                        }, 0);
                    } else if (numberMatch) {
                        e.preventDefault();
                        const currentNumber = parseInt(numberMatch[1]);
                        const newValue = value.substring(0, start) + '\n' + (currentNumber + 1) + '. ' + value.substring(start);
                        if (field === 'question') {
                            setQuestionTitle(newValue);
                            saveToHistory('question', newValue);
                        } else {
                            setSolutionText(newValue);
                            saveToHistory('solution', newValue);
                        }
        
                        setTimeout(() => {
                            textarea.focus();
                            textarea.setSelectionRange(start + (currentNumber + 1).toString().length + 3, start + (currentNumber + 1).toString().length + 3);
                        }, 0);
                    }
                }
            };
        
    
        // Multiple Image Upload for Question
        const handleQuestionImagesUpload = (e) => {
            const files = Array.from(e.target.files);
            if (files.length === 0) return;
    
            // Check total size (5MB total limit)
            const totalSize = files.reduce((total, file) => total + file.size, 0);
            if (totalSize > 5 * 1024 * 1024) {
                alert("Total images size should be less than 5MB");
                return;
            }
    
            // Filter valid files (2MB each limit)
            const validFiles = files.filter(file => {
                if (file.size > 2 * 1024 * 1024) {
                    alert(`Image ${file.name} is too large (max 2MB each)`);
                    return false;
                }
                return true;
            });
    
            // Read all files
            const readers = validFiles.map(file => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve({
                            data: reader.result,
                            name: file.name,
                            size: file.size
                        });
                    };
                    reader.readAsDataURL(file);
                });
            });
    
            // Add all images to state
            Promise.all(readers).then(imageDataArray => {
                setQuestionImages(prev => [...prev, ...imageDataArray.map(img => img.data)]);
            });
    
            // Reset file input to allow uploading same files again
            e.target.value = '';
        };
    
    
        //Handle to Remove Queston Image
        const handleRemoveQuestionImage = (indexToRemove) => {
            setQuestionImages(prev => prev.filter((_, index) => index !== indexToRemove));
        };
    
            
        const handleCodeToggle = () => {
            const textarea = questionRef.current;
            if (!textarea) return;
    
            const cursorStart = textarea.selectionStart;
            const cursorEnd = textarea.selectionEnd;
    
            const language = "~~~language\n//code here\n~~~";
    
            // Insert at cursor position
            const newValue =
                questionTitle.slice(0, cursorStart) +
                language +
                questionTitle.slice(cursorEnd);
    
            setQuestionTitle(newValue);
    
            // Reset cursor position after inserting
            setTimeout(() => {
                const newCursorPos = cursorStart + language.length;
                textarea.setSelectionRange(newCursorPos, newCursorPos);
                textarea.focus();
            }, 0);
        };

    const handleQuestionImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("Image size should be less than 2MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setQuestionImages(reader.result);
            };
            reader.readAsDataURL(file);
        }
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
                questionImages,
            };

            console.log("Submitting question:", questionData);
            onClose();
        } catch (error) {
            console.error("Error submitting question:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <div className="descriptive-modal-overlay">
            <div ref={modalRef} className={`descriptive-modal-content ${isBouncing ? "bounce" : ""}`}>
                <div className="descriptive-modal-header">
                    <h5>{initialData ? "Edit Descriptive Question" : "Add Descriptive Question"}</h5>
                    <button className="close-btn" onClick={() => { onClose()}}>&times;</button>
                </div>

                <div className="descriptive-modal-body">
                    <div className="descriptive-modal-row">
                        <div className="first-column1">
                            <div className="title">Question</div>
                            <hr />
                            <div className="body-question">

                                {/* Enhanced editing-option */}
                                <div className="editing-option">
                                    <label
                                        style={{ fontWeight: "bold", cursor: "pointer" }}
                                        onClick={() => applyFormatting('bold', 'question')}
                                        title="Bold"
                                    >
                                        B
                                    </label>
                                    <label
                                        style={{ fontStyle: "italic", cursor: "pointer" }}
                                        onClick={() => applyFormatting('italic', 'question')}
                                        title="Italic"
                                    >
                                        I
                                    </label>
                                    <label
                                        style={{ cursor: "pointer" }}
                                        onClick={() => insertList('question', 'bullet')}
                                        title="Bullet List"
                                    >
                                        <FaListUl />
                                    </label>
                                    <label
                                        style={{ cursor: "pointer" }}
                                        onClick={() => insertList('question', 'number')}
                                        title="Numbered List"
                                    >
                                        <FaListOl />
                                    </label>
                                    <label
                                        style={{
                                            cursor: historyIndex.question === 0 ? "not-allowed" : "pointer",
                                            opacity: historyIndex.question === 0 ? 0.5 : 1
                                        }}
                                        onClick={() => handleUndo('question')}
                                        title="Undo"
                                    >
                                        <FaUndo />
                                    </label>
                                    <label
                                        style={{
                                            cursor: historyIndex.question === history.question.length - 1 ? "not-allowed" : "pointer",
                                            opacity: historyIndex.question === history.question.length - 1 ? 0.5 : 1
                                        }}
                                        onClick={() => handleRedo('question')}
                                        title="Redo"
                                    >
                                        <FaRedo />
                                    </label>
                                    <label
                                        style={{
                                            cursor: "pointer",
                                        }}
                                        onClick={handleCodeToggle}
                                    >
                                        Code
                                    </label>
                                </div>

                                {/* Question Input */}

                                <textarea
                                    ref={questionRef}
                                    className="qtn-textarea"
                                    placeholder="Enter the question text..."
                                    value={questionTitle}
                                    onChange={(e) => {
                                        setQuestionTitle(e.target.value);
                                        handleAutoResize(e.target);
                                        saveToHistory('question', e.target.value);
                                    }}
                                    onSelect={handleTextSelection('question')}
                                    onKeyDown={(e) => handleKeyDown('question', e)}
                                    disabled={isSubmitting}
                                />

                                <hr />

                                {/* Question Images */}
                                <div className="image-box">
                                    <div
                                        className="upload-box"
                                        onClick={() => document.getElementById("question-images-upload").click()}
                                    >
                                        {questionImages.length === 0 ? (
                                            <div className="upload-placeholder">
                                                <label className="upload-label">Upload Images</label>
                                            </div>
                                        ) : (
                                            <div className="add-more-container">
                                                <div
                                                    className="add-more-placeholder"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        document.getElementById("question-images-upload").click();
                                                    }}
                                                >
                                                    <label className="upload-label">Upload Images</label>
                                                </div>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            id="question-images-upload"
                                            style={{ display: "none" }}
                                            onChange={handleQuestionImagesUpload}
                                            accept="image/*"
                                            disabled={isSubmitting}
                                            multiple
                                        />
                                    </div>
                                </div>

                                {/* Question Images Upload */}
                                <div className="qtn-images-preview">
                                    {questionImages.map((image, imgIndex) => (
                                        <div key={imgIndex} className="qtn-image-item">
                                            <img
                                                src={image}
                                                alt={`Question ${imgIndex + 1}`}
                                                className="qtn-image"
                                            />
                                            <button
                                                className="btn-remove-image"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveQuestionImage(imgIndex);
                                                }}
                                                disabled={isSubmitting}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="secound-column2">
                            <div className="title">Live Preview</div>
                            <hr />
                            <div className="body-question">

                                {/* Preview Question */}
                                <label className="editing-option">Question</label>
                                <div className="modal-preview-content">
                                    <div className="input">
                                        <QuestionEditor
                                            content={questionTitle}
                                            className="question-editor-preview"
                                        />
                                    </div>

                                    {questionImages.length > 0 && (
                                        <div className="question-images-container">
                                            {questionImages.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={image}
                                                    alt={`Question ${index + 1}`}
                                                    className="question-image"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="descriptive-modal-footer">
                    <button
                        className="btn btn-cancel"
                        onClick={() => { onClose()}}
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