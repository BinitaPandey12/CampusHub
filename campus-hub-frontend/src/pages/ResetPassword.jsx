import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/ResetPassword.css';
import { FiEye, FiEyeOff } from "react-icons/fi";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = searchParams.get('token');

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    // Password strength calculation
    let strength = 0;
    if (password.length > 5) strength += 1;
    if (password.length > 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setMessage({ text: 'Invalid reset link', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }

    if (passwordStrength < 3) {
      setMessage({ text: 'Password is too weak', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/reset-password',
        {
          token,
          newPassword
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      setMessage({ 
        text: response.data.message || 'Password reset successfully!', 
        type: 'success' 
      });
      
      // Redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password reset failed';
      setMessage({ 
        text: errorMessage, 
        type: 'error' 
      });
    }
    setLoading(false);
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'transparent';
    if (passwordStrength <= 2) return '#ef4444';
    if (passwordStrength === 3) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="logo-container">
          <svg className="logo-icon" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
          </svg>
          <h1>Reset Password</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="input-group">
            <div className="password-input-wrapper">
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={handlePasswordChange}
                required
                minLength="6"
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
            
          </div>

          <div className="input-group">
           <div className="password-input-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          </div>

          <button 
            type="submit" 
            className="reset-button"
            disabled={loading || !token}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="footer-links">
          <a href="/login">Back to Login</a>
         
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;