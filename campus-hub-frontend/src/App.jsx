import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventDetails from "./pages/EventDetails";
import SystemAdmin from "./pages/SystemAdmin";
import ClubAdmin from "./pages/ClubAdmin";
import UserDashboard from "./pages/UserDashboard";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";
<<<<<<< HEAD
import Profile from "./pages/Profile";
// If you do not have these files, comment them or create them
import MyEvents from "./pages/MyEvents";
import JoinedClubs from "./pages/JoinedClubs";
import ChatbotHelp from "./pages/ChatbotHelp";
=======
import VerifyEmail from "./pages/VerifyEmail"; 
// import Chatbot from "./components/Chatbot";
>>>>>>> fd82b4ae393e6e7c84015747839a5f21d2b34919

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/event/:eventId" element={<EventDetails />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/system-admin" element={<SystemAdmin />} />
          <Route path="/club-admin" element={<ClubAdmin />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
<<<<<<< HEAD
          <Route path="/profile" element={<Profile />} />
          {/* Uncomment these only if you create the files */}
          { <Route path="/myevents" element={<MyEvents />} /> }
          {<Route path="/joined" element={<JoinedClubs />} /> }
          { <Route path="/chatbot" element={<ChatbotHelp />} /> }
=======

          <Route path="/verify-email" element={<VerifyEmail />} />
>>>>>>> fd82b4ae393e6e7c84015747839a5f21d2b34919
        </Routes>
      </div>
    </Router>
  );
}

export default App;
