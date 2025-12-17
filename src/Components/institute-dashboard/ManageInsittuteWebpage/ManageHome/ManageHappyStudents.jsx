import React, { useState, useEffect, useRef } from "react";
import "./ManageHome.css";
import { VscTriangleDown } from "react-icons/vsc";
import SidebarMenu from "../../dashboard/sidebar/sidemenu";

const ManageHappyStudents = () => {
  /* ============ SIDEBAR (same as blogs/courses) ============ */
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const sidebarRef = useRef(null);
  const toggleRef = useRef(null);

  const toggleMobileSidebar = () => {
    setIsMobileOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!isMobileOpen) return;

      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target)
      ) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileOpen]);

  const [data, setData] = useState({
    title: "Join Thousand Of Happy Students!",
    description: "Subscribe our newsletter & get latest news and updates!",
    backgroundColor: "#0b66e4",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSave = () => {
    console.log("HAPPY STUDENTS DATA:", data);
    alert("Saved successfully");
  };

  return (
    <div className="slider-manager">
      {/* ===== MOBILE HEADER ===== */}
     

      {/* ===== DESKTOP HEADER ===== */}
      <div className="slider-header desktop-only">
        <h2>Edit Happy Students Section<VscTriangleDown
          ref={toggleRef}
          onClick={toggleMobileSidebar}
          className="TriagbleDown"
        /></h2>
        
        <div ref={sidebarRef}>
          <SidebarMenu
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
          />
        </div>
      </div>

      {/* ===== FORM (updated to use consistent modal styling) ===== */}
      <div className="slider-modal">
        <div className="slider-modal-body">
          <label>Title</label>
          <input
            name="title"
            value={data.title}
            onChange={handleChange}
          />

          <label>Description</label>
          <textarea
            name="description"
            value={data.description}
            onChange={handleChange}
          />

          <label>Background Color</label>
          <input
            type="color"
            name="backgroundColor"
            value={data.backgroundColor}
            onChange={handleChange}
          />
        </div>

        <div className="slider-modal-footer">
          <button className="slider-save-btn" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>

      {/* 🔴 LIVE PREVIEW */}
      <div
        className="happy-students-preview"
        style={{ background: data.backgroundColor }}
      >
        <h2>{data.title}</h2>
        <p>{data.description}</p>
      </div>
    </div>
  );
};

export default ManageHappyStudents;
