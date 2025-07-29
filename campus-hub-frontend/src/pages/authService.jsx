import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

const login = async (email, password) => {
  const response = await axios.post(
    `${API_URL}/login`,
    { email: email.trim(), password },
    { withCredentials: true }
  );
  return response.data;
};

const logout = async () => {
  const response = await axios.post(
    `${API_URL}/logout`,
    {},
    { withCredentials: true }
  );
  localStorage.removeItem("email");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");
  return response.data;
};

const getSessionInfo = async () => {
  const response = await axios.get(`${API_URL}/session-info`, {
    withCredentials: true,
  });
  return response.data;
};

const getCurrentUser = async () => {
  const response = await axios.get(`${API_URL}/me`, {
    withCredentials: true,
  });
  return response.data;
};

const verifyEmail = async (token) => {
  const response = await axios.get(`${API_URL}/verify-email?token=${token}`);
  return response.data;
};

export default {
  login,
  logout,
  getSessionInfo,
  getCurrentUser,
  verifyEmail,
};