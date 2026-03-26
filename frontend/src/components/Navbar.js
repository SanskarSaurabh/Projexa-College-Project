import { useContext, useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import socket from "../socket";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [globalUnread, setGlobalUnread] = useState(0);

  // Scroll effect logic
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= FETCH GLOBAL UNREAD ================= */
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/chat/unread`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await res.json();
        if (!data.unread) return;

        const total = data.unread.reduce((sum, item) => sum + item.count, 0);
        setGlobalUnread(total);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    try {
      socket.emit("logout");
      socket.disconnect();
    } catch (err) {
      console.log(err);
    }
    logout();
    navigate("/");
  };

  const userRole = user?.role?.toLowerCase();

  const getHomeRoute = () => {
    if (userRole === "admin") return "/admin";
    if (userRole === "placement") return "/placements";
    return "/dashboard";
  };

  const isActive = (path) =>
    location.pathname.startsWith(path) ? "nav-item-active" : "";

  return (
    <nav className={`campus-navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
      <div className="nav-container-pill">

        {/* BRAND LOGO */}
        <Link className="nav-brand-area" to={getHomeRoute()}>
          <div className="nav-logo-box">K</div>
          <div className="nav-logo-text">
            <span className="logo-main">KRMU</span>
            <span className="logo-sub">Connect</span>
          </div>
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="nav-links-wrapper">
          <ul className="nav-links-list">

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
                <li className={`nav-link-item ${isActive("/admin/delete-student")}`}>
                  <Link to="/admin/delete-student">Remove Student</Link>
                </li>
              </>
            )}

            {userRole === "placement" && (
              <>
                <li className={`nav-link-item ${isActive("/placements")}`}>
                  <Link to="/placements">Placement Hub</Link>
                </li>
                <li className={`nav-link-item ${isActive("/placement-applicants")}`}>
                  <Link to="/placement-applicants">Applicants</Link>
                </li>
              </>
            )}

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
                <li className={`nav-link-item ${isActive("/student-profile")}`}>
                  <Link to="/student-profile">My Profile</Link>
                </li>
                <li className={`nav-link-item ${isActive("/chat")}`}>
                  <Link to="/chat">
                    Messages {globalUnread > 0 && `(+${globalUnread})`}
                  </Link>
                </li>
              </>
            )}

          </ul>
        </div>

        {/* USER CONTROLS (No Upload logic here) */}
        <div className="nav-user-controls">
          <div className="nav-profile-pill">
            <div className="nav-avatar-circle">
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="profile"
                  className="nav-avatar-img"
                />
              ) : (
                <span className="nav-avatar-initial">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>
              )}
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