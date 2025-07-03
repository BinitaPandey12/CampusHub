import React from "react";
import "./Profile.css";

function Profile() {
  // In real project, get these from context or API
  const user = {
    name: "{user.name}",
    email: "{user.email}",
    role: "{user.role}",
    avatar: "https://i.pravatar.cc/150?img=8"
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img src={user.avatar} alt="Profile" className="profile-avatar" />
        <h2 className="profile-name">{user.name}</h2>
        <p className="profile-role">{user.role}</p>
        <p className="profile-email">{user.email}</p>
        <button className="edit-btn">Edit Profile</button>
      </div>
    </div>
  );
}

export default Profile;
