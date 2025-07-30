import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/EventDetails.css";
import {
  FiCalendar,
  FiMapPin,
  FiUser,
  FiMail,
  FiBook,
  FiPhone,
  FiClock,
  FiArrowLeft,
} from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("table");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);

        // Fetch event details
        const eventRes = await axios.get(
          `http://localhost:8080/api/events/${eventId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Fetch enrollments
        // const enrollmentsRes = await axios.get(
        //   `http://localhost:8080/api/enrollments/event/${eventId}/enrollments`,
        //   { headers: { Authorization: `Bearer ${token}` } }
        // );

        setEvent(eventRes.data);
        setEnrollments(enrollmentsRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data", err);
        toast.error(
          err.response?.data?.message || "Failed to load event details"
        );
        setLoading(false);
        if (err.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    if (token) {
      fetchEventData();
    } else {
      navigate("/login");
    }
  }, [eventId, token, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "Not specified";
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="clubevent-loading-container">
        <div className="clubevent-loading-spinner"></div>
        <p>Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="clubevent-error-container">
        <h2>Event not found</h2>
        <button onClick={() => navigate(-1)} className="clubevent-back-button">
          <FiArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="clubevent-container">
      <button onClick={() => navigate(-1)} className="clubevent-back-button">
        <FiArrowLeft /> Back to Events
      </button>

      <div className="clubevent-card">
        <div className="clubevent-header">
          <div className="clubevent-meta">
            <span className="clubevent-id">Event ID: {event.id}</span>
            <span
              className={`clubevent-status clubevent-status-${event.status.toLowerCase()}`}
            >
              {event.status}
            </span>
          </div>
          <h1 className="clubevent-title">{event.title}</h1>
          <p className="clubevent-organizer">Organized by Campus Hub</p>
        </div>

        <div className="clubevent-content">
          <div className="clubevent-description">
            <h3>Description</h3>
            <p>{event.description}</p>
          </div>

          <div className="clubevent-details-grid">
            <div className="clubevent-detail-item">
              <FiCalendar className="clubevent-detail-icon" />
              <div>
                <h4>Date</h4>
                <p>{formatDate(event.date)}</p>
              </div>
            </div>

            <div className="clubevent-detail-item">
              <FiClock className="clubevent-detail-icon" />
              <div>
                <h4>Time</h4>
                <p>{event.time || "Not specified"}</p>
              </div>
            </div>

            <div className="clubevent-detail-item">
              <FiMapPin className="clubevent-detail-icon" />
              <div>
                <h4>Location</h4>
                <p>{event.location}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="clubevent-enrollments-section">
          <div className="clubevent-section-header">
            <h3 className="clubevent-section-title">
              Registered Users ({enrollments.length})
            </h3>
            <div className="clubevent-view-toggle">
              <button
                className={`clubevent-toggle-btn ${
                  viewMode === "table" ? "clubevent-active" : ""
                }`}
                onClick={() => setViewMode("table")}
              >
                Table View
              </button>
              <button
                className={`clubevent-toggle-btn ${
                  viewMode === "cards" ? "clubevent-active" : ""
                }`}
                onClick={() => setViewMode("cards")}
              >
                Card View
              </button>
            </div>
          </div>

          {enrollments.length > 0 ? (
            viewMode === "table" ? (
              <div className="clubevent-table-container">
                <table className="clubevent-enrollments-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Contact</th>
                      <th>Semester</th>
                      <th>Registered On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map((enrollment, index) => (
                      <tr key={index}>
                        <td>
                          <div className="clubevent-user-cell">
                            <FiUser className="clubevent-user-icon" />
                            {enrollment.fullName}
                          </div>
                        </td>
                        <td>
                          <div className="clubevent-email-cell">
                            <FiMail className="clubevent-cell-icon" />
                            {enrollment.email}
                          </div>
                        </td>
                        <td>{enrollment.department}</td>
                        <td>{enrollment.contactNo}</td>
                        <td>{enrollment.semester}</td>
                        <td>{formatDateTime(enrollment.enrollmentDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="clubevent-enrollments-grid">
                {enrollments.map((enrollment, index) => (
                  <div key={index} className="clubevent-enrollment-card">
                    <div className="clubevent-enrollment-header">
                      <FiUser className="clubevent-enrollment-icon" />
                      <h4>{enrollment.fullName}</h4>
                    </div>

                    <div className="clubevent-enrollment-details">
                      <div className="clubevent-enrollment-detail">
                        <FiMail className="clubevent-detail-icon" />
                        <span>{enrollment.email}</span>
                      </div>
                      <div className="clubevent-enrollment-detail">
                        <FiBook className="clubevent-detail-icon" />
                        <span>{enrollment.department}</span>
                      </div>
                      <div className="clubevent-enrollment-detail">
                        <FiPhone className="clubevent-detail-icon" />
                        <span>{enrollment.contactNo}</span>
                      </div>
                      <div className="clubevent-enrollment-detail">
                        <span>Semester: {enrollment.semester}</span>
                      </div>
                      <div className="clubevent-enrollment-detail">
                        <FiClock className="clubevent-detail-icon" />
                        <span>
                          Registered on:{" "}
                          {formatDateTime(enrollment.enrollmentDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <p className="clubevent-empty-state">
              No users have registered for this event yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
