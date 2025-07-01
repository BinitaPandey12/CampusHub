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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="user-dashboard">
      <aside className="user-dashboard__sidebar">
        <div className="user-dashboard__sidebar-title">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">CampusHub</span>
        </div>

        <nav className="user-dashboard__nav">
          <Link to="/user-dashboard" className="user-dashboard__nav-link">
            <span className="user-dashboard__nav-icon">🏠</span>
            <span className="user-dashboard__nav-text">Dashboard</span>
          </Link>
          <Link to="/myevents" className="user-dashboard__nav-link">
            <span className="user-dashboard__nav-icon">📆</span>
            <span className="user-dashboard__nav-text">My Events</span>
          </Link>
          <Link to="/chatbot" className="user-dashboard__nav-link">
            <span className="user-dashboard__nav-icon">💬</span>
            <span className="user-dashboard__nav-text">Chatbot Help</span>
          </Link>
        </nav>
      </aside>

      <div className="user-dashboard__main">
        <header
          className={`user-dashboard__header ${scrolled ? "scrolled" : ""}`}
        >
          <div className="user-dashboard__search">
            <input
              className="user-dashboard__search-input"
              placeholder="🔍 Search clubs, tags..."
            />
          </div>

          <div className="user-dashboard__profile" ref={dropdownRef}>
            <span className="user-dashboard__welcome">Welcome, {userName}</span>
            <button
              className="user-dashboard__profile-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              👤
            </button>

            {dropdownOpen && (
              <div className="user-dashboard__dropdown">
                <Link to="/profile" className="user-dashboard__dropdown-item">
                  View Profile
                </Link>
                <Link to="/settings" className="user-dashboard__dropdown-item">
                  Settings
                </Link>
                <Link
                  to="/"
                  className="user-dashboard__dropdown-item user-dashboard__dropdown-item--logout"
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        </header>

        <section className="user-dashboard__content">
          <h2 className="user-dashboard__section-title">Recommended Clubs</h2>
          <div className="user-dashboard__clubs">
            {clubs.map((club) => (
              <div key={club.id} className="user-dashboard__club-card">
                <div className="user-dashboard__club-header">
                  <h3 className="user-dashboard__club-name">{club.name}</h3>
                  {club.newEvent && (
                    <span className="user-dashboard__club-badge">
                      🔴 New Event
                    </span>
                  )}
                </div>
                <p className="user-dashboard__club-desc">{club.description}</p>
                <button className="user-dashboard__club-btn">
                  {club.joined ? "View Club" : "Join Club"}
                </button>
              </div>
            ))}
          </div>

          <h2 className="user-dashboard__section-title">Upcoming Events</h2>
          <div className="user-dashboard__events">
            {upcomingEvents.map((event, idx) => (
              <div key={idx} className="user-dashboard__event-card">
                <div className="user-dashboard__event-info">
                  <h4 className="user-dashboard__event-title">{event.title}</h4>
                  <p className="user-dashboard__event-host">
                    Hosted by {event.club}
                  </p>
                  <span className="user-dashboard__event-time">
                    {getCountdown(event.time)}
                  </span>
                </div>
                <button className="user-dashboard__event-btn">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserDashboard;
