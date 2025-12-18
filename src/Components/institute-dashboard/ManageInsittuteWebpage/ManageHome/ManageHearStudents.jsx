import React, { useState, useEffect, useRef } from "react";
import "./ManageHome.css";
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import { VscTriangleDown } from "react-icons/vsc";
import SidebarMenu from "../../dashboard/sidebar/sidemenu";

const ManageHearStudents = () => {
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

  /* ============ SECTION TITLE / DESCRIPTION ============ */
  const [section, setSection] = useState({
    title: "Hear From Our Students",
    description:
      "Discover What Learners Around the World Are Saying About Our Courses",
  });

  const [editSection, setEditSection] = useState(false);
  const [tempSection, setTempSection] = useState({
    title: "",
    description: "",
  });

  const openEditSection = () => {
    setTempSection(section); // load current values into temp
    setEditSection(true);
  };

  const closeEditSection = () => {
    setEditSection(false);
  };

  const handleSectionChange = (e) => {
    const { name, value } = e.target;
    setTempSection((prev) => ({ ...prev, [name]: value }));
  };

  const handleSectionSave = () => {
    setSection(tempSection);
    setEditSection(false);
  };

  /* ================= BLOGS ================= */
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "Fantastic  ",
      description: "A complete guide ",
      image: "https://i.pravatar.cc/100?img=11",
      date: "Oct 25, 2025",
      status: "Active",
      stars: 5,
      studentName: "Casey Allen",
      studentType: "Student",
    },
    {
      id: 2,
      title: "Excellent Support",
      description: "In a professional context .",
      image: "https://i.pravatar.cc/100?img=32",
      date: "Oct 10, 2025",
      status: "Active",
      stars: 4,
      studentName: "Sophia Carter",
      studentType: "Student",
    },
    {
      id: 3,
      title: "Very Satisfied .",
      description: "DiscoverLMS platforms s.",
      image: "https://i.pravatar.cc/100?img=14",
      date: "Sep 22, 2025",
      status: "Active",
      stars: 5,
      studentName: "Daniel Wright",
      studentType: "Student",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formBlog, setFormBlog] = useState({
    title: "",
    description: "",
    image: "",
    date: "",
    status: "Active",
    stars: 5,
    studentName: "",
    studentType: "Student",
  });

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormBlog({ ...formBlog, [name]: value });
  };

  const resetForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditId(null);
    setFormBlog({
      title: "",
      description: "",
      image: "",
      date: "",
      status: "Active",
      stars: 5,
      studentName: "",
      studentType: "Student",
    });
  };

  const handleAdd = () => {
    const id = blogs.length ? blogs[blogs.length - 1].id + 1 : 1;
    setBlogs([...blogs, { id, ...formBlog }]);
    resetForm();
  };

  const handleEdit = (blog) => {
    setFormBlog(blog);
    setEditId(blog.id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleUpdate = () => {
    setBlogs(
      blogs.map((b) => (b.id === editId ? { ...b, ...formBlog } : b))
    );
    resetForm();
  };

  const handleDelete = (id) => {
    setBlogs(blogs.filter((b) => b.id !== id));
  };

  const toggleStatus = (id) => {
    setBlogs(
      blogs.map((b) =>
        b.id === id
          ? { ...b, status: b.status === "Active" ? "Inactive" : "Active" }
          : b
      )
    );
  };

  /* ================= ORDER ================= */
  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...blogs];
    [updated[index - 1], updated[index]] = [
      updated[index],
      updated[index - 1],
    ];
    setBlogs(updated);
  };

  const moveDown = (index) => {
    if (index === blogs.length - 1) return;
    const updated = [...blogs];
    [updated[index + 1], updated[index]] = [
      updated[index],
      updated[index + 1],
    ];
    setBlogs(updated);
  };

  /* ================= UI ================= */

  return (
    <div className="slider-manager">
      {/* ===== DESKTOP HEADER WITH SIDEBAR TOGGLE ===== */}
      <div className="slider-header desktop-only">
        <h2>
          Manage Hear Students{" "}
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

        <button
          className="slider-add-btn"
          onClick={openEditSection}
          style={{ marginBottom: "15px" }}
        >
          Edit Section Title
        </button>
      </div>

      {/* ===== SECTION PREVIEW ===== */}
      <div className="blog-section-preview">
        <h3>{section.title}</h3>
        <p>{section.description}</p>
      </div>

      {/* ===== ADD BLOG BUTTON ===== */}
      <button
        id="add-blogs"
        className="slider-add-btn"
        style={{ marginBottom: "15px" }}
        onClick={() => setShowForm(true)}
      >
        + Add cards
      </button>

      {/* ===== SECTION EDIT MODAL ===== */}
      {editSection && (
        <div className="slider-modal-overlay">
          <div className="slider-modal-card">
            <div className="slider-modal-header">
              <h3>Edit Section</h3>
              <button className="slider-close-btn" onClick={closeEditSection}>
                ×
              </button>
            </div>

            <div className="slider-modal-body">
              <label>Section Title</label>
              <input
                name="title"
                value={tempSection.title}
                onChange={handleSectionChange}
              />

              <label>Section Description</label>
              <textarea
                name="description"
                value={tempSection.description}
                onChange={handleSectionChange}
              />
            </div>

            <div className="slider-modal-footer">
              <button className="slider-cancel-btn" onClick={closeEditSection}>
                Cancel
              </button>
              <button className="slider-save-btn" onClick={handleSectionSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== BLOG MODAL ===== */}
      {showForm && (
        <div className="slider-modal-overlay">
          <div className="slider-modal-card">
            <div className="slider-modal-header">
              <h3>{isEditing ? "Edit Blog" : "Add Blog"}</h3>
              <button className="slider-close-btn" onClick={resetForm}>
                ×
              </button>
            </div>

            <div className="slider-modal-body">
              <label>Title</label>
              <input name="title" value={formBlog.title} onChange={handleChange} />

              <label>Description</label>
              <textarea
                name="description"
                value={formBlog.description}
                onChange={handleChange}
              />

              <label>Date</label>
              <input name="date" value={formBlog.date} onChange={handleChange} />

              <label>Image URL</label>
              <input
                name="image"
                value={formBlog.image}
                onChange={handleChange}
              />

              <label>Stars (1–5)</label>
              <input
                type="number"
                min="1"
                max="5"
                name="stars"
                value={formBlog.stars}
                onChange={handleChange}
              />

              <label>Student Name</label>
              <input
                name="studentName"
                value={formBlog.studentName}
                onChange={handleChange}
              />

              <label>Status</label>
              <select
                name="status"
                value={formBlog.status}
                onChange={handleChange}
              >
                <option>Active</option>
                <option>Inactive</option>
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
                {isEditing ? "Update Blog" : "Add Blog"}
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
              <th>Image</th>
              <th>Title</th>
              <th>Description</th>
              <th>Student</th>
              <th>Stars</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {blogs.map((b, index) => (
              <tr key={b.id}>
                <td className="slider-order-col">
                  <button onClick={() => moveUp(index)}>↑</button>
                  <span>{index + 1}</span>
                  <button onClick={() => moveDown(index)}>↓</button>
                </td>

                <td>
                  <img
                    src={
                      b.image ||
                      "https://via.placeholder.com/80x50?text=No+Image"
                    }
                    alt={b.title}
                    style={{
                      width: "80px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />
                </td>

                <td>{b.title}</td>

                <td>{b.description}</td>

                <td>
                  {b.studentName}
                  <br />
                  <small>{b.studentType}</small>
                </td>

                <td>{"★".repeat(b.stars)}</td>

                <td>{b.date}</td>

                <td>
                  <span
                    className={`slider-status ${
                      b.status === "Active" ? "active" : "inactive"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>

                <td className="slider-icon-actions">
                  <button className="edit" onClick={() => handleEdit(b)}>
                    <FaEdit />
                  </button>
                  <button className="toggle" onClick={() => toggleStatus(b.id)}>
                    {b.status === "Active" ? <FaEye /> : <FaEyeSlash />}
                  </button>
                  <button className="delete" onClick={() => handleDelete(b.id)}>
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

export default ManageHearStudents;
