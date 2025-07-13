import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./UserDashboard.css";

// Utility function to format date and time display
function formatEventDateTime(dateStr, timeStr) {
  try {
    // Clean time string by removing milliseconds if present
    const cleanTime = timeStr.includes('.') ? timeStr.split('.')[0] : timeStr;
    const dateTime = new Date(`${dateStr}T${cleanTime}`);
    
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

// Calculate time remaining until event
function calculateTimeRemaining(dateStr, timeStr) {
  try {
    const cleanTime = timeStr.includes('.') ? timeStr.split('.')[0] : timeStr;
    const eventTime = new Date(`${dateStr}T${cleanTime}`);
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  // Get username from localStorage or use default
  const userName = localStorage.getItem("username") || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  // Fetch approved events from API
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:8080/api/events/approved", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status}`);
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
              const eventTime = new Date(`${event.date}T${cleanTime}`);
              return !isNaN(eventTime.getTime()) && eventTime > now;
            } catch (e) {
              console.error("Error processing event:", e);
              return false;
            }
          })
          .sort((a, b) => {
            try {
              const timeA = new Date(`${a.date}T${a.time.includes('.') ? a.time.split('.')[0] : a.time}`);
              const timeB = new Date(`${b.date}T${b.time.includes('.') ? b.time.split('.')[0] : b.time}`);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  // Render time remaining with appropriate message
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
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">CampusHub</span>
        </div>

        <nav className="sidebar-nav">
          <Link to="/user-dashboard" className="nav-link active">
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Dashboard</span>
          </Link>
          <Link to="/myevents" className="nav-link">
            <span className="nav-icon">📆</span>
            <span className="nav-text">My Events</span>
          </Link>
          <Link to="/chatbot" className="nav-link">
            <span className="nav-icon">💬</span>
            <span className="nav-text">Chatbot Help</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="dashboard-main">
        {/* Header with Search and Profile */}
        <header className={`dashboard-header ${scrolled ? "scrolled" : ""}`}>
          <div className="search-bar">
            <input
              type="text"
              placeholder="🔍 Search events, clubs..."
              className="search-input"
            />
          </div>

          <div className="profile-section" ref={dropdownRef}>
            <span className="welcome-message">Welcome, {userName}</span>
            <button
              className="profile-button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="User menu"
            >
              👤
            </button>

            {dropdownOpen && (
              <div className="profile-dropdown">
                <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  View Profile
                </Link>
                <Link to="/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  Settings
                </Link>
                <button
                  className="dropdown-item logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Events Section */}
        <section className="dashboard-content">
          <h2 className="section-title">Upcoming Events</h2>
          
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading events...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <span className="error-icon">⚠️</span>
              <p>Error loading events: {error}</p>
              <button
                className="retry-button"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="events-grid">
              {upcomingEvents.map(event => (
                <div key={event.id} className="event-card" onClick={() => handleEventClick(event.id)}>
                 
                  <div className="event-details">
                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-host">Hosted by {event.club}</p>
                    <p className="event-description">{event.description}</p>
                    <div className="event-meta">
                      <span className="event-location">📍 {event.location}</span>
                      <span className="event-date">📅 {formatEventDateTime(event.date, event.time)}</span>
                    </div>
                    <div className="event-countdown">
                      {renderCountdown(event.date, event.time)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">📅</span>
              <p>No upcoming events found</p>
              <Link to="/events" className="explore-button">
                Explore All Events
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default UserDashboard;