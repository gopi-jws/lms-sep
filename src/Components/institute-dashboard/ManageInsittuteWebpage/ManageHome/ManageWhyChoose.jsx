import React, { useState, useEffect, useRef } from "react";
import "./ManageHome.css";
import { VscTriangleDown } from "react-icons/vsc";
import SidebarMenu from "../../dashboard/sidebar/sidemenu";

const ManageWhyChoose = () => {
  /* ============ SIDEBAR (same pattern as all others) ============ */
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
      sidebarRef.current?.contains(e.target) ||
      toggleRef.current?.contains(e.target)
    ) {
      return; // allow interaction + scroll
    }

    setIsMobileOpen(false);
  };

  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, [isMobileOpen]);


  const [data, setData] = useState({
    title: "Why Choose LMSS SaaS Online Platform For Your Institute?",
    description:
      "We've developed an advanced LMS designed specially for schools, colleges, coaching institutes, and online tutors — helping you automate classes, exams, teachers, and digital learning.",
    points: [
      "Wide Range of Courses",
      "Cost-Effective",
      "Global Networking",
      "Get Certificate",
    ],
    buttonText: "Create an Account",
    buttonLink: "/lms-saas/contact",
    image:
      "https://www.iitms.co.in/blog/img/Learning-Management-Systems-banner.jpg",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handlePointChange = (index, value) => {
    const updated = [...data.points];
    updated[index] = value;
    setData({ ...data, points: updated });
  };

  const addPoint = () => {
    setData({ ...data, points: [...data.points, ""] });
  };

  const removePoint = (index) => {
    setData({
      ...data,
      points: data.points.filter((_, i) => i !== index),
    });
  };

  const handleSave = () => {
    console.log("WHY CHOOSE DATA:", data);
    alert("Changes saved (static)");
  };

  return (
    <div className="slider-manager">
      {/* ===== MOBILE HEADER ===== */}

      {/* ===== DESKTOP HEADER ===== */}
      <div className="slider-header desktop-only">
        <h2>Manage Why Choose Section   <VscTriangleDown
          ref={toggleRef}
          onClick={toggleMobileSidebar}
          className="TriagbleDown"
        /></h2>
     
      </div>
      
        <div ref={sidebarRef}>
          <SidebarMenu
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
          />
        </div>

      {/* ===== FORM (consistent styling) ===== */}
      <div className="slider-modal">
        <div className="slider-modal-body">
          <label>Heading</label>
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

          <label>Image URL</label>
          <input
            name="image"
            value={data.image}
            onChange={handleChange}
          />

          <label>Feature Points</label>
          {data.points.map((point, index) => (
            <div key={index} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
              <input
                value={point}
                onChange={(e) => handlePointChange(index, e.target.value)}
                placeholder={`Point ${index + 1}`}
              />
              <button
                onClick={() => removePoint(index)}
                style={{
                  background: "#ff4444",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  width: "30px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
          ))}

          <button
            className="slider-add-btn"
          >
            + Add Point
          </button>

          <label>Button Text</label>
          <input
            name="buttonText"
            value={data.buttonText}
            onChange={handleChange}
          />

          <label>Button Link</label>
          <input
            name="buttonLink"
            value={data.buttonLink}
            onChange={handleChange}
          />
        </div>

        <div className="slider-modal-footer">
          <button className="slider-save-btn" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageWhyChoose;
