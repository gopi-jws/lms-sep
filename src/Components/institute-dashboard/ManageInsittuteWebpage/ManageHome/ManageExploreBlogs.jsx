import React, { useState, useEffect, useRef } from "react";
import "../ManageHome/ManageHome.css";
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import { VscTriangleDown } from "react-icons/vsc";
import SidebarMenu from "../../dashboard/sidebar/sidemenu";

const ManageExploreBlog = () => {
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

  /* ================= SECTION CONTENT ================= */
  const [section, setSection] = useState({
    title: "Explore Our Courses.",
    description:
      "Learn from Industry Experts and Advance Your Career with Practical Skills.",
  });

  const [editSection, setEditSection] = useState(false);

  /* ================= BLOGS ================= */
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "How Institutes ",
      description: "A complete guide for schools, colleges",
      image: "https://www.brainvire.com/blog/wp-content/uploads/2024/12/Best-Online-exam-software.jpg",
      date: "Oct 25, 2025",
      status: "Active",
    },
    {
      id: 2,
      title: "Why LaTeX-Based ",
      description: "Understand how LaTeX improves .",
      image: "https://oswaalbooks.com/cdn/shop/articles/IMPORTANCE-OF-QUESTION-BANKS--WHY-STUDENTS-NEED-QUESTION-BANK--Oswaal-Books-and-Learning-Pvt-Ltd-1683091503_1920x.jpg?v=1685773230",
      date: "Oct 10, 2025",
      status: "Active",
    },
    {
      id: 3,
      title: "Top Benefits o",
      description: "Discover how cloud LMS platforms s.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeyfD02aS7MEsdyLTWbJDR1Q1Sux3Y4d2O9Q&s",
      date: "Sep 22, 2025",
      status: "Active",
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
      {/* ===== MOBILE HEADER ===== */}
      

      {/* ===== DESKTOP HEADER ===== */}
      <div className="slider-header desktop-only">
        <h2>Manage Blogs     <VscTriangleDown
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
         <button className="slider-add-btn" onClick={() => setEditSection(true)}>
          Edit Section Title
        </button>
      </div>

      <div className="blog-section-preview">
        <h3>{section.title}</h3>
        <p>{section.description}</p>
      </div>

      {/* ===== SECTION MODAL ===== */}
      {editSection && (
        <div className="slider-modal-overlay">
          <div className="slider-modal-card">
            <div className="slider-modal-header">
              <h3>Edit Blog Section</h3>
              <button
                className="slider-close-btn"
                onClick={() => setEditSection(false)}
              >
                ×
              </button>
            </div>

            <div className="slider-modal-body">
              <label>Section Title</label>
              <input
                value={section.title}
                onChange={(e) =>
                  setSection({ ...section, title: e.target.value })
                }
              />

              <label>Section Description</label>
              <textarea
                value={section.description}
                onChange={(e) =>
                  setSection({ ...section, description: e.target.value })
                }
              />
            </div>

            <div className="slider-modal-footer">
              <button className="slider-cancel-btn" onClick={() => setEditSection(false)}>
                Cancel
              </button>
              <button
                className="slider-save-btn"
                onClick={() => setEditSection(false)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== ADD BLOG BUTTON ===== */}
      <button
        id="add-blogs"
        className="slider-add-btn"
        style={{ marginBottom: "15px" }}
        onClick={() => setShowForm(true)}
      >
        + Add Blog
      </button>

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

              <label>Status</label>
              <select
                name="status"
                value={formBlog.status}
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

                {/* IMAGE */}
                <td>
                  <img
                    src={b.image || "https://via.placeholder.com/80x50?text=No+Image"}
                    alt={b.title}
                    style={{
                      width: "80px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />
                </td>

                {/* TITLE */}
                <td>{b.title}</td>

                {/* DESCRIPTION */}
                <td style={{ maxWidth: "300px" }}>
                  <p
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      margin: 0,
                    }}
                    title={b.description}
                  >
                    {b.description}
                  </p>
                </td>

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

export default ManageExploreBlog;
