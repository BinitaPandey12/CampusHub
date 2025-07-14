import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyEvents.css";

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

const MyEvents = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const userName = localStorage.getItem("username") || "User";
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [enrolledEvents, setEnrolledEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dropdownRef = useRef();

  const fetchEnrolledEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      if (!email) {
        throw new Error("User email not found in localStorage");
      }

      const response = await axios.get(
        `http://localhost:8080/api/enrollments/user/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000
        }
      );

      console.log("API Response:", response.data); // Debug log

      if (response.status === 200) {
        // First ensure we have the data in the expected format
        let eventsData = [];
        
        if (Array.isArray(response.data)) {
          eventsData = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          eventsData = response.data.data;
        } else if (response.data) {
          // Handle case where response.data is a single event object
          eventsData = [response.data];
        }

        if (eventsData.length === 0) {
          setEnrolledEvents([]);
          setError("No enrolled events found");
          return;
        }

        // Transform each enrollment to standardized format
        const formattedEvents = eventsData.map((enrollment) => {
          // Safely extract event and club data
          const event = enrollment.event || {};
          const club = event.club || {};

          // Format date if available
          let formattedDate = "Date not specified";
          try {
            if (event.date) {
              const dateObj = new Date(event.date);
              if (!isNaN(dateObj.getTime())) {
                formattedDate = dateObj.toLocaleDateString(undefined, { 
                  year: "numeric", 
                  month: "long", 
                  day: "numeric" 
                });
              }
            }
          } catch (e) {
            console.error("Date parsing error:", e);
          }

          // Format time if available
          let formattedTime = "Time not specified";
          try {
            if (event.time) {
              const timeStr = event.time.includes(".") 
                ? event.time.split(".")[0] 
                : event.time;
              const timeObj = new Date(`1970-01-01T${timeStr}`);
              if (!isNaN(timeObj.getTime())) {
                formattedTime = timeObj.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
              }
            }
          } catch (e) {
            console.error("Time parsing error:", e);
          }

          return {
            id: enrollment.id || event.id || Date.now(),
            event: {
              id: event.id || 0,
              title: event.title || "Untitled Event",
              club: {
                id: club.id || 0,
                name: club.name || "No club specified"
              },
              date: event.date || null,
              formattedDate,
              time: event.time || null,
              formattedTime,
              location: event.location || "Location not specified",
              description: event.description || "No description available",
            }
          };
        });

        setEnrolledEvents(formattedEvents);
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (err) {
      console.error("Fetch error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (err.response?.status === 404) {
        setError("No enrolled events found");
        setEnrolledEvents([]);
      } else {
        setError(err.response?.data?.message || err.message || "Failed to load events");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledEvents();
  }, [email, navigate]);
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const handleRetry = () => {
    fetchEnrolledEvents();
  };

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
              disabled={loading}
            />
          </div>

          <div className="my-events__profile" ref={dropdownRef}>
            <span className="my-events__welcome">Welcome, {userName}</span>
            <button
              className="my-events__profile-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="User profile menu"
              disabled={loading}
            >
              👤
            </button>

            {dropdownOpen && (
              <div className="my-events__dropdown">
                <Link
                  to="/profile"
                  className="my-events__dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  View Profile
                </Link>
                <Link
                  to="/settings"
                  className="my-events__dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  Settings
                </Link>
                <button
                  className="my-events__dropdown-item my-events__dropdown-item--logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="my-events__content">
          <h1 className="my-events__page-title">My Events</h1>

          {loading ? (
            <div className="my-events__loading">
              <div className="my-events__loading-spinner"></div>
              Loading your events...
            </div>
          ) : error ? (
            <div className="my-events__error">
              <div className="error-header">
                <svg className="error-icon" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <h3>Error Loading Events</h3>
              </div>
              <p>{error}</p>
              <button
                className="my-events__retry-btn"
                onClick={handleRetry}
                disabled={loading}
              >
                Try Again
              </button>
            </div>
          ) : enrolledEvents.length > 0 ? (
            <div className="my-events__list">
              {enrolledEvents.map((enrollment) => (
                <div key={enrollment.id} className="my-events__card">
                  <div className="my-events__card-content">
                    <div className="my-events__event-header">
                      <h3 className="my-events__event-title">
                        {enrollment.event.title}
                      </h3>
                      <span className="my-events__event-club">
                        Hosted by: {enrollment.event.club.name}
                      </span>
                    </div>
                    <p className="my-events__event-desc">
                      {enrollment.event.description}
                    </p>
                    <div className="my-events__event-meta">
                      <div className="my-events__event-detail">
                        <span className="my-events__detail-icon">📅</span>
                        <span className="my-events__detail-value">
                          {enrollment.event.formattedDateTime}
                        </span>
                      </div>
                      <div className="my-events__event-detail">
                        <span className="my-events__detail-icon">📍</span>
                        <span className="my-events__detail-value">
                          {enrollment.event.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="my-events__action-btn"
                    onClick={() => navigate(`/event/${enrollment.event.id}`)}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="my-events__empty">
              <span className="my-events__empty-icon">📅</span>
              <h3>No Enrolled Events</h3>
              <p>You haven't enrolled in any events yet.</p>
              <button
                className="my-events__browse-btn"
                onClick={() => navigate("/user-dashboard")}
              >
                Browse Events
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyEvents;