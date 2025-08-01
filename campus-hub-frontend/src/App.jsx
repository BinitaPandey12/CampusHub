import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventDetails from "./pages/EventDetails";
import SystemAdmin from "./pages/SystemAdmin";
import ClubAdmin from "./pages/ClubAdmin";
import UserDashboard from "./pages/UserDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import EventDetailsPage from "./pages/EventDetailsPage";
import AddClubAdmin from "./pages/AddClubAdmin";
import ResetPassword from "./pages/ResetPassword";
import FormFill from "./pages/FormFill";
import MyEvents from "./pages/MyEvents";
import ChatbotHelp from "./pages/ChatbotHelp";
import VerifyEmail from "./pages/VerifyEmail";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/events/:eventId" element={<EventDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/system-admin" element={<SystemAdmin />} />
          <Route path="/club-admin" element={<ClubAdmin />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/event/:eventId" element={<EventDetailsPage />} />{" "}
          <Route path="/add-club-admin" element={<AddClubAdmin />} />
          <Route path="/myevents" element={<MyEvents />} />
          <Route path="/enroll/:eventId" element={<FormFill />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/chatbot" element={<ChatbotHelp />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
