import React, { useState, useEffect } from "react";
import { FiUser, FiMail, FiLock, FiUsers, FiShield, FiSave, FiEdit, FiChevronLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./Settings.css";

const Settings = ({ userRole }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    clubName: "",
    systemPermissions: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    // Load different data based on user role
    const loadUserData = () => {
      switch(userRole) {
        case "systemAdmin":
          setFormData({
            name: "System Admin",
            email: "sysadmin@example.com",
            password: "",
            clubName: "",
            systemPermissions: true
          });
          break;
        case "clubAdmin":
          setFormData({
            name: "Club Admin",
            email: "clubadmin@example.com",
            password: "",
            clubName: "Nepal Tek Community",
            systemPermissions: false
          });
          break;
        default: // Regular user
          setFormData({
            name: "",
            email: "",
            password: "",
            clubName: "",
            systemPermissions: false
          });
      }
    };
    loadUserData();
  }, [userRole]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setProfilePic(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    console.log("Updated settings:", formData);
    // Add your actual update logic here
  };

  const renderRoleBadge = () => {
    let badgeClass = "";
    let badgeText = "";
    
    switch(userRole) {
      case "systemAdmin":
        badgeClass = "badge-system";
        badgeText = "System Admin";
        break;
      case "clubAdmin":
        badgeClass = "badge-club";
        badgeText = "Club Admin";
        break;
      default:
        badgeClass = "badge-user";
        badgeText = "Member";
    }
    
    return <span className={`badge ${badgeClass}`}>{badgeText}</span>;
  };

  const renderRoleSpecificFields = () => {
    switch(userRole) {
      case "systemAdmin":
        return (
          <div className="form-section">
            <h4><FiShield className="section-icon" /> Admin Privileges</h4>
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="systemPermissions"
                checked={formData.systemPermissions}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <label htmlFor="systemPermissions">
                Full system administration privileges
              </label>
            </div>
          </div>
        );
      case "clubAdmin":
        return (
          <div className="form-section">
            <h4><FiUsers className="section-icon" /> Club Management</h4>
            <div className="form-group">
              <label htmlFor="clubName"><FiUsers /> Club Name</label>
              <input
                type="text"
                id="clubName"
                value={formData.clubName}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <Link to="/" className="back-button">
          <FiChevronLeft /> Back to Dashboard
        </Link>
        
        <div className="settings-header">
          <h2>Account Settings</h2>
          <p>Manage your {userRole === "systemAdmin" ? "system" : userRole === "clubAdmin" ? "club" : "account"} preferences</p>
        </div>

        <div className="settings-content">
          <div className="profile-section">
            <div className="profile-pic-container">
              <div className="profile-pic-wrapper">
                <img 
                  src={profilePic || `https://ui-avatars.com/api/?name=${formData.name}&background=random`} 
                  alt="Profile" 
                  className="profile-pic"
                />
                {isEditing && (
                  <label className="profile-pic-edit">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      style={{ display: 'none' }}
                    />
                    <FiEdit size={18} />
                  </label>
                )}
              </div>
              <div className="profile-info">
                <h3>{formData.name}</h3>
                <div className="profile-meta">
                  {renderRoleBadge()}
                  <span>{formData.email}</span>
                </div>
              </div>
            </div>

            {!isEditing ? (
              <button 
                className="edit-btn"
                onClick={() => setIsEditing(true)}
              >
                <FiEdit /> Edit Profile
              </button>
            ) : (
              <div className="action-buttons">
                <button 
                  className="cancel-btn"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="save-btn"
                  form="settings-form"
                >
                  <FiSave /> Save Changes
                </button>
              </div>
            )}
          </div>

          <form id="settings-form" onSubmit={handleSubmit} className="settings-form">
            <div className="form-section">
              <h4><FiUser className="section-icon" /> Personal Information</h4>
              <div className="form-group">
                <label htmlFor="name"><FiUser /> Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email"><FiMail /> Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h4><FiLock className="section-icon" /> Security</h4>
              <div className="form-group">
                <label htmlFor="password"><FiLock /> Change Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="New password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                {isEditing && (
                  <small className="hint-text">
                    Leave blank to keep current password
                  </small>
                )}
              </div>
            </div>

            {/* Role-specific fields */}
            {renderRoleSpecificFields()}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;