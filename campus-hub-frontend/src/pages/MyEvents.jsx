import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./MyEvents.css";

const myEvents = [
  {
    id: 1,
    title: "Tech Innovators Workshop",
    date: "2025-08-15",
    location: "Main Auditorium",
    description: "Join the latest workshop on AI and blockchain innovations.",
  },
  {
    id: 2,
    title: "Design Sprint Marathon",
    date: "2025-09-01",
    location: "Room 204",
    description: "A 48-hour design thinking marathon.",
  },
];

const MyEvents = () => {
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
    <div className="myevents-dashboard-layout">
      <aside className="myevents-sidebar">
        <div className="myevents-sidebar-title">Campus Hub</div>
        <nav>
          <Link to="/user-dashboard" className="myevents-sidebar-link">🏠 Dashboard</Link>
          <Link to="/myevents" className="myevents-sidebar-link">📆 My Events</Link>
          <Link to="/joined" className="myevents-sidebar-link">📝 Joined Clubs</Link>
          <Link to="/chatbot" className="myevents-sidebar-link">💬 Chatbot Help</Link>
        </nav>
      </aside>
      <main className="myevents-main">
        <header className="myevents-header">
          <div className="myevents-search">
            <input placeholder="🔍 Search your events..." />
          </div>
          <div className="myevents-profile" ref={dropdownRef}>
            <span className="myevents-welcome-text">Welcome, {userName}</span>
            <button
              className="myevents-profile-icon"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              👤
            </button>
            {dropdownOpen && (
              <div className="myevents-dropdown-menu">
                <Link to="/profile" className="myevents-dropdown-item">View Profile</Link>
                <Link to="/settings" className="myevents-dropdown-item">Settings</Link>
                <Link to="/" className="myevents-dropdown-item myevents-logout">Logout</Link>
              </div>
            )}
          </div>
        </header>
        <section className="myevents-content">
          <h1>My Events</h1>
          {myEvents.map(event => (
            <div key={event.id} className="myevents-event-card">
              <div>
                <h4>{event.title}</h4>
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p>{event.description}</p>
              </div>
              <button className="myevents-view-btn">View Details</button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default MyEvents;
