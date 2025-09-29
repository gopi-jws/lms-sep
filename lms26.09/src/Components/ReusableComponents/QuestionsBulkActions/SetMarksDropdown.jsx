// SetMarksDropdown.js
import React from "react";
import PropTypes from 'prop-types';

const SetMarksDropdown = ({ onMarksChange }) => {
    const marksOptions = [1, 2, 3, 4, 5];

    return (
        <div className="change-section-dropdown">
            <p className="dropdown-heading">Set Marks</p>
            <ul className="dropdown-options-list">
                {marksOptions.map((marks) => (
                    <li
                        key={marks}
                        className="dropdown-option"
                        onClick={() => onMarksChange(marks)}
                    >
                        {marks} Mark{marks !== 1 ? 's' : ''}
                    </li>
                ))}
            </ul>
        </div>
    );
};

SetMarksDropdown.propTypes = {
    onMarksChange: PropTypes.func.isRequired,
};

export default SetMarksDropdown;