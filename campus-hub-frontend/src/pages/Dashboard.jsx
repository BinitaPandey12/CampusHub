import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [filter, setFilter] = useState("all");
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const profileIconRef = useRef(null);

  // Static club details with running and upcoming events (for demo/testing)
  useEffect(() => {
    if (clubs.length === 0 && loading) {
      setClubs([
        {
          id: 1,
          name: "Tech Club",
          description: "A club for tech enthusiasts exploring the latest trends in AI, blockchain, and web development.",
          events: [
            {
              id: 101,
              name: "AI Workshop with Google Engineers",
              date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              status: "upcoming",
              location: "Computer Lab 3",
              image: "https://source.unsplash.com/random/300x200/?tech"
            },
            {
              id: 102,
              name: "24-Hour Hackathon (Live)",
              date: new Date().toISOString().split("T")[0],
              status: "running",
              location: "Main Auditorium",
              image: "https://source.unsplash.com/random/300x200/?hackathon"
            },
          ],
        },
        {
          id: 2,
          name: "Music & Arts",
          description: "For musicians, artists, and creative minds to collaborate and perform.",
          events: [
            {
              id: 201,
              name: "Open Mic Night",
              date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              status: "upcoming",
              location: "Student Center",
              image: "https://source.unsplash.com/random/300x200/?music"
            },
            {
              id: 202,
              name: "Live Band Performance",
              date: new Date().toISOString().split("T")[0],
              status: "running",
              location: "Quadrangle",
              image: "https://source.unsplash.com/random/300x200/?concert"
            },
          ],
        },
        {
          id: 3,
          name: "Sports & Fitness",
          description: "Join us for competitive sports and fitness activities.",
          events: [
            {
              id: 301,
              name: "Inter-College Football (Live)",
              date: new Date().toISOString().split("T")[0],
              status: "running",
              location: "Sports Complex",
              image: "https://source.unsplash.com/random/300x200/?football"
            },
            {
              id: 302,
              name: "Yoga & Meditation Workshop",
              date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              status: "upcoming",
              location: "Wellness Center",
              image: "https://source.unsplash.com/random/300x200/?yoga"
            },
          ],
        },
      ]);
      setLoading(false);
    }
  }, [clubs, loading]);

  const today = new Date().toISOString().split("T")[0];

  // Handle scroll for header effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => document.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Profile dropdown toggle
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        if (profileIconRef.current && !profileIconRef.current.contains(e.target)) {
          setShowDropdown(false);
        }
      }
    };
    
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
    <div className="dashboard">
      {/* Floating Notification */}
      <div className="floating-notification">
        <span className="notification-badge">New</span>
        <p>Check out the new photography club events!</p>
        <button className="notification-close">×</button>
      </div>

      {/* Header */}
      <header className={`dashboard-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-content">
          <Link to="/" className="dashboard-logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">CampusHub</span>
          </Link>
          
          <nav className="main-nav">
            <div className="search-container">
              <input 
                type="text" 
                placeholder="🔍 Search clubs, events..." 
                className="search-input"
              />
            </div>
            
            <div className="nav-links">
              <Link to="/login" className="nav-link">
                <span className="nav-icon">🔑</span> Login</Link>
              <Link to="/register" className="nav-link">
                <span className="nav-icon">📝</span> Register</Link> 
              
              <div className="profile-dropdown-container" ref={dropdownRef}>
                <button 
                  ref={profileIconRef}
                  className="profile-button"
                  onClick={toggleDropdown}
                  aria-expanded={showDropdown}
                >
                  <div className="avatar">👤</div>
                  <span className="username">John D.</span>
                  <span className="dropdown-arrow">▾</span>
                </button>
                
                {showDropdown && (
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item">
                      <span className="dropdown-icon">👤</span> My Profile
                    </Link>
                    <Link to="/settings" className="dropdown-item">
                      <span className="dropdown-icon">⚙️</span> Settings
                    </Link>
                    <div className="dropdown-divider"></div>
                    <Link to="/" className="dropdown-item logout">
                      <span className="dropdown-icon">🚪</span> Logout
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Discover Campus Life</h1>
          <p className="hero-subtitle">
            Join clubs, attend events, and connect with your community
          </p>
          <div className="hero-actions">
            <button className="primary-button">Explore Events</button>
            <button className="secondary-button">Create Club</button>
          </div>
        </div>
        <div className="hero-image"></div>
      </section>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Tabs + Filter */}
        <div className="content-controls">
          <div className="tabs">
            <button 
              className={`tab ${selectedTab === "upcoming" ? 'active' : ''}`}
              onClick={() => setSelectedTab("upcoming")}
            >
              Upcoming Events
            </button>
            <button 
              className={`tab ${selectedTab === "running" ? 'active' : ''}`}
              onClick={() => setSelectedTab("running")}
            >
              Happening Now
            </button>
          </div>
          
          <div className="filter-container">
            <label htmlFor="filter-select" className="filter-label">Filter:</label>
            <select
              id="filter-select"
              className="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Events</option>
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="featured">Featured</option>
            </select>
          </div>
        </div>

        {/* Clubs & Events Grid */}
        <div className="clubs-grid">
          {clubs.map((club) => {
            const filteredEvents = filterEvents(club.events);
            if (!filteredEvents.length) return null;
            
            return (
              <div key={club.id} className="club-card">
                <div className="club-header">
                  <h2 className="club-name">{club.name}</h2>
                  <p className="club-description">{club.description}</p>
                </div>
                
                <div className="events-container">
                  <h3 className="events-title">
                    {selectedTab === "upcoming" ? "Upcoming" : "Live"} Events
                  </h3>
                  
                  <div className="events-list">
                    {filteredEvents.map((event) => (
                      <div 
                        key={event.id} 
                        className={`event-card ${event.status}`}
                        style={{ backgroundImage: `url(${event.image})` }}
                      >
                        <div className="event-overlay"></div>
                        <div className="event-content">
                          {event.status === "running" && (
                            <span className="live-badge">
                              <span className="pulse"></span> LIVE NOW
                            </span>
                          )}
                          <h4 className="event-name">{event.name}</h4>
                          <div className="event-meta">
                            <span className="event-date">
                              📅 {new Date(event.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                            <span className="event-location">📍 {event.location}</span>
                          </div>
                          <button className="event-button">
                            {event.status === "running" ? "Join Now" : "Learn More"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Featured Clubs Section */}
      <section className="featured-section">
        <h2 className="section-title">Featured Clubs</h2>
        <p className="section-subtitle">Discover popular clubs on campus</p>
        
        <div className="featured-clubs">
          <div className="featured-club">
            <div className="club-icon">📸</div>
            <h3 className="club-title">Photography Club</h3>
            <p className="club-members">1.2k members</p>
            <button className="join-button">Join Club</button>
          </div>
          
          <div className="featured-club">
            <div className="club-icon">💻</div>
            <h3 className="club-title">Coding Society</h3>
            <p className="club-members">850 members</p>
            <button className="join-button">Join Club</button>
          </div>
          
          <div className="featured-club">
            <div className="club-icon">🎭</div>
            <h3 className="club-title">Drama Club</h3>
            <p className="club-members">620 members</p>
            <button className="join-button">Join Club</button>
          </div>
          
          <div className="featured-club">
            <div className="club-icon">🌱</div>
            <h3 className="club-title">Environmental Club</h3>
            <p className="club-members">430 members</p>
            <button className="join-button">Join Club</button>
          </div>
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