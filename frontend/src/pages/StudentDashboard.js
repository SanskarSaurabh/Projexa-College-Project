import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  return (
    <div className="campus-view">
      {/* Background Animated Blobs - Same as Login */}
      <div className="orange-blob blob-1"></div>
      <div className="orange-blob blob-2"></div>
      
      <Navbar />

      <main className="campus-container" style={{ display: 'block', padding: '100px 5%' }}>
        <header className="dashboard-header mb-5 slide-up">
          <div className="krmu-brand">
            <div className="brand-logo-circle">K</div>
            <div className="brand-titles">
              <span className="badge-system mb-1">STUDENT PORTAL</span>
              <h1>WELCOME BACK!</h1>
              <p>Access your KRMU campus network and career opportunities.</p>
            </div>
          </div>
        </header>

        <div className="row g-4">
          {/* Bento Card: Campus Feed */}
          <div className="col-md-6 col-lg-4">
            <Link to="/feed" className="text-decoration-none">
              <div className="premium-card bento-item slide-up">
                <div className="bento-icon-box">
                  <i className="bi bi-megaphone-fill"></i>
                </div>
                <div className="bento-text">
                  <h3>Campus Feed</h3>
                  <p>Stay updated with latest posts and university news.</p>
                </div>
                <div className="bento-footer">
                  <span>Explore Feed</span>
                  <i className="bi bi-arrow-right"></i>
                </div>
              </div>
            </Link>
          </div>

          {/* Bento Card: Peer Chat */}
          <div className="col-md-6 col-lg-4">
            <Link to="/chat" className="text-decoration-none">
              <div className="premium-card bento-item slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="bento-icon-box">
                  <i className="bi bi-chat-dots-fill"></i>
                </div>
                <div className="bento-text">
                  <h3>Peer Chat</h3>
                  <p>Connect and collaborate with fellow students in real-time.</p>
                </div>
                <div className="bento-footer">
                  <span>Start Chat</span>
                  <i className="bi bi-arrow-right"></i>
                </div>
              </div>
            </Link>
          </div>

          {/* Bento Card: Placements */}
          <div className="col-md-12 col-lg-4">
            <Link to="/jobs" className="text-decoration-none">
              <div className="premium-card bento-item slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="bento-icon-box">
                  <i className="bi bi-briefcase-fill"></i>
                </div>
                <div className="bento-text">
                  <h3>Placements</h3>
                  <p>Official job opportunities from the KRMU Placement Dept.</p>
                </div>
                <div className="bento-footer">
                  <span>View Jobs</span>
                  <i className="bi bi-arrow-right"></i>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;