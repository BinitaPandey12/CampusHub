import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Link } from "react-router-dom";
import "./UserDashboard.css"; // Ensure you have this CSS file for styling
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

const UserDashboard = () => {
  const userName = "User"; // dynamically replace this when auth is added

  const barData = {
    labels: ["Quiz", "Hackathon", "Workshop", "Seminar"],
    datasets: [
      {
        label: "Performance (%)",
        data: [70, 85, 60, 90],
        backgroundColor: "#3b82f6",
        borderRadius: 8,
      },
    ],
  };

  const doughnutData = {
    labels: ["Upcoming", "Ongoing", "Completed"],
    datasets: [
      {
        label: "Events",
        data: [30, 20, 50],
        backgroundColor: ["#10b981", "#3b82f6", "#f59e0b"],
        borderWidth: 1,
      },
    ],
  };

  const dropdownRef = React.useRef(null);
  const profileIconRef = React.useRef(null);
  const [showDropdown, setShowDropdown] = React.useState(false);

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        profileIconRef.current &&
        !profileIconRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="user-dashboard">
      <nav className="user-dashboard-nav">
        <div className="user-nav-container">
          <div className="user-nav-logo">
            <img
              src="/icon.png"
              alt="Campus Hub Logo"
              className="user-nav-logo-img"
            />
            Campus Hub
          </div>
          <div className="user-nav-links">
            <div className="user-nav-welcome">
              <span>Welcome, {userName}</span>
              <button
                type="button"
                aria-label="Notifications"
                className="user-notification-btn"
              >
                👋
              </button>
            </div>
            <div className="user-profile-dropdown" ref={dropdownRef}>
              <button
                ref={profileIconRef}
                type="button"
                aria-label="User Profile"
                className="user-profile-icon"
                aria-haspopup="true"
                aria-expanded={showDropdown}
                onClick={toggleDropdown}
              >
                👤
              </button>
              {showDropdown && (
                <div className="user-dropdown-menu">
                  <Link
                    to="/"
                    className="user-dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="event/:eventId"
                    className="user-dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    Events
                  </Link>
                  <Link
                    to="/"
                    className="user-dropdown-item user-dropdown-logout"
                    onClick={() => setShowDropdown(false)}
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="user-dashboard-main">
        <h1 className="user-dashboard-heading">Welcome, {userName} 👋</h1>

        <div className="user-dashboard-cards">
          <div className="user-dashboard-card">
            <h4>Events Attended</h4>
            <p>10</p>
          </div>
          <div className="user-dashboard-card">
            <h4>Certificates Earned</h4>
            <p>7</p>
          </div>
          <div className="user-dashboard-card">
            <h4>Overall Rating</h4>
            <p>4.6 / 5</p>
          </div>
        </div>

        <div className="user-charts-section">
          <div className="user-chart-box">
            <h4>Event Enrollment</h4>
            <Doughnut data={doughnutData} />
          </div>
          <div className="user-chart-box">
            <h4>Performance Overview</h4>
            <Bar data={barData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;