import React, { useState, useEffect, useRef } from "react";
import "./NewQBModal.css";
import useBounceModal from "../../ReusableComponents/useBounceModal/useBounceModal";

const NewQBModal = ({
    isOpen,
    onClose,
    onSubmit,
    heading,
    selectedFolder,
    selectedTest,
    initialName = "",
    mode = "",  
}) => {
   
    const { modalRef, isBouncing } = useBounceModal(isOpen);
    const [qbName, setQBName] = useState(initialName);
    const [error, setError] = useState("");
    const inputRef = useRef(null);

    const handleSubmit = () => {
       

        if (mode === "delete") {
            onSubmit(selectedTest);
            onClose();
            return;
        }

        if (mode === "archive") {
            onSubmit(selectedTest);
            onClose();
            return;
        }

        if(mode === "create"){
            onSubmit({ name: qbName.trim() });
            setError("");
            onClose();
            return
        }

        // if (mode === "rename") {
        //     onSubmit({ name: qbName.trim() });
        //     setError("");
        //     onClose();
        //     return
        // }

        // CREATE or EDIT
        onSubmit({ name: qbName.trim() });
        setError("");
        onClose();
    };

    // Auto-focus input on open
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setQBName(initialName); // reset when opening
            inputRef.current.focus();
        }
    }, [isOpen, initialName]);

    if (!isOpen) return null;

    return (
        <div className="newqb-modal-overlay">
            <div
                className={`newqb-modal-content newqb-modal-content2 ${isBouncing ? "bounce" : ""}`}
                ref={modalRef}
            >
                <div className="newqb-modal-header">
                    <h5>
                        {heading}
                        {/* {mode === "edit" ? "Edit QB" : mode === "delete" ? "Delete QB" : mode === "archive" ? "Archive QB" : mode === "rename" ? "Rename QB" : "Create New QB"} */}
                    </h5>
                    <button className="close-btn" onClick={onClose}>
                        &times;
                    </button>
                </div>

                {(mode === "create" || mode === "edit" || mode === "rename") && (
                    <div className="newqb-modal-body">
                        <div className="newqb-form-group">
                            <input
                                type="text"
                                value={qbName}
                                className={`newqb-form-control ${error ? "error" : ""}`}
                                onChange={(e) => {
                                    setQBName(e.target.value);
                                    setError("");
                                }}
                                placeholder="Enter QB name"
                                ref={inputRef}
                            />
                            {error && <p className="error-message">{error}</p>}
                        </div>
                    </div>
                )}  

                { (mode === "archive" || mode === "delete") && (
                    <div className="newqb-modal-body">
                        <div className="newqb-form-group">
                            <h6 className="pop-titale">You are about to trash the following projects:</h6>
                            {selectedTest && (
                                <ul >
                                    {selectedTest.map((test, index) => (
                                        <li key={index} className="delete-list">
                                            <h6>{test.name}</h6>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {selectedFolder && (
                                <ul>
                                    <li className="delete-list">
                                        <h6>{selectedFolder.name}</h6>
                                    </li>
                                </ul>
                            )}


                            {error && <p className="error-message">{error}</p>}
                        </div>
                    </div>
                )}

                <div className="newqb-modal-footer">
                    <button className="btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="btn create-btn"
                        onClick={handleSubmit}
                        disabled={mode !== "delete" && mode !== "archive" && !qbName.trim()}
                    >
                        {mode === "edit" || mode === "rename" ? "Update" : mode === "delete" ? "Delete" : mode === "archive" ? "Confirm" : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewQBModal;
