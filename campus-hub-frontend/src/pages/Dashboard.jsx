import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiCalendar,
  FiMapPin,
  FiClock,
  FiUsers,
  FiLogIn,
} from "react-icons/fi";
import axios from "axios";
import "../Styles/Dashboard.css";
import ntcLogo from "../assets/ntc-logo.jpg";
import noskLogo from "../assets/nosk-logo.jpg";
import ieeeLogo from "../assets/ieee-logo.jpg";

const Dashboard = () => {
  // State management
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Handle scroll for header effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Explore Events button click
  const handleExploreEvents = () => {
    navigate("/login");
  };

  // Filter events based on selected tab and current time
  // const filterEvents = (events = []) => {
  //   const now = new Date();
  //   return events.filter((event) => {
  //     const startDate = new Date(event.startDate);
  //     const endDate = new Date(event.endDate);

  //     if (selectedTab === "upcoming") return event.status === "upcoming";
  //     if (selectedTab === "running") return event.status === "running";

  //     if (filter === "today") {
  //       return startDate.toDateString() === now.toDateString();
  //     }
  //     if (filter === "thisWeek") {
  //       const weekEnd = new Date();
  //       weekEnd.setDate(now.getDate() + 7);
  //       return startDate >= now && startDate <= weekEnd;
  //     }
  //     return true;
  //   });
  // };

  return (
    <div className="dashboard">
      {/* Header */}
      <motion.header
        className={`dashboard-header ${scrolled ? "scrolled" : ""}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <Link to="/" className="dashboard-logo">
            <motion.span
              className="logo-icon"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
            >
              🎓
            </motion.span>
            <motion.span
              className="logo-text"
              whileHover={{ color: "#3a0ca3" }}
            >
              CampusHub
            </motion.span>
          </Link>

          <nav className="main-nav">
            <div className="nav-links">
              <motion.div whileHover={{ y: -2 }}>
                <Link to="/login" className="nav-link">
                  <span className="nav-icon">🔑</span> Login
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }}>
                <Link to="/register" className="nav-link">
                  <span className="nav-icon">📝</span> Register
                </Link>
              </motion.div>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          >
            Discover <span className="highlight">Campus Life</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          >
            Join clubs, attend events, and connect with your community like
            never before.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
          >
            <button
              className="btn-primary"
              onClick={handleExploreEvents}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Events
            </button>
          </motion.div>
        </div>
      </section>

      {/* Featured Clubs Section */}
      <section className="featured-section">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Featured Clubs
        </motion.h2>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Discover popular clubs on campus
        </motion.p>

        <div className="featured-clubs">
          {[
            {
              icon: ntcLogo,
              name: "NTC",
              description: "Nepal Tek Community (NTC) is a technology-focused group that connects developers, designers, and IT professionals across Nepal. It hosts events and discussions on emerging tech trends to foster professional growth.",
              fullName: "Nepal Tek Community",
            },
            {
              icon: noskLogo,
              name: "NOSK",
              description:
                "Nepal Open Source Klub (NOSK) is a student-led community that promotes the use and development of open-source technologies. It organizes workshops, projects, and events to encourage collaboration and learning among tech enthusiasts.",
              fullName: "Nepal Open Source Klub",
            },
            {
              icon: ieeeLogo,
              name: "IEEE NCIT",
              description: "IEEE NCIT Student Branch is a part of the global IEEE network established at Nepal College of Information Technology. It supports students through technical events, competitions, and research-based activities in engineering and technology.",
              fullName: "Institute of Electrical and Electronics Engineers NCIT",
            },
            
          ].map((club, index) => (
            <motion.div
              key={index}
              className="featured-club"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <motion.div
                className="club-icon"
                animate={{
                  y: [0, -5, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <img
                  src={club.icon}
                  alt={club.name}
                  className="club-icon-img"
                />
              </motion.div>
              <h3 className="club-title">{club.name}</h3>
              <p className="club-fullname">{club.fullName}</p>
              <p className="club-description">{club.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">CampusHub</h3>
            <p className="footer-text">
              Connecting students with campus activities and organizations.
            </p>
            <p className="footer-text">Contact No: 01-5186354</p>
            <p className="footer-text">Email: info@ncitedu.np</p>
            <p className="footer-text">Website: www.ncitedu.np</p>
            <p className="footer-text">Address: Balkumari, Lalitpur, Nepal</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            ©️ {new Date().getFullYear()} CampusHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;