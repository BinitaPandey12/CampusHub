import React, { useEffect, useState, useRef } from "react";
import "./SystemAdmin.css";
import { useNavigate } from "react-router-dom";
import { 
  FiUser, 
  FiPlus, 
  FiTrash2, 
  FiLogOut,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiAlertCircle,
  FiSearch
} from "react-icons/fi";

function SystemAdmin() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [adminsRes, usersRes, eventsRes] = await Promise.all([
          fetch("http://localhost:8080/api/admins", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("http://localhost:8080/api/users", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("http://localhost:8080/api/events/pending", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (adminsRes.status === 401 || usersRes.status === 401 || eventsRes.status === 401) {
          throw new Error("Unauthorized");
        }

        const adminsData = await adminsRes.json();
        const usersData = await usersRes.json();
        const eventsData = await eventsRes.json();

        setAdmins(adminsData);
        setUsers(usersData);
        setPendingEvents(eventsData);
      } catch (error) {
        console.error("Fetch error:", error);
        handleLogout();
      }
    };

    fetchData();
  }, [navigate, token]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddAdmin = () => navigate("/add-club-admin");

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Delete this ${type}?`)) return;
    
    try {
      const endpoint = type === "admin" ? "admins" : "users";
      const res = await fetch(`http://localhost:8080/api/${endpoint}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        if (type === "admin") {
          setAdmins(admins.filter(admin => admin.id !== id));
        } else {
          setUsers(users.filter(user => user.id !== id));
        }
      } else {
        alert("Failed to delete");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleEventDecision = async (eventId, decision) => {
    try {
      const res = await fetch(`http://localhost:8080/api/events/${eventId}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: decision })
      });

      if (res.ok) {
        setPendingEvents(pendingEvents.filter(event => event.id !== eventId));
        alert(`Event ${decision} successfully`);
      } else {
        alert("Failed to update event status");
      }
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  const filteredAdmins = admins.filter(admin => 
    (admin.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    admin.id?.toString().includes(searchQuery)
  );

  const filteredUsers = users.filter(user => 
    (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    user.id?.toString().includes(searchQuery)
  );

  return (
    <div className="sysadmin-container">
      <header className={`sysadmin-header ${scrolled ? "scrolled" : ""}`}>
        <div className="sysadmin-brand">
          <h1>System Admin Dashboard</h1>
        </div>

        <div className="sysadmin-search">
          <FiSearch className="sysadmin-search-icon" />
          <input
            type="text"
            placeholder="Search admins or users..."
            className="sysadmin-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="sysadmin-profile" ref={dropdownRef}>
          <button
            className="sysadmin-profile-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <FiUser className="sysadmin-profile-icon" />
          </button>

          {dropdownOpen && (
            <div className="sysadmin-dropdown">
              <div className="sysadmin-dropdown-header">
                <span>System Administrator</span>
              </div>
              <button
                className="sysadmin-dropdown-item logout"
                onClick={handleLogout}
              >
                <FiLogOut className="dropdown-icon" />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="sysadmin-content">
        {/* Event Approval Section */}
        <section className="sysadmin-section event-approval">
          <div className="sysadmin-section-header">
            <div className="section-title-wrapper">
              <FiClock className="section-icon pending" />
              <h2>Pending Event Approvals</h2>
              <span className="pending-count">{pendingEvents.length}</span>
            </div>
          </div>
          
          {pendingEvents.length > 0 ? (
            <div className="event-grid">
              {pendingEvents.map(event => (
                <div key={event.id} className="event-card">
                  <div className="event-card-header">
                    <h3>{event.title || "Untitled Event"}</h3>
                    <span className="event-creator">By: {event.creatorName || "Club Admin"}</span>
                  </div>
                  <p className="event-description">
                    {event.description ? `${event.description.substring(0, 120)}...` : "No description provided"}
                  </p>
                  <div className="event-meta">
                    <div className="event-detail">
                      <span className="detail-label">Date:</span>
                      <span>{event.date ? new Date(event.date).toLocaleDateString() : "Not specified"}</span>
                    </div>
                    <div className="event-detail">
                      <span className="detail-label">Location:</span>
                      <span>{event.location || "Not specified"}</span>
                    </div>
                  </div>
                  <div className="event-actions">
                    <button
                      className="sysadmin-btn approve"
                      onClick={() => handleEventDecision(event.id, 'approved')}
                    >
                      <FiCheckCircle className="btn-icon" />
                      Approve
                    </button>
                    <button
                      className="sysadmin-btn reject"
                      onClick={() => handleEventDecision(event.id, 'rejected')}
                    >
                      <FiXCircle className="btn-icon" />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-events">
              <FiAlertCircle className="empty-icon" />
              <p>No pending events awaiting approval</p>
            </div>
          )}
        </section>

        {/* Admins Section */}
        <section className="sysadmin-section">
          <div className="sysadmin-section-header">
            <h2>Club Admins</h2>
            <button className="sysadmin-btn primary" onClick={handleAddAdmin}>
              <FiPlus className="btn-icon" />
              Add Admin
            </button>
          </div>
          
          <div className="sysadmin-table-container">
            <table className="sysadmin-table">
              <thead>
                <tr>
                  <th className="id-header">ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.length > 0 ? (
                  filteredAdmins.map(admin => (
                    <tr key={admin.id}>
                      <td className="id-cell">{admin.id}</td>
                      <td className="name-cell">{admin.name || 'Unnamed Admin'}</td>
                      <td className="email-cell">{admin.email || 'No email'}</td>
                      <td className="action-cell">
                        <button
                          className="sysadmin-btn danger"
                          onClick={() => handleDelete("admin", admin.id)}
                        >
                          <FiTrash2 className="btn-icon" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-results">
                      No admins found matching your search
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Users Section */}
        <section className="sysadmin-section">
          <div className="sysadmin-section-header">
            <h2>Registered Users</h2>
          </div>
          
          <div className="sysadmin-table-container">
            <table className="sysadmin-table">
              <thead>
                <tr>
                  <th className="id-header">ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td className="id-cell">{user.id}</td>
                      <td className="name-cell">{user.name || 'Unnamed User'}</td>
                      <td className="email-cell">{user.email || 'No email'}</td>
                      <td className="action-cell">
                        <button
                          className="sysadmin-btn danger"
                          onClick={() => handleDelete("user", user.id)}
                        >
                          <FiTrash2 className="btn-icon" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-results">
                      No users found matching your search
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
}

export default SystemAdmin;