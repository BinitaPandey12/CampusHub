import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Styles/EventDetailsPage.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUsers,
  FiTag,
  FiInfo,
  FiUser,
} from "react-icons/fi";

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
    error: null,
  });
  const [creatorName, setCreatorName] = useState("");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // Format username from email
  const formatUsernameFromEmail = (email) => {
    if (!email) return "Club Admin";
    const atIndex = email.indexOf("@");
    if (atIndex === -1) return email;
    return email.substring(0, atIndex).replace(/[^a-zA-Z]/g, " ");
  };

  // Calculate time remaining until event
  const calculateTimeRemaining = (date, time) => {
    try {
      if (!date || !time) {
        return { error: "Date/time not specified" };
      }

      const eventDateTime = new Date(`${date}T${time}`);
      if (isNaN(eventDateTime.getTime())) {
        return { error: "Invalid date/time format" };
      }

      const now = new Date();
      const diff = eventDateTime - now;

      if (diff <= 0) {
        return { isPast: true };
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds, isPast: false };
    } catch (err) {
      return { error: "Could not calculate time remaining" };
    }
  };

  // Format date and time for display
  const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr) return "Date not specified";

    try {
      const dateTime = new Date(
        `${dateStr}T${timeStr?.split(".")[0] || "00:00"}`
      );
      return dateTime.toLocaleString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date/time";
    }
  };

  // Render countdown component
  const renderCountdown = () => {
    if (!event) return null;

    const { days, hours, minutes, isPast, error } = timeRemaining;

    if (error) return <span className="event-countdown error">⏰ {error}</span>;
    if (isPast)
      return <span className="event-countdown now">🎉 Happening now!</span>;

    if (days > 0) {
      return (
        <span className="event-countdown">
          ⏰ {days}d {hours}h {minutes}m remaining
        </span>
      );
    }
    return (
      <span className="event-countdown">
        ⏰ {hours}h {minutes}m remaining
      </span>
    );
  };

//   // Fetch event details and creator info
//   useEffect(() => {
//     const fetchEventDetails = async () => {
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       try {
//         setLoading(true);
//         // Fetch event details
//         const eventResponse = await axios.get(
//           `http://localhost:8080/api/events/${eventId}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setEvent(eventResponse.data);

//         // Fetch approved events to get creator info
//         const approvedEventsResponse = await axios.get(
//           "http://localhost:8080/api/events/approved",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

        
// const processedEvents = processEvents(approvedEventsResponse.data);

// // Find the current event in the processed list
// const currentEvent = processedEvents.find((e) => e.id.toString() === eventId);
// if (currentEvent && currentEvent.creatorName) {
//   setCreatorName(currentEvent.creatorName);
// }

//       } catch (err) {
//         console.error("Error fetching event:", err);
//         toast.error(err.response?.data?.message || "Failed to load event");
//         if (err.response?.status === 401) {
//           navigate("/login");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEventDetails();
//   }, [eventId, token, navigate]);

// Fetch event details and creator info
useEffect(() => {
  const fetchEventDetails = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      
      // Fetch event details (includes creator info)
      const eventResponse = await axios.get(
        `http://localhost:8080/api/events/${eventId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setEvent(eventResponse.data);
      
      // Set creator name from the event response
      if (eventResponse.data.createdByFullName) {
        setCreatorName(eventResponse.data.createdByFullName);
      } else if (eventResponse.data.createdByEmail) {
        setCreatorName(formatUsernameFromEmail(eventResponse.data.createdByEmail));
      }

    } catch (err) {
      console.error("Error fetching event:", err);
      toast.error(err.response?.data?.message || "Failed to load event");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchEventDetails();
}, [eventId, token, navigate]);

  // Update countdown timer
  useEffect(() => {
    if (!event?.date || !event?.time) return;

    const updateCountdown = () => {
      setTimeRemaining(calculateTimeRemaining(event.date, event.time));
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [event]);

  // Handle enrollment
  const handleEnroll = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/enrollments",
        { eventId, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEnrolled(true);
      toast.success("Successfully enrolled in the event!");
    } catch (err) {
      console.error("Enrollment error:", err);
      toast.error(err.response?.data?.message || "Failed to enroll");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="event-details-container loading">
        <div className="loading-spinner"></div>
        <p>Loading event details...</p>
      </div>
    );
  }

  // Error state - event not found
  if (!event) {
    return (
      <div className="event-details-container error">
        <div className="error-content">
          <h2>Event Not Found</h2>
          <p>The requested event could not be found.</p>
          <button className="back-button" onClick={() => navigate(-1)}>
            <FiArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="event-details-container">
      <div className="event-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back to Events
        </button>
        <div className="event-title-wrapper">
          <h1 className="event-title">{event.title}</h1>
          <div className="event-meta">
            {event.club?.name && (
              <span className="event-host">Hosted by {event.club.name}</span>
            )}
          </div>
        </div>
      </div>

      <div className="event-content">
        <div className="event-details">
          <div className="detail-section">
            <div className="section-header">
              <FiInfo className="section-icon" />
              <h3>About This Event</h3>
            </div>
            <p className="event-description">
              {event.description || "No description available."}
            </p>
          </div>

          <div className="detail-section">
            <div className="section-header">
              <FiCalendar className="section-icon" />
              <h3>Event Details</h3>
            </div>
            <div className="detail-grid">
              <div className="detail-item">
                <FiCalendar className="detail-icon" />
                <div>
                  <span className="detail-label">Date & Time</span>
                  <span className="detail-value">
                    {formatDateTime(event.date, event.time)}
                  </span>
                </div>
              </div>
              <div className="detail-item">
                <FiMapPin className="detail-icon" />
                <div>
                  <span className="detail-label">Room No:</span>
                  <span className="detail-value">
                    {event.location || "Not specified"}
                  </span>
                </div>
              </div>
              <div className="detail-item">
                <FiUsers className="detail-icon" />
                <div>
                  <span className="detail-label">Capacity</span>
                  <span className="detail-value">
                    {event.capacity || "100"}
                  </span>
                </div>
              </div>
              <div className="detail-item">
                <FiTag className="detail-icon" />
                <div>
                  <span className="detail-label">⏰ Count Down</span>
                  {renderCountdown()}
                </div>
              </div>
              <div className="detail-item">
                <FiClock className="detail-icon" />
                <div>
                  <span className="detail-label">Status</span>
                  <span className="detail-value">
                    {event.status || "Scheduled"}
                  </span>
                </div>
              </div>
              <div className="detail-item created-by">
                <FiUser className="detail-icon" />
                <div>
                  <span className="detail-label">Created By</span>
                  <span className="detail-value">{creatorName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
