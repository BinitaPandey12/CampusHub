import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiCalendar, FiMapPin, FiDollarSign, FiClock, FiInfo, FiImage, FiX, FiUpload } from "react-icons/fi";
import "./EventForm.css";

const EventForm = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
  
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const removeImage = () => {
    setEventData(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!eventData.title.trim()) newErrors.title = "Title is required";
    if (!eventData.description.trim()) newErrors.description = "Description is required";
    if (!eventData.date) newErrors.date = "Date is required";
    if (!eventData.time) newErrors.time = "Time is required";
    if (!eventData.location.trim()) newErrors.location = "Location is required";
    if (!eventData.price) newErrors.price = "Price is required";
    if (isNaN(eventData.price)) newErrors.price = "Price must be a number";
    if (!eventData.capacity) newErrors.capacity = "Capacity is required";
    if (isNaN(eventData.capacity)) newErrors.capacity = "Capacity must be a number";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("title", eventData.title);
      formData.append("description", eventData.description);
      formData.append("date", eventData.date);
      formData.append("time", eventData.time);
      formData.append("location", eventData.location);
      
      
      const response = await axios.post("http://localhost:8080/api/events", formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      
      setSuccessMessage("Event created successfully!");
      setTimeout(() => {
        navigate("/club-admin");
      }, 2000);
    } catch (error) {
      console.error("Error creating event:", error);
      setErrors(prev => ({
        ...prev,
        server: error.response?.data?.message || "Failed to create event. Please try again."
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="event-form-container">
      <div className="event-form-card">
        <h2 className="event-form-title">
          <span className="title-gradient">Create New Event</span>
        </h2>
        
        {successMessage && (
          <div className="success-message">
            <svg className="success-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
            </svg>
            {successMessage}
          </div>
        )}
        
        {errors.server && (
          <div className="error-message">
            <svg className="error-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M11 15H13V17H11V15ZM11 7H13V13H11V7M12 2C6.47 2 2 6.5 2 12C2 17.5 6.5 22 12 22S22 17.5 22 12 17.5 2 12 2M12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4S20 7.58 20 12C20 16.42 16.42 20 12 20Z" />
            </svg>
            {errors.server}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label htmlFor="title">Event Title</label>
            <div className="input-with-icon">
              <FiInfo className="input-icon" />
              <input
                type="text"
                id="title"
                name="title"
                value={eventData.title}
                onChange={handleChange}
                placeholder="Enter event title"
                className={`event-form-input ${errors.title ? "error" : ""}`}
              />
            </div>
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={eventData.description}
              onChange={handleChange}
              placeholder="Enter event description"
              rows="5"
              className={`event-form-textarea ${errors.description ? "error" : ""}`}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <div className="input-with-icon">
                <FiCalendar className="input-icon" />
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={eventData.date}
                  onChange={handleChange}
                  className={`event-form-input ${errors.date ? "error" : ""}`}
                />
              </div>
              {errors.date && <span className="error-text">{errors.date}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="time">Time</label>
              <div className="input-with-icon">
                <FiClock className="input-icon" />
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={eventData.time}
                  onChange={handleChange}
                  className={`event-form-input ${errors.time ? "error" : ""}`}
                />
              </div>
              {errors.time && <span className="error-text">{errors.time}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <div className="input-with-icon">
              <FiMapPin className="input-icon" />
              <input
                type="text"
                id="location"
                name="location"
                value={eventData.location}
                onChange={handleChange}
                placeholder="Enter event location"
                className={`event-form-input ${errors.location ? "error" : ""}`}
              />
            </div>
            {errors.location && <span className="error-text">{errors.location}</span>}
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate("/club-admin")}
              className="cancel-btn"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Creating...
                </>
              ) : (
                "Create Event"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;