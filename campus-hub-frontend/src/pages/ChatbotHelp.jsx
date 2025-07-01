import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./ChatbotHelp.css";

const ChatbotHelp = () => {
  const userName = "User";
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", sender: "bot" },
  ]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
    };

    setMessages([...messages, newUserMessage]);
    setInputValue("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: "Thanks for your message! Our team will get back to you soon.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

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
            <div className="chatbot-help__messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`chatbot-help__message chatbot-help__message--${message.sender}`}
                >
                  {message.text}
                </div>
              ))}
            </div>

            <form
              className="chatbot-help__input-form"
              onSubmit={handleSendMessage}
            >
              <input
                type="text"
                className="chatbot-help__message-input"
                placeholder="Type your message here..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button type="submit" className="chatbot-help__send-btn">
                Send
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatbotHelp;
