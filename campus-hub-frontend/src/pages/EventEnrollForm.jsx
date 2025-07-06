import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import './EventEnrollForm.css';

const EventEnrollForm = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    studentId: '',
    department: '',
    contactNumber: '',
    additionalInfo: ''
  });

  // Check if user is logged in
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/login', { 
        state: { from: location },
        replace: true 
      });
    }
  }, [navigate, location]);

  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`/api/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        setEventDetails(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load event details. Please try again later.');
        setLoading(false);
        console.error('Error fetching event:', err);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await axios.post(
        `/api/events/${eventId}/enroll`, 
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
      
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate(`/event/${eventId}/confirmation`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit enrollment. Please try again.');
      console.error('Enrollment error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="spinner"
        />
        <p>Loading event details...</p>
      </div>
    );
  }

  if (error && !submitSuccess) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="retry-button"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <motion.div 
        className="success-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="success-message">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            🎉
          </motion.div>
          <h2>Enrollment Successful!</h2>
          <p>You've successfully enrolled for {eventDetails?.name}.</p>
          <p>Redirecting to confirmation page...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="event-enroll-container">
      <motion.div 
        className="enroll-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Enroll for {eventDetails?.name}</h1>
        <p>Fill out the form below to secure your spot</p>
      </motion.div>

      <motion.form 
        onSubmit={handleSubmit}
        className="enroll-form"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {error && <div className="form-error">{error}</div>}

        <div className="form-grid">
          <div className="form-group floating">
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder=" "
              required
              disabled={isSubmitting}
              className="modern-input"
            />
            <label htmlFor="fullName">Full Name *</label>
          </div>

          <div className="form-group floating">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
              required
              disabled={isSubmitting}
              className="modern-input"
            />
            <label htmlFor="email">Email *</label>
          </div>

          <div className="form-group floating">
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder=" "
              required
              disabled={isSubmitting}
              className="modern-input"
            />
            <label htmlFor="studentId">Student ID *</label>
          </div>

          <div className="form-group floating">
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder=" "
              required
              disabled={isSubmitting}
              className="modern-input"
            />
            <label htmlFor="department">Department *</label>
          </div>

          <div className="form-group floating">
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder=" "
              required
              disabled={isSubmitting}
              className="modern-input"
            />
            <label htmlFor="contactNumber">Contact Number *</label>
          </div>

          <div className="form-group floating full-width">
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              placeholder=" "
              disabled={isSubmitting}
              className="modern-textarea"
            />
            <label htmlFor="additionalInfo">Additional Information</label>
          </div>
        </div>

        <div className="form-actions">
          <motion.button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {isSubmitting ? (
              <>
                <span className="button-spinner"></span>
                Processing...
              </>
            ) : (
              'Submit Enrollment'
            )}
          </motion.button>
        </div>
      </motion.form>

      <div className="event-details-sidebar">
        <h3>Event Details</h3>
        {eventDetails && (
          <>
            <div className="detail-item">
              <span className="detail-label">Date:</span>
              <span className="detail-value">
                {new Date(eventDetails.startDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Time:</span>
              <span className="detail-value">
                {new Date(eventDetails.startDate).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                {' - '}
                {new Date(eventDetails.endDate).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Location:</span>
              <span className="detail-value">{eventDetails.location}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Organizer:</span>
              <span className="detail-value">{eventDetails.clubName}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Attendees:</span>
              <span className="detail-value">{eventDetails.attendees || 0} registered</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EventEnrollForm;