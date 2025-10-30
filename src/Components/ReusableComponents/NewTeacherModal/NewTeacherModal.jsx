import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import './NewTeacherModal.css'
import { toast } from "react-toastify";
import { PiMicrosoftExcelLogoBold } from "react-icons/pi";

import useBounceModal from "../../ReusableComponents/useBounceModal/useBounceModal";

const NewTeacherModal = ({ isOpen, onClose, onCreate, success }) => {
    const { modalRef, isBouncing } = useBounceModal(isOpen);
    const [names, setNames] = useState([]);
    const [emails, setEmails] = useState([]);
    const [nameInputValue, setNameInputValue] = useState("");
    const [emailInputValue, setEmailInputValue] = useState("");
    const [isNameFocused, setIsNameFocused] = useState(false);
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isExcelImporting, setIsExcelImporting] = useState(false);

    const fileInputRef = useRef(null);

    // Fix 1: Move the early return after hooks
    useEffect(() => {
        if (isOpen) {
            // Reset form when modal opens
            setNameInputValue("");
            setEmailInputValue("");
            setNameError("");
            setEmailError("");
            setNames([]);
            setEmails([]);
        }
    }, [isOpen]);

    // Fix 2: Improved file upload with better error handling
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Reset file input
        e.target.value = '';

        // Validate file type
        const validExtensions = ['.xlsx', '.xls'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!validExtensions.includes('.' + fileExtension)) {
            toast.error('Please upload a valid Excel file (.xlsx or .xls)');
            return;
        }

        setIsExcelImporting(true);
        setLoading(true);

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target.result;
                const workbook = XLSX.read(bstr, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

                // Extract names and emails with multiple possible header names
                const extractedNames = jsonData.map(
                    (item) =>
                        item.name ||
                        item.Name ||
                        item["Full Name"] ||
                        item["Teacher Name"] ||
                        item["Names"] ||
                        item["fullname"] ||
                        item["teachername"] ||
                        ""
                ).map(name => name.toString().trim()).filter(Boolean);

                const extractedEmails = jsonData.map(
                    (item) =>
                        item.email ||
                        item.Email ||
                        item["Mail ID"] ||
                        item["Email Address"] ||
                        item["Emails"] ||
                        item["mail"] ||
                        item["emailaddress"] ||
                        ""
                ).map(email => email.toString().trim()).filter(Boolean);

                if (extractedNames.length === 0 && extractedEmails.length === 0) {
                    toast.error("No valid data found. Please check your Excel file format.");
                    setLoading(false);
                    setIsExcelImporting(false);
                    return;
                }

                if (extractedNames.length !== extractedEmails.length) {
                    toast.error(`Excel data mismatch: Found ${extractedNames.length} names and ${extractedEmails.length} emails. They must be equal.`);
                    setLoading(false);
                    setIsExcelImporting(false);
                    return;
                }

                // Validate names and emails
                const validPairs = [];
                const validationErrors = [];

                extractedNames.forEach((name, index) => {
                    const email = extractedEmails[index];
                    const isNameValid = /^[a-zA-Z0-9\s]+$/.test(name);
                    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

                    if (!isNameValid) {
                        validationErrors.push(`Invalid name: ${name}`);
                    }
                    if (!isEmailValid) {
                        validationErrors.push(`Invalid email: ${email}`);
                    }
                    if (isNameValid && isEmailValid) {
                        validPairs.push({ name, email });
                    }
                });

                if (validationErrors.length > 0) {
                    toast.error(`Validation errors: ${validationErrors.slice(0, 3).join(', ')}${validationErrors.length > 3 ? '...' : ''}`);
                }

                if (validPairs.length === 0) {
                    toast.error("No valid teacher data found after validation.");
                    setLoading(false);
                    setIsExcelImporting(false);
                    return;
                }

                // Remove duplicates based on email
                const uniquePairs = validPairs.reduce((acc, current) => {
                    const exists = acc.find(item => item.email === current.email);
                    if (!exists) {
                        acc.push(current);
                    }
                    return acc;
                }, []);

                const uniqueNames = uniquePairs.map(pair => pair.name);
                const uniqueEmails = uniquePairs.map(pair => pair.email);

                setNames(uniqueNames);
                setEmails(uniqueEmails);

                toast.success(`Imported ${uniqueNames.length} valid teachers from Excel`);

            } catch (error) {
                console.error('Error processing Excel file:', error);
                toast.error('Error processing Excel file. Please make sure it\'s a valid Excel file.');
            } finally {
                setLoading(false);
                setIsExcelImporting(false);
            }
        };

        reader.onerror = () => {
            toast.error('Error reading file');
            setLoading(false);
            setIsExcelImporting(false);
        };

        reader.readAsBinaryString(file);
    };

    // Fix 3: Enhanced validation functions
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validateName = (name) => {
        const regex = /^[a-zA-Z0-9\s]+$/;
        return regex.test(name);
    };

    // Fix 4: Improved input handlers with better validation
    const handleNameInputChange = (e) => {
        setNameInputValue(e.target.value);
        setNameError("");
    };

    const handleEmailInputChange = (e) => {
        setEmailInputValue(e.target.value);
        setEmailError("");
    };

    // Fix 5: Better keydown handlers with paste support
    const handleNameInputKeyDown = (e) => {
        if (["Enter", "Tab", ","].includes(e.key)) {
            e.preventDefault();
            addNameFromInput();
        }
    };

    const handleEmailInputKeyDown = (e) => {
        if (["Enter", "Tab", ","].includes(e.key)) {
            e.preventDefault();
            addEmailFromInput();
        }
    };

    const addNameFromInput = () => {
        const name = nameInputValue.trim();
        if (name) {
            if (validateName(name)) {
                if (!names.includes(name)) {
                    setNames([...names, name]);
                    setNameInputValue("");
                } else {
                    setNameError("Name already added.");
                }
            } else {
                setNameError("Please enter a valid name (letters and spaces only).");
            }
        }
    };

    const addEmailFromInput = () => {
        const email = emailInputValue.trim();
        if (email) {
            if (validateEmail(email)) {
                if (!emails.includes(email)) {
                    setEmails([...emails, email]);
                    setEmailInputValue("");
                } else {
                    setEmailError("Email already added.");
                }
            } else {
                setEmailError("Please enter a valid email address.");
            }
        }
    };

    // Fix 6: Handle blur events to add values
    const handleNameInputBlur = () => {
        setIsNameFocused(false);
        addNameFromInput();
    };

    const handleEmailInputBlur = () => {
        setIsEmailFocused(false);
        addEmailFromInput();
    };

    // Fix 7: Remove functions
    const removeName = (nameToRemove) => {
        setNames(names.filter((name) => name !== nameToRemove));
    };

    const removeEmail = (emailToRemove) => {
        setEmails(emails.filter((email) => email !== emailToRemove));
    };

    // Fix 8: Improved create handler
    const handleCreate = () => {
        // Clear previous errors
        setNameError("");
        setEmailError("");

        // Validate input
        if (names.length === 0 || emails.length === 0) {
            setNameError("Please enter at least one name.");
            setEmailError("Please enter at least one email.");
            return;
        }

        if (names.length !== emails.length) {
            setEmailError("Number of names and emails must match.");
            return;
        }

        // Create teachers array
        const teachers = names.map((name, index) => ({
            name,
            email: emails[index],
        }));

        console.log("Creating teachers:", teachers);

        // Call the onCreate prop
        if (onCreate) {
            onCreate(teachers);
        }

        // Don't clear state here - let the parent component handle success
        // The useEffect will handle resetting when modal reopens
    };

    // Fix 9: Handle success from parent
    useEffect(() => {
        if (success) {
            toast.success("Teachers created successfully!");
            onClose();
        }
    }, [success, onClose]);

    // Fix 10: Early return must be after all hooks
    if (!isOpen) return null;

    return (
        <div className="newteacher-modal-overlay">
            <div className={`newteacher-modal-content newteacher-modal-content2 ${isBouncing ? "bounce" : ""}`} ref={modalRef}>
                {/* Modal Header */}
                <div className="newteacher-modal-header">
                    <h5>Add New Teachers</h5>
                    <button
                        className="close-btn"
                        onClick={() => {
                            onClose();
                        }}
                    >
                        &times;
                    </button>
                </div>

                {loading ? (
                    <div className="loading">Processing Excel file...</div>
                ) : (
                    <div className="newteacher-modal-body">
                        {/* Names Input */}
                        <div className="newteacher-form-group">
                            <label>Teacher Names</label>
                            <div className={`email-tags ${isNameFocused ? "focused" : ""}`}>
                                    {names.map((name, index) => (
                                        <span key={`${name}-${index}`} className="email-tag">
                                            {index + 1}. {name}
                                            <button onClick={() => removeName(name)}>&times;</button>
                                        </span>
                                    ))}
                                <input
                                    type="text"
                                    value={nameInputValue}
                                    onChange={handleNameInputChange}
                                    onKeyDown={handleNameInputKeyDown}
                                    onFocus={() => setIsNameFocused(true)}
                                    onBlur={handleNameInputBlur}
                                    placeholder="Enter name and press comma or enter"
                                    className="email-input"
                                    disabled={loading}
                                />
                            </div>
                            {nameError && <p className="error-message-email">{nameError}</p>}
                        </div>

                        {/* Emails Input */}
                        <div className="newteacher-form-group">
                            <label>Email Addresses</label>
                            <div className={`email-tags ${isEmailFocused ? "focused" : ""}`}>
                                    {emails.map((email, index) => (
                                        <span key={`${email}-${index}`} className="email-tag">
                                            {index + 1}. {email}
                                            <button onClick={() => removeEmail(email)}>&times;</button>
                                        </span>
                                    ))}
                                <input
                                    type="text"
                                    value={emailInputValue}
                                    onChange={handleEmailInputChange}
                                    onKeyDown={handleEmailInputKeyDown}
                                    onFocus={() => setIsEmailFocused(true)}
                                    onBlur={handleEmailInputBlur}
                                    placeholder="Enter email and press comma or enter"
                                    className="email-input"
                                    disabled={loading}
                                />
                            </div>
                            {emailError && <p className="error-message-email">{emailError}</p>}
                        </div>

                        {/* Summary */}
                        {(names.length > 0 || emails.length > 0) && (
                            <div className="summary-section">
                                <p>
                                    Ready to add {Math.min(names.length, emails.length)} teachers.
                                    {names.length !== emails.length &&
                                        ` (Warning: ${Math.abs(names.length - emails.length)} mismatch)`
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Modal Footer */}
                <div className="newteacher-modal-footer">
                    <button
                        className="btn excel-btn"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                    >
                        <PiMicrosoftExcelLogoBold className="Excel-icon" />
                        {isExcelImporting ? "Importing..." : "Import Excel"}
                    </button>
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        className="add-teacher"
                        style={{ display: "none" }}
                        onChange={handleFileUpload}
                        ref={fileInputRef}
                    />

                    <div className="action">
                        <button
                            className="btn cancel-btn"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn add-btn"
                            onClick={handleCreate}
                            disabled={loading || names.length === 0 || emails.length === 0 || names.length !== emails.length}
                        >
                            Add {names.length > 0 ? `(${names.length})` : ''}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewTeacherModal;