import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const UserDashboard = () => {
  // Dummy user data
  const [userName] = useState("Daya Shankar Adhikari");

  // Sample event enrollment data
  const barData = {
    labels: ["Event A", "Event B", "Event C", "Event D", "Event E"],
    datasets: [
      {
        label: "Enrollments",
        data: [12, 19, 7, 14, 10],
        backgroundColor: "#3b82f6",
        borderRadius: 6,
      },
    ],
  };

  const doughnutData = {
    labels: ["Completed", "Pending", "Missed"],
    datasets: [
      {
        label: "Event Status",
        data: [8, 3, 2],
        backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    animation: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Event Enrollment Overview" },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  const doughnutOptions = {
    responsive: true,
    animation: false,
    plugins: {
      legend: { position: "bottom" },
      title: { display: true, text: "Event Completion Status" },
    },
  };

  // Additional info
  const badges = [
    { name: "Active Participant", icon: "🏅", color: "bg-blue-100" },
    { name: "Top Scorer", icon: "🥇", color: "bg-yellow-100" },
    { name: "Consistent", icon: "⏰", color: "bg-green-100" },
  ];

  const upcomingEvents = [
    { name: "Tech Talk 2024", date: "2024-07-10", location: "Auditorium" },
    { name: "Workshop: AI Basics", date: "2024-07-15", location: "Lab 3" },
    { name: "Sports Meet", date: "2024-07-20", location: "Ground" },
  ];

  return (
    <>
      <nav className="navbar shadow-md bg-white">
        <div className="nav-container flex justify-between items-center px-8 py-4">
          <div className="nav-logo text-2xl font-bold text-blue-600">Campus Hub</div>
          <div className="nav-links flex gap-6">
            <a href="#dashboard" className="hover:text-blue-600">Dashboard</a>
            <a href="#events" className="hover:text-blue-600">Events</a>
            <a href="#profile" className="hover:text-blue-600">Profile</a>
            <a href="#logout" className="hover:text-red-500">Logout</a>
          </div>
        </div>
      </nav>

      <div className="page-container bg-gray-50 min-h-screen py-8">
        <div className="dashboard-card max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-6 mb-6">
            <img
              src="https://ui-avatars.com/api/?name=Daya+Shankar+Adhikari&background=3b82f6&color=fff"
              alt="User Avatar"
              className="w-20 h-20 rounded-full border-4 border-blue-200"
            />
            <div>
              <h1 className="dashboard-title text-3xl font-bold mb-1">Welcome, {userName}</h1>
              <p className="text-gray-500">Student | Computer Science Department</p>
              <div className="flex gap-2 mt-2">
                {badges.map((badge) => (
                  <span
                    key={badge.name}
                    className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${badge.color} font-semibold`}
                  >
                    <span className="mr-1">{badge.icon}</span>
                    {badge.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <section className="stats-section grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="stat-box bg-blue-50 rounded-lg p-4 text-center shadow">
              <h3 className="text-blue-600 font-semibold">Events Enrolled</h3>
              <p className="stat-number text-2xl font-bold mt-2">22</p>
            </div>
            <div className="stat-box bg-green-50 rounded-lg p-4 text-center shadow">
              <h3 className="text-green-600 font-semibold">Events Attended</h3>
              <p className="stat-number text-2xl font-bold mt-2">15</p>
            </div>
            <div className="stat-box bg-yellow-50 rounded-lg p-4 text-center shadow">
              <h3 className="text-yellow-600 font-semibold">Upcoming Events</h3>
              <p className="stat-number text-2xl font-bold mt-2">5</p>
            </div>
            <div className="stat-box bg-purple-50 rounded-lg p-4 text-center shadow">
              <h3 className="text-purple-600 font-semibold">Points Earned</h3>
              <p className="stat-number text-2xl font-bold mt-2">130</p>
            </div>
          </section>

          <section className="charts-section grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="chart-card bg-white rounded-lg shadow p-4">
              <Bar data={barData} options={barOptions} />
            </div>
            <div className="chart-card bg-white rounded-lg shadow p-4">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="recent-activities bg-gray-50 rounded-lg p-6 shadow">
              <h2 className="text-lg font-semibold mb-4 text-blue-700">Recent Activities</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Joined Event A - 3 days ago</li>
                <li>Completed Event B - 5 days ago</li>
                <li>Missed Event C - 1 week ago</li>
                <li>Registered for Event D - Yesterday</li>
                <li>Earned 20 points for volunteering - Today</li>
              </ul>
            </div>
            <div className="upcoming-events bg-gray-50 rounded-lg p-6 shadow">
              <h2 className="text-lg font-semibold mb-4 text-green-700">Upcoming Events</h2>
              <ul className="space-y-3">
                {upcomingEvents.map((event) => (
                  <li key={event.name} className="flex items-center gap-3">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                    <div>
                      <div className="font-semibold">{event.name}</div>
                      <div className="text-xs text-gray-500">
                        {event.date} &middot; {event.location}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="tips-section bg-blue-50 rounded-lg p-6 shadow text-blue-900">
            <h2 className="font-semibold mb-2">Tips to Earn More Points</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Participate in more events and workshops.</li>
              <li>Volunteer for event organization.</li>
              <li>Complete feedback forms after events.</li>
              <li>Invite friends to join Campus Hub.</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
