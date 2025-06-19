import React, { useEffect, useState } from "react";
import "./SystemAdmin.css";
import { useNavigate } from "react-router-dom";

function SystemAdmin() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    // ✅ Fetch admins from backend
    fetch("http://localhost:8080/api/admins", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401) throw new Error("Unauthorized");
        return res.json();
      })
      .then(data => setAdmins(data))
      .catch(() => navigate("/login"));

    // ✅ Fetch users from backend
    fetch("http://localhost:8080/api/users", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401) throw new Error("Unauthorized");
        return res.json();
      })
      .then(data => setUsers(data))
      .catch(() => navigate("/login"));
  }, [navigate, token]);

  const handleAddAdmin = () => {
    navigate("/add-club-admin");
  };

  const handleDelete = (type, id) => {
    const endpoint = type === "admin" ? "admins" : "users";

    if (window.confirm(`Delete this ${type}?`)) {
      fetch(`http://localhost:8080/api/${endpoint}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          if (res.ok) {
            alert(`${type} deleted.`);
            window.location.reload(); // Or re-fetch data
          } else {
            alert("Failed to delete.");
          }
        });
    }
  };

  return (
    <div className="system-admin-container">
      <h1 className="dashboard-title">System Admin Dashboard</h1>

      <section className="admin-section">
        <div className="section-header">
          <h2>Club Admins</h2>
          <button className="btn btn-add" onClick={handleAddAdmin}>
            + Add Club Admin
          </button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete("admin", admin.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="admin-section">
        <h2>Registered Users</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete("user", user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default SystemAdmin;
