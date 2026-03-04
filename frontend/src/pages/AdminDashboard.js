import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPendingUsers, approveUser, rejectUser } from "../api/AdminApi";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import "./AdminDashboard.css";

const AdminDashboard = () => {

  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await getPendingUsers();
      setUsers(res.data);
    } catch (error) {
      toast.error("Error loading user queue");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = async (id, actionType) => {

    const loadToast = toast.loading("Processing...");

    try {

      if (actionType === "approve") await approveUser(id);
      else await rejectUser(id);

      setUsers(prev => prev.filter(user => user._id !== id));

      toast.success(
        `User ${actionType === "approve" ? "Verified" : "Rejected"}`,
        { id: loadToast }
      );

    } catch (err) {
      toast.error("Action failed", { id: loadToast });
    }
  };

  return (
    <div className="admin-page-bg">

      <Navbar />

      <main className="admin-main-content">

        <div className="admin-top-bar">

          <div className="admin-title-section">
            <h1>User Verification</h1>
            <p>Review institutional registration requests</p>
          </div>

          <div className="role-switcher">

            <button className="role-btn active">
              Verify Users
            </button>

            <Link to="/admin/announcement" className="role-btn">
              Campus Announcement
            </Link>

            <Link to="/admin/posts" className="role-btn">
              Verify Posts
            </Link>

          </div>

        </div>

        <div className="admin-table-card">

          <div className="table-responsive">

            <table className="user-verification-table">

              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>University Email</th>
                  <th>Role</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>

                {users.map(user => (

                  <tr key={user._id}>

                    <td>{user.name}</td>

                    <td>{user.email}</td>

                    <td>
                      <span className={`role-tag ${user.role}`}>
                        {user.role}
                      </span>
                    </td>

                    <td>
                      <div className="action-btns-group">

                        <button
                          className="btn-circle-check"
                          onClick={() => handleAction(user._id,"approve")}
                        >
                          <i className="bi bi-check-lg"></i>
                        </button>

                        <button
                          className="btn-circle-x"
                          onClick={() => handleAction(user._id,"reject")}
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>

                      </div>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </main>

    </div>
  );
};

export default AdminDashboard;