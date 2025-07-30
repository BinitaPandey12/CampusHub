import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../Styles/FormFill.css";

const FormFill = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: localStorage.getItem("username") || "",
    email: localStorage.getItem("email") || "",
    department: "",
    contactNo: "",
    semester: "",
    eventId: eventId || "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [eventDetails, setEventDetails] = useState(null);

  const departments = [
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
  ];

  // Enhanced validation function
  const validateForm = () => {
    const errors = [];
    if (!form.fullName.trim()) errors.push("Full Name is required");
    if (!form.email.trim()) errors.push("Email is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.push("Invalid email format");
    if (!form.department) errors.push("Department is required");
    if (!form.contactNo) errors.push("Phone Number is required");
    if (!/^\d{10}$/.test(form.contactNo))
      errors.push("Phone must be 10 digits");
    if (!form.semester) errors.push("Semester is required");
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Construct the complete API URL
    const API_URL = `${window.location.origin.replace(
      /:\d+$/,
      ":8080"
    )}/api/enrollments/register`;

    try {
      console.log("Attempting to call:", API_URL); // Debugging

      const response = await axios.post(
        API_URL,
        {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          department: form.department,
          contactNo: form.contactNo,
          semester: form.semester,
          eventId: form.eventId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          timeout: 10000,
        }
      );

      console.log("API Response:", response); // Debugging

      if (response.status === 201) {
        setSuccess("Enrollment successful!");
        setTimeout(() => navigate("/myevents"), 2000);
      } else {
        setError(response.data?.message || "Registration failed");
      }
    } catch (err) {
      console.error("Full error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config,
      });

      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError("Already enrolled in this event.");
            break;
          case 401:
            setError("Please login again");
            setTimeout(() => navigate("/login"), 1500);
            break;
          case 404:
            setError("API endpoint not found. Please check the URL.");
            break;
          default:
            setError(`Server error: ${err.response.status}`);
        }
      } else if (err.code === "ECONNABORTED") {
        setError("Request timeout - server is not responding");
      } else if (err.request) {
        setError("Network error - server is unreachable");
      } else {
        setError("Request configuration error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="form-page-container">
      <div className="form-card">
        <div className="form-header">
          <h2>Event Enrollment</h2>
          {eventId && <p className="event-id-text">Event ID: {eventId}</p>}
          <p>Please fill out all required fields</p>
        </div>

        {error && (
          <div className="error-message">
            <svg className="error-icon" viewBox="0 0 20 20">
              <path d="M10,0C4.5,0,0,4.5,0,10s4.5,10,10,10s10-4.5,10-10S15.5,0,10,0z M10,18c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S14.4,18,10,18z" />
              <path d="M10,5c-0.6,0-1,0.4-1,1v5c0,0.6,0.4,1,1,1s1-0.4,1-1V6C11,5.4,10.6,5,10,5z" />
              <path d="M10,14c0.6,0,1-0.4,1-1s-0.4-1-1-1s-1,0.4-1,1S9.4,14,10,14z" />
            </svg>
            {error}
            <button onClick={() => setError("")} className="dismiss-btn">
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="success-message">
            <svg className="success-icon" viewBox="0 0 20 20">
              <path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z" />
            </svg>
            Enrollment submitted successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="fullName">
              Full Name <span className="required">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              autoComplete="name"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              disabled={isSubmitting}
              readOnly
            />
          </div>

          <div className="form-group">
            <label htmlFor="department">
              Department <span className="required">*</span>
            </label>
            <select
              id="department"
              name="department"
              value={form.department}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="">Select your department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="contactNo">
              Phone Number <span className="required">*</span>
            </label>
            <input
              id="contactNo"
              name="contactNo"
              type="tel"
              value={form.contactNo}
              onChange={handleChange}
              placeholder="Enter 10-digit number"
              pattern="[0-9]{10}"
              maxLength="10"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="semester">
              Semester <span className="required">*</span>
            </label>
            <select
              id="semester"
              name="semester"
              value={form.semester}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="">Select semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  Semester {num}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(-1)}
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
                  Processing...
                </>
              ) : (
                "Submit Enrollment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormFill;
