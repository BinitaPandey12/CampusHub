import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyEvents.css";

const MyEvents = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const userName = localStorage.getItem("username") || "User";
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef();

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      if (!email) {
        throw new Error("User email not found in localStorage");
      }

      const response = await axios.get(
        `http://localhost:8080/api/enrollments/user/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000
        }
      );

      console.log("API Response:", response.data); // Debug log

      if (response.status === 200) {
        // Handle both array and single enrollment responses
        const enrollmentsData = Array.isArray(response.data) 
          ? response.data 
          : [response.data];

        if (enrollmentsData.length === 0) {
          setEnrollments([]);
          setFilteredEnrollments([]);
          setError("No enrollments found");
          return;
        }

        // Format enrollment date
        const formattedEnrollments = enrollmentsData.map(enrollment => {
          let formattedEnrollmentDate = "Date not available";
          try {
            if (enrollment.enrollmentDate) {
              const dateObj = new Date(enrollment.enrollmentDate);
              if (!isNaN(dateObj.getTime())) {
                formattedEnrollmentDate = dateObj.toLocaleDateString(undefined, { 
                  year: "numeric", 
                  month: "long", 
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                });
              }
            }
          } catch (e) {
            console.error("Date parsing error:", e);
          }

          return {
            id: enrollment.id,
            eventId: enrollment.eventId,
            eventTitle: enrollment.eventTitle || "Event Title Not Available",
            fullName: enrollment.fullName || "Name not provided",
            email: enrollment.email,
            department: enrollment.department || "Department not specified",
            contactNo: enrollment.contactNo || "Contact not provided",
            semester: enrollment.semester || "Semester not specified",
            status: enrollment.status || "Status unknown",
            enrollmentDate: enrollment.enrollmentDate,
            formattedEnrollmentDate,
            searchableText: `${enrollment.eventTitle} ${enrollment.status} ${formattedEnrollmentDate}`.toLowerCase()
          };
        });

        setEnrollments(formattedEnrollments);
        setFilteredEnrollments(formattedEnrollments);
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (err) {
      console.error("Fetch error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (err.response?.status === 404) {
        setError("No enrollments found");
        setEnrollments([]);
        setFilteredEnrollments([]);
      } else {
        setError(err.response?.data?.message || err.message || "Failed to load enrollments");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, [email, navigate]);

  useEffect(() => {
    // Filter enrollments based on search query
    if (searchQuery.trim() === "") {
      setFilteredEnrollments(enrollments);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = enrollments.filter(enrollment => 
        enrollment.searchableText.includes(query)
      );
      setFilteredEnrollments(filtered);
    }
  }, [searchQuery, enrollments]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const handleRetry = () => {
    fetchEnrollments();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchQuery("");
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "APPLIED":
        return "status-badge--applied";
      case "APPROVED":
        return "status-badge--approved";
      case "REJECTED":
        return "status-badge--rejected";
      default:
        return "status-badge--unknown";
    }
  };

  return (
    <div className="my-events">
      <aside className="my-events__sidebar">
        <div className="my-events__sidebar-title">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">CampusHub</span>
        </div>
        <nav className="my-events__nav">
          <Link to="/user-dashboard" className="my-events__nav-link">
            <span className="my-events__nav-icon">🏠</span>
            <span className="my-events__nav-text">Dashboard</span>
          </Link>
          <Link
            to="/myevents"
            className="my-events__nav-link my-events__nav-link--active"
          >
            <span className="my-events__nav-icon">📆</span>
            <span className="my-events__nav-text">My Enrollments</span>
          </Link>
          <Link to="/chatbot" className="my-events__nav-link">
            <span className="my-events__nav-icon">💬</span>
            <span className="my-events__nav-text">Chatbot Help</span>
          </Link>
        </nav>
      </aside>

      <div className="my-events__main">
        <header className="my-events__header">
          <div className="my-events__search">
            <input
              className="my-events__search-input"
              placeholder="🔍 Search by event, status, date..."
              value={searchQuery}
              onChange={handleSearchChange}
              disabled={loading}
            />
            {searchQuery && (
              <button 
                className="my-events__search-clear"
                onClick={handleSearchClear}
                aria-label="Clear search"
                disabled={loading}
              >
                ×
              </button>
            )}
          </div>

          <div className="my-events__profile" ref={dropdownRef}>
            <span className="my-events__welcome">Welcome, {userName}</span>
            <button
              className="my-events__profile-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="User profile menu"
              disabled={loading}
            >
              👤
            </button>

            {dropdownOpen && (
              <div className="my-events__dropdown">
               
                <button
                  className="my-events__dropdown-item my-events__dropdown-item--logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="my-events__content">
          <h1 className="my-events__page-title">
            My Enrollments
            {searchQuery && filteredEnrollments.length > 0 && (
              <span className="my-events__search-results-count">
                {filteredEnrollments.length} {filteredEnrollments.length === 1 ? 'match' : 'matches'} found
              </span>
            )}
          </h1>

          {loading ? (
            <div className="my-events__loading">
              <div className="my-events__loading-spinner"></div>
              Loading your enrollments...
            </div>
          ) : error ? (
            <div className="my-events__error">
              <div className="error-header">
                <svg className="error-icon" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <h3>Error Loading Enrollments</h3>
              </div>
              <p>{error}</p>
              <button
                className="my-events__retry-btn"
                onClick={handleRetry}
                disabled={loading}
              >
                Try Again
              </button>
            </div>
          ) : filteredEnrollments.length > 0 ? (
            <div className="my-events__list">
              {filteredEnrollments.map((enrollment) => (
                <div key={enrollment.id} className="my-events__card">
                  <div className="my-events__card-header">
                    <h3 className="my-events__event-title">{enrollment.eventTitle}</h3>
                    <span className={`status-badge ${getStatusBadgeClass(enrollment.status)}`}>
                      {enrollment.status}
                    </span>
                  </div>
                  
                  <div className="my-events__card-content">
                    <div className="my-events__enrollment-details">
                      <div className="my-events__detail-row">
                        <span className="my-events__detail-label">Enrollment Date: </span>
                        <span>{enrollment.formattedEnrollmentDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="my-events__no-results">
              <span className="my-events__no-results-icon">🔍</span>
              <h3>No enrollments found for "{searchQuery}"</h3>
              <button
                className="my-events__clear-search-btn"
                onClick={handleSearchClear}
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="my-events__empty">
              <span className="my-events__empty-icon"> 📅 </span>
              <h3>No Enrollments Found</h3>
              <p>You haven't enrolled in any events yet.</p>
              <button
                className="my-events__browse-btn"
                onClick={() => navigate("/user-dashboard")}
              >
                Browse Events
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyEvents;