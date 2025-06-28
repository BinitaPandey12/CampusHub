import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./JoinedClubs.css";

const JoinedClubs = () => {
  const userName = "User";
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="joined-dashboard-layout">
      <aside className="joined-sidebar">
        <div className="joined-sidebar-title">Campus Hub</div>
        <nav>
          <Link to="/user-dashboard" className="joined-sidebar-link">🏠 Dashboard</Link>
          <Link to="/myevents" className="joined-sidebar-link">📆 My Events</Link>
          <Link to="/joined" className="joined-sidebar-link">📝 Joined Clubs</Link>
          <Link to="/chatbot" className="joined-sidebar-link">💬 Chatbot Help</Link>
        </nav>
      </aside>
      <main className="joined-main">
        <header className="joined-header">
          <div className="joined-search">
            <input placeholder="🔍 Search joined clubs..." />
          </div>
          <div className="joined-profile" ref={dropdownRef}>
            <span className="joined-welcome-text">Welcome, {userName}</span>
            <button
              className="joined-profile-icon"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              👤
            </button>
            {dropdownOpen && (
              <div className="joined-dropdown-menu">
                <Link to="/profile" className="joined-dropdown-item">View Profile</Link>
                <Link to="/settings" className="joined-dropdown-item">Settings</Link>
                <Link to="/" className="joined-dropdown-item joined-logout">Logout</Link>
              </div>
            )}
          </div>
        </header>
        <section className="joined-content">
          <h2 className="joined-title">Joined Clubs</h2>
          <p className="joined-description">Here are all the clubs you have joined.</p>
          <div className="joined-empty">
            <p>You haven’t joined any clubs yet.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default JoinedClubs;
