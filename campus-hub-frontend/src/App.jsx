import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventDetails from "./pages/EventDetails";
import SystemAdmin from "./pages/SystemAdmin";
import ClubAdmin from "./pages/ClubAdmin";
import UserDashboard from "./pages/UserDashboard";
import Settings from "./pages/Settings";
// import Chatbot from "./components/Chatbot";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* <Chatbot /> */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/event/:eventId" element={<EventDetails />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/system-admin" element={<SystemAdmin />} />
          <Route path="/club-admin" element={<ClubAdmin />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
