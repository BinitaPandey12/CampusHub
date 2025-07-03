import React, { useEffect, useState, useRef } from "react";
import "./ClubAdmin.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { 
  FiUsers, 
  FiPlusCircle, 
  FiSettings, 
  FiClock, 
  FiCheckCircle,
  FiSearch,
  FiUser,
  FiLogOut 
} from "react-icons/fi";

const ClubAdmin = () => {
  const [users, setUsers] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userName = "Club Admin"; // Replace with actual user name from your auth system

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, eventsResponse] = await Promise.all([
          axios.get("http://localhost:8080/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8080/api/events", {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);
        
        setUsers(usersResponse.data);
        
        const pending = eventsResponse.data.filter(event => event.status === 'pending');
        const approved = eventsResponse.data.filter(event => event.status === 'approved');
        
        setPendingEvents(pending);
        setApprovedEvents(approved);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 401) {
          handleLogout();
        }
      }
    };

    if (token) {
      fetchData();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="clubadmin-container">
      {/* Header Section */}
      <header className={`clubadmin-header ${scrolled ? "scrolled" : ""}`}>
        <div className="clubadmin-profile" ref={dropdownRef}>
          <span className="clubadmin-welcome">Welcome, {userName}</span>
          <button
            className="clubadmin-profile-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <FiUser className="clubadmin-profile-icon" />
          </button>

          {dropdownOpen && (
            <div className="clubadmin-dropdown">
              <Link to="/clubadmin/profile" className="clubadmin-dropdown-item">
                <FiUser className="clubadmin-dropdown-icon" />
                View Profile
              </Link>
              <Link to="/clubadmin/settings" className="clubadmin-dropdown-item">
                <FiSettings className="clubadmin-dropdown-icon" />
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="clubadmin-dropdown-item clubadmin-dropdown-item--logout"
              >
                <FiLogOut className="clubadmin-dropdown-icon" />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="clubadmin-main-content">
        <section className="clubadmin-hero">
          <h1 className="clubadmin-title">Club Admin Dashboard</h1>
          <p className="clubadmin-subtitle">Manage your club users and events</p>
        </section>

        <div className="clubadmin-actions">
          <button 
            className="clubadmin-action-btn primary"
            onClick={() => navigate("/events/new")}
          >
            <FiPlusCircle className="clubadmin-action-icon" />
            Add New Event
          </button>
          <button className="clubadmin-action-btn">
            <FiUsers className="clubadmin-action-icon" />
            View Club Users
          </button>
          <button className="clubadmin-action-btn">
            <FiSettings className="clubadmin-action-icon" />
            Settings
          </button>
        </div>

        {/* Pending Events Section */}
        <section className="clubadmin-section">
          <div className="clubadmin-section-header">
            <FiClock className="clubadmin-section-icon" />
            <h2 className="clubadmin-section-title">Pending Approval</h2>
            <span className="clubadmin-badge">{pendingEvents.length}</span>
          </div>
          
          {pendingEvents.length > 0 ? (
            <div className="clubadmin-events-grid">
              {pendingEvents.map(event => (
                <article key={event.id} className="clubadmin-event-card">
                  <h3 className="clubadmin-event-title">{event.title}</h3>
                  <p className="clubadmin-event-description">
                    {event.description.substring(0, 100)}...
                  </p>
                  <div className="clubadmin-event-meta">
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                    <span>{event.location}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="clubadmin-empty-state">No pending events awaiting approval.</p>
          )}
        </section>

        {/* Approved Events Section */}
        <section className="clubadmin-section">
          <div className="clubadmin-section-header">
            <FiCheckCircle className="clubadmin-section-icon" />
            <h2 className="clubadmin-section-title">Approved Events</h2>
            <span className="clubadmin-badge approved">{approvedEvents.length}</span>
          </div>
          
          {approvedEvents.length > 0 ? (
            <div className="clubadmin-events-grid">
              {approvedEvents.map(event => (
                <article key={event.id} className="clubadmin-event-card">
                  <h3 className="clubadmin-event-title">{event.title}</h3>
                  <p className="clubadmin-event-description">
                    {event.description.substring(0, 100)}...
                  </p>
                  <div className="clubadmin-event-meta">
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                    <span>{event.location}</span>
                  </div>
                  <button 
                    className="clubadmin-view-btn"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    View Details
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <p className="clubadmin-empty-state">No events have been approved yet.</p>
          )}
        </section>

        {/* Users Section */}
        <section className="clubadmin-section">
          <h2 className="clubadmin-section-title">Registered Users</h2>
          <div className="clubadmin-users-table">
            <table className="clubadmin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.name || "N/A"}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="3" className="clubadmin-empty-state">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ClubAdmin;