import React, { useEffect, useState, useRef } from "react";
import "./ClubAdmin.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { 
  FiPlusCircle, 
  FiClock, 
  FiCheckCircle,
  FiXCircle,
  FiLogOut,
  FiRefreshCw,
} from "react-icons/fi";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ClubAdmin = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [rejectedEvents, setRejectedEvents] = useState([]);
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
      const [usersResponse, pendingResponse, approvedResponse, rejectedResponse] = await Promise.all([
        axios.get("http://localhost:8080/api/events/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:8080/api/events/pending", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:8080/api/events/approved", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:8080/api/events/rejected", {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      setUsers(usersResponse.data);
      setPendingEvents(pendingResponse.data);
      setApprovedEvents(approvedResponse.data);
      setRejectedEvents(rejectedResponse.data);

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

  useEffect(() => {
    if (token) {
      fetchData();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

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

  // Validate time is between 6 AM and 10 PM
  const validateTime = (time) => {
    if (!time) return false;
    
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    
    // 6 AM = 360 minutes, 10 PM = 1320 minutes
    return totalMinutes >= 360 && totalMinutes <= 1320;
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

      // Time validation (6 AM to 10 PM)
      if (!validateTime(newEvent.time)) {
        toast.error("Event time must be between 6 AM and 10 PM");
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
    <div className="ca-container">
      <header className={`ca-header ${scrolled ? "ca-scrolled" : ""}`}>
        <div className="ca-profile" ref={dropdownRef}>
          <span className="ca-welcome">Welcome, {userName}</span>
          <button
            className="ca-profile-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            👤
          </button>

          {dropdownOpen && (
            <div className="ca-dropdown">
              <button
                onClick={handleLogout}
                className="ca-dropdown-item ca-dropdown-item--logout"
              >
                <FiLogOut className="ca-dropdown-icon" />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="ca-main-content">
        <section className="ca-hero">
          <h1 className="ca-title">Club Admin Dashboard</h1>
          <p className="ca-subtitle">Manage your club users and events</p>
        </section>

        <div className="ca-actions">
          <button 
            className="ca-action-btn ca-primary"
            onClick={() => setShowEventForm(!showEventForm)}
            disabled={isSubmitting}
          >
            <FiPlusCircle className="ca-action-icon" />
            {showEventForm ? "Cancel" : "Add New Event"}
          </button>
          <button 
            className="ca-action-btn"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <FiRefreshCw className="ca-action-icon" />
            Refresh Data
          </button>
        </div>

        {showEventForm && (
          <section className="ca-section">
            <div className="ca-card">
              <h2 className="ca-section-title">Create New Event</h2>
              <form onSubmit={handleCreateEvent} className="ca-form">
                <div className="ca-form-grid">
                  <div className="ca-form-group ca-floating">
                    <input
                      type="text"
                      id="event-title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      placeholder=" "
                      required
                      disabled={isSubmitting}
                      className="ca-input"
                    />
                    <label htmlFor="event-title">Event Title *</label>
                  </div>
          
                  <div className="ca-form-group ca-floating">
                    <textarea
                      id="event-description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      placeholder=" "
                      required
                      disabled={isSubmitting}
                      className="ca-textarea"
                    />
                    <label htmlFor="event-description">Description *</label>
                  </div>
          
                  <div className="ca-form-row">
                    <div className="ca-form-group ca-floating">
                      <input
                        type="date"
                        id="event-date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        disabled={isSubmitting}
                        className="ca-input"
                      />
                      <label htmlFor="event-date">Date *</label>
                    </div>
          
                    <div className="ca-form-group ca-floating">
                      <input
                        type="time"
                        id="event-time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                        placeholder=" "
                        required
                        disabled={isSubmitting}
                        className="ca-input"
                      />
                      <label htmlFor="event-time">Time * (6 AM - 10 PM)</label>
                    </div>
                  </div>
          
                  <div className="ca-form-group ca-floating">
                    <input
                      type="text"
                      id="event-location"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                      placeholder=" "
                      required
                      disabled={isSubmitting}
                      className="ca-input"
                    />
                    <label htmlFor="event-location">Room No *</label>
                  </div>
                </div>
          
                <div className="ca-form-actions">
                  <button 
                    type="button"
                    className="ca-btn ca-secondary"
                    onClick={() => setShowEventForm(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="ca-btn ca-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="ca-spinner"></span>
                        Creating...
                      </>
                    ) : "Create Event"}
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* Pending Events Section */}
        <section className="ca-section">
          <div className="ca-section-header">
            <FiClock className="ca-section-icon" />
            <h2 className="ca-section-title">Pending Approval</h2>
            <span className="ca-badge">{pendingEvents.length}</span>
          </div>
          
          {pendingEvents.length > 0 ? (
            <div className="ca-events-grid">
              {pendingEvents.map(event => (
                <article key={`pending-${event.id}`} className="ca-event-card">
                  <h3 className="ca-event-title">{event.title}</h3>
                  <p className="ca-event-description">
                    {event.description?.substring(0, 100)}...
                  </p>
                  <div className="ca-event-meta">
                    <span>{event.date ? new Date(event.date).toLocaleDateString() : 'No date'}</span>
                    <span>{event.time || 'No time'}</span>
                    <span>{event.location || 'No location'}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="ca-empty-state">No pending events awaiting approval.</p>
          )}
        </section>

        {/* Approved Events Section */}
        <section className="ca-section">
          <div className="ca-section-header">
            <FiCheckCircle className="ca-section-icon" />
            <h2 className="ca-section-title">Approved Events</h2>
            <span className="ca-badge ca-approved">{approvedEvents.length}</span>
          </div>
          
          {approvedEvents.length > 0 ? (
            <div className="ca-events-grid">
              {approvedEvents.map(event => {
                const eventDate = event.date ? new Date(event.date).toLocaleDateString() : "Date not set";
                return (
                  <article key={`approved-${event.id}`} className="ca-event-card">
                    <h3 className="ca-event-title">{event.title || "Untitled Event"}</h3>
                    <p className="ca-event-description">
                      {(event.description || "No description provided").substring(0, 100)}...
                    </p>
                    <div className="ca-event-meta">
                      <span>{eventDate}</span>
                      <span>{event.time || "Time not set"}</span>
                      <span>{event.location || "Location not specified"}</span>
                    </div>
                    <Link 
                      to={`/events/${event.id}`}
                      className="ca-view-btn"
                    >
                      View Details
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="ca-empty-state">No events have been approved yet.</p>
          )}
        </section>

        {/* Rejected Events Section */}
        <section className="ca-section">
          <div className="ca-section-header">
            <FiXCircle className="ca-section-icon" />
            <h2 className="ca-section-title">Rejected Events</h2>
            <span className="ca-badge ca-rejected">{rejectedEvents.length}</span>
          </div>
          
          {rejectedEvents.length > 0 ? (
            <div className="ca-events-grid">
              {rejectedEvents.map(event => {
                const eventDate = event.date ? new Date(event.date).toLocaleDateString() : "Date not set";
                return (
                  <article key={`rejected-${event.id}`} className="ca-event-card ca-rejected-card">
                    <div className="ca-event-header">
                      <h3 className="ca-event-title">{event.title || "Untitled Event"}</h3>
                      <p className="ca-event-author">By: {event.createdBy?.name || "Club Admin"}</p>
                    </div>
                    <p className="ca-event-description">
                      {(event.description || "No description provided").substring(0, 100)}...
                    </p>
                    <div className="ca-event-details">
                      <div className="ca-detail-row">
                        <span className="ca-detail-label">Date:</span>
                        <span className="ca-detail-value">{eventDate}</span>
                      </div>
                      <div className="ca-detail-row">
                        <span className="ca-detail-label">Time:</span>
                        <span className="ca-detail-value">{event.time || "Time not set"}</span>
                      </div>
                      <div className="ca-detail-row">
                        <span className="ca-detail-label">Location:</span>
                        <span className="ca-detail-value">{event.location || "Location not specified"}</span>
                      </div>
                      <div className="ca-detail-row">
                        <span className="ca-detail-label">Rejection Reason:</span>
                        <span className="ca-detail-value ca-rejection-reason">
                          {event.rejectionReason || "No reason provided"}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="ca-empty-state">No events have been rejected.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default ClubAdmin;