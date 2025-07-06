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
  FiSearch,
  FiAlertTriangle
} from "react-icons/fi";

function SystemAdmin() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [rejectedEvents, setRejectedEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const dropdownRef = useRef(null);
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    // if (!token) {
    //   navigate("/login");
    //   return;
    // }

    const fetchData = async () => {
      try {
        const [adminsRes, usersRes, pendingRes, rejectedRes] = await Promise.all([
          fetch("http://localhost:8080/api/admins", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("http://localhost:8080/api/users", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("http://localhost:8080/api/events/pending", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("http://localhost:8080/api/events/rejected", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        // if (adminsRes.status === 401 || usersRes.status === 401 || 
        //     pendingRes.status === 401 || rejectedRes.status === 401) {
        //   throw new Error("Unauthorized");
        // }

        const adminsData = await adminsRes.json();
        const usersData = await usersRes.json();
        const pendingData = await pendingRes.json();
        const rejectedData = await rejectedRes.json();

        setAdmins(adminsData);
        setUsers(usersData);
        setPendingEvents(pendingData);
        setRejectedEvents(rejectedData);
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

  const showConfirmation = (type, id, eventId, decision) => {
    setModalData({
      type,
      id,
      eventId,
      decision,
      message: getConfirmationMessage(type, decision)
    });
    setShowConfirmModal(true);
  };

  const getConfirmationMessage = (type, decision) => {
    if (type === "event") {
      return decision === "approved" 
        ? "Are you sure you want to approve this event?" 
        : "Are you sure you want to reject this event?";
    } else {
      return type === "admin" 
        ? "Are you sure you want to delete this admin?" 
        : "Are you sure you want to delete this user?";
    }
  };

  const handleConfirmAction = async () => {
    setShowConfirmModal(false);
    
    try {
      if (modalData.type === "event") {
        await handleEventDecision(modalData.eventId, modalData.decision);
      } else {
        await handleDelete(modalData.type, modalData.id);
      }
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  const handleDelete = async (type, id) => {
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
      const res = await fetch(`http://localhost:8080/api/events/${eventId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: decision })
      });

      if (res.ok) {
        // Move event from pending to appropriate list
        const eventToMove = pendingEvents.find(event => event.id === eventId);
        setPendingEvents(pendingEvents.filter(event => event.id !== eventId));
        
        if (decision === "approved") {
          // Event will now appear in club admin's approved section
          alert("Event approved successfully!");
        } else {
          setRejectedEvents([...rejectedEvents, eventToMove]);
          alert("Event rejected successfully!");
        }
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

  const renderEventCard = (event, isRejected = false) => (
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
        {isRejected && (
          <div className="event-detail">
            <span className="detail-label">Status:</span>
            <span className="rejected-status">Rejected</span>
          </div>
        )}
      </div>
      {!isRejected && (
        <div className="event-actions">
          <button
            className="sysadmin-btn approve"
            onClick={() => showConfirmation("event", null, event.id, "approved")}
          >
            <FiCheckCircle className="btn-icon" />
            Approve
          </button>
          <button
            className="sysadmin-btn reject"
            onClick={() => showConfirmation("event", null, event.id, "rejected")}
          >
            <FiXCircle className="btn-icon" />
            Reject
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="sysadmin-container">
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <div className="modal-header">
              <FiAlertTriangle className="modal-icon" />
              <h3>Confirm Action</h3>
            </div>
            <p className="modal-message">{modalData.message}</p>
            <div className="modal-actions">
              <button 
                className="modal-btn cancel"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button 
                className={`modal-btn ${modalData.decision === "rejected" ? "reject" : "confirm"}`}
                onClick={handleConfirmAction}
              >
                {modalData.type === "event" 
                  ? modalData.decision === "approved" ? "Approve" : "Reject"
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

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
          > 👤
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
        {/* Event Tabs */}
        <div className="event-tabs">
          <button
            className={`event-tab ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            <FiClock className="tab-icon" />
            Pending Approvals
            {pendingEvents.length > 0 && (
              <span className="tab-badge">{pendingEvents.length}</span>
            )}
          </button>
          <button
            className={`event-tab ${activeTab === "rejected" ? "active" : ""}`}
            onClick={() => setActiveTab("rejected")}
          >
            <FiXCircle className="tab-icon" />
            Rejected Events
            {rejectedEvents.length > 0 && (
              <span className="tab-badge">{rejectedEvents.length}</span>
            )}
          </button>
        </div>

        {/* Event Approval Section */}
        <section className="sysadmin-section event-approval">
          <div className="sysadmin-section-header">
            <div className="section-title-wrapper">
              {activeTab === "pending" ? (
                <>
                  <FiClock className="section-icon pending" />
                  <h2>Pending Event Approvals</h2>
                  {pendingEvents.length > 0 && (
                    <span className="pending-count">{pendingEvents.length}</span>
                  )}
                </>
              ) : (
                <>
                  <FiXCircle className="section-icon rejected" />
                  <h2>Rejected Events</h2>
                  {rejectedEvents.length > 0 && (
                    <span className="rejected-count">{rejectedEvents.length}</span>
                  )}
                </>
              )}
            </div>
          </div>
          
          {activeTab === "pending" ? (
            pendingEvents.length > 0 ? (
              <div className="event-grid">
                {pendingEvents.map(event => renderEventCard(event))}
              </div>
            ) : (
              <div className="no-events">
                <FiAlertCircle className="empty-icon" />
                <p>No pending events awaiting approval</p>
              </div>
            )
          ) : (
            rejectedEvents.length > 0 ? (
              <div className="event-grid">
                {rejectedEvents.map(event => renderEventCard(event, true))}
              </div>
            ) : (
              <div className="no-events">
                <FiAlertCircle className="empty-icon" />
                <p>No rejected events</p>
              </div>
            )
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
                          onClick={() => showConfirmation("admin", admin.id)}
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
                          onClick={() => showConfirmation("user", user.id)}
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