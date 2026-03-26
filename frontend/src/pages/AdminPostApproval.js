import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getPendingPosts, approvePost, rejectPost } from "../api/PostApi";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import "./AdminPostApproval.css";

const AdminPostApproval = () => {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewPost, setPreviewPost] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

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

  const handleMouseDown = (e) => {
    if (zoom <= 1) return;

    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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
  {post.author?.profilePic ? (
    <img
      src={post.author.profilePic}
      alt="profile"
      className="admin-avatar-img"
    />
  ) : (
    post.author?.name?.charAt(0)
  )}
</div>

                  <div className="author-meta">
                    <strong>{post.author?.name}</strong>
                    <span className="role-badge">
                      {post.author?.role}
                    </span>
                  </div>
                </div>

                <p className="post-body">
                  {post.text}
                </p>

                {(post.media?.url || post.mediaFiles?.length > 0) && (

                  <div className="post-media-box">

                    {post.mediaFiles?.length > 0 ? (

                      <div className="media-slider">

                        {post.mediaFiles.map((file, index) => (

                          file.resource_type === "video" ? (

                            <video
                              key={index}
                              src={file.url}
                              controls
                              style={{ width: "100%", borderRadius: "12px" }}
                            />

                          ) : (

                            <img
                              key={index}
                              src={file.url}
                              alt="post"
                              style={{ width: "100%", borderRadius: "12px", cursor: "pointer" }}
                              onClick={() => {
                                setPreviewPost(post);
                                setCurrentIndex(index);
                                setZoom(1);
                                setPosition({ x: 0, y: 0 });
                              }}
                            />

                          )

                        ))}

                      </div>

                    ) : (

                      post.media.resource_type === "video" ? (

                        <video
                          src={post.media.url}
                          controls
                          style={{ width: "100%", borderRadius: "12px" }}
                        />

                      ) : (

                        <img
                          src={post.media.url}
                          alt="post"
                          style={{ width: "100%", borderRadius: "12px", cursor: "pointer" }}
                          onClick={() => {
                            setPreviewPost(post);
                            setCurrentIndex(0);
                            setZoom(1);
                            setPosition({ x: 0, y: 0 });
                          }}
                        />

                      )

                    )}

                  </div>

                )}

                <div className="mod-actions">

                  <button
                    className="btn-preview"
                    onClick={() => {
                      setPreviewPost(post);
                      setCurrentIndex(0);
                    }}
                  >
                    Preview
                  </button>

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

      {/* 🔥 FIXED MODAL */}
      {previewPost && (

        <div className="image-modal-overlay" onClick={() => setPreviewPost(null)}>

          <div className="modal-content-box" onClick={(e) => e.stopPropagation()}>

            <div className="post-author">
              <div className="author-initial">
  {previewPost.author?.profilePic ? (
    <img
      src={previewPost.author.profilePic}
      alt="profile"
      className="admin-avatar-img"
    />
  ) : (
    previewPost.author?.name?.charAt(0)
  )}
</div>

              <div className="author-meta">
                <strong>{previewPost.author?.name}</strong>
                <span className="role-badge">
                  {previewPost.author?.role}
                </span>
              </div>
            </div>

            <p className="post-body">{previewPost.text}</p>

            <div className="modal-image-wrapper">

              <img
                src={
                  previewPost.mediaFiles?.length > 0
                    ? previewPost.mediaFiles[currentIndex]?.url
                    : previewPost.media?.url
                }
                alt="full"
                className="image-modal-content"
                style={{
                  transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={(e) => {
                  e.preventDefault();
                  const delta = -e.deltaY * 0.001;
                  setZoom(prev => Math.min(Math.max(prev + delta, 1), 3));
                }}
              />

            </div>

            {previewPost.mediaFiles?.length > 1 && (
              <>
                <button className="nav-btn left" onClick={() => {
                  setCurrentIndex(prev =>
                    prev === 0 ? previewPost.mediaFiles.length - 1 : prev - 1
                  );
                  setZoom(1);
                  setPosition({ x: 0, y: 0 });
                }}>◀</button>

                <button className="nav-btn right" onClick={() => {
                  setCurrentIndex(prev =>
                    prev === previewPost.mediaFiles.length - 1 ? 0 : prev + 1
                  );
                  setZoom(1);
                  setPosition({ x: 0, y: 0 });
                }}>▶</button>
              </>
            )}

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminPostApproval;