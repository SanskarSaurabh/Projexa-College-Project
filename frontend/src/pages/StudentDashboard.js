import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import "./StudentDashboard.css"; // We'll create this next

const StudentDashboard = () => {
  return (
    <div className="student-wrapper">
      <Navbar />

      <div className="container py-5">
        <header className="dashboard-header mb-5">
          <span className="badge-system mb-2">STUDENT HUB</span>
          <h2 className="display-6 fw-bold text-white">Your Dashboard</h2>
          <p className="text-silver">Access your campus network and career opportunities.</p>
        </header>

        <div className="row g-4">
          {/* 📱 CAMPUS FEED CARD */}
          <div className="col-md-6 col-lg-4">
            <Link to="/feed" className="text-decoration-none">
              <div className="bento-card feed-card">
                <div className="card-icon"><i className="bi bi-megaphone-fill"></i></div>
                <div className="card-content">
                  <h3>Campus Feed</h3>
                  <p>Stay updated with the latest campus posts and news.</p>
                </div>
                <div className="card-arrow"><i className="bi bi-arrow-up-right"></i></div>
              </div>
            </Link>
          </div>

          {/* 💬 CHAT CARD */}
          <div className="col-md-6 col-lg-4">
            <Link to="/chat" className="text-decoration-none">
              <div className="bento-card chat-card">
                <div className="card-icon"><i className="bi bi-chat-dots-fill"></i></div>
                <div className="card-content">
                  <h3>Peer Chat</h3>
                  <p>Connect and collaborate with your fellow students.</p>
                </div>
                <div className="card-arrow"><i className="bi bi-arrow-up-right"></i></div>
              </div>
            </Link>
          </div>

          {/* 💼 JOBS CARD */}
          <div className="col-md-12 col-lg-4">
            <Link to="/jobs" className="text-decoration-none">
              <div className="bento-card jobs-card">
                <div className="card-icon"><i className="bi bi-briefcase-fill"></i></div>
                <div className="card-content">
                  <h3>Placements</h3>
                  <p>Explore job opportunities from the Placement Dept.</p>
                </div>
                <div className="card-arrow"><i className="bi bi-arrow-up-right"></i></div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;