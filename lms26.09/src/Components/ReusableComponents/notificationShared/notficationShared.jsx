import React, { useState, useEffect } from "react";
import { FaTimes, FaInfoCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import "./NotificationShared.css";
import { useNavigate } from "react-router-dom";

const NotificationShared = ({ sender, projectName, testId }) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if notification has already been shown in this tab session
    const alreadyShown = sessionStorage.getItem("notificationShown");

    if (!alreadyShown) {
      setVisible(true);
      sessionStorage.setItem("notificationShown", "true");
    }
  }, []);

  const handleJoin = () => {
    navigate(`/test/${testId}/movetest`, { state: { testId } });

    toast.success(`You successfully joined the test: ${projectName}`, {
      position: "top-right",
      autoClose: 3000,
    });

    setVisible(false);
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
          Join Test
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
