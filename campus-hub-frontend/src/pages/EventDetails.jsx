import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EventDetails.css";
import {
  FiCalendar,
  FiMapPin,
  FiEdit2,
  FiTrash2,
  FiLogIn,
} from "react-icons/fi";

function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvent(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch event", err);
        setLoading(false);
      }
    };

    const fetchUserRole = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserRole(res.data.role); // e.g., 'admin' or 'student'
      } catch (err) {
        console.error("Failed to get user role", err);
        setUserRole("");
      }
    };

    if (token) {
      fetchEvent();
      fetchUserRole();
    } else {
      navigate("/login");
    }
  }, [eventId, token, navigate]);

  const handleEnroll = async () => {
    try {
      await axios.post(
        `http://localhost:8080/api/events/${eventId}/enroll`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Enrollment successful!");
    } catch (err) {
      console.error("Enrollment failed", err);
      alert("Failed to enroll. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Event deleted successfully");
      navigate("/events");
    } catch (err) {
      console.error("Failed to delete event", err);
      alert("Could not delete event");
    }
  };

  const handleUpdate = () => {
    navigate(`/events/${eventId}/edit`);
  };

  if (loading) return <div className="loading-state">Loading event details...</div>;
  if (!event) return <div className="error-state">Event not found</div>;

  return (
    <div className="event-details-container">
      <div className="event-card">
        <div className="event-hero">
          <div className="event-hero-content">
            <span className="event-badge">Event ID: {event.id}</span>
            <h1 className="event-title">{event.title}</h1>
            <p className="event-subtitle">Organized by Campus Hub</p>
          </div>
        </div>

        <div className="event-content">
          <div className="event-header">
            <h1 className="event-title">{event.title}</h1>
          </div>

          <p className="event-description">{event.description}</p>

          <div className="event-meta">
            <span className="meta-item">
              <FiCalendar className="btn-icon" />
              {event.date}
            </span>
            <span className="meta-item">
              <FiMapPin className="btn-icon" />
              {event.location}
            </span>
          </div>

          <div className="action-buttons">
            {userRole === "admin" && (
              <>
                <button className="btn btn-edit" onClick={handleUpdate}>
                  <FiEdit2 className="btn-icon" />
                  Edit Event
                </button>
                <button className="btn btn-delete" onClick={handleDelete}>
                  <FiTrash2 className="btn-icon" />
                  Delete Event
                </button>
              </>
            )}

            {userRole === "student" && (
              <button className="btn btn-enroll" onClick={handleEnroll}>
                <FiLogIn className="btn-icon" />
                Enroll in Event
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
