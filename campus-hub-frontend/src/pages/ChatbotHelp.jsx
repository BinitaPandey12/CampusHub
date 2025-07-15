import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./ChatbotHelp.css";

const ChatbotHelp = () => {
  const userName = "User";
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    // Load Dialogflow script only once
    if (!window.dfMessengerScriptLoaded) {
      const script = document.createElement("script");
      script.src =
        "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
      script.async = true;
      document.body.appendChild(script);
      window.dfMessengerScriptLoaded = true;

      script.onload = () => {
        addMessenger();
      };
    } else {
      addMessenger();
    }

    function addMessenger() {
      const container = document.getElementById(
        "dialogflow-messenger-container"
      );
      if (!container) return;

      // Prevent adding messenger multiple times
      if (!container.querySelector("df-messenger")) {
        const messenger = document.createElement("df-messenger");
        messenger.setAttribute("chat-title", "CampusBot");
        messenger.setAttribute(
          "agent-id",
          "0861736d-dbac-4fad-aa93-b0ab54ccf2d6"
        );
        messenger.setAttribute("language-code", "en");
        messenger.setAttribute(
          "chat-icon",
          "https://cdn3d.iconscout.com/3d/premium/thumb/robot-say-hi-3d-icon-download-in-png-blend-fbx-gltf-file-formats--saying-hello-device-brain-activity-pack-science-technology-icons-7746773.png?f=webp"
        );
        messenger.setAttribute("intent","Welcome");


        // Remove floating styles to embed inline
        messenger.style.position = "relative";
        messenger.style.marginTop = "70px";
        messenger.style.width = "100%";
        messenger.style.height = "600px"; // Adjust height as needed

        container.appendChild(messenger);
      }
    }

    // Do NOT remove the script or messenger on unmount
  }, []);

  return (
    <div className="chatbot-help">
      <aside className="chatbot-help__sidebar">
        <div className="chatbot-help__sidebar-title">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">CampusHub</span>
        </div>
        <nav className="chatbot-help__nav">
          <Link to="/user-dashboard" className="chatbot-help__nav-link">
            <span className="chatbot-help__nav-icon">🏠</span>
            <span className="chatbot-help__nav-text">Dashboard</span>
          </Link>
          <Link to="/myevents" className="chatbot-help__nav-link">
            <span className="chatbot-help__nav-icon">📆</span>
            <span className="chatbot-help__nav-text">My Events</span>
          </Link>
          <Link
            to="/chatbot"
            className="chatbot-help__nav-link chatbot-help__nav-link--active"
          >
            <span className="chatbot-help__nav-icon">💬</span>
            <span className="chatbot-help__nav-text">Chatbot Help</span>
          </Link>
        </nav>
      </aside>

      <div className="chatbot-help__main">
        <header className="chatbot-help__header">
          <div className="chatbot-help__search">
            <input
              className="chatbot-help__search-input"
              placeholder="🔍 Search help topics..."
            />
          </div>

          <div className="chatbot-help__profile" ref={dropdownRef}>
            <span className="chatbot-help__welcome">Welcome, {userName}</span>
            <button
              className="chatbot-help__profile-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              👤
            </button>

            {dropdownOpen && (
              <div className="chatbot-help__dropdown">
                <Link to="/profile" className="chatbot-help__dropdown-item">
                  View Profile
                </Link>
                <Link to="/settings" className="chatbot-help__dropdown-item">
                  Settings
                </Link>
                <Link
                  to="/"
                  className="chatbot-help__dropdown-item chatbot-help__dropdown-item--logout"
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        </header>

        <main className="chatbot-help__content">
          <div className="chatbot-help__header-section">
            <h1 className="chatbot-help__title">Chatbot Help</h1>
            <p className="chatbot-help__subtitle">
              Need assistance? Our virtual assistant is available 24/7 to answer
              your questions.
            </p>
          </div>

          <div className="chatbot-help__chat-container">
            {/* Dialogflow Messenger will be embedded here */}
            <div id="dialogflow-messenger-container"></div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatbotHelp;
