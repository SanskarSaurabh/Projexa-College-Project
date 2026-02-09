import { useEffect, useState } from "react";
import { getPendingPosts, approvePost, rejectPost } from "../api/PostApi";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import "./AdminPostApproval.css"; // Reusing the high-fidelity Admin styles

const AdminPostApproval = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingPosts = async () => {
    try {
      const res = await getPendingPosts();
      setPosts(res.data.posts);
    } catch (error) {
      console.error("Error fetching posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPosts();
  }, []);

  const handleApprove = async (id) => {
    await approvePost(id);
    fetchPendingPosts();
  };

  const handleReject = async (id) => {
    await rejectPost(id);
    fetchPendingPosts();
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
            <span className="badge-system mb-2">CONTENT MODERATION</span>
            <h2 className="display-6 fw-bold text-white">Post Approvals</h2>
          </div>
          
          <nav className="admin-nav-pills">
            <Link to="/admin" className="nav-pill">Verify Users</Link>
            <Link to="/admin/posts" className="nav-pill active">Verify Posts</Link>
          </nav>
        </div>

        {posts.length === 0 ? (
          <div className="admin-card p-5 text-center">
            <div className="empty-state">
              <i className="bi bi-chat-square-check display-1 text-indigo-glow mb-3"></i>
              <p className="text-silver fs-5">All caught up! No posts pending review.</p>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {posts.map((post) => (
              <div key={post._id} className="col-md-6 col-xl-4">
                <div className="post-approval-card">
                  <div className="post-card-header d-flex align-items-center mb-3">
                    <div className="author-avatar-sm me-2">
                      {post.author.name.charAt(0)}
                    </div>
                    <div>
                      <h6 className="text-white m-0 small">{post.author.name}</h6>
                      <span className="text-silver smaller">Author</span>
                    </div>
                  </div>
                  
                  <div className="post-body mb-4">
                    <p className="text-silver-muted">{post.text}</p>
                  </div>

                  <div className="post-actions d-flex gap-2">
                    <button 
                      className="btn-approve-lg flex-grow-1" 
                      onClick={() => handleApprove(post._id)}
                    >
                      <i className="bi bi-check2 me-2"></i> Approve
                    </button>
                    <button 
                      className="btn-reject-lg" 
                      onClick={() => handleReject(post._id)}
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPostApproval;