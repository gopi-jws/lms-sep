import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import './NewTeacherModal.css'
import { toast } from "react-toastify";
import { MdCloudUpload, MdCloudDownload } from "react-icons/md";
import useBounceModal from "../../ReusableComponents/useBounceModal/useBounceModal";

const NewTeacherModal = ({ isOpen, onClose, onCreate, success }) => {
    const { modalRef, isBouncing } = useBounceModal(isOpen);
    const [names, setNames] = useState([]);
    const [emails, setEmails] = useState([]);
    const [nameInputValue, setNameInputValue] = useState("");
    const [emailInputValue, setEmailInputValue] = useState("");
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isExcelImporting, setIsExcelImporting] = useState(false);

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setNameInputValue("");
            setEmailInputValue("");
            setNameError("");
            setEmailError("");
            setNames([]);
            setEmails([]);
        }
    }, [isOpen]);

    // ✅ Excel Upload
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        e.target.value = "";

        const validExtensions = [".xlsx", ".xls"];
        const fileExtension = file.name.split(".").pop().toLowerCase();
        if (!validExtensions.includes("." + fileExtension)) {
            toast.error("Please upload a valid Excel file (.xlsx or .xls)");
            return;
        }

        setIsExcelImporting(true);
        setLoading(true);

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target.result;
                const workbook = XLSX.read(bstr, { type: "binary" });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

                const extractedNames = jsonData
                    .map(
                        (item) =>
                            item.name ||
                            item.Name ||
                            item["Full Name"] ||
                            item["Teacher Name"] ||
                            item["Names"] ||
                            item["fullname"] ||
                            item["teachername"] ||
                            ""
                    )
                    .map((name) => name.toString().trim())
                    .filter(Boolean);

                const extractedEmails = jsonData
                    .map(
                        (item) =>
                            item.email ||
                            item.Email ||
                            item["Mail ID"] ||
                            item["Email Address"] ||
                            item["Emails"] ||
                            item["mail"] ||
                            item["emailaddress"] ||
                            ""
                    )
                    .map((email) => email.toString().trim())
                    .filter(Boolean);

                if (extractedNames.length === 0 && extractedEmails.length === 0) {
                    toast.error("No valid data found. Please check Excel format.");
                    setLoading(false);
                    setIsExcelImporting(false);
                    return;
                }

                if (extractedNames.length !== extractedEmails.length) {
                    toast.error(
                        `Mismatch: Found ${extractedNames.length} names and ${extractedEmails.length} emails.`
                    );
                    setLoading(false);
                    setIsExcelImporting(false);
                    return;
                }

                const validPairs = [];
                extractedNames.forEach((name, index) => {
                    const email = extractedEmails[index];
                    const isNameValid = /^[a-zA-Z0-9\s]+$/.test(name);
                    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
                    if (isNameValid && isEmailValid) validPairs.push({ name, email });
                });

                if (validPairs.length === 0) {
                    toast.error("No valid teacher data found.");
                    setLoading(false);
                    setIsExcelImporting(false);
                    return;
                }

                // ✅ Merge Excel + Manual Entries
                const currentPairs = names.map((n, i) => ({
                    name: n,
                    email: emails[i] || "",
                }));

                const allPairs = [...currentPairs, ...validPairs];
                const uniquePairs = [];
                const seenEmails = new Set();

                for (const pair of allPairs) {
                    const emailKey = pair.email.toLowerCase();
                    if (!seenEmails.has(emailKey)) {
                        seenEmails.add(emailKey);
                        uniquePairs.push(pair);
                    }
                }

                setNames(uniquePairs.map((p) => p.name));
                setEmails(uniquePairs.map((p) => p.email));

                toast.success(
                    `Imported ${validPairs.length} Teachers. Total unique: ${uniquePairs.length}`
                );
            } catch (error) {
                console.error("Excel Error:", error);
                toast.error("Error processing Excel file.");
            } finally {
                setLoading(false);
                setIsExcelImporting(false);
            }
        };
        reader.readAsBinaryString(file);
    };

    // ✅ Validation
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validateName = (name) => /^[a-zA-Z0-9\s]+$/.test(name);

    // ✅ Manual Input Handlers
    const handleNameInputChange = (e) => {
        setNameInputValue(e.target.value);
        setNameError("");
    };

    const handleEmailInputChange = (e) => {
        setEmailInputValue(e.target.value);
        setEmailError("");
    };

    const addNameFromInput = () => {
        const name = nameInputValue.trim();
        if (name && validateName(name)) {
            if (!names.includes(name)) setNames([...names, name]);
            else setNameError("Name already added.");
        } else if (name) {
            setNameError("Invalid name format.");
        }
        setNameInputValue("");
    };

    const addEmailFromInput = () => {
        const email = emailInputValue.trim();
        if (email && validateEmail(email)) {
            if (!emails.includes(email)) setEmails([...emails, email]);
            else setEmailError("Email already added.");
        } else if (email) {
            setEmailError("Invalid email format.");
        }
        setEmailInputValue("");
    };

    const handleNameInputBlur = () => addNameFromInput();
    const handleEmailInputBlur = () => addEmailFromInput();

    const removeName = (nameToRemove) => {
        const index = names.indexOf(nameToRemove);
        const newNames = names.filter((n) => n !== nameToRemove);
        const newEmails = emails.filter((_, i) => i !== index);
        setNames(newNames);
        setEmails(newEmails);
    };

    const removeEmail = (emailToRemove) => {
        const index = emails.indexOf(emailToRemove);
        const newEmails = emails.filter((e) => e !== emailToRemove);
        const newNames = names.filter((_, i) => i !== index);
        setEmails(newEmails);
        setNames(newNames);
    };

    const handleCreate = () => {
        setNameError("");
        setEmailError("");

        if (names.length === 0 || emails.length === 0) {
            setNameError("Please enter at least one name and email.");
            return;
        }

        if (names.length !== emails.length) {
            setEmailError("Names and emails count must match.");
            return;
        }

        const teachers = names.map((name, i) => ({ name, email: emails[i] }));
        if (onCreate) onCreate(teachers);
    };

    // ✅ Fixed Download Function
    const handleDownload = async () => {
        const fileUrl = "public\Book1.xlsx";
        const fileName = "Teachers_Template.xlsx";

        try {
            // Check if file exists
            const response = await fetch(fileUrl);
            if (!response.ok) {
                throw new Error('File not found');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Template downloaded successfully!");
        } catch (error) {
            console.error("Download error:", error);
            toast.error("Template file not found. Using dynamic generation...");

            // Fallback to dynamic generation
            createDynamicTemplate();
        }
    };

    const createDynamicTemplate = () => {
        const sampleData = [
            { name: "John Smith", email: "john.smith@school.com" },
            { name: "Sarah Johnson", email: "sarah.johnson@school.com" },
            { name: "Michael Brown", email: "michael.brown@school.com" }
        ];

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(sampleData);

        // Add column headers explicitly
        XLSX.utils.sheet_add_aoa(worksheet, [["name", "email"]], { origin: "A1" });
        XLSX.utils.sheet_add_json(worksheet, sampleData, { origin: "A2", skipHeader: true });

        XLSX.utils.book_append_sheet(workbook, worksheet, "Teachers");

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Teachers_Template.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        if (success) {
            toast.success("Teachers imported successfully!");
            onClose();
        }
    }, [success, onClose]);

    if (!isOpen) return null;

    return (
        <div className="newteacher-modal-overlay">
            <div className={`newteacher-modal-content newteacher-modal-content2 ${isBouncing ? "bounce" : ""}`} ref={modalRef}>
                {/* Modal Header */}
                <div className="newteacher-modal-header">
                    <h5>Add New Teachers</h5>
                    <button
                        className="close-btn"
                        onClick={onClose}
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
                            <div className="email-tags">
                                {names.map((name, index) => (
                                    <span key={`${name}-${index}`} className="email-tag">
                                        {name}
                                        <button onClick={() => removeName(name)}>&times;</button>
                                    </span>
                                ))}
                                {names.length === 0 && (
                                    <input
                                        type="text"
                                        value={nameInputValue}
                                        onChange={handleNameInputChange}
                                        onBlur={handleNameInputBlur}
                                        placeholder="Enter name"
                                        className="email-input"
                                        disabled={loading}
                                    />
                                )}
                            </div>
                            {nameError && <p className="error-message-email">{nameError}</p>}
                        </div>

                        {/* Emails Input */}
                        <div className="newteacher-form-group">
                            <label>Email Addresses</label>
                            <div className="email-tags">
                                {emails.map((email, index) => (
                                    <span key={`${email}-${index}`} className="email-tag">
                                        {email}
                                        <button onClick={() => removeEmail(email)}>&times;</button>
                                    </span>
                                ))}
                                {emails.length === 0 && (
                                    <input
                                        type="text"
                                        value={emailInputValue}
                                        onChange={handleEmailInputChange}
                                        onBlur={handleEmailInputBlur}
                                        placeholder="Enter email"
                                        className="email-input"
                                        disabled={loading}
                                    />
                                )}
                            </div>
                            {emailError && <p className="error-message-email">{emailError}</p>}
                        </div>
                    </div>
                )}

                {/* Modal Footer */}
                <div className="newteacher-modal-footer">
                    <div className="file-utp-dow">
                        <button
                            className="btn btn-colour excel-btn"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={loading}
                        >
                            <MdCloudUpload className="Excel-icon" />
                            {isExcelImporting ? "Importing..." : "Bulk Upload"}
                        </button>
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            className="add-teacher"
                            style={{ display: "none" }}
                            onChange={handleFileUpload}
                            ref={fileInputRef}
                        />

                        <button
                            className="btn btn-colour excel-btn"
                            onClick={handleDownload}
                            disabled={loading}
                        >
                            <MdCloudDownload className="Excel-icon" />
                            Sample Sheet
                        </button>
                    </div>

                    <div className="action">
                        <button
                            className="btn cancel-btn"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn create-btn"
                            onClick={handleCreate}
                            disabled={loading || names.length === 0 || emails.length === 0 || names.length !== emails.length}
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewTeacherModal;