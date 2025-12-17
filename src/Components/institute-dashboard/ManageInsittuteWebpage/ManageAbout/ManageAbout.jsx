import React, { useState, useEffect, useRef } from "react";
import "../ManageContact/ManageContact.css";
import { VscTriangleDown } from "react-icons/vsc";
import SidebarMenu from "../../dashboard/sidebar/sidemenu";

const ManageAbout = () => {
  /* ============ SIDEBAR (same logic as others) ============ */
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

  /* ============ ORIGINAL STATE ============ */
  const [data, setData] = useState({
    /* HERO SECTION */
    heroTitle: "About Us",
    heroSubtitle:
      "Building the future of online examinations — modern, simple & reliable.",

    /* MAIN SECTION */
    mainHeading: "Professionalism • Excellence • On-Time Delivery",
    para1:
      "Our LMS SaaS platform is designed for institutes that demand accuracy, speed, and reliability in their online examinations.",
    para2:
      "We understand how important it is for institutes to maintain consistency and trust.",
    para3:
      "Whether you're a coaching institute, school, college, or training center — our platform adapts to your needs.",
    para4:
      "With thousands of successful online tests delivered, we stay committed to innovation and excellence.",

    mainImage:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",

    statsCount: "200+",
    statsLabel: "Institutes Served",

    /* CTA SECTION */
    ctaSmallTitle: "Work With Us",
    ctaMainTitle:
      "Experience the difference of a modern & reliable LMS built for your institute.",
    ctaButtonText: "Contact Us",
    ctaButtonLink: "/contact",
    ctaBackgroundImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  });

  const [imagePreview, setImagePreview] = useState(data.mainImage);
  const [ctaBgPreview, setCtaBgPreview] = useState(data.ctaBackgroundImage);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setData({ ...data, mainImage: reader.result });
    };
    reader.readAsDataURL(file);
  };

  /* CTA BACKGROUND IMAGE HANDLER */
  const handleCtaBgChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCtaBgPreview(reader.result);
      setData({ ...data, ctaBackgroundImage: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("About page updated successfully!");

    setTimeout(() => {
      setLoading(false);
      setMessage("");
    }, 2000);
  };

  return (
    <div className="institute-home">
      {/* ===== MOBILE HEADER (uses same pattern as others) ===== */}
   

      {/* ===== DESKTOP HEADER ===== */}
      <div className="institute-home__header desktop-only">
        <h2 className="institute-home__title">Manage About Page <VscTriangleDown
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

      {/* ALERT */}
      {message && (
        <div className="institute-home__alert success">{message}</div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="institute-home__form">
        {/* HERO SECTION */}
        <div className="institute-home__card">
          <h3 className="institute-home__card-title">Hero Section</h3>

          <div className="institute-home__field">
            <label>Hero Title</label>
            <input
              type="text"
              name="heroTitle"
              value={data.heroTitle}
              onChange={handleChange}
            />
          </div>

          <div className="institute-home__field">
            <label>Hero Subtitle</label>
            <textarea
              name="heroSubtitle"
              value={data.heroSubtitle}
              onChange={handleChange}
              rows="3"
            />
          </div>
        </div>

        {/* MAIN CONTENT SECTION */}
        <div className="institute-home__card">
          <h3 className="institute-home__card-title">Main Content Section</h3>

          <div className="institute-home__field">
            <label>Main Heading</label>
            <input
              type="text"
              name="mainHeading"
              value={data.mainHeading}
              onChange={handleChange}
            />
          </div>

          <div className="institute-home__field">
            <label>Paragraph 1</label>
            <textarea name="para1" value={data.para1} onChange={handleChange} />
          </div>

          <div className="institute-home__field">
            <label>Paragraph 2</label>
            <textarea name="para2" value={data.para2} onChange={handleChange} />
          </div>

          <div className="institute-home__field">
            <label>Paragraph 3</label>
            <textarea name="para3" value={data.para3} onChange={handleChange} />
          </div>

          <div className="institute-home__field">
            <label>Paragraph 4</label>
            <textarea name="para4" value={data.para4} onChange={handleChange} />
          </div>

          <div className="institute-home__image-upload">
            <label>Main Image</label>
            <div className="institute-home__image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="institute-home__field">
            <label>Stats Count</label>
            <input
              type="text"
              name="statsCount"
              value={data.statsCount}
              onChange={handleChange}
            />
          </div>

          <div className="institute-home__field">
            <label>Stats Label</label>
            <input
              type="text"
              name="statsLabel"
              value={data.statsLabel}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* CTA SECTION */}
        <div className="institute-home__card">
          <h3 className="institute-home__card-title">CTA Section</h3>

          <div className="institute-home__field">
            <label>CTA Background Image</label>
            <div className="institute-home__image-preview">
              <img src={ctaBgPreview} alt="CTA Preview" />
            </div>
            <input type="file" accept="image/*" onChange={handleCtaBgChange} />
          </div>

          <div className="institute-home__field">
            <label>Small Title</label>
            <input
              type="text"
              name="ctaSmallTitle"
              value={data.ctaSmallTitle}
              onChange={handleChange}
            />
          </div>

          <div className="institute-home__field">
            <label>Main Title</label>
            <textarea
              name="ctaMainTitle"
              value={data.ctaMainTitle}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="institute-home__field">
            <label>Button Text</label>
            <input
              type="text"
              name="ctaButtonText"
              value={data.ctaButtonText}
              onChange={handleChange}
            />
          </div>

          <div className="institute-home__field">
            <label>Button Link</label>
            <input
              type="text"
              name="ctaButtonLink"
              value={data.ctaButtonLink}
              onChange={handleChange}
            />
          </div>
        </div>

        <button className="institute-home__btn" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ManageAbout;
