import { useContext, useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Standardize role
  const userRole = user?.role?.toLowerCase();

  const getHomeRoute = () => {
    if (userRole === "admin") return "/admin";
    if (userRole === "placement") return "/placements";
    return "/dashboard";
  };

  // Improved active route detection
  const isActive = (path) =>
    location.pathname.startsWith(path) ? "nav-item-active" : "";

  return (
    <nav className={`campus-navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
      <div className="nav-container-pill">

        {/* Brand Logo */}
        <Link className="nav-brand-area" to={getHomeRoute()}>
          <div className="nav-logo-box">K</div>
          <div className="nav-logo-text">
            <span className="logo-main">KRMU</span>
            <span className="logo-sub">Connect</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="nav-links-wrapper">
          <ul className="nav-links-list">

            {/* -------- ADMIN -------- */}
            {userRole === "admin" && (
              <>
                <li className={`nav-link-item ${isActive("/admin")}`}>
                  <Link to="/admin">Verifications</Link>
                </li>

                <li className={`nav-link-item ${isActive("/admin/announcement")}`}>
                  <Link to="/admin/announcement">Announcements</Link>
                </li>

                <li className={`nav-link-item ${isActive("/admin/posts")}`}>
                  <Link to="/admin/posts">Moderation</Link>
                </li>
              </>
            )}

            {/* -------- PLACEMENT -------- */}
            {userRole === "placement" && (
              <li className={`nav-link-item ${isActive("/placements")}`}>
                <Link to="/placements">Placement Hub</Link>
              </li>
            )}

            {/* -------- STUDENT -------- */}
            {userRole === "student" && (
              <>
                <li className={`nav-link-item ${isActive("/dashboard")}`}>
                  <Link to="/dashboard">Dashboard</Link>
                </li>

                <li className={`nav-link-item ${isActive("/feed")}`}>
                  <Link to="/feed">Campus Feed</Link>
                </li>

                <li className={`nav-link-item ${isActive("/jobs")}`}>
                  <Link to="/jobs">Job Listings</Link>
                </li>

                <li className={`nav-link-item ${isActive("/chat")}`}>
                  <Link to="/chat">Messages</Link>
                </li>
              </>
            )}

          </ul>
        </div>

        {/* User Profile */}
        <div className="nav-user-controls">

          <div className="nav-profile-pill">
            <div className="nav-avatar-circle">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>

            <div className="nav-user-labels">
              <span className="nav-username-display">
                {user?.name?.split(" ")[0]}
              </span>

              <span className="nav-role-badge">
                {userRole}
              </span>
            </div>
          </div>

          <button
            className="nav-exit-btn"
            onClick={handleLogout}
            title="Logout"
          >
            <i className="bi bi-box-arrow-right"></i>
          </button>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;