import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./UserDashboard.css";
import { jwtDecode } from "jwt-decode";

const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

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
  const userEmail = localStorage.getItem("email") || "";
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("User");
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  const getFirstName = () => {
    const fullName = localStorage.getItem("username") || "User";
    return fullName.split(" ")[0];
  };

  const firstName = getFirstName();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !userEmail) {
          navigate("/login");
          return;
        }

        const [eventsResponse, enrollmentsResponse] = await Promise.all([
          fetch("http://localhost:8080/api/events/approved", {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }),
          fetch(`http://localhost:8080/api/enrollments/user/${userEmail}`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          })
        ]);

        if (!eventsResponse.ok) {
          throw new Error(`Failed to load events: ${eventsResponse.status}`);
        }

        const eventsData = await eventsResponse.json();
        let enrolledEventsData = [];

        if (enrollmentsResponse.ok) {
          enrolledEventsData = await enrollmentsResponse.json();
        }

        const now = new Date();
        const processedEvents = eventsData
          .map(event => ({
            id: event.id,
            title: event.title,
            club: event.club?.name || "Unknown Club",
            date: event.date,
            time: event.time,
            description: event.description || "No description available",
            location: event.location || "Location not specified",
            isEnrolled: enrolledEventsData.some(enrollment => enrollment.eventId === event.id),
            formattedDate: formatEventDateTime(event.date, event.time),
            timeRemaining: calculateTimeRemaining(event.date, event.time)
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
        setFilteredEvents(processedEvents); // Initialize filtered events with all events
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, userEmail]);

  useEffect(() => {
    // Filter events based on search query
    if (searchQuery.trim() === "") {
      setFilteredEvents(upcomingEvents);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = upcomingEvents.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.club.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
      );
      setFilteredEvents(filtered);
    }
  }, [searchQuery, upcomingEvents]);

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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchQuery("");
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
              placeholder="🔍 Search clubs, events, locations..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button 
                className="user-dashboard__search-clear"
                onClick={handleSearchClear}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <div className="user-dashboard__profile" ref={dropdownRef}>
            <span className="user-dashboard__welcome">Welcome, {firstName}</span>
            <button
              className="user-dashboard__profile-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="User profile menu"
            >
              👤
            </button>

            {dropdownOpen && (
              <div className="user-dashboard__dropdown">
                
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
          <h2 className="user-dashboard__section-title">
            Upcoming Events
            {searchQuery && filteredEvents.length > 0 && (
              <span className="user-dashboard__search-results-count">
                {filteredEvents.length} {filteredEvents.length === 1 ? 'result' : 'results'} found
              </span>
            )}
          </h2>
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
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className={`user-dashboard__event-card ${event.isEnrolled ? "enrolled" : ""}`}
                  onClick={() => handleEventClick(event.id)}
                >
                  {event.isEnrolled && (
                    <div className="enrolled-status">
                      <span className="enrolled-checkmark">✓</span>
                      <span className="enrolled-text">Enrolled</span>
                    </div>
                  )}
                  <div className="user-dashboard__event-info">
                    <h4 className="user-dashboard__event-title">
                      {event.title}
                    </h4>
                  
                    <p className="user-dashboard__event-desc">
                      Description: {event.description}
                    </p>
                    <div className="user-dashboard__event-meta">
                      <span className="event-location">📍Location: {event.location}<br></br></span>
                      <span className="event-date">
                       Date: 📅 {event.formattedDate}
                      </span>
                    </div>
                    <div className="event-countdown">
                     CountDown: {renderCountdown(event.date, event.time)}
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
                    {!event.isEnrolled && (
                      <button
                        className="user-dashboard__enroll-btn"
                        onClick={(e) => handleEnrollClick(event.id, e)}
                      >
                        Enroll Now
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : searchQuery ? (
              <div className="user-dashboard__no-results">
                <span className="user-dashboard__no-results-icon">🔍</span>
                No events found for "{searchQuery}"
                <button
                  className="user-dashboard__clear-search-btn"
                  onClick={handleSearchClear}
                >
                  Clear search
                </button>
              </div>
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