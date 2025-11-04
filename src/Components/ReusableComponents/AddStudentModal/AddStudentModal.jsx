import React, { useState, useRef, useEffect } from "react";
import "./AddStudentModal.css";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import useBounceModal from "../../ReusableComponents/useBounceModal/useBounceModal";
import { PiMicrosoftExcelLogoBold } from "react-icons/pi";
import { useLocation } from "react-router-dom";

const AddStudentModal = ({ isOpen, onClose, onSave, success }) => {
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
  const Location = useLocation();
  const ClassId = Location.state.classId;

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
              item["Student Name"] ||
              item["Names"] ||
              item["fullname"] ||
              item["studentname"] ||
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
          toast.error("No valid student data found.");
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
          `Imported ${validPairs.length} students. Total unique: ${uniquePairs.length}`
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

    const students = names.map((name, i) => ({ name, email: emails[i] }));
    if (onSave) onSave(students);
  };

  useEffect(() => {
    if (success) {
      toast.success("Students imported successfully!");
      onClose();
    }
  }, [success, onClose]);

  if (!isOpen) return null;

  return (
    <div className="new-student-modal-overlay">
      <div
        className={`new-student-modal-content new-student-modal-content2 ${isBouncing ? "bounce" : ""
          }`}
        ref={modalRef}
      >
        <div className="new-student-modal-header">
          <h5>Add Student</h5>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="new-student-modal-body">
          {/* Name Input */}
          <div className="new-student-form-group">
            <label>Student Names</label>
            <div className="email-tags">
              {names.map((name, index) => (
                <span key={index} className="email-tag">
                  {name}
                  <button type="button" onClick={() => removeName(name)}>
                    &times;
                  </button>
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

          {/* Email Input */}
          <div className="new-student-form-group">
            <label>Email Addresses</label>
            <div className="email-tags">
              {emails.map((email, index) => (
                <span key={index} className="email-tag">
                  {email}
                  <button type="button" onClick={() => removeEmail(email)}>
                    &times;
                  </button>
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

        {/* Footer */}
        <div className={`new-student-modal-footer ${ClassId === "1" ? "showExcelButton" : ""}`}>
          {ClassId === "1" && (
            <button
              className="btn excel-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              <PiMicrosoftExcelLogoBold className="Excel-icon" />
              {isExcelImporting ? "Importing..." : "Bulk Students"}
            </button>
          )}
          <input
            type="file"
            accept=".xlsx,.xls"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <div className="action">
            <button className="btn" onClick={onClose}>
              Close
            </button>
            <button
              className="btn create-btn"
              onClick={handleCreate}
              disabled={
                loading ||
                names.length === 0 ||
                emails.length === 0 ||
                names.length !== emails.length
              }
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;
