import { useEffect, useState } from "react";
import { getFeedPosts } from "../api/PostApi";
import CreatePost from "../components/CreatePost";
import Navbar from "../components/Navbar";
import "./Feed.css";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await getFeedPosts();
      setPosts(res.data.posts);
    } catch (error) {
      console.error("Error loading feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="feed-wrapper">
      <Navbar />

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            
            {/* ✍️ POST CREATION AREA */}
            <div className="feed-header mb-4">
              <h2 className="text-white fw-bold">Campus Feed</h2>
              <p className="text-silver small">Share insights, opportunities, and campus news.</p>
            </div>

            <div className="create-post-container mb-5">
              <CreatePost onPostCreated={fetchPosts} />
            </div>

            <div className="feed-divider d-flex align-items-center mb-4">
              <span className="text-silver smaller fw-bold pe-3">LATEST UPDATES</span>
              <div className="flex-grow-1 border-bottom border-secondary opacity-25"></div>
            </div>

            {/* 📜 POST LISTING */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-indigo" role="status"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="empty-feed-card text-center p-5">
                <i className="bi bi-mailbox display-4 text-indigo-glow mb-3"></i>
                <p className="text-silver">The feed is quiet... be the first to start a conversation!</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-4">
                {posts.map((post) => (
                  <div key={post._id} className="post-card p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="avatar-sm me-3">
                        {post.author.name.charAt(0)}
                      </div>
                      <div>
                        <h6 className="text-white mb-0">{post.author.name}</h6>
                        <span className={`badge-role ${post.author.role}`}>
                          {post.author.role}
                        </span>
                      </div>
                    </div>
                    
                    <div className="post-content">
                      <p className="text-silver-light">{post.text}</p>
                    </div>

                    <div className="post-footer mt-3 pt-3 border-top border-dark-subtle d-flex gap-4">
                       <button className="post-action-btn"><i className="bi bi-heart me-2"></i> Like</button>
                       <button className="post-action-btn"><i className="bi bi-chat-text me-2"></i> Comment</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 💡 SIDEBAR (Extra Content) */}
          <div className="col-lg-3 d-none d-lg-block">
            <div className="sidebar-card p-4">
               <h6 className="text-white fw-bold mb-3">Campus Trends</h6>
               <ul className="list-unstyled smaller text-silver">
                 <li className="mb-2">#PlacementDrive2026</li>
                 <li className="mb-2">#HackathonKRMU</li>
                 <li className="mb-2">#AdminNotices</li>
               </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;