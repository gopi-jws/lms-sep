import React, { useState } from "react";
import * as XLSX from "xlsx";
import './NewTeacherModal.css'
import { toast } from "react-toastify";
import { PiMicrosoftExcelLogoBold } from "react-icons/pi";

import useBounceModal from "../../ReusableComponents/useBounceModal/useBounceModal"; // Import the custom hook

const NewTeacherModal = ({ isOpen, onClose, onCreate, success }) => {

    const { modalRef, isBouncing } = useBounceModal(isOpen); // Corrected line
    const [names, setNames] = useState([]); // State to store name tags
    const [emails, setEmails] = useState([]); // State to store email tags
    const [nameInputValue, setNameInputValue] = useState(""); // State for the name input field
    const [emailInputValue, setEmailInputValue] = useState(""); // State for the email input field
    const [isNameFocused, setIsNameFocused] = useState(false); // State to track name input focus
    const [isEmailFocused, setIsEmailFocused] = useState(false); // State to track email input focus
    const [nameError, setNameError] = useState(""); // State for name validation error
    const [emailError, setEmailError] = useState(""); // State for email validation error
    const [data, setData] = useState([]); // excel data stored
    const [loading, setLoading] = useState(false);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const workbook = XLSX.read(bstr, { type: "binary" });
            const sheetName = workbook.SheetNames[0]; // first sheet
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
            // defval ensures empty cells are not undefined
            setData(jsonData);
        };
        reader.readAsBinaryString(file);
        onClose();
        success();
    };

    // Validate email format
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Validate name format (alphanumeric with spaces)
    const validateName = (name) => {
        const regex = /^[a-zA-Z\s]+$/;
        return regex.test(name);
    };

    // Handle name input change
    const handleNameInputChange = (e) => {
        setNameInputValue(e.target.value);
        setNameError(""); // Clear error on input change
    };

    // Handle email input change
    const handleEmailInputChange = (e) => {
        setEmailInputValue(e.target.value);
        setEmailError(""); // Clear error on input change
    };

    // Handle name input keydown (e.g., comma, space, or enter to add name)
    const handleNameInputKeyDown = (e) => {
        if (["Enter", "Tab", ",", " "].includes(e.key)) {
            e.preventDefault();
            const name = nameInputValue.trim();

            if (name && validateName(name)) {
                if (!names.includes(name)) {
                    setNames([...names, name]); // Add name to the list
                    setNameInputValue(""); // Clear input field
                } else {
                    setNameError("Name already added.");
                }
            } else {
                setNameError("Please enter a valid name (letters and spaces only).");
            }
        }
    };

    // Handle email input keydown (e.g., comma, space, or enter to add email)
    const handleEmailInputKeyDown = (e) => {
        if (["Enter", "Tab", ",", " "].includes(e.key)) {
            e.preventDefault();
            const email = emailInputValue.trim();

            if (email && validateEmail(email)) {
                if (!emails.includes(email)) {
                    setEmails([...emails, email]); // Add email to the list
                    setEmailInputValue(""); // Clear input field
                } else {
                    setEmailError("Email already added.");
                }
            } else {
                setEmailError("Please enter a valid email address.");
            }
        }
    };

    // Remove a name from the list
    const removeName = (nameToRemove) => {
        setNames(names.filter((name) => name !== nameToRemove));
    };

    // Remove an email from the list
    const removeEmail = (emailToRemove) => {
        setEmails(emails.filter((email) => email !== emailToRemove));
    };

    // Handle name input focus
    const handleNameInputFocus = () => {
        setIsNameFocused(true);
    };

    // Handle name input blur
    const handleNameInputBlur = () => {
        setIsNameFocused(false);
    };

    // Handle email input focus
    const handleEmailInputFocus = () => {
        setIsEmailFocused(true);
    };

    // Handle email input blur
    const handleEmailInputBlur = () => {
        setIsEmailFocused(false);
    };

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
            setEmailError("Each name must have exactly one email.");
            return;
        }

        // Call the onCreate function with the names and emails
        const teachers = names.map((name, index) => ({
            name,
            email: emails[index],
        }));
        onCreate(teachers);

        // Clear the input and close the modal
        setNames([]);
        setEmails([]);
        setNameInputValue("");
        setEmailInputValue("");
        onClose();
    };

    if (!isOpen) return null; // Don't render the modal if it's not open

    return (
        <div className="newteacher-modal-overlay">
            <div className={`newteacher-modal-content newteacher-modal-content2 ${isBouncing ? "bounce" : ""}`} ref={modalRef}>
                {/* Modal Header */}
                <div className="newteacher-modal-header">
                    <h5>Add New Teachers</h5>
                    <button className="close-btn" onClick={() => { onClose(); setNameInputValue(""); setEmailInputValue(""); }}>
                        &times;
                    </button>
                </div>

                {loading ? (
                    <div className="loading">Loading Excel...</div>
                ) : (
                    <div className="newteacher-modal-body">

                        {/* 🔹 Names Input */}
                        <div className="newteacher-form-group">
                            <div className={`email-tags ${isNameFocused ? "focused" : ""}`}>
                                {names.map((name, index) => (
                                    <span key={index} className="email-tag">
                                        {index + 1}. {name}
                                        <button onClick={() => removeName(name)}>&times;</button>
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    value={nameInputValue}
                                    onChange={handleNameInputChange}
                                    onFocus={handleNameInputFocus}
                                    onBlur={handleNameInputBlur}
                                    placeholder="Name separated by comma & space"
                                    className="email-input"
                                />
                            </div>
                            {nameError && <p className="error-message-email">{nameError}</p>}
                        </div>

                        {/* 🔹 Emails Input */}
                        <div className="newteacher-form-group">
                            <div className={`email-tags ${isEmailFocused ? "focused" : ""}`}>
                                {emails.map((email, index) => (
                                    <span key={index} className="email-tag">
                                        {index + 1}. {email}
                                        <button onClick={() => removeEmail(email)}>&times;</button>
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    value={emailInputValue}
                                    onChange={handleEmailInputChange}
                                    onFocus={handleEmailInputFocus}
                                    onBlur={handleEmailInputBlur}
                                    placeholder="Email Address separated by comma & space"
                                    className="email-input"
                                />
                            </div>
                            {emailError && <p className="error-message-email">{emailError}</p>}
                        </div>
                    </div>
                )}

                {/* Modal Footer */}
                <div className="newteacher-modal-footer">
                    
                    <button className="btn" onClick={() => document.querySelector(".add-teacher").click()}>
                        <PiMicrosoftExcelLogoBold className="Excel-icon"/> Import Excel</button>
                    <input type="file" accept=".xlsx, .xls" className="add-teacher" style={{display:"none"}} onChange={handleFileUpload} />

                    <div className="action">
                        <button className="btn" onClick={() => { onClose(); setNameInputValue(""); setEmailInputValue(""); }}>
                            Cancel
                        </button>
                        <button className="btn" onClick={handleCreate}>
                            Add
                        </button>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default NewTeacherModal;