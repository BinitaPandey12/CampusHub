import React, { useEffect, useState, useRef } from "react";
import "../Styles/SystemAdmin.css";
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
  FiAlertTriangle,
  FiMessageSquare,
} from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "http://localhost:8080/api";

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
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [modalData, setModalData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  const token = localStorage.getItem("token");

  // Fetch all data on component mount
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [adminsRes, usersRes, pendingRes, rejectedRes] =
          await Promise.all([
            fetch(`${API_BASE_URL}/admins`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_BASE_URL}/users`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_BASE_URL}/events/pending`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_BASE_URL}/events/rejected`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        if (!adminsRes.ok) throw new Error("Failed to fetch admins");
        if (!usersRes.ok) throw new Error("Failed to fetch users");
        if (!pendingRes.ok) throw new Error("Failed to fetch pending events");
        if (!rejectedRes.ok) throw new Error("Failed to fetch rejected events");

        const [adminsData, usersData, pendingData, rejectedData] =
          await Promise.all([
            adminsRes.json(),
            usersRes.json(),
            pendingRes.json(),
            rejectedRes.json(),
          ]);

        // Process rejected events to ensure consistent data structure
        const processedRejectedEvents = rejectedData.map((event) => ({
          ...event,
          rejectionMessage:
            event.rejectionMessage?.trim() || "No reason provided",
          status: event.status || "REJECTED",
          creatorName: event.creator?.name || "Unknown",
          date: event.date || new Date().toISOString(),
          location: event.location || "Not specified",
        }));

        setAdmins(adminsData);
        setUsers(usersData);
        setPendingEvents(pendingData);
        setRejectedEvents(processedRejectedEvents);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
        if (error.message.includes("Unauthorized")) {
          handleLogout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate, token]);

  // Handle scroll for header effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login");
  };

  const handleAddAdmin = () => navigate("/add-club-admin");

  const showConfirmation = (type, id, eventId, decision) => {
    if (decision === "rejected") {
      setShowRejectModal(true);
      setModalData({
        type,
        id,
        eventId,
        decision,
        message: "Please provide a reason for rejecting this event:",
      });
    } else {
      setShowConfirmModal(true);
      setModalData({
        type,
        id,
        eventId,
        decision,
        message:
          type === "event"
            ? "Are you sure you want to approve this event?"
            : `Are you sure you want to delete this ${type}?`,
      });
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
      setError(error.message);
      toast.error(error.message);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      setError("Please provide a rejection reason");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/events/${modalData.eventId}/reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rejectionMessage: rejectReason.trim(),
            status: "REJECTED",
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to reject event");
      }

      const updatedEvent = await res.json();

      // Process the updated event with proper rejection data
      const processedEvent = {
        ...updatedEvent,
        rejectionMessage:
          updatedEvent.rejectionMessage?.trim() || "No reason provided",
        status: updatedEvent.status || "REJECTED",
        creatorName: updatedEvent.creator?.name || "Unknown",
        date: updatedEvent.date || new Date().toISOString(),
        location: updatedEvent.location || "Not specified",
      };

      // Update state
      setPendingEvents((prev) =>
        prev.filter((e) => e.id !== modalData.eventId)
      );
      setRejectedEvents((prev) => [processedEvent, ...prev]);

      // Reset modal and form
      setShowRejectModal(false);
      setRejectReason("");
      setError(null);

      // Show success feedback
      toast.success("Event rejected successfully");
    } catch (error) {
      console.error("Rejection error:", error);
      setError(error.message);
      toast.error(error.message);
    }
  };

  const handleDelete = async (type, id) => {
    try {
      let endpoint;
      if (type === "admin") {
        endpoint = `${API_BASE_URL}/admins/${id}`;
      } else if (type === "user") {
        endpoint = `${API_BASE_URL}/users/${id}`;
      } else {
        throw new Error("Invalid type for deletion");
      }

      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete");
      }

      // Update state based on what was deleted
      if (type === "admin") {
        setAdmins((prevAdmins) => prevAdmins.filter((a) => a.id !== id));
        toast.success("Admin deleted successfully");
      } else {
        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== id));
        toast.success("User deleted successfully");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setError(error.message);
      toast.error(error.message);
    }
  };

  const handleEventDecision = async (eventId, decision) => {
    try {
      const endpoint =
        decision === "approved"
          ? `${API_BASE_URL}/events/${eventId}/approve`
          : `${API_BASE_URL}/events/${eventId}/reject`;

      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body:
          decision === "rejected"
            ? JSON.stringify({ rejectionMessage: "Rejected by admin" })
            : undefined,
      });

      if (!res.ok) throw new Error(`Failed to ${decision} event`);

      const updatedEvent = await res.json();

      if (decision === "approved") {
        setPendingEvents((prevEvents) =>
          prevEvents.filter((e) => e.id !== eventId)
        );
        toast.success("Event approved successfully");
      } else {
        const processedEvent = {
          ...updatedEvent,
          rejectionMessage:
            updatedEvent.rejectionMessage?.trim() || "No reason provided",
          status: "REJECTED",
          creatorName: updatedEvent.creator?.name || "Unknown",
        };
        setPendingEvents((prev) => prev.filter((e) => e.id !== eventId));
        setRejectedEvents((prev) => [processedEvent, ...prev]);
        toast.success("Event rejected successfully");
      }
    } catch (error) {
      console.error("Status update error:", error);
      setError(error.message);
      toast.error(error.message);
    }
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.id?.toString().includes(searchQuery)
  );

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id?.toString().includes(searchQuery)
  );

  const renderEventCard = (event, isRejected = false) => {
    const isActuallyRejected = isRejected || event.status === "REJECTED";
    const rejectionMessage =
      event.rejectionMessage?.trim() || "No reason provided";

    return (
      <div
        key={event.id}
        className={`event-card ${isActuallyRejected ? "rejected" : ""}`}
      >
        <div className="event-card-header">
          <h3>{event.title || "Untitled Event"}</h3>
          <span className="event-creator">
            By: {event.creatorName || "Club Admin"}
          </span>
          {isActuallyRejected && (
            <span className="rejected-badge">
              <FiXCircle /> Rejected
            </span>
          )}
        </div>
        <p className="event-description">
          {event.description
            ? `${event.description.substring(0, 120)}...`
            : "No description provided"}
        </p>
        <div className="event-meta">
          <div className="event-detail">
            <span className="detail-label">Date:</span>
            <span>
              {event.date
                ? new Date(event.date).toLocaleDateString()
                : "Not specified"}
            </span>
          </div>
          <div className="event-detail">
            <span className="detail-label">Location:</span>
            <span>{event.location || "Not specified"}</span>
          </div>
          {isActuallyRejected && (
            <div className="event-detail full-width">
              <span className="detail-label">Rejection Reason:</span>
              <span className="rejection-reason">{rejectionMessage}</span>
            </div>
          )}
        </div>
        {!isActuallyRejected && (
          <div className="event-actions">
            <button
              className="sysadmin-btn approve"
              onClick={() =>
                showConfirmation("event", null, event.id, "approved")
              }
            >
              <FiCheckCircle className="btn-icon" /> Approve
            </button>
            <button
              className="sysadmin-btn reject"
              onClick={() =>
                showConfirmation("event", null, event.id, "rejected")
              }
            >
              <FiXCircle className="btn-icon" /> Reject
            </button>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <FiAlertCircle className="error-icon" />
        <p>{error}</p>
        <button className="retry-btn" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="sysadmin-container">
      {/* Background Animation */}
      <div className="animated-background">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
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
                  className={`modal-btn ${
                    modalData.decision === "rejected" ? "reject" : "confirm"
                  }`}
                  onClick={handleConfirmAction}
                >
                  {modalData.type === "event"
                    ? modalData.decision === "approved"
                      ? "Approve"
                      : "Reject"
                    : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="rejection-modal">
            <div className="modal-content">
              <div className="modal-header">
                <FiMessageSquare className="modal-icon" />
                <h3>Rejection Reason</h3>
              </div>
              <p className="modal-message">{modalData.message}</p>
              <textarea
                className="rejection-textarea"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter the reason for rejection..."
                rows={4}
              />
              {error && <p className="modal-error">{error}</p>}
              <div className="modal-actions">
                <button
                  className="modal-btn cancel"
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason("");
                    setError(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="modal-btn reject"
                  onClick={handleRejectSubmit}
                >
                  Submit Rejection
                </button>
              </div>
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
                <FiLogOut className="dropdown-icon" /> Logout
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
            <FiClock className="tab-icon" /> Pending Approvals
            {pendingEvents.length > 0 && (
              <span className="tab-badge">{pendingEvents.length}</span>
            )}
          </button>
          <button
            className={`event-tab ${activeTab === "rejected" ? "active" : ""}`}
            onClick={() => setActiveTab("rejected")}
          >
            <FiXCircle className="tab-icon" /> Rejected Events
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
                    <span className="pending-count">
                      {pendingEvents.length}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <FiXCircle className="section-icon rejected" />
                  <h2>Rejected Events</h2>
                  {rejectedEvents.length > 0 && (
                    <span className="rejected-count">
                      {rejectedEvents.length}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {activeTab === "pending" ? (
            pendingEvents.length > 0 ? (
              <div className="event-grid">
                {pendingEvents.map((event) => renderEventCard(event))}
              </div>
            ) : (
              <div className="no-events">
                <FiAlertCircle className="empty-icon" />
                <p>No pending events awaiting approval</p>
              </div>
            )
          ) : rejectedEvents.length > 0 ? (
            <div className="event-grid">
              {rejectedEvents.map((event) => renderEventCard(event, true))}
            </div>
          ) : (
            <div className="no-events">
              <FiAlertCircle className="empty-icon" />
              <p>No rejected events</p>
            </div>
          )}
        </section>

        {/* Admins Section */}
        <section className="sysadmin-section">
          <div className="sysadmin-section-header">
            <h2>Club Admins</h2>
            <button className="sysadmin-btn primary" onClick={handleAddAdmin}>
              <FiPlus className="btn-icon" /> Add Admin
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
                  filteredAdmins.map((admin) => (
                    <tr key={admin.id}>
                      <td className="id-cell">{admin.id}</td>
                      <td className="name-cell">
                        {admin.name || "Unnamed Admin"}
                      </td>
                      <td className="email-cell">
                        {admin.email || "No email"}
                      </td>
                      <td className="action-cell">
                        <button
                          className="sysadmin-btn danger"
                          onClick={() => showConfirmation("admin", admin.id)}
                        >
                          <FiTrash2 className="btn-icon" /> Delete
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
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="id-cell">{user.id}</td>
                      <td className="name-cell">
                        {user.name || "Unnamed User"}
                      </td>
                      <td className="email-cell">{user.email || "No email"}</td>
                      <td className="action-cell">
                        <button
                          className="sysadmin-btn danger"
                          onClick={() => showConfirmation("user", user.id)}
                        >
                          <FiTrash2 className="btn-icon" /> Delete
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
