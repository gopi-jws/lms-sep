import React, { useState, useEffect } from "react";
import './NewTestModal.css';
import useBounceModal from "../../ReusableComponents/useBounceModal/useBounceModal";

const NewTestModal = ({
    isOpen,
    onClose,
    onSubmit,
    initialName = "",
    initialDuration = "",
    initialDescription = "",
    initialInstructions = "",
    mode = "",
}) => {
    const { modalRef, isBouncing } = useBounceModal(isOpen);
    const [testName, setTestName] = useState(initialName);
    const [duration, setDuration] = useState(initialDuration);
    const [description, setDescription] = useState(initialDescription);
    const [instructions, setInstructions] = useState(initialInstructions);
    const [errors, setErrors] = useState({});

    // Reset form when initial values change (for edit/rename/create)
    useEffect(() => {
        if (isOpen) {
            setTestName(initialName);
            setDuration(initialDuration);
            setDescription(initialDescription);
            setInstructions(initialInstructions);
            setErrors({});
        }
    }, [isOpen, initialName, initialDuration, initialDescription, initialInstructions]);

    const handleSubmit = () => {
        setErrors({});
        const newErrors = {};
         

        if (mode === "delete") {
            onSubmit({ delete: true }); // tell parent to remove item
            onClose();
            return;
        }

        // ---- RENAME MODE: validate only name ----
        if (mode === "rename") {
            if (!testName.trim()) {
                newErrors.testName = "Test Name is required.";
            }

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }

            // Only send the changed name for rename
            onSubmit({ name: testName.trim() });
            onClose();
            return;
        }

        // ---- CREATE / EDIT MODE: full validation ----
        if (!testName.trim()) newErrors.testName = "Test Name is required.";

        if (duration === "") {
            newErrors.duration = "Duration is required.";
        } else if (isNaN(duration)) {
            newErrors.duration = "Duration must be a number.";
        } else {
            const numeric = Number(duration);
            if (numeric < 0) newErrors.duration = "Duration cannot be negative.";
            else if (numeric > 600) newErrors.duration = "Duration cannot be greater than 600.";
        }

        if (!description.trim()) newErrors.description = "Description is required.";
        if (!instructions.trim()) newErrors.instructions = "Instructions are required.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Submit full object for create/edit
        onSubmit({
            name: testName.trim(),
            duration: Number(duration),
            description: description.trim(),
            instructions: instructions.trim()
        });
        onClose();
    };

    const handleDurationChange = (e) => {
        const value = e.target.value;
        setDuration(value);

        if (value !== "" && !isNaN(value)) {
            const numericValue = Number(value);
            if (numericValue > 600) {
                setErrors(prev => ({ ...prev, duration: "Duration cannot be greater than 600." }));
            } else {
                setErrors(prev => ({ ...prev, duration: "" }));
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="newtest-modal-overlay">
            {mode === "rename" ? (
                <div className={`newtest-modal-content newtest-modal-content2 ${isBouncing ? "bounce" : ""}`} ref={modalRef}>
                    <div className="newtest-modal-header">
                        <h5>Rename Test</h5>
                        <button className="close-btn" onClick={onClose}>
                            &times;
                        </button>
                    </div>

                    <div className="newtest-modal-body">
                        <div className="newtest-form-group">
                            <input
                                type="text"
                                value={testName}
                                className={`newtest-form-control ${errors.testName ? 'error' : ''}`}
                                onChange={(e) => setTestName(e.target.value)}
                                placeholder="Enter test name"
                            />
                            {errors.testName && <p className="error-message">{errors.testName}</p>}
                        </div>
                    </div>

                    <div className="newtest-modal-footer">
                        <button className="btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            className="btn create-btn"
                            onClick={handleSubmit}
                        >
                            Update
                        </button>
                    </div>
                </div>
            ) : mode === "create" ? (
                <div className={`newtest-modal-content newtest-modal-content2 ${isBouncing ? "bounce" : ""}`} ref={modalRef}>
                    <div className="newtest-modal-header">
                        <h5>{mode === "create" ? "Create New Test" : "Edit Test"}</h5>
                        <button className="close-btn" onClick={onClose}>
                            &times;
                        </button>
                    </div>

                    <div className="newtest-modal-body">
                        <div className="newtest-form-group">
                            <input
                                type="text"
                                value={testName}
                                className={`newtest-form-control ${errors.testName ? 'error' : ''}`}
                                onChange={(e) => setTestName(e.target.value)}
                                placeholder="Enter test name"
                            />
                            {errors.testName && <p className="error-message">{errors.testName}</p>}
                        </div>

                        <div className="newtest-form-group">
                            <input
                                type="number"
                                value={duration}
                                className={`newtest-form-control ${errors.duration ? 'error' : ''}`}
                                onChange={handleDurationChange}
                                placeholder="Enter duration (minutes)"
                                min="0"
                                max="600"
                            />
                            {errors.duration && <p className="error-message">{errors.duration}</p>}
                        </div>

                        <div className="newtest-form-group">
                            <textarea
                                value={description}
                                className={`newtest-form-control ${errors.description ? 'error' : ''}`}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter description"
                                rows="3"
                            />
                            {errors.description && <p className="error-message">{errors.description}</p>}
                        </div>

                        <div className="newtest-form-group">
                            <textarea
                                value={instructions}
                                className={`newtest-form-control ${errors.instructions ? 'error' : ''}`}
                                onChange={(e) => setInstructions(e.target.value)}
                                placeholder="Enter instructions"
                                rows="3"
                            />
                            {errors.instructions && <p className="error-message">{errors.instructions}</p>}
                        </div>
                    </div>

                    <div className="newtest-modal-footer">
                        <button className="btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            className="btn create-btn"
                            onClick={handleSubmit}
                        >
                            {mode === "create" ? "Create" : "Update"}
                        </button>
                    </div>
                </div>
                ) : mode === "edit" ? (
                        <div className={`newtest-modal-content newtest-modal-content2 ${isBouncing ? "bounce" : ""}`} ref={modalRef}>
                            <div className="newtest-modal-header">
                                <h5>{mode === "create" ? "Create New Test" : "Edit Test"}</h5>
                                <button className="close-btn" onClick={onClose}>
                                    &times;
                                </button>
                            </div>

                            <div className="newtest-modal-body">
                                <div className="newtest-form-group">
                                    <input
                                        type="text"
                                        value={testName}
                                        className={`newtest-form-control ${errors.testName ? 'error' : ''}`}
                                        onChange={(e) => setTestName(e.target.value)}
                                        placeholder="Enter test name"
                                    />
                                    {errors.testName && <p className="error-message">{errors.testName}</p>}
                                </div>

                                <div className="newtest-form-group">
                                    <input
                                        type="number"
                                        value={duration}
                                        className={`newtest-form-control ${errors.duration ? 'error' : ''}`}
                                        onChange={handleDurationChange}
                                        placeholder="Enter duration (minutes)"
                                        min="0"
                                        max="600"
                                    />
                                    {errors.duration && <p className="error-message">{errors.duration}</p>}
                                </div>

                                <div className="newtest-form-group">
                                    <textarea
                                        value={description}
                                        className={`newtest-form-control ${errors.description ? 'error' : ''}`}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Enter description"
                                        rows="3"
                                    />
                                    {errors.description && <p className="error-message">{errors.description}</p>}
                                </div>

                                <div className="newtest-form-group">
                                    <textarea
                                        value={instructions}
                                        className={`newtest-form-control ${errors.instructions ? 'error' : ''}`}
                                        onChange={(e) => setInstructions(e.target.value)}
                                        placeholder="Enter instructions"
                                        rows="3"
                                    />
                                    {errors.instructions && <p className="error-message">{errors.instructions}</p>}
                                </div>
                            </div>

                            <div className="newtest-modal-footer">
                                <button className="btn" onClick={onClose}>
                                    Cancel
                                </button>
                                <button
                                    className="btn create-btn"
                                    onClick={handleSubmit}
                                >
                                    {mode === "create" ? "Create" : "Update"}
                                </button>
                            </div>
                        </div>
                ) : (
                            <div className={`newtest-modal-content newtest-modal-content2 ${isBouncing ? "bounce" : ""}`} ref={modalRef}>
                                <div className="newtest-modal-header">
                                    <h5>Delete</h5>
                                    <button className="close-btn" onClick={onClose}>
                                        &times;
                                    </button>
                                </div>

                                <div className="newtest-modal-body">
                                    <div className="newtest-form-group">
                                        <h6>You are about to trash the following projects:</h6>
                                        {/* <input
                                            type="text"
                                            value={testName}
                                            className={`newtest-form-control ${errors.testName ? 'error' : ''}`}
                                            onChange={(e) => setTestName(e.target.value)}
                                            placeholder="Enter test name"
                                        /> */}

                                
                                                <h5 className="delete">{testName}</h5>
                                        
                                      
                                        {errors.testName && <p className="error-message">{errors.testName}</p>}
                                    </div>
                                </div>

                                <div className="newtest-modal-footer">
                                    <button className="btn" onClick={onClose}>
                                        Cancel
                                    </button>
                                    <button
                                        className="btn create-btn"
                                        onClick={handleSubmit}
                                    >
                                       Delete
                                    </button>
                                </div>
                            </div>
                )}
        </div>
    );
};

export default NewTestModal;
