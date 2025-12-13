import React, { useState } from "react";
import "./ManageHome.css";

const ManageSlider = () => {
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

  // ✅ ORDER FUNCTIONS (NEW)
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
    <div className="manage-slider">
      <div className="header">
        <h2>Manage Slider</h2>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          + Add New Slide
        </button>
      </div>

      {/* MODAL (UNCHANGED) */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{isEditing ? "Edit Slide" : "Add New Slide"}</h3>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>

            <div className="modal-body">
              <label>Title</label>
              <input name="title" value={newSlide.title} onChange={handleChange} />

              <label>Image URL</label>
              <input name="image" value={newSlide.image} onChange={handleChange} />

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
              <select name="status" value={newSlide.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="modal-footer">
              <button className="cancel" onClick={resetForm}>Cancel</button>
              <button
                className="save"
                onClick={isEditing ? handleUpdateSlide : handleAddSlide}
              >
                {isEditing ? "Update Slide" : "Add Slide"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="table-box">
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
                {/* ORDER */}
                <td className="order-col">
                  <button onClick={() => moveUp(index)}>↑</button>
                  <span>{index + 1}</span>
                  <button onClick={() => moveDown(index)}>↓</button>
                </td>

                <td>{slide.title}</td>

                <td>
                  <img src={slide.image} className="thumb" alt="" />
                </td>

                <td>{slide.buttonText}</td>
                <td>{slide.buttonLink}</td>

                <td>
                  <span className={`status ${slide.status === "Active" ? "active" : "inactive"}`}>
                    {slide.status}
                  </span>
                </td>

                {/* ACTION ICONS */}
                <td className="icon-actions">
                  <button onClick={() => handleEdit(slide)} title="Edit">✏️</button>
                  <button onClick={() => handleToggleStatus(slide.id)} title="Toggle Status">
                    {slide.status === "Active" ? "👁" : "🚫"}
                  </button>
                  <button onClick={() => handleDelete(slide.id)} title="Delete">🗑️</button>
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


