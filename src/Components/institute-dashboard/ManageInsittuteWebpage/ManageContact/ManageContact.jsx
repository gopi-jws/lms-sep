import React, { useState } from "react";
import "./ManageContact.css";

const ManageContact = () => {
  const [data, setData] = useState({
    // Hero Section
    heroTitle: "Get In Touch",
    heroDescription: "Reference giving information on its origins, as well as a random Lipsum generator.",
    heroImage: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&auto=format&fit=crop",
    
    // Form Section
    formTitle: "Fillup The Form",
    
    // Contact Information
    contactTitle: "Get In Touch",
    contactDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.",
    addressTitle: "Reach Us",
    address: "2512, New Market, Eliza Road, Tamilnadu, India",
    emailTitle: "Drop A Mail",
    email: "support@lms-saas.com",
    phoneTitle: "Call Us",
    phone: "+91 8615487548",
    
    // CTA Section
    ctaTitle: "Join Thousands Of Happy Students!",
    ctaDescription: "Subscribe to our newsletter & get the latest updates!"
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [imagePreview, setImagePreview] = useState(data.heroImage);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setData({ ...data, heroImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Contact page updated successfully!");
    setMessageType("success");
    
    setTimeout(() => {
      setLoading(false);
      setMessage("");
      setMessageType("");
    }, 2000);
  };

  return (
    <div className="institute-home">
      <h2 className="institute-home__title">Manage Contact Page</h2>

      {message && (
        <div className={`institute-home__alert ${messageType === "error" ? "error" : "success"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="institute-home__form">
        {/* Hero Section */}
        <div className="institute-home__card">
          <h3 className="institute-home__card-title">Hero Section</h3>
          
          {/* Image Upload */}
          <div className="institute-home__image-upload">
            <label className="institute-home__image-label">Hero Background Image</label>
            <div className="institute-home__image-preview-container">
              <div className="institute-home__image-preview">
                <img src={imagePreview} alt="Hero Preview" />
              </div>
              <div className="institute-home__image-upload-controls">
                <input
                  type="file"
                  id="heroImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="institute-home__file-input"
                />
                <label htmlFor="heroImage" className="institute-home__file-label">
                  Choose Image
                </label>
                <button 
                  type="button" 
                  className="institute-home__remove-image"
                  onClick={() => {
                    setImagePreview("");
                    setData({ ...data, heroImage: "" });
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          <div className="institute-home__field">
            <label>Hero Title</label>
            <input
              type="text"
              name="heroTitle"
              value={data.heroTitle}
              onChange={handleChange}
              placeholder="Enter hero title"
            />
          </div>

          <div className="institute-home__field">
            <label>Hero Description</label>
            <textarea
              name="heroDescription"
              value={data.heroDescription}
              onChange={handleChange}
              placeholder="Enter hero description"
              rows="3"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="institute-home__card">
          <h3 className="institute-home__card-title">Contact Information</h3>

          <div className="institute-home__field">
            <label>Section Title</label>
            <input
              type="text"
              name="contactTitle"
              value={data.contactTitle}
              onChange={handleChange}
              placeholder="Enter section title"
            />
          </div>

          <div className="institute-home__field">
            <label>Section Description</label>
            <textarea
              name="contactDescription"
              value={data.contactDescription}
              onChange={handleChange}
              placeholder="Enter section description"
              rows="2"
            />
          </div>

          <div className="institute-home__field-group">
            <div className="institute-home__field">
              <label>Address Title</label>
              <input
                type="text"
                name="addressTitle"
                value={data.addressTitle}
                onChange={handleChange}
                placeholder="Enter address title"
              />
            </div>

            <div className="institute-home__field">
              <label>Address</label>
              <textarea
                name="address"
                value={data.address}
                onChange={handleChange}
                placeholder="Enter address"
                rows="3"
              />
            </div>
          </div>

          <div className="institute-home__field-group">
            <div className="institute-home__field">
              <label>Email Title</label>
              <input
                type="text"
                name="emailTitle"
                value={data.emailTitle}
                onChange={handleChange}
                placeholder="Enter email title"
              />
            </div>

            <div className="institute-home__field">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className="institute-home__field-group">
            <div className="institute-home__field">
              <label>Phone Title</label>
              <input
                type="text"
                name="phoneTitle"
                value={data.phoneTitle}
                onChange={handleChange}
                placeholder="Enter phone title"
              />
            </div>

            <div className="institute-home__field">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={data.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="institute-home__card">
          <h3 className="institute-home__card-title">CTA Section</h3>

          <div className="institute-home__field">
            <label>CTA Title</label>
            <input
              type="text"
              name="ctaTitle"
              value={data.ctaTitle}
              onChange={handleChange}
              placeholder="Enter CTA title"
            />
          </div>

          <div className="institute-home__field">
            <label>CTA Description</label>
            <textarea
              name="ctaDescription"
              value={data.ctaDescription}
              onChange={handleChange}
              placeholder="Enter CTA description"
              rows="3"
            />
          </div>
        </div>

        <button type="submit" className="institute-home__btn" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ManageContact;