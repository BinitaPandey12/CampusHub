import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./ChatbotHelp.css";

function ChatbotHelp() {
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
    <div className="chatbot-dashboard-layout">
      {/* Sidebar */}
      <aside className="chatbot-sidebar">
        <div className="chatbot-sidebar-title">Campus Hub</div>
        <nav>
          <Link to="/user-dashboard" className="chatbot-sidebar-link">🏠 Dashboard</Link>
          <Link to="/myevents" className="chatbot-sidebar-link">📆 My Events</Link>
          <Link to="/joined" className="chatbot-sidebar-link">📝 Joined Clubs</Link>
          <Link to="/chatbot" className="chatbot-sidebar-link">💬 Chatbot Help</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="chatbot-main">
        {/* Header */}
        <header className="chatbot-header">
          <div className="chatbot-search">
            <input placeholder="🔍 Search help topics..." />
          </div>
          <div className="chatbot-profile" ref={dropdownRef}>
            <span className="chatbot-welcome-text">Welcome, {userName}</span>
            <button
              className="chatbot-profile-icon"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              👤
            </button>
            {dropdownOpen && (
              <div className="chatbot-dropdown-menu">
                <Link to="/profile" className="chatbot-dropdown-item">View Profile</Link>
                <Link to="/settings" className="chatbot-dropdown-item">Settings</Link>
                <Link to="/" className="chatbot-dropdown-item chatbot-logout">Logout</Link>
              </div>
            )}
          </div>
        </header>

        {/* Chatbot Section */}
        <section className="chatbot-container">
          <h2 className="chatbot-title">Chatbot Help</h2>
          <p className="chatbot-description">
            Need assistance? Our chatbot is here to help you 24/7.
          </p>
          <div className="chatbot-box">
            <p>Chatbot interface will appear here.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ChatbotHelp;
