import Navbar from "../components/Navbar";
import CreatePost from "../components/CreatePost";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./AdminDashboard.css";
import "./AdminAnnouncement.css";

const AdminAnnouncement = () => {

  const handlePostCreated = () => {
    toast.success("Announcement posted to campus feed!");
  };

  return (
    <div className="admin-page-bg">
      <Navbar />

      <main className="admin-main-content">

        <div className="admin-top-bar">
          <div className="admin-title-section">
            <h1>Campus Announcement</h1>
            <p>Share updates with students</p>
          </div>

          <div className="role-switcher">

            <Link to="/admin" className="role-btn">
              Verify Users
            </Link>

            <button className="role-btn active">
              Campus Announcement
            </button>

            <Link to="/admin/posts" className="role-btn">
              Verify Posts
            </Link>

          </div>
        </div>

        <div className="admin-post-box">

          <h2>Create Announcement</h2>
          <p>This post will appear in the campus feed</p>

          <CreatePost onPostCreated={handlePostCreated} />

        </div>

      </main>
    </div>
  );
};

export default AdminAnnouncement;