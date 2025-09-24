import React, { useState, useEffect } from "react";
import './NewTestModal.css';
import useBounceModal from "../../ReusableComponents/useBounceModal/useBounceModal";

const NewTestModal = ({
    isOpen,
    onClose,
    onSubmit,
    initialName = "",
    initialId = "",
    initialDuration = "",
    initialDescription = "",
    initialInstructions = "",
    mode = "",
}) => {

    const [tags, setTags] = useState(() => {
        const savedTags = localStorage.getItem("testTags");
        return savedTags ? JSON.parse(savedTags) : [
            { id: 1, name: "Important", color: "#FF0000", questions: [] },
            { id: 2, name: "Review", color: "#FF9900", questions: [] },
            { id: 3, name: "Completed", color: "#008000", questions: [] },
        ];
    });

    const { modalRef, isBouncing } = useBounceModal(isOpen);
    const [testName, setTestName] = useState(initialName);
    const [testId, setTestId] = useState(initialId);
    const [duration, setDuration] = useState(initialDuration);
    const [description, setDescription] = useState(initialDescription);
    const [instructions, setInstructions] = useState(initialInstructions);
    const [errors, setErrors] = useState({});
    const [selectedCopyTags, setSelectedCopyTags] = useState([]);

    // Derived tags linked to current test
    const filteredTags = tags.filter(tag => tag.questions?.includes(testId));

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setTestName(initialName);
            setTestId(initialId);
            setDuration(initialDuration);
            setDescription(initialDescription);
            setInstructions(initialInstructions);
            setErrors({});
            setSelectedCopyTags([]); // reset when opening
        }
    }, [isOpen, initialName, initialId, initialDuration, initialDescription, initialInstructions]);

    // Initialize copy tags only once when copy modal opens
    useEffect(() => {
        if (isOpen && mode === "copy") {
            setSelectedCopyTags(filteredTags.map(tag => tag.id));
            setTestName(`${testName}(Copy)`)
        }
        // ✅ no selectedCopyTags in deps, avoids infinite loop
    }, [isOpen, mode, testId]);

    const handleSubmit = () => {
        setErrors({});
        const newErrors = {};

        if (mode == "tagremove"){

        }

        if (mode === "archive") {
            if (!testName.trim()) {
                newErrors.testName = "New name is required.";
                setErrors(newErrors);
                return;
            }
            onSubmit({ name: testName.trim() });
            onClose();
            return;
        }

        if (mode === "copy") {
            if (!testName.trim()) {
                newErrors.testName = "New name is required.";
                setErrors(newErrors);
                return;
            }
            onSubmit({
                name: testName.trim(),
                tags: selectedCopyTags
            });
            onClose();
            return;
        }

        if (mode === "delete") {
            onSubmit({ delete: true });
            onClose();
            return;
        }

        if (mode === "rename") {
            if (!testName.trim()) {
                newErrors.testName = "Test Name is required.";
            }
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
            onSubmit({ name: testName.trim() });
            onClose();
            return;
        }

        // ---- CREATE / EDIT ----
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

    // Remove tags
    const handleRemoveQuestionFromTag = (tagName, questionId) => {
        setTags(prevTags =>
            prevTags.map(tag => {
                if (tag.name === tagName) {
                    return {
                        ...tag,
                        questions: tag.questions.filter(id => id !== questionId)
                    };
                }
                return tag;
            })
        );
    };


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
            ) : mode == "delete" ? (
                <div className={`newtest-modal-content newtest-modal-content2 ${isBouncing ? "bounce" : ""}`} ref={modalRef}>
                    <div className="newtest-modal-header">
                        <h5>Delete</h5>
                        <button className="close-btn" onClick={onClose}>
                            &times;
                        </button>
                    </div>

                    <div className="newtest-modal-body">
                        <div className="newtest-form-group">
                            <h6 className="pop-titale">You are about to trash the following projects:</h6>
                            {/* <input
                                            type="text"
                                            value={testName}
                                            className={`newtest-form-control ${errors.testName ? 'error' : ''}`}
                                            onChange={(e) => setTestName(e.target.value)}
                                            placeholder="Enter test name"
                                        /> */}


                            {/* <h5 className="delete">{testName}</h5> */}

                            <ul >
                                <li className="delete">
                                    <h6>{testName}</h6>
                                </li>
                            </ul>


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
                        ) : mode == "copy" ? (
                                <div className={`newtest-modal-content newtest-modal-content2 ${isBouncing ? "bounce" : ""}`} ref={modalRef}>
                                    <div className="newtest-modal-header">
                                        <h5>Copy</h5>
                                        <button className="close-btn" onClick={onClose}>
                                            &times;
                                        </button>
                                    </div>

                                    <div className="newtest-modal-body">
                                        <div className="newtest-form-group">
                                            <label>New name</label>
                                            <input
                                                type="text"
                                                value={testName}
                                                className={`newtest-form-control ${errors.testName ? 'error' : ''}`}
                                                onChange={(e) => setTestName(e.target.value)}
                                                placeholder="Enter test name"
                                            />
                                        </div>

                                        {filteredTags.length > 0 && (
                                            <div className="copytestTag">
                                                <label>Tags to copy:</label>
                                                <div className="question-tags copytest-qus-tag">
                                                    {selectedCopyTags
                                                        .map(id => filteredTags.find(tag => tag.id === id)) // only selected
                                                        .filter(Boolean) // remove nulls
                                                        .map(tag => (
                                                            <div key={tag.id} className="question-tag-container">
                                                                <div className="question-tag">
                                                                    <span
                                                                        className="tag-color-dot"
                                                                        style={{ backgroundColor: tag.color }}
                                                                    ></span>
                                                                    <span className="index-tag-name">{tag.name}</span>
                                                                </div>
                                                                <span
                                                                    className="tag-remove"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelectedCopyTags(prev => prev.filter(id => id !== tag.id));
                                                                    }}
                                                                >
                                                                    &times;
                                                                </span>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        )}

                                        {errors.testName && <p className="error-message">{errors.testName}</p>}
                                    </div>

                                    <div className="newtest-modal-footer">
                                        <button className="btn" onClick={onClose}>Cancel</button>
                                        <button className="btn create-btn" onClick={handleSubmit}>Copy</button>
                                    </div>
                                </div>) : (
                                    <div className={`newtest-modal-content newtest-modal-content2 ${isBouncing ? "bounce" : ""}`} ref={modalRef}>
                                        <div className="newtest-modal-header">
                                            <h5>Archive</h5>
                                            <button className="close-btn" onClick={onClose}>
                                                &times;
                                            </button>
                                        </div>

                                        <div className="newtest-modal-body">
                                            <div className="newtest-form-group">
                                                <h6 className="pop-titale">You are about to trash the following projects:</h6>
                                                <ul >
                                                    <li className="delete">
                                                        <h6>{testName}</h6>
                                                    </li>
                                                </ul>
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
                                                Confirm
                                            </button>
                                        </div>
                                    </div>
                        )}
        </div>
    );
};

export default NewTestModal;
