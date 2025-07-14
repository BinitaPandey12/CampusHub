import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./UserDashboard.css";

function formatEventDateTime(dateStr, timeStr) {
  try {
    const cleanTime = timeStr.includes('.') ? timeStr.split('.')[0] : timeStr;
    const dateTime = new Date(dateStr + "T" + cleanTime);
    
    if (isNaN(dateTime.getTime())) {
      return "Invalid date/time";
    }

    return dateTime.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Date not available";
  }
}

function calculateTimeRemaining(dateStr, timeStr) {
  try {
    const cleanTime = timeStr.includes('.') ? timeStr.split('.')[0] : timeStr;
    const eventTime = new Date(dateStr + "T" + cleanTime);
    const now = new Date();

    if (isNaN(eventTime.getTime())) {
      return { error: "Invalid event time" };
    }

    const diff = Math.max(eventTime - now, 0);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    return { days, hours, minutes, isPast: diff === 0 };
  } catch (error) {
    console.error("Error calculating time remaining:", error);
    return { error: "Time calculation error" };
  }
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("username") || "User";
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        // const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          "http://localhost:8080/api/events/approved",
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const now = new Date();
        const processedEvents = data
          .map(event => ({
            id: event.id,
            title: event.title,
            club: event.club?.name || "Unknown Club",
            date: event.date,
            time: event.time,
            description: event.description || "No description available",
            location: event.location || "Location not specified",
          }))
          .filter(event => {
            try {
              const cleanTime = event.time.includes('.') ? event.time.split('.')[0] : event.time;
              const eventTime = new Date(event.date + "T" + cleanTime);
              return !isNaN(eventTime.getTime()) && eventTime > now;
            } catch (e) {
              console.error("Error processing event:", e);
              return false;
            }
          })
          .sort((a, b) => {
            try {
              const timeA = new Date(a.date + "T" + (a.time.includes('.') ? a.time.split('.')[0] : a.time));
              const timeB = new Date(b.date + "T" + (b.time.includes('.') ? b.time.split('.')[0] : b.time));
              return timeA - timeB;
            } catch (e) {
              return 0;
            }
          });

        setUpcomingEvents(processedEvents);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const handleEnrollClick = (eventId, e) => {
    e.stopPropagation();
    navigate(`/enroll/${eventId}`);
  };

  const renderCountdown = (date, time) => {
    const { days, hours, minutes, isPast, error } = calculateTimeRemaining(date, time);
    
    if (error) return <span className="event-countdown error">⏰ {error}</span>;
    if (isPast) return <span className="event-countdown now">🎉 Happening now!</span>;
    
    if (days > 0) {
      return <span className="event-countdown">⏰ {days}d {hours}h {minutes}m remaining</span>;
    }
    return <span className="event-countdown">⏰ {hours}h {minutes}m remaining</span>;
  };

  return (
    <div className="user-dashboard">
      <aside className="user-dashboard__sidebar">
        <div className="user-dashboard__sidebar-title">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">CampusHub</span>
        </div>

        <nav className="user-dashboard__nav">
          <Link to="/user-dashboard" className="user-dashboard__nav-link active">
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
        <header className={`user-dashboard__header ${scrolled ? "scrolled" : ""}`}>
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
                <button
                  className="user-dashboard__dropdown-item user-dashboard__dropdown-item--logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
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
                <span className="user-dashboard__error-icon">⚠</span>
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
                <div
                  key={event.id}
                  className="user-dashboard__event-card"
                  onClick={() => handleEventClick(event.id)}
                >
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
                    <div className="user-dashboard__event-meta">
                      <span className="event-location">
                        📍 {event.location}
                      </span>
                      <span className="event-date">
                        📅 {formatEventDateTime(event.date, event.time)}
                      </span>
                    </div>
                    <div className="event-countdown">
                      {renderCountdown(event.date, event.time)}
                    </div>
                  </div>
                  <div className="user-dashboard__event-actions">
                    <button
                      className="user-dashboard__event-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event.id);
                      }}
                    >
                      View Details
                    </button>
                    <button
                      className="user-dashboard__enroll-btn"
                      onClick={(e) => handleEnrollClick(event.id, e)}
                    >
                      Enroll Now
                    </button>
                  </div>
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