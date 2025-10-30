// SetMarksDropdown.js
import { useState } from 'react';
import React from "react";
import PropTypes from 'prop-types';

const SetMarksDropdown = ({ onMarksChange }) => {
    const [marks, setMarks] = useState("");
    const [negMarks, setNegMarks] = useState("");

    const handleChange = (e) => {
        const value = e.target.value;
        if(e.target.name === "mark"){
            // Allow only numbers with up to 2 decimals
            if (/^\d*\.?\d{0,2}$/.test(value)) {
                setMarks(value);
            }
        }
        else{
            // Allow only numbers with up to 2 decimals
            if (/^\d*\.?\d{0,2}$/.test(value)) {
                setNegMarks(value);
            }
        }
        
    };

    const handleSetMarks = () => {
        onMarksChange();
        console.log("Marks set to:", marks);
        // Add your logic to update marks for selected questions
    };

    return (
        <div className="change-section-dropdown">

            <div className="setMark_item">
                <p>Set Marks</p>
                {/* <ul className="dropdown-options-list">
                {marksOptions.map((marks) => (
                    <li
                        key={marks}
                        className="dropdown-option"
                        onClick={() => onMarksChange(marks)}
                    >
                        {marks} Mark{marks !== 1 ? 's' : ''}
                    </li>
                ))}
            </ul> */}
                <input
                    type="number"
                    id="marks"
                    value={marks}
                    onChange={handleChange}
                    placeholder="Enter marks"
                    className="setMark-input"
                    name="mark"
                />

                <input
                    type="number"
                    id="marks"
                    value={negMarks}
                    onChange={handleChange}
                    placeholder="Enter Neg marks"
                    className="setMark-input"
                    name="negmark"
                />

                <button className='setMark-btn' onClick={handleSetMarks} disabled={!marks}>Set</button>
                
            </div>
           
        </div>
    );
};

SetMarksDropdown.propTypes = {
    onMarksChange: PropTypes.func.isRequired,
};

export default SetMarksDropdown;