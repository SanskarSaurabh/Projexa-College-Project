import { useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Function to determine where the Logo should take the user
  const getHomeRoute = () => {
    if (user?.role === "admin") return "/admin";
    if (user?.role === "placement") return "/placements";
    return "/dashboard"; // Students
  };

  const isActive = (path) => location.pathname === path ? "active-link" : "";

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
      <div className="container">
        {/* Brand Logo - Dynamic Link based on Role */}
        <Link className="navbar-brand fw-bold text-white" to={getHomeRoute()}>
          KRMU <span className="text-indigo-glow">CONNECT</span>
        </Link>

        {/* Mobile Toggle */}
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <i className="bi bi-list text-white fs-2"></i>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto gap-lg-4">
            
            {/* 🛡️ ADMIN NAVIGATION */}
            {user?.role === "admin" && (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/admin")}`} to="/admin">Verify Users</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/admin/posts")}`} to="/admin/posts">Verify Posts</Link>
                </li>
              </>
            )}
            
            {/* 💼 PLACEMENT OFFICER NAVIGATION */}
            {user?.role === "placement" && (
              <li className="nav-item">
                <Link className={`nav-link ${isActive("/placements")}`} to="/placements">Job Management</Link>
              </li>
            )}

            {/* 🎓 STUDENT NAVIGATION ONLY */}
            {user?.role === "student" && (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/dashboard")}`} to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/feed")}`} to="/feed">Campus Feed</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/jobs")}`} to="/jobs">Opportunities</Link>
                </li>
              </>
            )}
          </ul>

          {/* User Profile & Logout */}
          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            <div className="user-profile-nav d-none d-md-flex align-items-center gap-2">
              <div className="avatar-circle">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="user-info-text">
                <p className="m-0 text-white small fw-bold">{user?.name || "User"}</p>
                <span className="text-silver-muted smaller text-uppercase">{user?.role}</span>
              </div>
            </div>
            
            <button className="btn-logout-custom" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;