import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const clubsData = [
  {
    id: 1,
    name: "Nepal Tek Community",
    description: "For technology enthusiasts",
    events: [
      { id: 1, name: "Hackathon 2023", date: "May 15-17", status: "upcoming" },
      { id: 2, name: "AI Workshop", date: "June 1", status: "upcoming" },
    ],
  },
  {
    id: 2,
    name: "NOSK",
    description: "All about sports and fitness",
    events: [
      { id: 3, name: "Annual Sports Day", date: "Ongoing", status: "running" },
      { id: 4, name: "Basketball Tournament", date: "May 20", status: "upcoming" },
    ],
  },
  {
    id: 3,
    name: "IEEE Computer Society",
    description: "Creative arts and performances",
    events: [
      { id: 5, name: "Art Exhibition", date: "May 10-12", status: "running" },
      { id: 6, name: "Drama Night", date: "June 5", status: "upcoming" },
    ],
  },
];

const Dashboard = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const dropdownRef = useRef(null);
  const profileIconRef = useRef(null);

  const toggleDropdown = useCallback(() => {
    setShowDropdown((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        profileIconRef.current &&
        !profileIconRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showDropdown]);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1 className="dashboard-logo">Campus Hub</h1>
        <nav className="dashboard-nav">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">Register</Link>
          <div className="profile-dropdown" ref={dropdownRef}>
            <button
              ref={profileIconRef}
              type="button"
              aria-label="User Profile"
              className="profile-icon"
              tabIndex={0}
              aria-haspopup="true"
              aria-expanded={showDropdown}
              onClick={toggleDropdown}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleDropdown();
                }
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontSize: "1.5rem"
              }}
            >
              👤
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/" className="dropdown-item" onClick={() => setShowDropdown(false)}>Dashboard</Link>
                <Link to="/settings" className="dropdown-item" onClick={() => setShowDropdown(false)}>Settings</Link>
                <Link to="/logout" className="dropdown-item" onClick={() => setShowDropdown(false)}>Logout</Link>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Tabs */}
      <div className="tab-buttons-container">
        <button
          className={`tab-button ${selectedTab === "upcoming" ? "active" : ""}`}
          onClick={() => setSelectedTab("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={`tab-button ${selectedTab === "running" ? "active" : ""}`}
          onClick={() => setSelectedTab("running")}
        >
          Running
        </button>
      </div>

      {/* Main */}
      <main className="dashboard-main">
        <div className="dashboard-card">
          <h2 className="dashboard-title">Campus Clubs & Events</h2>
          <div className="clubs-container">
            {clubsData.map(club => {
              const filteredEvents = club.events.filter(event => event.status === selectedTab);
              if (filteredEvents.length === 0) return null;

              return (
                <div key={club.id} className="club-card">
                  <div className="club-header">
                    <h3 className="club-name">{club.name}</h3>
                    <p className="club-description">{club.description}</p>
                  </div>
                  <div className="club-events">
                    <h4 className="events-title">
                      {selectedTab === "upcoming" ? "Upcoming Events" : "Running Events"}
                    </h4>
                    <ul className="events-list">
                      {filteredEvents.map(event => (
                        <li key={event.id} className={`event-item ${event.status}`}>
                          <Link to={`/event/${event.id}`} className="event-link">
                            {event.status === "running" && (
                              <span className="event-badge highlight">Live</span>
                            )}
                            <span className="event-text">{event.name}</span>
                            <span className="event-date">{event.date}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
