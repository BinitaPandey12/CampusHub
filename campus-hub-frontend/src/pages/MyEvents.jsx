import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./MyEvents.css";

const myEvents = [
  {
    id: 1,
    title: "Tech Innovators Workshop",
    date: "August 15, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "Main Auditorium",
    description: "Join the latest workshop on AI and blockchain innovations.",
  },
  {
    id: 2,
    title: "Design Sprint Marathon",
    date: "September 1, 2025",
    time: "9:00 AM - September 3, 5:00 PM",
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
    <div className="my-events">
      <aside className="my-events__sidebar">
        <div className="my-events__sidebar-title">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">CampusHub</span>
        </div>
        <nav className="my-events__nav">
          <Link to="/user-dashboard" className="my-events__nav-link">
            <span className="my-events__nav-icon">🏠</span>
            <span className="my-events__nav-text">Dashboard</span>
          </Link>
          <Link
            to="/myevents"
            className="my-events__nav-link my-events__nav-link--active"
          >
            <span className="my-events__nav-icon">📆</span>
            <span className="my-events__nav-text">My Events</span>
          </Link>
          <Link to="/chatbot" className="my-events__nav-link">
            <span className="my-events__nav-icon">💬</span>
            <span className="my-events__nav-text">Chatbot Help</span>
          </Link>
        </nav>
      </aside>

      <div className="my-events__main">
        <header className="my-events__header">
          <div className="my-events__search">
            <input
              className="my-events__search-input"
              placeholder="🔍 Search your events..."
            />
          </div>

          <div className="my-events__profile" ref={dropdownRef}>
            <span className="my-events__welcome">Welcome, {userName}</span>
            <button
              className="my-events__profile-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              👤
            </button>

            {dropdownOpen && (
              <div className="my-events__dropdown">
                <Link to="/profile" className="my-events__dropdown-item">
                  View Profile
                </Link>
                <Link to="/settings" className="my-events__dropdown-item">
                  Settings
                </Link>
                <Link
                  to="/"
                  className="my-events__dropdown-item my-events__dropdown-item--logout"
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        </header>

        <main className="my-events__content">
          <h1 className="my-events__page-title">My Events</h1>

          <div className="my-events__list">
            {myEvents.map((event) => (
              <div key={event.id} className="my-events__card">
                <div className="my-events__card-content">
                  <h3 className="my-events__event-title">{event.title}</h3>
                  <div className="my-events__event-details">
                    <div className="my-events__event-detail">
                      <span className="my-events__detail-label">Date:</span>
                      <span className="my-events__detail-value">
                        {event.date}
                      </span>
                    </div>
                    <div className="my-events__event-detail">
                      <span className="my-events__detail-label">Time:</span>
                      <span className="my-events__detail-value">
                        {event.time}
                      </span>
                    </div>
                    <div className="my-events__event-detail">
                      <span className="my-events__detail-label">Location:</span>
                      <span className="my-events__detail-value">
                        {event.location}
                      </span>
                    </div>
                  </div>
                  <p className="my-events__event-desc">{event.description}</p>
                </div>
                <button className="my-events__action-btn">View Details</button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyEvents;
