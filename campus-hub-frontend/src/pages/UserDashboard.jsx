import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./UserDashboard.css";

const clubs = [
  {
    id: 1,
    name: "Tech Club",
    description: "A club for tech enthusiasts exploring the latest trends.",
    newEvent: true,
    joined: true,
  },
  {
    id: 2,
    name: "Literary Club",
    description: "For writers, poets, and literature lovers.",
    newEvent: false,
    joined: false,
  },
];

const upcomingEvents = [
  {
    title: "Hackathon 2025",
    club: "Tech Club",
    time: new Date(new Date().getTime() + 3 * 60 * 60 * 1000),
  },
  {
    title: "Poetry Slam",
    club: "Literary Club",
    time: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  },
];

function getCountdown(eventTime) {
  const now = new Date();
  const diff = Math.max(eventTime - now, 0);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return `⏰ Event in ${hours}h ${minutes}m`;
}

const UserDashboard = () => {
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
    <div className="user-dashboard-layout">
      <aside className="user-sidebar">
        <div className="user-sidebar-title">Campus Hub</div>
        <nav>
          <Link to="/user-dashboard" className="user-sidebar-link">🏠 Dashboard</Link>
          <Link to="/myevents" className="user-sidebar-link">📆 My Events</Link>
          <Link to="/joined" className="user-sidebar-link">📝 Joined Clubs</Link>
          <Link to="/chatbot" className="user-sidebar-link">💬 Chatbot Help</Link>
        </nav>
      </aside>
      <div className="user-main">
        <header className="user-header">
          <div className="user-search">
            <input placeholder="🔍 Search clubs, tags..." />
          </div>
          <div className="user-profile" ref={dropdownRef}>
            <span className="user-welcome-text">Welcome, {userName}</span>
            <button
              className="user-profile-icon"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              👤
            </button>
            {dropdownOpen && (
              <div className="user-dropdown-menu">
                <Link to="/profile" className="user-dropdown-item">View Profile</Link>
                <Link to="/settings" className="user-dropdown-item">Settings</Link>
                <Link to="/" className="user-dropdown-item user-logout">Logout</Link>
              </div>
            )}
          </div>
        </header>
        <section className="user-content">
          <h2>Recommended Clubs</h2>
          <div className="user-clubs-grid">
            {clubs.map((club) => (
              <div key={club.id} className="user-club-card">
                <div className="user-club-name">
                  {club.name}
                  {club.newEvent && <span className="user-badge">🔴 New Event</span>}
                </div>
                <p>{club.description}</p>
                <button className="user-view-btn">
                  {club.joined ? "View Club" : "Join Club"}
                </button>
              </div>
            ))}
          </div>
          <h2>Upcoming Events</h2>
          <div className="user-events-list">
            {upcomingEvents.map((event, idx) => (
              <div key={idx} className="user-event-card">
                <div>
                  <h4>{event.title}</h4>
                  <p>Hosted by {event.club}</p>
                  <span className="user-countdown">{getCountdown(event.time)}</span>
                </div>
                <button className="user-view-btn">View Details</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserDashboard;
