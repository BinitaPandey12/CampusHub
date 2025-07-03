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
  FiLogOut
} from "react-icons/fi";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ClubAdmin = () => {
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
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("user"));
  const userName = userData?.name || "Club Admin";

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
        
        setUsers(usersResponse.data.content || usersResponse.data);
        
        const pending = eventsResponse.data.filter(event => event.status === 'PENDING');
        const approved = eventsResponse.data.filter(event => event.status === 'APPROVED');
        
        setPendingEvents(pending);
        setApprovedEvents(approved);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 401) {
          handleLogout();
        } else {
          toast.error("Failed to fetch data");
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
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate all required fields
      if (!newEvent.title?.trim()) {
        toast.error("Event title is required");
        setIsSubmitting(false);
        return;
      }
      if (!newEvent.description?.trim()) {
        toast.error("Event description is required");
        setIsSubmitting(false);
        return;
      }
      if (!newEvent.date) {
        toast.error("Event date is required");
        setIsSubmitting(false);
        return;
      }
      if (!newEvent.time) {
        toast.error("Event time is required");
        setIsSubmitting(false);
        return;
      }
      if (!newEvent.location?.trim()) {
        toast.error("Event location is required");
        setIsSubmitting(false);
        return;
      }

      // Combine date and time for validation
      const eventDateTime = new Date(`${newEvent.date}T${newEvent.time}`);
      if (eventDateTime < new Date()) {
        toast.error("Event date and time must be in the future");
        setIsSubmitting(false);
        return;
      }

      // Format time to HH:mm:ss
      const formattedTime = newEvent.time.includes(':') ? 
        (newEvent.time.split(':').length === 2 ? `${newEvent.time}:00` : newEvent.time) : 
        `${newEvent.time}:00:00`;

      // Prepare the event data without createdBy
      const eventData = {
        title: newEvent.title.trim(),
        description: newEvent.description.trim(),
        date: newEvent.date,
        time: formattedTime,
        location: newEvent.location.trim(),
        status: "PENDING" // Status is still needed
      };

      const response = await axios.post(
        "http://localhost:8080/api/events",
        eventData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update events list based on status
      if (response.data.status === 'PENDING') {
        setPendingEvents(prev => [response.data, ...prev]);
      } else {
        setApprovedEvents(prev => [response.data, ...prev]);
      }
      
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
      if (error.response?.data) {
        toast.error(error.response.data.message || "Failed to create event");
      } else {
        toast.error("Network error - failed to connect to server");
      }
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
        </div>

        {showEventForm && (
          <section className="clubadmin-section">
            <h2 className="clubadmin-section-title">Create New Event</h2>
            <form onSubmit={handleCreateEvent} className="clubadmin-form">
              <div className="clubadmin-form-group">
                <label>Event Title *</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="Enter event title"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="clubadmin-form-group">
                <label>Description *</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Enter event description"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="clubadmin-form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="clubadmin-form-group">
                <label>Time *</label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="clubadmin-form-group">
                <label>Location *</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  placeholder="Enter event location"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="clubadmin-form-actions">
                <button 
                  type="button"
                  className="clubadmin-action-btn"
                  onClick={() => setShowEventForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="clubadmin-action-btn primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Event"}
                </button>
              </div>
            </form>
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
                    {event.description.substring(0, 100)}...
                  </p>
                  <div className="clubadmin-event-meta">
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                    <span>{event.time}</span>
                    <span>{event.location}</span>
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
              {approvedEvents.map(event => (
                <article key={`approved-${event.id}`} className="clubadmin-event-card">
                  <h3 className="clubadmin-event-title">{event.title}</h3>
                  <p className="clubadmin-event-description">
                    {event.description.substring(0, 100)}...
                  </p>
                  <div className="clubadmin-event-meta">
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                    <span>{event.time}</span>
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
                {users.map((user, index) => (
                  <tr key={user.id ? `user-${user.id}` : `user-${index}`}>
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