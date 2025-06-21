import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [filter, setFilter] = useState("all");
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  // Static club details with running and upcoming events (for demo/testing)
  useEffect(() => {
    // Only set static data if clubs are empty (e.g., on first load or fetch fails)
    if (clubs.length === 0 && loading) {
      setClubs([
        {
          id: 1,
          name: "Tech Club",
          description: "A club for tech enthusiasts.",
          events: [
        {
          id: 101,
          name: "AI Workshop",
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 2 days from now
          status: "upcoming",
        },
        {
          id: 102,
          name: "Hackathon",
          date: new Date().toISOString().split("T")[0], // today
          status: "running",
        },
          ],
        },
        {
          id: 2,
          name: "Music Club",
          description: "For all music lovers.",
          events: [
        {
          id: 201,
          name: "Open Mic Night",
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 5 days from now
          status: "upcoming",
        },
        {
          id: 202,
          name: "Band Jam",
          date: new Date().toISOString().split("T")[0], // today
          status: "running",
        },
          ],
        },
        {
          id: 3,
          name: "Sports Club",
          description: "Join us for sports and fitness activities.",
          events: [
        {
          id: 301,
          name: "Football Match (Live)",
          date: new Date().toISOString().split("T")[0], // today
          status: "running",
        },
          ],
        },
      ]);
      setLoading(false);
    }
  }, [clubs, loading]);
  const profileIconRef = useRef(null);

  const today = new Date().toISOString().split("T")[0];

  // Fetch clubs & events
  useEffect(() => {
    async function fetchClubs() {
      try {
        const res = await fetch("http://localhost:8080/api/clubs");
        if (!res.ok) throw new Error("Failed to fetch clubs");
        const data = await res.json();
        setClubs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchClubs();
  }, []);

  // Profile dropdown toggle
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
      if (e.key === "Escape") setShowDropdown(false);
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

  // Filter events by status + date
  const filterEvents = (events = []) => {
    return events.filter((ev) => {
      if (ev.status !== selectedTab) return false;
      if (filter === "today") return ev.date === today;
      if (filter === "thisWeek") {
        const ed = new Date(ev.date);
        const now = new Date();
        const weekLater = new Date();
        weekLater.setDate(now.getDate() + 7);
        return ed >= now && ed <= weekLater;
      }
      return true;
    });
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1 className="dashboard-logo">Campus Hub</h1>
        <nav className="dashboard-nav">
          <Link to="/login" className="nav-link">
            Login
          </Link>
          <Link to="/register" className="nav-link">
            Register
          </Link>
          <div className="profile-dropdown" ref={dropdownRef}>
            <button
              ref={profileIconRef}
              type="button"
              aria-label="User Profile"
              className="profile-icon"
              aria-haspopup="true"
              aria-expanded={showDropdown}
              onClick={toggleDropdown}
            >
              👤
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <Link
                  to="/"
                  className="dropdown-item"
                  onClick={() => setShowDropdown(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/settings"
                  className="dropdown-item"
                  onClick={() => setShowDropdown(false)}
                >
                  Settings
                </Link>
                <Link
                  to="/logout"
                  className="dropdown-item"
                  onClick={() => setShowDropdown(false)}
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Tabs + Filter */}
      <div className="tab-buttons-container">
        <div className="tab-section">
          <button
            className={`tab-button ${
              selectedTab === "upcoming" ? "active" : ""
            }`}
            onClick={() => setSelectedTab("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`tab-button ${
              selectedTab === "running" ? "active" : ""
            }`}
            onClick={() => setSelectedTab("running")}
          >
            Running
          </button>
        </div>
        <select
          className="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="today">Today</option>
          <option value="thisWeek">This Week</option>
        </select>
      </div>

      {/* Main */}
      <main className="dashboard-main">
        <div className="dashboard-card">
          <h2 className="dashboard-title">Campus Clubs & Events</h2>
          <div className="clubs-container">
            {clubs.map((club) => {
              const evs = filterEvents(club.events);
              if (!evs.length) return null;
              return (
                <div key={club.id} className="club-card">
                  <div className="club-header">
                    <h3 className="club-name">{club.name}</h3>
                    <p className="club-description">{club.description}</p>
                  </div>
                  <div className="club-events">
                    <h4 className="events-title">
                      {selectedTab === "upcoming"
                        ? "Upcoming Events"
                        : "Running Events"}
                    </h4>
                    <ul className="events-list">
                      {evs.map((ev) => (
                        <li key={ev.id} className={`event-item ${ev.status}`}>
                          <Link to={`/event/${ev.id}`} className="event-link">
                            {ev.status === "running" && (
                              <span className="event-badge highlight">
                                Live
                              </span>
                            )}
                            <span className="event-text">{ev.name}</span>
                            <span className="event-date">{ev.date}</span>
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

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <span>
            &copy; {new Date().getFullYear()} Campus Hub. All rights reserved.
          </span>
          <span>
            <Link to="/about" className="footer-link">
              About
            </Link>{" "}
            |{" "}
            <Link to="/contact" className="footer-link">
              Contact
            </Link>{" "}
            |{" "}
            <Link to="/privacy" className="footer-link">
              Privacy Policy
            </Link>
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
