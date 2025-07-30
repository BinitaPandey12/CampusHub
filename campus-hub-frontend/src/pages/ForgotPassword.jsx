import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../Styles/ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/forgot-password",
        { email }
      );
      setMessage(response.data.message || "Reset link sent. Check your email.");
      setEmail("");
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to send reset link. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-wrapper">
      <div className="forgot-card">
        <form className="forgot-form" onSubmit={handleSubmit}>
          <div className="forgot-icon">🔒</div>
          <h2 className="forgot-title">Forgot Password?</h2>
          <p className="forgot-subtitle">
            Enter your email to receive a password reset link.
          </p>

          {message && <div className="forgot-success">{message}</div>}
          {error && <div className="forgot-error">{error}</div>}

          <input
            type="email"
            className="forgot-input"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className="forgot-button" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <div className="forgot-footer">
            <Link to="/login" className="forgot-link">
              ← Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
