import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaCalendarAlt, FaUsers, FaRobot } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h1 className="sidebar-logo">Campus Hub</h1>
      <nav className="sidebar-nav">
        <NavLink
          to="/userdashboard"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <FaHome className="icon" />
          Dashboard
        </NavLink>
        <NavLink
          to="/myevents"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <FaCalendarAlt className="icon" />
          My Events
        </NavLink>
        <NavLink
          to="/joinedclubs"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <FaUsers className="icon" />
          Joined Clubs
        </NavLink>
        <NavLink
          to="/chatbot"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <FaRobot className="icon" />
          Chatbot Help
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
