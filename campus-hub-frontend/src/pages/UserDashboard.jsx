import { FaUserCircle } from "react-icons/fa";

function UserDashboard() {
  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-xl shadow-lg mt-10">
      <div className="flex items-center space-x-4 mb-6">
        <FaUserCircle className="text-5xl text-blue-500" />
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">Welcome Back!</h1>
          <p className="text-gray-500">User Dashboard</p>
        </div>
      </div>
      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">Your Performance</h2>
        <p className="text-gray-700 mb-4">Track your progress and achievements here.</p>
        <div className="flex space-x-6">
          <div className="flex-1 bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">85%</div>
            <div className="text-gray-500">Completion Rate</div>
          </div>
          <div className="flex-1 bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-green-600">5</div>
            <div className="text-gray-500">Upcoming Events</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
