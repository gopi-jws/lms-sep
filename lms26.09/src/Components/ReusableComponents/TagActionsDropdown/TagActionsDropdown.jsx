"use client";

import React, { useRef, useEffect } from "react";
import './TagActionsDropdown.css';

const TagActionsDropdown = ({
    isOpen,
    onEdit,
    onRemove,
    onClose,
    tagId,
    tagName,
    tagColor,
    mode,
}) => {
    const dropdownRef = useRef(null);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleEditClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onEdit({ name: tagName, color: tagColor, id: tagId });
        onClose();
    };

    const handleRemoveClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onRemove({ name: tagName, color: tagColor, id: tagId });
        onClose(); // optional, if you also want to close dropdown
    };

    const handleDescAndInstr = (e) =>{
        e.preventDefault();
        e.stopPropagation();
        onEdit();
        onClose();
    }

    if (!isOpen) return null;
    

    return (
        <div className={`${mode == "desc" || mode == "instr" ? "des-options" :"tag-rename-options"}`} ref={dropdownRef}>
            {mode == "desc" || mode == "instr" ? (
                <ul className="tag-list-dropdown">
                    <li
                        className="testquestionadd-dropdown-item testquestionadd-dropdown-item2"
                        onClick={handleDescAndInstr}
                    >
                        Edit
                    </li>
                </ul >
            ) : (
                <ul className="tag-list-dropdown">
                <li
                    className="testquestionadd-dropdown-item testquestionadd-dropdown-item2"
                    onClick={handleEditClick}
                >
                    Edit
                </li>
                <li
                    className="testquestionadd-dropdown-item"
                    onClick={handleRemoveClick}
                >
                    Remove
                </li>
            </ul >
            )}

        </div>
    );
};

export default TagActionsDropdown;