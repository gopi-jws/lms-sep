"use client";
import  { useState, useEffect ,useRef} from "react";
import Select from 'react-select';
import "./MCQModal.css";
import { FaPlus } from "react-icons/fa";
import 'katex/dist/katex.min.css';
import { FaListUl, FaListOl, FaTable, FaUndo, FaRedo } from 'react-icons/fa';
import QuestionEditor from "../../Markdown/QuestionEditor";
import useBounceModal from "../../../ReusableComponents/useBounceModal/useBounceModal";
import React from "react";


const MCQModal = ({ open, onClose, initialData, }) => {
    const { modalRef, isBouncing } = useBounceModal(open);
    const [questionTitle, setQuestionTitle] = useState(initialData?.questionTitle || "");
    const [answers, setAnswers] = useState(initialData?.answers || [{ text: "", image: null }]);
    const [correctAnswers, setCorrectAnswers] = useState(initialData?.correctAnswers || []);
    const [isCodeEnabled, setIsCodeEnabled] = useState(initialData?.isCodeEnabled ?? false);
    const [isLaTeXEnabled, setIsLaTeXEnabled] = useState(initialData?.isLaTeXEnabled ?? false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [questionImages, setQuestionImages] = useState(initialData?.questionImages || []);
    const [solutionText, setSolutionText] = useState(initialData?.solutionText || "");
    const [solutionImage, setSolutionImage] = useState(initialData?.solutionImage || null);

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

    // Prepare options for react-select
    const answerOptions = answers.map((answer, index) => ({
        value: `answer${index + 1}`,
        label: `Option ${index + 1}: ${answer?.text?.substring(0, 30) || ''}${answer?.text?.length > 30 ? '...' : ''}`
    }));

    // Refs for textareas
    const questionRef = useRef(null);
    const answerRefs = useRef([]);
    const solutionRef = useRef(null);

    const handleAutoResize = (textarea) => {
        if (!textarea) return;
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
    };

    // When component mounts or updates, adjust all
    useEffect(() => {
        handleAutoResize(questionRef.current);
        answerRefs.current.forEach((ref) => ref && handleAutoResize(ref));
        handleAutoResize(solutionRef.current);
    }, [questionTitle, answers, solutionText]);

    // Handle initial data when modal opens
    useEffect(() => {
        if (open && initialData) {
            setQuestionTitle(initialData.questionTitle || "");
            const initialQuestionImages = initialData.questionImages
                ? Array.isArray(initialData.questionImages)
                    ? initialData.questionImages
                    : [initialData.questionImages]
                : [];
            setQuestionImages(initialQuestionImages);
            setAnswers(initialData.answers || [{ text: "", image: null }]);
            setCorrectAnswers(initialData.correctAnswers || []);
            setIsCodeEnabled(initialData.isCodeEnabled ?? false);
            setIsLaTeXEnabled(initialData.isLaTeXEnabled ?? false);
            setSolutionText(initialData.solutionText || "");
            setSolutionImage(initialData.solutionImage || null);

            // Initialize history
            setHistory({
                question: [initialData.questionTitle || ""],
                solution: [initialData.solutionText || ""],
                answers: initialData.answers ? [initialData.answers] : [[{ text: "", image: null }]]
            });
            setHistoryIndex({
                question: 0,
                solution: 0,
                answers: 0
            });
        } else if (open) {
            // Reset for new question
            setQuestionTitle("");
            setQuestionImages([]);
            setAnswers([{ text: "", image: null }]);
            setCorrectAnswers([]);
            setIsCodeEnabled(false);
            setIsLaTeXEnabled(false);
            setSolutionText("");
            setSolutionImage(null);
            setSelectedField(null);
            setSelectedText("");
            setSelectionStart(0);
            setSelectionEnd(0);

            // Reset history
            setHistory({
                question: [""],
                solution: [""],
                answers: [[{ text: "", image: null }]]
            });
            setHistoryIndex({
                question: 0,
                solution: 0,
                answers: 0
            });
        }
    }, [open, initialData]);

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
        } else if (field === 'solution') {
            currentValue = solutionText;
            setValue = (val) => {
                setSolutionText(val);
                saveToHistory('solution', val);
            };
            textarea = solutionRef.current;
            historyField = 'solution';
        } else if (field === 'answer' && index !== null) {
            currentValue = answers[index]?.text || "";
            setValue = (val) => {
                const updatedAnswers = [...answers];
                updatedAnswers[index].text = val;
                setAnswers(updatedAnswers);
                saveToHistory('answers', updatedAnswers);
            };
            textarea = answerRefs.current[index];
            historyField = 'answers';
        } else {
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

    const handleRemoveQuestionImage = (indexToRemove) => {
        setQuestionImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleCorrectAnswersChange = (selectedOptions) => {
        setCorrectAnswers(selectedOptions ? selectedOptions.map(option => option.value) : []);
    };

    const selectedCorrectAnswers = answerOptions.filter(option =>
        correctAnswers.includes(option.value)
    );

    const handleCodeToggle = () => {
        const textarea = questionRef.current;
        if (!textarea) return;

        console.log("textarea :" + textarea);


        const cursorStart = textarea.selectionStart;
        const cursorEnd = textarea.selectionEnd;

        console.log("cursorStart :" + cursorStart);
        console.log("cursorEnd :" + cursorEnd);

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

    const handleLaTeXToggle = () => {
        setIsLaTeXEnabled(!isLaTeXEnabled);
    };

    const addAnswerField = () => {
        if (answers.length < 10) {
            const newAnswers = [...answers, { text: "", image: null }];
            setAnswers(newAnswers);
            saveToHistory('answers', newAnswers);
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
        const updatedAnswers = [...answers];

        if (field === "text") {
            let processedValue = value;
            if (isLaTeXEnabled) {
                processedValue = cleanLatexInput(value);
            }
            updatedAnswers[index][field] = processedValue;
        } else {
            updatedAnswers[index][field] = value;
        }

        setAnswers(updatedAnswers);
        saveToHistory('answers', updatedAnswers);
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
                const updatedAnswers = [...answers];
                updatedAnswers[index].image = reader.result;
                setAnswers(updatedAnswers);
                saveToHistory('answers', updatedAnswers);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (index) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index].image = null;
        setAnswers(updatedAnswers);
        saveToHistory('answers', updatedAnswers);
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
        if (answers.length > 1) {
            const updatedAnswers = answers.filter((_, i) => i !== index);
            setAnswers(updatedAnswers);
            saveToHistory('answers', updatedAnswers);

            // Update correct answers
            const removedAnswerId = `answer${index + 1}`;
            const updatedCorrectAnswers = correctAnswers
                .filter(id => id !== removedAnswerId)
                .map(id => {
                    const answerNum = parseInt(id.replace("answer", ""));
                    if (answerNum > index + 1) {
                        return `answer${answerNum - 1}`;
                    }
                    return id;
                });

            setCorrectAnswers(updatedCorrectAnswers);
        }
    };

    const handleSubmit = async () => {
        if (!questionTitle.trim()) {
            alert("Please enter a question");
            return;
        }

        const hasEmptyAnswers = answers.some(answer => !answer.text?.trim());
        if (hasEmptyAnswers) {
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
                questionImages,
                answers,
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

    if (!open) return null;

    return (
        <div className="mcq-modal-overlay">
            <div ref={modalRef} className={`mcq-modal-content ${isBouncing ? "bounce" : ""}`}>
                {/* Main Header */}
                <div className="mcq-modal-header">
                    <h5>{initialData ? "Edit MAQ Question" : "Add MAQ Question"}</h5>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                {/* Body */}
                <div className="mcq-modal-body">
                    <div className="modal-mcq-row">
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
                                <hr />

                                {/* Answer Options */}
                                {answers.map((answer, index) => (
                                    <div className="option" key={index}>

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
                                        </div>

                                        <div className="option-contanier">
                                            <textarea
                                                ref={(el) => {
                                                    answerRefs.current[index] = el;
                                                    if (el) handleAutoResize(el);
                                                }}
                                                className="qtn-textarea qtn-textarea-option"
                                                value={answer.text || ""}
                                                onChange={(e) => {
                                                    handleAnswerChange(index, "text", e.target.value);
                                                    handleAutoResize(e.target);
                                                }}
                                                placeholder="Enter option text..."
                                                disabled={isSubmitting}
                                            />

                                            <div className="image-box">
                                                <div
                                                    className="upload-box"
                                                    onClick={() => document.querySelector(`.option-image-upload-${index}`).click()}
                                                >
                                                    {!answer.image ? (
                                                        <div className="upload-placeholder">
                                                            <label className="upload-label">Upload Image</label>
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
                                                                    e.stopPropagation();
                                                                    handleRemoveImage(index);
                                                                }}
                                                                disabled={isSubmitting}
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
                                    </div>
                                ))}

                                {answers.length < 10 ? (
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

                                {/* Correct Answers */}
                                <div className="mcq-form-group">
                                    <label>Correct Answer(s)</label>
                                    <Select
                                        isMulti
                                        isClearable={false}
                                        options={answerOptions}
                                        value={selectedCorrectAnswers}
                                        onChange={handleCorrectAnswersChange}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        placeholder="Select correct Option(s)..."
                                        isDisabled={isSubmitting || answers.length === 0}
                                        closeMenuOnSelect={false}
                                        hideSelectedOptions={false}
                                        noOptionsMessage={() => "No options available"}
                                    />
                                </div>

                                <hr />

                                <label className="editing-option">Solution</label>
                                <textarea
                                    ref={solutionRef}
                                    className="qtn-textarea"
                                    value={solutionText}
                                    onChange={(e) => {
                                        setSolutionText(e.target.value);
                                        handleAutoResize(e.target);
                                        saveToHistory('solution', e.target.value);
                                    }}
                                    //onSelect={handleTextSelection('solution')}
                                    onKeyDown={(e) => handleKeyDown('solution', e)}
                                    placeholder="Enter solution text..."
                                    disabled={isSubmitting}
                                />

                                {/* Solution Image */}
                                <div className="image-box">
                                    <div
                                        className="upload-box"
                                        onClick={() => document.querySelector(`#solution-image-upload`).click()}
                                    >
                                        {!solutionImage ? (
                                            <div className="upload-placeholder">
                                                <label className="upload-label">Upload Image</label>
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
                                <hr />

                                {/* Preview Options */}
                                <div className="preview-answers">
                                    <div className="editing-option">Options:</div>
                                    <div className="answers-list">
                                        {answers.map((answer, index) => (
                                            <div
                                                className={`answer-item ${correctAnswers.includes(`answer${index + 1}`) ? 'correct-answer' : ''}`}
                                                key={index}
                                            >
                                                <div className="answer-header">
                                                    {correctAnswers.includes(`answer${index + 1}`) && (
                                                        <span className="correct-badge">Correct</span>
                                                    )}
                                                </div>
                                                <div className="answer-content">
                                                    <QuestionEditor
                                                        content={answer.text?.trim() || ""}
                                                    />
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

                                {/* Preview Solution */}
                                <div className="preview-solution">
                                    <div className="editing-option">Solution:</div>
                                    <div className="modal-preview-content">
                                        {solutionText.length === 0 ? (
                                            <span className="placeholder-text">No solution provided</span>
                                        ) : (
                                            <QuestionEditor
                                                content={solutionText}
                                            />
                                        )}
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

                {/* Footer */}
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

export default MCQModal;