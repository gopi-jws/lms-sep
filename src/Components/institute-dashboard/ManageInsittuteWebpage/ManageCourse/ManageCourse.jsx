import React, { useState, useEffect, useRef } from "react";
import "../ManageHome/ManageHome.css";
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import { VscTriangleDown } from "react-icons/vsc";
import SidebarMenu from "../../dashboard/sidebar/sidemenu";

const ManageCourses = () => {
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
    title: "Explore Our Courses",
    description:
      "Learn with clean, simple and modern curriculum — designed to make you industry-ready..",
  });

  const [editSection, setEditSection] = useState(false);

  /* ================= COURSES ================= */
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Full Stack Web Development",
      description: "Become a professional full-stack developer with hands-on projects.",
      duration: "6 Months",
      startDate: "5th Dec 2025",
      time: "Mon–Fri • 7 PM – 9 PM",
      status: "Active",
    },
    {
      id: 2,
      title: "Advanced Data Structures & Algorithms",
      description: "Master DSA through structured problem-solving and mock interviews.",
      duration: "3 Months",
      startDate: "12th Dec 2025",
      time: "Sat–Sun • 10 AM – 1 PM",
      status: "Active",
    },
    {
      id: 3,
      title: "Digital Marketing Mastery",
      description: "Learn SEO, SEM, Google Ads, analytics, and automation tools.",
      duration: "2 Months",
      startDate: "20th Dec 2025",
      time: "Mon–Fri • 6 PM – 8 PM",
      status: "Inactive",
    },
    {
      id: 4,
      title: "Artificial Intelligence Fundamentals",
      description:
        "Learn AI concepts, neural networks, automation systems, and intelligent agents with hands-on mini-projects.",
      duration: "3 Months",
      startDate: "25th Jan 2026",
      time: "Sat–Sun • 2 PM – 5 PM",
      status: "Active",
    },
    {
      id: 5,
      title: "DevOps & Deployment Engineering",
      description:
        "Master CI/CD pipelines, Docker, Kubernetes, GitHub Actions, and cloud deployment workflows.",
      duration: "4 Months",
      startDate: "10th Jan 2026",
      time: "Mon–Fri • 8 PM – 10 PM",
      status: "Active",
    },
    {
      id: 6,
      title: "Java Backend Engineering",
      description:
        "Learn Java, Spring Boot, microservices, REST APIs, and backend architecture used by enterprises.",
      duration: "5 Months",
      startDate: "28th Dec 2025",
      time: "Mon–Fri • 7 PM – 9 PM",
      status: "Active",
    },
    {
      id: 7,
      title: "Graphic Design & Branding",
      description:
        "Learn professional design fundamentals, Adobe tools, typography, brand identity systems, and creativity.",
      duration: "2 Months",
      startDate: "18th Jan 2026",
      time: "Sat–Sun • 11 AM – 2 PM",
      status: "Active",
    },
    {
      id: 8,
      title: "Big Data Engineering with Hadoop & Spark",
      description:
        "Work with distributed systems, data pipelines, large-scale data processing, and big data tools.",
      duration: "4 Months",
      startDate: "12th Jan 2026",
      time: "Sat–Sun • 9 AM – 1 PM",
      status: "Active",
    },
    {
      id: 9,
      title: "Artificial Intelligence in Education (Ed-Tech AI)",
      description:
        "Learn how AI transforms education: adaptive learning, student analytics, content generation, and AI tutors.",
      duration: "1.5 Months",
      startDate: "25th Jan 2026",
      time: "Mon–Fri • 6 PM – 8 PM",
      status: "Active",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formCourse, setFormCourse] = useState({
    title: "",
    description: "",
    duration: "",
    startDate: "",
    time: "",
    status: "Active",
  });

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormCourse({ ...formCourse, [name]: value });
  };

  const handleAddCourse = () => {
    const id = courses.length ? courses[courses.length - 1].id + 1 : 1;
    setCourses([...courses, { id, ...formCourse }]);
    resetForm();
  };

  const handleEdit = (course) => {
    setFormCourse(course);
    setEditId(course.id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleUpdateCourse = () => {
    setCourses(
      courses.map((course) =>
        course.id === editId ? { ...course, ...formCourse } : course
      )
    );
    resetForm();
  };

  const handleDelete = (id) => {
    setCourses(courses.filter((course) => course.id !== id));
  };

  const handleToggleStatus = (id) => {
    setCourses(
      courses.map((course) =>
        course.id === id
          ? {
              ...course,
              status: course.status === "Active" ? "Inactive" : "Active",
            }
          : course
      )
    );
  };

  /* ================= ORDER ================= */
  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...courses];
    [updated[index - 1], updated[index]] = [
      updated[index],
      updated[index - 1],
    ];
    setCourses(updated);
  };

  const moveDown = (index) => {
    if (index === courses.length - 1) return;
    const updated = [...courses];
    [updated[index + 1], updated[index]] = [
      updated[index],
      updated[index + 1],
    ];
    setCourses(updated);
  };

  const resetForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditId(null);
    setFormCourse({
      title: "",
      description: "",
      duration: "",
      startDate: "",
      time: "",
      status: "Active",
    });
  };

  /* ================= UI ================= */
  return (
    <div className="slider-manager">
      {/* ===== MOBILE HEADER ===== */}
     

      {/* ===== DESKTOP HEADER ===== */}
      <div className="slider-header desktop-only" style={{ alignItems: "flex-start" }}>
        <h2>Manage Courses   <VscTriangleDown
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
            <button
          className="slider-add-btn"
          onClick={() => setEditSection(true)}
        >
          Edit Section Title
        </button>
      </div>

      {/* ===== SECTION PREVIEW ===== */}
      <div className="blog-section-preview">
        <h3>{section.title}</h3>
        <p>{section.description}</p>
      </div>

      {/* ===== ADD COURSE BUTTON ===== */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 15 }}>
        <button className="slider-add-btn" onClick={() => setShowForm(true)}>
          + Add New Course
        </button>
      </div>

      {/* ===== SECTION MODAL ===== */}
      {editSection && (
        <div className="slider-modal-overlay">
          <div className="slider-modal-card">
            <div className="slider-modal-header">
              <h3>Edit Courses Section</h3>
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

      {/* ===== COURSE MODAL ===== */}
      {showForm && (
        <div className="slider-modal-overlay">
          <div className="slider-modal-card">
            <div className="slider-modal-header">
              <h3>{isEditing ? "Edit Course" : "Add New Course"}</h3>
              <button className="slider-close-btn" onClick={resetForm}>
                ×
              </button>
            </div>

            <div className="slider-modal-body">
              <label>Title</label>
              <input name="title" value={formCourse.title} onChange={handleChange} />

              <label>Description</label>
              <textarea
                name="description"
                value={formCourse.description}
                onChange={handleChange}
              />

              <label>Duration</label>
              <input name="duration" value={formCourse.duration} onChange={handleChange} />

              <label>Start Date</label>
              <input name="startDate" value={formCourse.startDate} onChange={handleChange} />

              <label>Time</label>
              <input name="time" value={formCourse.time} onChange={handleChange} />

              <label>Status</label>
              <select name="status" value={formCourse.status} onChange={handleChange}>
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
                onClick={isEditing ? handleUpdateCourse : handleAddCourse}
              >
                {isEditing ? "Update Course" : "Add Course"}
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
              <th>Duration</th>
              <th>Start Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((course, index) => (
              <tr key={course.id}>
                <td className="slider-order-col">
                  <button onClick={() => moveUp(index)}>↑</button>
                  <span>{index + 1}</span>
                  <button onClick={() => moveDown(index)}>↓</button>
                </td>

                <td>{course.title}</td>
                <td>{course.duration}</td>
                <td>{course.startDate}</td>
                <td>{course.time}</td>

                <td>
                  <span
                    className={`slider-status ${
                      course.status === "Active" ? "active" : "inactive"
                    }`}
                  >
                    {course.status}
                  </span>
                </td>

                <td className="slider-icon-actions">
                  <button className="edit" onClick={() => handleEdit(course)}>
                    <FaEdit />
                  </button>
                  <button
                    className="toggle"
                    onClick={() => handleToggleStatus(course.id)}
                  >
                    {course.status === "Active" ? <FaEye /> : <FaEyeSlash />}
                  </button>
                  <button className="delete" onClick={() => handleDelete(course.id)}>
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

export default ManageCourses;
