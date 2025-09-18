import React, { useState } from "react";
import { FaTimes, FaInfoCircle } from "react-icons/fa";
import { toast } from "react-toastify";  // ⬅ only toast here
import "./NotificationShared.css";

const NotificationShared = ({ sender, projectName }) => {
  const [visible, setVisible] = useState(true);

  const handleJoin = () => {
    toast.success(`You successfully joined the project: ${projectName}`, {
      position: "top-right",
      autoClose: 3000,
    });
    setVisible(false); // hide notification
  };

  const handleClose = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="notification-shared">
      <p>
        <FaInfoCircle
          className="shared-info me-2"
          size={22}
          style={{ color: "var(--button-bg-color)" }}
        />
        <strong>{sender}</strong> would like you to join{" "}
        <span className="project-name">{projectName}</span>
      </p>

      <div className="notification-actions">
        <button className="btn-join" onClick={handleJoin}>
          Join
        </button>
        <button
          className="btn-close"
          onClick={handleClose}
          aria-label="Close"
        >
          <FaTimes size={16} />
        </button>
      </div>
    </div>
  );
};

export default NotificationShared;
