import React, { useState } from "react";
import "./PostCard.css";

const PostCard = ({ post, actions, commentText, setCommentText }) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="fb-card premium-glass slide-up">
      {/* Header */}
      <div className="fb-header">
        <div className="fb-avatar">{post.author.name.charAt(0)}</div>

        <div className="fb-meta">
          <span className="fb-name">
            {post.author.name}

            {/* ADMIN BADGE */}
            {post.author.role === "admin" && (
              <span className="admin-badge">Admin 📢</span>
            )}
          </span>

          <div className="fb-sub-meta">
            {new Date(post.createdAt).toLocaleDateString()} • <i className="bi bi-globe-americas"></i>
          </div>
        </div>

        <button className="fb-more">
          <i className="bi bi-three-dots"></i>
        </button>
      </div>

      {/* Body Content */}
      <div className="fb-body">
        <p className="fb-text">{post.text}</p>
      </div>

      {/* Edge-to-Edge Media */}
      {post.media?.url && (
        <div className="fb-media-container">
          {post.media.resource_type === "image" ? (
            <img src={post.media.url} alt="post" />
          ) : (
            <video src={post.media.url} controls />
          )}
        </div>
      )}

      {/* Interaction Stats */}
      <div className="fb-stats-bar">
        <div className="fb-stat-item">
          <span className="fb-like-icon">
            <i className="bi bi-hand-thumbs-up-fill"></i>
          </span>
          {post.likes?.length || 0}
        </div>

        <div className="fb-stat-item">
          {post.comments?.length || 0} comments
        </div>
      </div>

      {/* Facebook Interaction Buttons */}
      <div className="fb-action-grid">
        <button
          onClick={() => actions.like(post._id)}
          className={`fb-action-btn ${
            post.likes?.length > 0 ? "active" : ""
          }`}
        >
          <i
            className={`bi ${
              post.likes?.length > 0
                ? "bi-hand-thumbs-up-fill"
                : "bi-hand-thumbs-up"
            }`}
          ></i>
          Like
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="fb-action-btn"
        >
          <i className="bi bi-chat-square"></i>
          Comment
        </button>

        <button
          onClick={() => actions.share(post)}
          className="fb-action-btn"
        >
          <i className="bi bi-share"></i>
          Share
        </button>
      </div>

      {/* Bubble Comments */}
      {showComments && (
        <div className="fb-comment-section">
          <div className="fb-comment-input-row">
            <div className="fb-avatar-sm">
              {post.author.name.charAt(0)}
            </div>

            <div className="fb-input-pill">
              <input
                placeholder="Write a comment..."
                value={commentText[post._id] || ""}
                onChange={(e) =>
                  setCommentText({
                    ...commentText,
                    [post._id]: e.target.value,
                  })
                }
              />

              <button onClick={() => actions.comment(post._id)}>
                <i className="bi bi-send-fill"></i>
              </button>
            </div>
          </div>

          <div className="fb-comments-list">
            {post.comments?.map((c, i) => (
              <div key={i} className="fb-comment-item">
                <div className="fb-avatar-sm">
                  {c.userName?.charAt(0)}
                </div>

                <div className="fb-comment-bubble">
                  <span className="fb-comment-user">
                    {c.userName}
                  </span>
                  <p>{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;