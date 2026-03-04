import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPendingPosts, approvePost, rejectPost } from "../api/PostApi";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import "./AdminPostApproval.css";

const AdminPostApproval = () => {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await getPendingPosts();
      setPosts(res.data.posts);
    } catch (err) {
      toast.error("Error loading posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleModeration = async (id, approved) => {

    const tId = toast.loading(approved ? "Approving..." : "Rejecting...");

    try {

      approved
        ? await approvePost(id)
        : await rejectPost(id);

      setPosts(prev => prev.filter(p => p._id !== id));

      toast.success(
        approved ? "Post Live!" : "Post Removed",
        { id: tId }
      );

    } catch (err) {

      toast.error("Failed", { id: tId });

    }

  };

  return (
    <div className="moderation-page-bg">

      <Navbar />

      <main className="moderation-container">

        <div className="moderation-header">

          <h1>Campus Moderation</h1>

          <div className="role-switcher">

            <Link to="/admin" className="role-btn">
              Verify Users
            </Link>

            <Link to="/admin/announcement" className="role-btn">
              Campus Announcement
            </Link>

            <button className="role-btn active">
              Verify Posts
            </button>

          </div>

        </div>

        {loading ? (
          <p className="loading-text">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="no-posts-msg">
            No posts waiting for approval.
          </p>
        ) : (
          <div className="posts-grid">

            {posts.map(post => (

              <div key={post._id} className="post-mod-card">

                <div className="post-author">

                  <div className="author-initial">
                    {post.author?.name?.charAt(0)}
                  </div>

                  <div className="author-meta">
                    <strong>{post.author?.name}</strong>
                    <span>{post.author?.role}</span>
                  </div>

                </div>

                <p className="post-body">
                  {post.text}
                </p>

                {post.media?.url && (
                  <div className="post-media-box">
                    <img src={post.media.url} alt="Post content" />
                  </div>
                )}

                <div className="mod-actions">

                  <button
                    className="btn-approve-full"
                    onClick={() => handleModeration(post._id, true)}
                  >
                    Approve
                  </button>

                  <button
                    className="btn-reject-outline"
                    onClick={() => handleModeration(post._id, false)}
                  >
                    Reject
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </main>

    </div>
  );
};

export default AdminPostApproval;