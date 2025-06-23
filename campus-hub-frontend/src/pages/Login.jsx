
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import * as jwtDecode from "jwt-decode";

import "./Login.css";
// import jwtDecode from "jwt-decode";







function decodeJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Manual decode error:", error);
    return null;
  }
}
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email,
          password,
        }
      );

      const token = response.data.token;

      // Save token to localStorage or sessionStorage
      localStorage.setItem("token", token);
      localStorage.setItem("email", response.data.email);

      
      const decoded = decodeJwt(token);
    if (!decoded) {
      setError("Failed to decode token.");
      return;
    }

    console.log("Manually decoded token:", decoded);
    const role = decoded.role;


  //     
   // ✅ Redirect based on role
   if (role === "SYSTEMADMIN") {
    navigate("/system-admin-dashboard");
  } else if (role === "CLUBADMIN") {
    navigate("/club-admin");
  } else {
    navigate("/");
  }

// } catch (err) {
//   console.error("Login error:", err);  // Add this line
//   if (err.response && err.response.status === 401) {
//     setError("Invalid email or password.");
//   } else {
//     setError("Login failed. Please try again later.");
//   }
// }

} catch (err) {
  console.error("Login error full object:", err);
  if (err.response) {
    console.log("Error response status:", err.response.status);
    console.log("Error response data:", err.response.data);
  }
  if (err.response && err.response.status === 403) {
    setError("Invalid email or password.");
  } else {
    setError("Login failed. Please try again later.");
  }
}
};

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h1 className="login-title">Login</h1>

        {error && <div className="error-message">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          required
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
          <span
            className="password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
            style={{ cursor: "pointer" }}
          >
            {showPassword ? "🙊" : "🙈"}
          </span>
        </div>

        {/* Forgot Password Link */}
        <div className="forgot-password-container">
          <Link to="/forgot-password" className="forgot-password-link">
            Forgot Password?
          </Link>
        </div>

        <button type="submit" className="login-button">
          Login
        </button>
        <div className="login-footer">
          Don't have an account?{" "}
          <Link to="/register" className="login-link">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
