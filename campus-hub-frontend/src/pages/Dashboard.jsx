import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiCalendar,
  FiMapPin,
  FiClock,
  FiUsers,
  FiLogIn,
} from "react-icons/fi";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  // State management
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [filter, setFilter] = useState("all");
  const [scrolled, setScrolled] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/api/events");
        const eventsData = Array.isArray(response.data) 
          ? response.data 
          : response.data?.events || [];

        const approvedEvents = eventsData.filter(
          (event) => event.status === "approved"
        );

        // Organize events by club with proper status calculation
        const clubsMap = approvedEvents.reduce((acc, event) => {
          if (!acc[event.clubId]) {
            acc[event.clubId] = {
              id: event.clubId,
              name: event.clubName,
              description: event.clubDescription,
              image: event.clubImage,
              events: [],
            };
          }
          
          const now = new Date();
          const startDate = new Date(event.startDate);
          const endDate = new Date(event.endDate);
          
          let status;
          if (endDate < now) {
            status = "past";
          } else if (startDate <= now && endDate >= now) {
            status = "running";
          } else {
            status = "upcoming";
          }

          acc[event.clubId].events.push({
            ...event,
            status: status,
          });
          return acc;
        }, {});

        setClubs(Object.values(clubsMap));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle scroll for header effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle enrollment button click
  const handleEnrollClick = (eventId) => {
    const isLoggedIn = localStorage.getItem("authToken"); // Simple auth check
    
    if (isLoggedIn) {
      navigate(`/event/${eventId}/enroll`);
    } else {
      // Redirect to login with return URL
      navigate(`/login?returnUrl=/event/${eventId}/enroll`);
    }
  };

  // Filter events based on selected tab and current time
  const filterEvents = (events = []) => {
    const now = new Date();
    return events.filter((event) => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);

      if (selectedTab === "upcoming") return event.status === "upcoming";
      if (selectedTab === "running") return event.status === "running";
      
      if (filter === "today") {
        return startDate.toDateString() === now.toDateString();
      }
      if (filter === "thisWeek") {
        const weekEnd = new Date();
        weekEnd.setDate(now.getDate() + 7);
        return startDate >= now && startDate <= weekEnd;
      }
      return true;
    });
  };

  // Helper functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatLiveTime = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffMs = now - start;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    return `${diffHrs}h ${diffMins % 60}m ago`;
  };

  const closeNotification = () => {
    setNotificationVisible(false);
  };

  const filteredClubs = clubs.filter((club) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      club.name.toLowerCase().includes(query) ||
      club.description.toLowerCase().includes(query) ||
      club.events.some(
        (event) =>
          event.name.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query)
      )
    );
  });

  return (
    <div className="dashboard">
      {/* Animated Background Elements */}
      <div className="animated-background">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-shape"
            initial={{ y: 0, x: Math.random() * 100 }}
            animate={{
              y: [0, -100, 0],
              x: [Math.random() * 100, Math.random() * 100],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 15 + Math.random() * 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Floating Notification */}
      <AnimatePresence>
        {notificationVisible && (
          <motion.div
            className="floating-notification"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <motion.span
              className="notification-badge"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              New
            </motion.span>
            <p>New events added recently!</p>
            <motion.button
              className="notification-close"
              onClick={closeNotification}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header
        className={`dashboard-header ${scrolled ? "scrolled" : ""}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <Link to="/" className="dashboard-logo">
            <motion.span
              className="logo-icon"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
            >
              🎓
            </motion.span>
            <motion.span
              className="logo-text"
              whileHover={{ color: "#3a0ca3" }}
            >
              CampusHub
            </motion.span>
          </Link>

          <nav className="main-nav">
            <div className="search-container">
              <motion.input
                type="text"
                placeholder="🔍 Search clubs, events..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                whileFocus={{ boxShadow: "0 0 0 2px var(--primary)" }}
              />
            </div>

            <div className="nav-links">
              <motion.div whileHover={{ y: -2 }}>
                <Link to="/login" className="nav-link">
                  <span className="nav-icon">🔑</span> Login
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }}>
                <Link to="/register" className="nav-link">
                  <span className="nav-icon">📝</span> Register
                </Link>
              </motion.div>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Discover <span className="highlight">Campus Life</span>
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Join clubs, attend events, and connect with your community
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Tabs + Filter */}
        <div className="content-controls">
          <div className="tabs">
            <motion.button
              className={`tab ${selectedTab === "upcoming" ? "active" : ""}`}
              onClick={() => setSelectedTab("upcoming")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Upcoming Events
            </motion.button>
            <motion.button
              className={`tab ${selectedTab === "running" ? "active" : ""}`}
              onClick={() => setSelectedTab("running")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Happening Now
            </motion.button>
          </div>

          <div className="filter-container">
            <motion.select
              id="filter-select"
              className="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              whileHover={{ y: -2 }}
            >
              <option value="all">All Events</option>
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="featured">Featured</option>
            </motion.select>
          </div>
        </div>

        {/* Clubs & Events Grid */}
        {loading ? (
          <div className="loading-spinner">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="spinner"
            />
            <p>Loading events...</p>
          </div>
        ) : (
          <div className="clubs-grid">
            {filteredClubs.map((club) => {
              const filteredEvents = filterEvents(club.events);
              if (!filteredEvents.length && searchQuery) return null;

              return (
                <motion.div
                  key={club.id}
                  className="club-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="club-header">
                    {club.image && (
                      <motion.div
                        className="club-image"
                        style={{ backgroundImage: `url(${club.image})` }}
                        whileHover={{ scale: 1.05 }}
                      />
                    )}
                    <h2 className="club-name">{club.name}</h2>
                    <p className="club-description">{club.description}</p>
                  </div>

                  {filteredEvents.length > 0 && (
                    <div className="events-container">
                      <h3 className="events-title">
                        {selectedTab === "upcoming" ? "Upcoming" : "Live"} Events
                      </h3>

                      <div className="events-list">
                        {filteredEvents.map((event) => (
                          <motion.div
                            key={event.id}
                            className={`event-card ${event.status}`}
                            style={{ backgroundImage: `url(${event.image})` }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="event-overlay"></div>
                            <div className="event-content">
                              {event.status === "running" && (
                                <motion.span
                                  className="live-badge"
                                  animate={{ scale: [1, 1.05, 1] }}
                                  transition={{ repeat: Infinity, duration: 2 }}
                                >
                                  <span className="pulse"></span> LIVE NOW
                                  <span className="live-time">
                                    {formatLiveTime(event.startDate)}
                                  </span>
                                </motion.span>
                              )}
                              <h4 className="event-name">{event.name}</h4>
                              <div className="event-meta">
                                <span className="event-date">
                                  <FiCalendar /> {formatDate(event.startDate)}
                                </span>
                                <span className="event-location">
                                  <FiMapPin /> {event.location}
                                </span>
                              </div>
                              <div className="event-stats">
                                <span className="event-time">
                                  <FiClock /> {formatTime(event.startDate)}
                                </span>
                                <span className="event-attendees">
                                  <FiUsers /> {event.attendees || 0} going
                                </span>
                              </div>
                              
                              {/* Enrollment Button */}
                              <motion.button
                                className="enroll-button"
                                onClick={() => handleEnrollClick(event.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FiLogIn /> Enroll Now
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {!loading && filteredClubs.length === 0 && (
          <motion.div
            className="no-results-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>No clubs or events found matching your search.</p>
            <motion.button
              className="primary-button"
              onClick={() => {
                setSearchQuery("");
                setFilter("all");
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reset Filters
            </motion.button>
          </motion.div>
        )}
      </main>

      {/* Featured Clubs Section */}
      <section className="featured-section">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Featured Clubs
        </motion.h2>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Discover popular clubs on campus
        </motion.p>

        <div className="featured-clubs">
          {[
            {
              icon: "📡",
              name: "NTC",
              members: "5.7k",
              fullName: "Nepal Telecom Club",
            },
            {
              icon: "🛰️",
              name: "NOSK",
              members: "3.2k",
              fullName: "Nepal Optical Society",
            },
            {
              icon: "⚡",
              name: "IEEE",
              members: "8.1k",
              fullName: "Institute of Electrical and Electronics Engineers",
            },
          ].map((club, index) => (
            <motion.div
              key={index}
              className="featured-club"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <motion.div
                className="club-icon"
                animate={{
                  y: [0, -5, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {club.icon}
              </motion.div>
              <h3 className="club-title">{club.name}</h3>
              <p className="club-fullname">{club.fullName}</p>
              <p className="club-members">{club.members} members</p>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  to={`/club/${club.name.toLowerCase()}`}
                  className="join-button"
                >
                  Join Club
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">CampusHub</h3>
            <p className="footer-text">
              Connecting students with campus activities and organizations.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © {new Date().getFullYear()} CampusHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;