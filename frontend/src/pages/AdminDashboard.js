import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPendingUsers, approveUser, rejectUser } from "../api/AdminApi";
import Navbar from "../components/Navbar";
import "./AdminDashboard.css"; // We'll create this next

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await getPendingUsers();
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (id) => {
    await approveUser(id);
    fetchUsers();
  };

  const handleReject = async (id) => {
    await rejectUser(id);
    fetchUsers();
  };

  if (loading) return (
    <div className="admin-loader">
      <div className="spinner-border text-indigo" role="status"></div>
    </div>
  );

  return (
    <div className="admin-wrapper">
      <Navbar />

      <div className="container py-5">
        <div className="admin-header d-flex justify-content-between align-items-end mb-5">
          <div>
            <span className="badge-system mb-2">MANAGEMENT ENGINE</span>
            <h2 className="display-6 fw-bold text-white">Admin Dashboard</h2>
          </div>
          
          <nav className="admin-nav-pills">
            <Link to="/admin" className="nav-pill active">Verify Users</Link>
            <Link to="/admin/posts" className="nav-pill">Verify Posts</Link>
          </nav>
        </div>

        <div className="admin-card p-4">
          <div className="card-header-flex d-flex justify-content-between mb-4">
            <h5 className="text-white m-0">Pending Approvals</h5>
            <span className="text-silver small">{users.length} requests found</span>
          </div>

          {users.length === 0 ? (
            <div className="empty-state text-center py-5">
              <i className="bi bi-shield-check display-1 text-indigo-glow mb-3"></i>
              <p className="text-silver">The queue is clear. No pending verifications.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table custom-admin-table">
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Requested Role</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="align-middle">
                      <td className="text-white fw-semibold">{user.name}</td>
                      <td className="text-silver">{user.email}</td>
                      <td>
                        <span className={`role-tag ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="text-end">
                        <button 
                          className="btn-approve me-2" 
                          onClick={() => handleApprove(user._id)}
                          title="Approve Access"
                        >
                          <i className="bi bi-check-lg"></i>
                        </button>
                        <button 
                          className="btn-reject" 
                          onClick={() => handleReject(user._id)}
                          title="Reject Request"
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;