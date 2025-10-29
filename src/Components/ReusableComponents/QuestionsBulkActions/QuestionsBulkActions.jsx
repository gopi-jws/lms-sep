"use client";

import React, { useState, useRef, useEffect } from "react";
import { Trash2 } from "lucide-react";

import PropTypes from 'prop-types';
import ChangeSectionDropdown from "./ChangeSectionDropdown";
import SetMarksDropdown from "./SetMarksDropdown";
import { MdOutlineBookmark } from "react-icons/md"; // Material Design example
const QuestionsBulkActions = ({
    selectedRows = [],
    onDelete = () => console.warn("Delete functionality not implemented"),
    onChangeSection = () => console.warn("Change section functionality not implemented"),
    onSetMarks = () => console.warn("Set marks functionality not implemented"),
    existingSections = []
}) => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = (dropdownName) => {
        setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    };

    if (!selectedRows.length) return null;

    return (
        <div className="tube-bulk-actions-container" ref={dropdownRef}>
            <div className="tube-bulk-actions">
                {/* Delete Button */}
                <div className="tube-bulk-button">
                    <button
                        className="tube-action-button"
                        data-tooltip="Delete"
                        onClick={() => onDelete(selectedRows)}
                    >
                        <Trash2 size={18} />
                    </button>
                </div>

                <div className="tube-divider" />

                {/* Change Section Button */}
                <div className="tube-bulk-button">
                    <button
                        className={`tube-action-button dropdown-toggle2 ${activeDropdown === "section" ? "active" : ""}`}
                        onClick={() => toggleDropdown("section")}
                    >
                        Section
                    </button>
                    {activeDropdown === "section" && (
                        <ChangeSectionDropdown
                            selectedRows={selectedRows}
                            onSectionChange={(section) => {
                                onChangeSection(selectedRows, section);
                                setActiveDropdown(null);
                            }}
                            existingSections={existingSections}
                        />
                    )}
                </div>

                <div className="tube-divider" />

                {/* Set Marks Button */}
                <div className="tube-bulk-button">
                    <button
                        className={`tube-action-button dropdown-toggle2 ${activeDropdown === "marks" ? "active" : ""}`}
                        onClick={() => toggleDropdown("marks")}
                        aria-label="Marks"
                    >
                        <span className="set-marks-tube-icon">M</span>
                      
                    </button>

                    {activeDropdown === "marks" && (
                        <SetMarksDropdown
                            onMarksChange={(marks) => {
                                onSetMarks(selectedRows, marks);
                                setActiveDropdown(null);
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

QuestionsBulkActions.propTypes = {
    selectedRows: PropTypes.array.isRequired,
    onDelete: PropTypes.func,
    onChangeSection: PropTypes.func,
    onSetMarks: PropTypes.func,
    existingSections: PropTypes.array,
};

QuestionsBulkActions.defaultProps = {
    onDelete: () => { },
    onChangeSection: () => { },
    onSetMarks: () => { },
    existingSections: [],
};

export default QuestionsBulkActions;