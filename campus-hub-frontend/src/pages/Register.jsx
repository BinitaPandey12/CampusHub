import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../Styles/Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    let strength = 0;
    if (value.length > 0) strength += 20;
    if (value.length >= 8) strength += 30;
    if (/[A-Z]/.test(value)) strength += 20;
    if (/[0-9]/.test(value)) strength += 20;
    if (/[^A-Za-z0-9]/.test(value)) strength += 10;

    setPasswordStrength(Math.min(strength, 100));
  };

  const getStrengthColor = () => {
    if (passwordStrength < 40) return "#ef4444";
    if (passwordStrength < 70) return "#f59e0b";
    return "#10b981";
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // Client-side email domain validation
    if (!email.toLowerCase().endsWith("@ncit.edu.np")) {
      setError("Registration allowed only with @ncit.edu.np email addresses.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
        }),
      });

      // if (!response.ok) {
      //   let message = "You are not allowed to register as CLUBADMIN or SYSTEMADMIN";
      //   try {
      //     const errData = await response.json();
      //     message = errData.message || message;
      //   } catch {}
      //   throw new Error(message);
      // }
      //       const data = await response.json();
      //     localStorage.setItem("token", data.token);
      //     navigate("/login");
      //   } catch (err) {
      //     setError(err.message || "Something went wrong");
      //   }
      // };

      const data = await response.json();

      if (!response.ok) {
        const message =
          data.message ||
          "You are not allowed to register as CLUBADMIN or SYSTEMADMIN";
        throw new Error(message);
      }

      // Show success message (don’t auto-redirect)
      setSuccessMessage(
        data.message || "Registration successful. Please check your email."
      );
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister} className="register-form">
        <h1 className="register-title">Create Account</h1>
        {successMessage && (
          <div
            className="success-message"
            style={{ color: "green", marginBottom: "10px" }}
          >
            {successMessage}
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="register-input"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="register-input"
          required
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            className="register-input"
            required
          />
          <span
            className="password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "🙊" : "🙈"}
          </span>
        </div>

        <div className="password-wrapper">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="register-input"
            required
          />
          <span
            className="password-toggle"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? "🙊" : "🙈"}
          </span>
        </div>

        <button type="submit" className="register-button">
          Register
        </button>

        <div className="register-footer">
          Already have an account?{" "}
          <Link to="/login" className="register-link">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
