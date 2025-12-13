"use client"

import { useState } from "react"
import "./ManageBlog.css"

const ManageBlog = () => {
  const initialBlogs = [
    {
      id: 1,
      title: "Why 2025 Is the Breakthrough Year for Online Assessments",
      date: "Nov 30, 2025",
      excerpt:
        "Exams are becoming smarter, faster, and fully automated. Here's why schools are shifting to cloud-first evaluation.",
      category: "Exams",
      imageUrl: "/online-assessment.jpg",
      content: "Full article content here...",
      status: "published",
    },
    {
      id: 2,
      title: "How Remote Learning Is Transforming Education",
      date: "Dec 15, 2025",
      excerpt:
        "Discover the latest trends in remote learning and how technology is reshaping the educational landscape.",
      category: "Education",
      imageUrl: "/remote-learning.jpg",
      content: "Remote learning has become an integral part of modern education...",
      status: "published",
    },
    {
      id: 3,
      title: "The Future of AI-Powered Grading Systems",
      date: "Jan 10, 2026",
      excerpt: "Artificial intelligence is revolutionizing how we evaluate student performance and provide feedback.",
      category: "Technology",
      imageUrl: "/ai-grading.jpg",
      content: "AI-powered grading systems are changing the game...",
      status: "published",
    },
  ]

  const [blogs, setBlogs] = useState(initialBlogs)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Exams",
    imageUrl: "",
    date: new Date().toISOString().split("T")[0],
  })

  const categories = ["all", ...new Set(blogs.map((blog) => blog.category))]

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || blog.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddBlog = () => {
    setEditingBlog(null)
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "Exams",
      imageUrl: "",
      date: new Date().toISOString().split("T")[0],
    })
    setShowModal(true)
  }

  const handleEditBlog = (blog) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content || blog.excerpt,
      category: blog.category,
      imageUrl: blog.imageUrl,
      date: blog.date,
    })
    setShowModal(true)
  }

  const handleDeleteBlog = (id) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      setBlogs((prev) => prev.filter((blog) => blog.id !== id))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingBlog) {
      setBlogs((prev) => prev.map((blog) => (blog.id === editingBlog.id ? { ...blog, ...formData } : blog)))
    } else {
      const newBlog = {
        id: Math.max(...blogs.map((b) => b.id), 0) + 1,
        ...formData,
        status: "published",
      }
      setBlogs((prev) => [newBlog, ...prev])
    }

    setShowModal(false)
  }

  return (
    <div className="manage-blog-container">
      <div className="manage-blog-header">
        <h1>Manage Blog Posts</h1>
        <button className="add-blog-btn" onClick={handleAddBlog}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New Blog
        </button>
      </div>

      <div className="blog-filters">
        <div className="search-filter">
          <svg
            className="search-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="category-filter">
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="blog-table-container">
        {filteredBlogs.length > 0 ? (
          <table className="blog-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title & Excerpt</th>
                <th>Date</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.map((blog) => (
                <tr key={blog.id} className="blog-row">
                  <td className="blog-image-cell">
                    <img src={blog.imageUrl || "/placeholder.svg"} alt={blog.title} className="blog-image" />
                  </td>
                  <td className="blog-title-cell">
                    <div className="blog-title">{blog.title}</div>
                    <div className="blog-excerpt">{blog.excerpt}</div>
                  </td>
                  <td className="blog-date-cell">
                    <div className="blog-date">{blog.date}</div>
                  </td>
                  <td className="blog-category-cell">
                    <span className="blog-category">{blog.category}</span>
                  </td>
                  <td className="blog-actions-cell">
                    <div className="action-buttons">
                      <button className="edit-btn" onClick={() => handleEditBlog(blog)}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                        Edit
                      </button>
                      <button className="delete-btn" onClick={() => handleDeleteBlog(blog.id)}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <h3>No blog posts found</h3>
            <p>Try adjusting your search or add a new blog post.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="blog-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingBlog ? "Edit Blog Post" : "Add New Blog Post"}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="blog-form">
              <div className="form-group">
                <label htmlFor="title">Blog Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter blog title"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="excerpt">Excerpt</label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="Enter short excerpt"
                  required
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">Full Content</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Enter full blog content"
                  required
                  rows="6"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select id="category" name="category" value={formData.category} onChange={handleInputChange}>
                  {categories
                    .filter((cat) => cat !== "all")
                    .map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="date">Publish Date</label>
                <input
                  type="text"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  placeholder="Nov 30, 2025"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="imageUrl">Featured Image URL</label>
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.imageUrl && (
                  <img src={formData.imageUrl || "/placeholder.svg"} alt="Preview" className="image-preview show" />
                )}
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingBlog ? "Update Blog" : "Publish Blog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageBlog
