import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./UserDashboard.css";

function getCountdown(eventTime) {
  const now = new Date();
  const diff = Math.max(eventTime - now, 0);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return `⏰ Event in ${hours}h ${minutes}m`;
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const userName = "User";
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:8080/api/events/approved",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const formattedEvents = data.map((event) => ({
          id: event.id,
          title: event.title,
          club: event.club?.name || "Unknown Club",
          time: new Date(event.dateTime),
          description: event.description || "No description available",
        }));

        setUpcomingEvents(formattedEvents);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

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
              aria-label="User profile menu"
            >
              👤
            </button>

            {dropdownOpen && (
              <div className="user-dashboard__dropdown">
                <Link
                  to="/profile"
                  className="user-dashboard__dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  View Profile
                </Link>
                <Link
                  to="/settings"
                  className="user-dashboard__dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  Settings
                </Link>
                <Link
                  to="/login"
                  className="user-dashboard__dropdown-item user-dashboard__dropdown-item--logout"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        </header>

        <section className="user-dashboard__content">
          <h2 className="user-dashboard__section-title">Upcoming Events</h2>
          <div className="user-dashboard__events">
            {loading ? (
              <div className="user-dashboard__loading">
                <div className="user-dashboard__loading-spinner"></div>
                Loading events...
              </div>
            ) : error ? (
              <div className="user-dashboard__error">
                <span className="user-dashboard__error-icon">⚠️</span>
                Error loading events: {error}
                <button
                  className="user-dashboard__retry-btn"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            ) : upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event.id} className="user-dashboard__event-card">
                  <div className="user-dashboard__event-info">
                    <h4 className="user-dashboard__event-title">
                      {event.title}
                    </h4>
                    <p className="user-dashboard__event-host">
                      Hosted by {event.club}
                    </p>
                    <p className="user-dashboard__event-desc">
                      {event.description}
                    </p>
                    <span className="user-dashboard__event-time">
                      {getCountdown(event.time)}
                    </span>
                  </div>
                  <button
                    className="user-dashboard__event-btn"
                    onClick={() => handleEventClick(event.id)}
                  >
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <div className="user-dashboard__no-events">
                <span className="user-dashboard__no-events-icon">📅</span>
                No upcoming events found.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserDashboard;
