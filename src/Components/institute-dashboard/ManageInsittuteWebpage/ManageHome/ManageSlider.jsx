import React, { useState, useEffect, useRef } from "react";
import "./ManageHome.css";
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import { VscTriangleDown } from "react-icons/vsc";
import SidebarMenu from "../../dashboard/sidebar/sidemenu";

const ManageSlider = () => {
  /* ============ SIDEBAR ============ */
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

  /* ============ SLIDER DATA ============ */
  const [slides, setSlides] = useState([
    {
      id: 1,
      title: "Discover Knowledge and Grow",
      image: "https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg",
      buttonText: "Explore Courses",
      buttonLink: "/courses",
      status: "Active",
    },
    {
      id: 2,
      title: "Unlock Your Potential",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
      buttonText: "Start Learning",
      buttonLink: "/student-login",
      status: "Active",
    },
    {
      id: 3,
      title: "Empowering Educators",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      buttonText: "Teacher Login",
      buttonLink: "/teacher-login",
      status: "Inactive",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [newSlide, setNewSlide] = useState({
    title: "",
    image: "",
    buttonText: "",
    buttonLink: "",
    status: "Active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSlide({ ...newSlide, [name]: value });
  };

  const handleAddSlide = () => {
    const id = slides.length ? slides[slides.length - 1].id + 1 : 1;
    setSlides([...slides, { id, ...newSlide }]);
    resetForm();
  };

  const handleEdit = (slide) => {
    setNewSlide(slide);
    setEditId(slide.id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleUpdateSlide = () => {
    setSlides(
      slides.map((slide) =>
        slide.id === editId ? { ...slide, ...newSlide } : slide
      )
    );
    resetForm();
  };

  const handleDelete = (id) => {
    setSlides(slides.filter((slide) => slide.id !== id));
  };

  const handleToggleStatus = (id) => {
    setSlides(
      slides.map((slide) =>
        slide.id === id
          ? {
              ...slide,
              status: slide.status === "Active" ? "Inactive" : "Active",
            }
          : slide
      )
    );
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...slides];
    [updated[index - 1], updated[index]] = [
      updated[index],
      updated[index - 1],
    ];
    setSlides(updated);
  };

  const moveDown = (index) => {
    if (index === slides.length - 1) return;
    const updated = [...slides];
    [updated[index + 1], updated[index]] = [
      updated[index],
      updated[index + 1],
    ];
    setSlides(updated);
  };

  const resetForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditId(null);
    setNewSlide({
      title: "",
      image: "",
      buttonText: "",
      buttonLink: "",
      status: "Active",
    });
  };

  return (
    <div className="slider-manager">
      {/* ===== DESKTOP HEADER WITH SIDEBAR TOGGLE ===== */}
      <div className="slider-header desktop-only">
        <h2>
          Manage Slider{" "}
          <VscTriangleDown
            ref={toggleRef}
            onClick={toggleMobileSidebar}
            className="TriagbleDown"
          />
        </h2>
        
        <div ref={sidebarRef}>
          <SidebarMenu
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
          />
        </div>

        <button className="slider-add-btn" onClick={() => setShowForm(true)}>
          + Add New Slide
        </button>
      </div>

      {/* ===== FIXED MODAL OVERLAY ===== */}
      {showForm && (
        <div 
          className="slider-modal-overlay" 
          onClick={resetForm} // Close on overlay click
        >
          <div 
            className="slider-modal-card"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
          >
            <div className="slider-modal-header">
              <h3>{isEditing ? "Edit Slide" : "Add New Slide"}</h3>
              <button className="slider-close-btn" onClick={resetForm}>
                ×
              </button>
            </div>

            <div className="slider-modal-body">
              <label>Title</label>
              <input
                name="title"
                value={newSlide.title}
                onChange={handleChange}
              />

              <label>Image URL</label>
              <input
                name="image"
                value={newSlide.image}
                onChange={handleChange}
              />

              <label>Button Text</label>
              <input
                name="buttonText"
                value={newSlide.buttonText}
                onChange={handleChange}
              />

              <label>Button Link</label>
              <input
                name="buttonLink"
                value={newSlide.buttonLink}
                onChange={handleChange}
              />

              <label>Status</label>
              <select
                name="status"
                value={newSlide.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="slider-modal-footer">
              <button className="slider-cancel-btn" onClick={resetForm}>
                Cancel
              </button>
              <button
                className="slider-save-btn"
                onClick={isEditing ? handleUpdateSlide : handleAddSlide}
              >
                {isEditing ? "Update Slide" : "Add Slide"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== TABLE ===== */}
      <div className="slider-table-box">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Title</th>
              <th>Image</th>
              <th>Button</th>
              <th>Link</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {slides.map((slide, index) => (
              <tr key={slide.id}>
                <td className="slider-order-col">
                  <button onClick={() => moveUp(index)}>↑</button>
                  <span>{index + 1}</span>
                  <button onClick={() => moveDown(index)}>↓</button>
                </td>

                <td>{slide.title}</td>

                <td>
                  <img 
                    src={slide.image || "https://via.placeholder.com/80x50?text=No+Image"} 
                    className="slider-thumb" 
                    alt="" 
                    style={{ 
                      width: "80px", 
                      height: "50px", 
                      objectFit: "cover", 
                      borderRadius: "6px" 
                    }}
                  />
                </td>

                <td>{slide.buttonText}</td>
                <td>{slide.buttonLink}</td>

                <td>
                  <span
                    className={`slider-status ${
                      slide.status === "Active" ? "active" : "inactive"
                    }`}
                  >
                    {slide.status}
                  </span>
                </td>

                <td className="slider-icon-actions">
                  <button
                    className="edit"
                    onClick={() => handleEdit(slide)}
                    title="Edit"
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="toggle"
                    onClick={() => handleToggleStatus(slide.id)}
                    title={slide.status === "Active" ? "Deactivate" : "Activate"}
                  >
                    {slide.status === "Active" ? <FaEye /> : <FaEyeSlash />}
                  </button>

                  <button
                    className="delete"
                    onClick={() => handleDelete(slide.id)}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageSlider;


