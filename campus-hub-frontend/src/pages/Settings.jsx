import React from "react";
import "./Settings.css";

const Settings = () => {
  return (
    <div className="settings-wrapper">
      <div className="settings-card">
        <h2 className="settings-heading">User Settings</h2>
        <div className="settings-section">
          <label htmlFor="name" className="settings-label">Name</label>
          <input type="text" id="name" className="settings-input" placeholder="Your name" />

          <label htmlFor="email" className="settings-label">Email</label>
          <input type="email" id="email" className="settings-input" placeholder="your@email.com" />

          <label htmlFor="password" className="settings-label">Password</label>
          <input type="password" id="password" className="settings-input" placeholder="New password" />

          <button className="settings-button">Update Settings</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
