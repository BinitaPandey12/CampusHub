import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "../Styles/AddClubAdmin.css";

const API_BASE_URL = "http://localhost:8080/api";

function AddClubAdmin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CLUBADMIN"
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "password") {
      let strength = 0;
      if (value.length > 0) strength += 20;
      if (value.length >= 8) strength += 30;
      if (/[A-Z]/.test(value)) strength += 20;
      if (/[0-9]/.test(value)) strength += 20;
      if (/[^A-Za-z0-9]/.test(value)) strength += 10;
      setPasswordStrength(Math.min(strength, 100));
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength < 40) return "#ef4444";
    if (passwordStrength < 70) return "#f59e0b";
    return "#10b981";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Enhanced validation
    if (!formData.fullName.trim()) {
      setError("Club name is required");
      setIsLoading(false);
      return;
    }

    if (!formData.email.toLowerCase().endsWith("@ncit.edu.np")) {
      setError("Only @ncit.edu.np emails are allowed");
      setIsLoading(false);
      return;
    }

   

   

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/club-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: "CLUBADMIN" // Explicitly set role
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register club admin");
      }

      setSuccessMessage("Club admin registered successfully! Redirecting...");
      setTimeout(() => navigate("/system-admin"), 2000);
    } catch (error) {
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="clubadmin-container">
      <form onSubmit={handleSubmit} className="clubadmin-form">
        <h1 className="clubadmin-title">Add Club Admin</h1>
        
        {successMessage && (
          <div className="clubadmin-success">{successMessage}</div>
        )}
        
        {error && <div className="clubadmin-error">{error}</div>}

        <div className="clubadmin-form-group">
          <input
            type="text"
            id="clubadmin-fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handlePasswordChange}
            className="clubadmin-input"
            required
            placeholder="Enter club name"
          />
        </div>

        <div className="clubadmin-form-group">
          <input
            type="email"
            id="clubadmin-email"
            name="email"
            value={formData.email}
            onChange={handlePasswordChange}
            className="clubadmin-input"
            required
            placeholder="Enter email"
          />
        </div>

        <div className="clubadmin-form-group">
          <div className="clubadmin-password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="clubadmin-password"
              name="password"
              value={formData.password}
              onChange={handlePasswordChange}
              className="clubadmin-input"
              required
              placeholder="Enter password (min 8 characters)"
              minLength="8"
            />
            <span 
              className="clubadmin-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
   
          
        </div>

        <div className="clubadmin-form-actions">
          <button
            type="button"
            className="clubadmin-cancel-btn"
            onClick={() => navigate("/system-admin")}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="clubadmin-submit-btn"
           
          >
            {isLoading ? "Registering..." : "Register Club Admin"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddClubAdmin;