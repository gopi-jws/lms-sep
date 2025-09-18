"use client";

import React from "react";
import PropTypes from 'prop-types';
import { FaCheck } from "react-icons/fa";
import './ChangeSectionDropdown.css'; // Assuming you have a CSS file for styles
import useOutsideClick from '../../../hooks/useOutsideClick'; // adjust path

const ChangeSectionDropdown = ({
    selectedRows = [],
    onSectionChange,
    existingSections = []
}) => {
    // Default sections + any existing unique sections from the data
    const defaultSections = ["Section A", "Section B", "Section C"];
    const allSections = [...new Set([...defaultSections, ...existingSections])];
    const sectionColors = [
        "#f87171", // red-400
        "#60a5fa", // blue-400
        "#34d399", // green-400
        "#fbbf24", // yellow-400
        "#a78bfa", // purple-400
        "#f472b6", // pink-400
    ];
    
    const getColorDot = (index) => {
        return sectionColors[index % sectionColors.length];
    };

    const handleSectionSelect = (section) => {
        if (!selectedRows.length) return;
        onSectionChange(selectedRows, section);
    };

    return (
        <div className="change-section-dropdown" ref={dropdownRef}>
            <p className="dropdown-heading">Change Section</p>
            <ul className="dropdown-options-list">
                {allSections.map((section, index) => (
                    <li
                        key={section}
                        className="dropdown-option"
                        onClick={() => handleSectionSelect(section)}
                    >
                        <span
                            className="color-dot"
                            style={{ backgroundColor: getColorDot(index) }}
                        ></span>
                        {section}
                    </li>
                ))}

            </ul>
            <p className="dropdown-footer">Create New Section</p>
        </div>
    );
};

ChangeSectionDropdown.propTypes = {
    selectedRows: PropTypes.array.isRequired,
    onSectionChange: PropTypes.func.isRequired,
    existingSections: PropTypes.array,
};

export default ChangeSectionDropdown;