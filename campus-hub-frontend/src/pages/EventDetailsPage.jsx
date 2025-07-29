import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EventDetailsPage.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUsers,
  FiTag,
  FiInfo
} from 'react-icons/fi';

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);

        const [eventResponse, enrollmentResponse] = await Promise.all([
          axios.get(`http://localhost:8080/api/events/${eventId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          // userId && axios.get(`http://localhost:8080/api/enrollments/check?eventId=${eventId}&userId=${userId}`, {
          //   headers: { Authorization: `Bearer ${token}` }
          // })
        ]);

        setEvent(eventResponse.data);
        if (enrollmentResponse?.data) {
          setIsEnrolled(enrollmentResponse.data.isEnrolled);
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        toast.error(err.response?.data?.message || "Failed to load event");
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, token, navigate, userId]);

  const handleEnroll = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/enrollments',
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

  const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr) return 'Date not specified';
    const dateTime = new Date(`${dateStr}T${timeStr?.split('.')[0] || '00:00'}`);
    return dateTime.toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="event-details-container loading">
        <div className="loading-spinner"></div>
        <p>Loading event details...</p>
      </div>
    );
  }

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

  return (
    <div className="event-details-container">
      <div className="event-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back to Events
        </button>
        <div className="event-title-wrapper">
          <h1 className="event-title">{event.title}</h1>
          <div className="event-meta">
            <span className="event-category">{event.category || 'General'}</span>
            {/* <span className="event-host">Hosted by {event.club?.name || 'Campus Hub'}</span> */}
          </div>
        </div>
      </div>

      <div className="event-content">
        {/* <div className="event-image-container">
          <img
            src={event.imageUrl || '/default-event-image.jpg'}
            alt={event.title}
            className="event-image"
            onError={(e) => {
              e.target.src = '/default-event-image.jpg';
            }}
          />
        </div> */}

        <div className="event-details">
          <div className="detail-section">
            <div className="section-header">
              <FiInfo className="section-icon" />
              <h3>About This Event</h3>
            </div>
            <p className="event-description">{event.description || 'No description available.'}</p>
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
                  <span className="detail-value">{formatDateTime(event.date, event.time)}</span>
                </div>
              </div>
              <div className="detail-item">
                <FiMapPin className="detail-icon" />
                <div>
                  <span className="detail-label">Location</span>
                  <span className="detail-value">{event.location || 'Not specified'}</span>
                </div>
              </div>
              <div className="detail-item">
                <FiUsers className="detail-icon" />
                <div>
                  <span className="detail-label">Capacity</span>
                  <span className="detail-value">{event.capacity || 'Unlimited'} spots</span>
                </div>
              </div>
              <div className="detail-item">
                <FiTag className="detail-icon" />
                <div>
                  <span className="detail-label">Category</span>
                  <span className="detail-value">{event.category || 'General'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="action-section">
            {/* {isEnrolled ? (
              <div className="enrollment-status">
                <span>✓ You're enrolled in this event</span>
              </div>
            ) : (
              <button className="enroll-button" onClick={handleEnroll}>
                Enroll Now
              </button>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;