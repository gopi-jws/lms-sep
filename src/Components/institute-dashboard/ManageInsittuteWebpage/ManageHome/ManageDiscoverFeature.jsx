import React, { useState, useEffect, useRef } from "react";
import "./ManageHome.css";
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import { VscTriangleDown } from "react-icons/vsc";
import SidebarMenu from "../../dashboard/sidebar/sidemenu";

const ManageDiscoverFeature = () => {
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

  const [features, setFeatures] = useState([
    {
      id: 1,
      title: "Course Management",
      description: "Easy class & lesson creation",
      icon: "📘",
      status: "Active",
    },
    {
      id: 2,
      title: "Teacher Management",
      description: "Manage teachers & scheduling",
      icon: "👨‍🏫",
      status: "Active",
    },
    {
      id: 3,
      title: "Exam Automation",
      description: "MCQs, subjective, AI checking",
      icon: "📝",
      status: "Active",
    },
    {
      id: 4,
      title: "Reports & Analytics",
      description: "Track performance & growth",
      icon: "📊",
      status: "Active",
    },
    {
      id: 5,
      title: "Mobile Learning",
      description: "Learn anywhere anytime",
      icon: "📱",
      status: "Active",
    },
    {
      id: 6,
      title: "Fees Management",
      description: "Online payments & invoices",
      icon: "💳",
      status: "Active",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formFeature, setFormFeature] = useState({
    title: "",
    description: "",
    icon: "",
    status: "Active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFeature({ ...formFeature, [name]: value });
  };

  const resetForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditId(null);
    setFormFeature({
      title: "",
      description: "",
      icon: "",
      status: "Active",
    });
  };

  const handleAdd = () => {
    const id = features.length ? features[features.length - 1].id + 1 : 1;
    setFeatures([...features, { id, ...formFeature }]);
    resetForm();
  };

  const handleEdit = (feature) => {
    setFormFeature(feature);
    setEditId(feature.id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleUpdate = () => {
    setFeatures(
      features.map((f) => (f.id === editId ? { ...f, ...formFeature } : f))
    );
    resetForm();
  };

  const handleDelete = (id) => {
    setFeatures(features.filter((f) => f.id !== id));
  };

  const toggleStatus = (id) => {
    setFeatures(
      features.map((f) =>
        f.id === id
          ? { ...f, status: f.status === "Active" ? "Inactive" : "Active" }
          : f
      )
    );
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...features];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setFeatures(updated);
  };

  const moveDown = (index) => {
    if (index === features.length - 1) return;
    const updated = [...features];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    setFeatures(updated);
  };

  return (
    <div className="slider-manager">
      {/* MOBILE HEADER (only mobile) */}
      <div className="test-index-header-moblie">
      
      </div>

    

      {/* DESKTOP HEADER (only desktop) */}
      <div className="slider-header desktop-only">
        <h2>Manage Discover Features<VscTriangleDown
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
        <button className="slider-add-btn" onClick={() => setShowForm(true)}>
          +Add Features
        </button>
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="slider-modal-overlay">
          <div className="slider-modal-card">
            <div className="slider-modal-header">
              <h3>{isEditing ? "Edit Feature" : "Add Feature"}</h3>
              <button className="slider-close-btn" onClick={resetForm}>
                ×
              </button>
            </div>

            <div className="slider-modal-body">
              <label>Title</label>
              <input
                name="title"
                value={formFeature.title}
                onChange={handleChange}
              />

              <label>Description</label>
              <textarea
                name="description"
                value={formFeature.description}
                onChange={handleChange}
              />

              <label>Icon (Emoji)</label>
              <input
                name="icon"
                value={formFeature.icon}
                onChange={handleChange}
              />

              <label>Status</label>
              <select
                name="status"
                value={formFeature.status}
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
                onClick={isEditing ? handleUpdate : handleAdd}
              >
                {isEditing ? "Update Feature" : "Add Feature"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="slider-table-box">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Title</th>
              <th>Description</th>
              <th>Icon</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {features.map((f, index) => (
              <tr key={f.id}>
                <td className="slider-order-col">
                  <button onClick={() => moveUp(index)}>↑</button>
                  <span>{index + 1}</span>
                  <button onClick={() => moveDown(index)}>↓</button>
                </td>

                <td>{f.title}</td>
                <td>{f.description}</td>
                <td>{f.icon}</td>

                <td>
                  <span
                    className={`slider-status ${
                      f.status === "Active" ? "active" : "inactive"
                    }`}
                  >
                    {f.status}
                  </span>
                </td>

                <td className="slider-icon-actions">
                  <button className="edit" onClick={() => handleEdit(f)}>
                    <FaEdit />
                  </button>
                  <button className="toggle" onClick={() => toggleStatus(f.id)}>
                    {f.status === "Active" ? <FaEye /> : <FaEyeSlash />}
                  </button>
                  <button className="delete" onClick={() => handleDelete(f.id)}>
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

export default ManageDiscoverFeature;
