import React, { useEffect, useState } from "react";
import { getFeedPosts, likePost, addComment } from "../api/PostApi";
import CreatePost from "../components/CreatePost";
import Navbar from "../components/Navbar";
import PostCard from "./PostCard";
import "./Feed.css";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState({});

  const fetchPosts = async () => {
    try {
      const res = await getFeedPosts();
      setPosts(res.data.posts || []); 
    } catch (error) {
      console.error("Error loading feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleActions = {
    like: async (id) => { await likePost(id); fetchPosts(); },
    comment: async (id) => {
      if (!commentText[id]?.trim()) return;
      await addComment(id, commentText[id]);
      setCommentText(prev => ({ ...prev, [id]: "" }));
      fetchPosts();
    },
    share: (post) => {
      if (navigator.share) {
        navigator.share({ title: `KRMU Post`, text: post.text, url: window.location.href });
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied!");
      }
    }
  };

  return (
    <div className="krmu-theme-root">
      <Navbar />
      
      {/* Dynamic Background */}
      <div className="floating-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <main className="feed-shell">
        <div className="feed-column">
          
          <header className="premium-header mb-5">
            <div className="header-badge">K</div>
            <div className="header-content">
              <h1>Campus <span>Feed</span></h1>
              <p>Stay connected with KRMU community</p>
            </div>
          </header>

          <section className="glass-composer-container mb-5">
            <CreatePost onPostCreated={fetchPosts} />
          </section>

          {loading ? (
            <div className="aesthetic-spinner-box">
              <div className="custom-loader"></div>
            </div>
          ) : (
            <div className="posts-stack">
              {posts.map((post, index) => (
                <div key={post._id} className="post-reveal-wrapper" style={{ animationDelay: `${index * 0.1}s` }}>
                  <PostCard 
                    post={post} 
                    actions={handleActions}
                    commentText={commentText}
                    setCommentText={setCommentText}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Feed;