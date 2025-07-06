import React, { useEffect, useState, useRef } from "react";
import "./ClubAdmin.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { 
  FiPlusCircle, 
  FiSettings, 
  FiClock, 
  FiCheckCircle,
  FiUser,
  FiLogOut,
  FiRefreshCw
} from "react-icons/fi";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ClubAdmin = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("user"));
  const userName = userData?.name || "Club Admin";

  // Fetch all data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [usersResponse, pendingResponse, approvedResponse] = await Promise.all([
        axios.get("http://localhost:8080/api/events/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:8080/api/events/pending", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:8080/api/events/approved", {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      setUsers(usersResponse.data);
      setPendingEvents(pendingResponse.data);
      setApprovedEvents(approvedResponse.data);

    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 401) {
        handleLogout();
      } else {
        toast.error(error.response?.data?.message || "Failed to fetch data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   if (token) {
  //     fetchData();
  //   } else {
  //     navigate("/login");
  //   }
  // }, [token, navigate]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRefresh = () => fetchData();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validation
      if (!newEvent.title?.trim()) {
        toast.error("Event title is required");
        return;
      }
      if (!newEvent.description?.trim()) {
        toast.error("Event description is required");
        return;
      }
      if (!newEvent.date) {
        toast.error("Event date is required");
        return;
      }
      if (!newEvent.time) {
        toast.error("Event time is required");
        return;
      }
      if (!newEvent.location?.trim()) {
        toast.error("Event location is required");
        return;
      }

      // Date validation
      const eventDateTime = new Date(`${newEvent.date}T${newEvent.time}`);
      if (eventDateTime < new Date()) {
        toast.error("Event date and time must be in the future");
        return;
      }

      // API call
      const response = await axios.post(
        "http://localhost:8080/api/events",
        {
          title: newEvent.title.trim(),
          description: newEvent.description.trim(),
          date: newEvent.date,
          time: newEvent.time,
          location: newEvent.location.trim(),
          status: "PENDING"
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update state
      setPendingEvents(prev => [response.data, ...prev]);
      
      // Reset form
      setNewEvent({
        title: "",
        description: "",
        date: "",
        time: "",
        location: ""
      });
      setShowEventForm(false);
      toast.success("Event created successfully!");
      
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(error.response?.data?.message || "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="clubadmin-container">
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
            onClick={() => setShowEventForm(!showEventForm)}
            disabled={isSubmitting}
          >
            <FiPlusCircle className="clubadmin-action-icon" />
            {showEventForm ? "Cancel" : "Add New Event"}
          </button>
          <button 
            className="clubadmin-action-btn"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <FiRefreshCw className="clubadmin-action-icon" />
            Refresh Data
          </button>
        </div>

        {showEventForm && (
          <section className="clubadmin-section">
          <div className="clubadmin-card">
            <h2 className="clubadmin-section-title">Create New Event</h2>
            <form onSubmit={handleCreateEvent} className="clubadmin-form">
              <div className="form-grid">
                <div className="clubadmin-form-group floating">
                  <input
                    type="text"
                    id="event-title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    placeholder=" "
                    required
                    disabled={isSubmitting}
                    className="modern-input"
                  />
                  <label htmlFor="event-title">Event Title *</label>
                </div>
        
                <div className="clubadmin-form-group floating">
                  <textarea
                    id="event-description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    placeholder=" "
                    required
                    disabled={isSubmitting}
                    className="modern-textarea"
                  />
                  <label htmlFor="event-description">Description *</label>
                </div>
        
                <div className="form-row">
                  <div className="clubadmin-form-group floating">
                    <input
                      type="date"
                      id="event-date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      disabled={isSubmitting}
                      className="modern-input"
                    />
                    <label htmlFor="event-date">Date *</label>
                  </div>
        
                  <div className="clubadmin-form-group floating">
                    <input
                      type="time"
                      id="event-time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                      required
                      disabled={isSubmitting}
                      className="modern-input"
                    />
                    <label htmlFor="event-time">Time *</label>
                  </div>
                </div>
        
                <div className="clubadmin-form-group floating">
                  <input
                    type="text"
                    id="event-location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    placeholder=" "
                    required
                    disabled={isSubmitting}
                    className="modern-input"
                  />
                  <label htmlFor="event-location">Location *</label>
                </div>
              </div>
        
              <div className="form-actions">
                <button 
                  type="button"
                  className="btn secondary"
                  onClick={() => setShowEventForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Creating...
                    </>
                  ) : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </section>
        )}

        <section className="clubadmin-section">
          <div className="clubadmin-section-header">
            <FiClock className="clubadmin-section-icon" />
            <h2 className="clubadmin-section-title">Pending Approval</h2>
            <span className="clubadmin-badge">{pendingEvents.length}</span>
          </div>
          
          {pendingEvents.length > 0 ? (
            <div className="clubadmin-events-grid">
              {pendingEvents.map(event => (
                <article key={`pending-${event.id}`} className="clubadmin-event-card">
                  <h3 className="clubadmin-event-title">{event.title}</h3>
                  <p className="clubadmin-event-description">
                    {event.description?.substring(0, 100)}...
                  </p>
                  <div className="clubadmin-event-meta">
                    <span>{event.date ? new Date(event.date).toLocaleDateString() : 'No date'}</span>
                    <span>{event.time || 'No time'}</span>
                    <span>{event.location || 'No location'}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="clubadmin-empty-state">No pending events awaiting approval.</p>
          )}
        </section>

        <section className="clubadmin-section">
          <div className="clubadmin-section-header">
            <FiCheckCircle className="clubadmin-section-icon" />
            <h2 className="clubadmin-section-title">Approved Events</h2>
            <span className="clubadmin-badge approved">{approvedEvents.length}</span>
          </div>
          
          {approvedEvents.length > 0 ? (
            <div className="clubadmin-events-grid">
              {approvedEvents.map(event => {
                const eventDate = event.date ? new Date(event.date).toLocaleDateString() : "Date not set";
                return (
                  <article key={`approved-${event.id}`} className="clubadmin-event-card">
                    <h3 className="clubadmin-event-title">{event.title || "Untitled Event"}</h3>
                    <p className="clubadmin-event-description">
                      {(event.description || "No description provided").substring(0, 100)}...
                    </p>
                    <div className="clubadmin-event-meta">
                      <span>{eventDate}</span>
                      <span>{event.time || "Time not set"}</span>
                      <span>{event.location || "Location not specified"}</span>
                    </div>
                    <button 
                      className="clubadmin-view-btn"
                      onClick={() => navigate(`/events/${event.id}`)}
                    >
                      View Details
                    </button>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="clubadmin-empty-state">No events have been approved yet.</p>
          )}
        </section>

        <section className="clubadmin-section">
          <h2 className="clubadmin-section-title">Registered Users</h2>
          <div className="clubadmin-users-table">
            <table className="clubadmin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id || user.email}>
                    <td>{user.id}</td>
                    <td>{user.email}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="2" className="clubadmin-empty-state">
                      No users found.
                    </td>
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