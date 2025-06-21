import React, { useState, useEffect } from "react";
import "./Settings.css";

const Settings = ({ userRole }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    clubName: "",
    systemPermissions: false,
  });

  useEffect(() => {
    // Simulate fetching user data based on role
    if (userRole === "systemAdmin") {
      setFormData({
        name: "System Admin",
        email: "sysadmin@example.com",
        password: "",
        clubName: "",
        systemPermissions: true,
      });
    } else if (userRole === "clubAdmin") {
      setFormData({
        name: "Club Admin",
        email: "clubadmin@example.com",
        password: "",
        clubName: "Nepal Tek Community",
        systemPermissions: false,
      });
    } else {
      setFormData({
        name: "Normal User",
        email: "user@example.com",
        password: "",
        clubName: "",
        systemPermissions: false,
      });
    }
  }, [userRole]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Settings updated for role: ${userRole}\n` +
        JSON.stringify(formData, null, 2)
    );
    // Add your update logic here
  };

  return (
    <div className="settings-wrapper">
      <form className="settings-card" onSubmit={handleSubmit}>
        <h2 className="settings-heading">
          {userRole === "systemAdmin"
            ? "System Admin Settings"
            : userRole === "clubAdmin"
            ? "Club Admin Settings"
            : "User Settings"}
        </h2>

        <label htmlFor="name" className="settings-label">
          Name
        </label>
        <input
          type="text"
          id="name"
          className="settings-input"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email" className="settings-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="settings-input"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password" className="settings-label">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="settings-input"
          placeholder="New password"
          value={formData.password}
          onChange={handleChange}
        />

        {/* Club Admin specific input */}
        {userRole === "clubAdmin" && (
          <>
            <label htmlFor="clubName" className="settings-label">
              Club Name
            </label>
            <input
              type="text"
              id="clubName"
              className="settings-input"
              placeholder="Your club name"
              value={formData.clubName}
              onChange={handleChange}
              required
            />
          </>
        )}

        {/* System Admin specific checkbox */}
        {userRole === "systemAdmin" && (
          <div className="settings-checkbox-wrapper">
            <input
              type="checkbox"
              id="systemPermissions"
              checked={formData.systemPermissions}
              onChange={handleChange}
              className="settings-checkbox"
            />
            <label
              htmlFor="systemPermissions"
              className="settings-checkbox-label"
            >
              Has system-wide permissions
            </label>
          </div>
        )}

        <button type="submit" className="settings-button">
          Update Settings
        </button>
      </form>
    </div>
  );
};

export default Settings;
