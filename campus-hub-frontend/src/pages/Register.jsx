import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
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
    if (passwordStrength < 40) return "#ef4444"; // red
    if (passwordStrength < 70) return "#f59e0b"; // amber
    return "#10b981"; // emerald
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      // if (!response.ok) {
      //   const errData = await response.json();
      //   throw new Error(errData.message || "Registration failed");
      // }
      if (!response.ok) {
        let message = "Registration failed";
        try {
          const errData = await response.json();
          message = errData.message || message;
        } catch {
          // Response body is not JSON or is empty//by bini
        }
        throw new Error(message);
      }
      
      const data = await response.json();
      localStorage.setItem("token", data.token); // Save JWT
      navigate("/login");
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister} className="register-form">
        <h1 className="register-title">Create Account</h1>

        {error && <div className="error-message">{error}</div>}

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
            className="login-input"
            required
          />
          <span
            className="password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "🙊" : "🙈"}
          </span>
        </div>

        <div
          className="password-strength-bar"
          style={{
            backgroundColor: getStrengthColor(),
            width: `${passwordStrength}%`,
            height: "5px",
            marginTop: "5px"
          }}
        />

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
