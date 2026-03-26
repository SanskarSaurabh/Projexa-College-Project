import React, { useState, useRef, useEffect } from "react";
import "./PostCard.css";
import { createPortal } from "react-dom";

const PostCard = ({ post, actions, commentText, setCommentText }) => {

  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.text);

  const [showImageModal, setShowImageModal] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  /* NEW DRAG STATES */
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });

  const menuRef = useRef(null);

  const authorName = post.author?.name || "Deleted User";
  const authorRole = post.author?.role;

  /* CLOSE MENU WHEN CLICK OUTSIDE */

  useEffect(() => {

    const handleClickOutside = (e) => {

      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);

  /* ESC KEY CLOSE IMAGE MODAL */

  useEffect(() => {

    const escClose = (e) => {
      if (e.key === "Escape") {
        setShowImageModal(false);
      }
    };

    window.addEventListener("keydown", escClose);

    return () => {
      window.removeEventListener("keydown", escClose);
    };

  }, []);

  /* LOCK PAGE SCROLL WHEN IMAGE MODAL OPEN */

  useEffect(() => {

    if (showImageModal) {

      const scrollY = window.scrollY;

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";

    } else {

      const scrollY = document.body.style.top;

      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";

      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }

    }

  }, [showImageModal]);

  /* DRAG FUNCTIONS */

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

  /* DELETE POST */

  const handleDelete = () => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (confirmDelete) {
      actions.deletePost(post._id);
    }

  };

  /* SAVE EDIT */

  const handleSaveEdit = () => {

    if (!editText.trim()) return;

    actions.editPost(post._id, editText);
    setIsEditing(false);

  };

  const handleCommentSubmit = () => {

    if (!commentText[post._id]?.trim()) return;

    actions.comment(post._id);

    setCommentText({
      ...commentText,
      [post._id]: ""
    });

  };

  return (

    <div className="fb-card premium-glass slide-up">

      {/* HEADER */}

      <div className="fb-header">

        <div className="fb-avatar">
          {post.author?.profilePic ? (
            <img
              src={post.author.profilePic}
              alt="profile"
              className="feed-avatar-img"
            />
          ) : (
            authorName.charAt(0)
          )}
        </div>

        <div className="fb-meta">

          <span className="fb-name">

            {authorName}

            {authorRole === "admin" && (
              <span className="admin-badge">Admin 📢</span>
            )}

            {/* WAITING APPROVAL BADGE */}

            {post.isApproved === false && (
              <span className="pending-badge">
                ⏳ Waiting for admin approval
              </span>
            )}

            {/* EDITED BADGE */}

            {post.isEdited && (
              <span className="edited-badge">
                ✏ Edited
              </span>
            )}

          </span>

          <div className="fb-sub-meta">
            {new Date(post.updatedAt).toLocaleDateString()} •
            <i className="bi bi-globe-americas"></i>
          </div>

        </div>

        {/* THREE DOT MENU */}

        <div className="fb-menu" ref={menuRef}>

          <button
            className="fb-more"
            onClick={() => setShowMenu(!showMenu)}
          >
            <i className="bi bi-three-dots"></i>
          </button>

          {showMenu && (

            <div className="fb-dropdown">

              <button
                className="dropdown-item"
                onClick={() => {
                  setIsEditing(true);
                  setShowMenu(false);
                }}
              >
                <i className="bi bi-pencil"></i> Edit Post
              </button>

              <button
                className="dropdown-item delete-post-btn"
                onClick={handleDelete}
              >
                <i className="bi bi-trash"></i> Delete Post
              </button>

            </div>

          )}

        </div>

      </div>

      {/* BODY */}

      <div className="fb-body">

        {isEditing ? (

          <div className="edit-post-box">

            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />

            <div className="edit-actions">

              <button
                className="save-edit-btn"
                onClick={handleSaveEdit}
              >
                Save
              </button>

              <button
                className="cancel-edit-btn"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>

            </div>

          </div>

        ) : (

          <p className="fb-text">{post.text}</p>

        )}

      </div>

      {/* MEDIA */}

      {(post.media?.url || post.mediaFiles?.length > 0) && (

        <div className="fb-media-container">

          {post.mediaFiles?.length > 0 ? (

            <div className="media-slider">

              {post.mediaFiles.map((file, index) => (

                file.resource_type === "image" ? (

                  <img
                    key={index}
                    src={file.url}
                    alt="post"
                    className="feed-image"
                    onClick={() => {
                      setCurrentIndex(index);   // 🔥 ADD THIS
                      setShowImageModal(true);
                      setZoom(1);
                      setPosition({ x: 0, y: 0 });
                    }}
                  />

                ) : (

                  <video key={index} src={file.url} controls />

                )

              ))}

            </div>

          ) : (

            post.media?.resource_type === "image" ? (
              <img
                src={post.media.url}
                className="feed-image"
                onClick={() => {
                  setCurrentIndex(0);
                  setShowImageModal(true);
                  setZoom(1);
                  setPosition({ x: 0, y: 0 });
                }}
              />
            ) : (
              <video src={post.media.url} controls />
            )

          )}

        </div>

      )}

      {/* IMAGE MODAL */}

      {showImageModal &&
        createPortal(
          <div
            className="image-modal-overlay"
            onClick={() => {
              setShowImageModal(false);
              setZoom(1);
              setPosition({ x: 0, y: 0 });
            }}
          >

            <img
              src={
                post.mediaFiles?.length > 0
                  ? post.mediaFiles[currentIndex]?.url || post.mediaFiles[0]?.url
                  : post.media?.url || ""
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
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => {
                e.preventDefault();
                const delta = -e.deltaY * 0.001;
                setZoom(prev => Math.min(Math.max(prev + delta, 1), 2));
              }}
            />

            {post.mediaFiles?.length > 1 && (
              <>
                <button
                  className="nav-btn left"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(prev =>
                      prev === 0 ? post.mediaFiles.length - 1 : prev - 1
                    );
                  }}
                >
                  ◀
                </button>

                <button
                  className="nav-btn right"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(prev =>
                      prev === post.mediaFiles.length - 1 ? 0 : prev + 1
                    );
                  }}
                >
                  ▶
                </button>
              </>
            )}

            <button
              className="image-close-btn"
              onClick={() => setShowImageModal(false)}
            >
              ✕
            </button>

          </div>,
          document.body   // 🔥 THIS FIXES EVERYTHING
        )}

      {/* STATS */}

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

      {/* ACTION BUTTONS */}

      <div className="fb-action-grid">

        <button
          onClick={() => actions.like(post._id)}
          className={`fb-action-btn ${post.likes?.length > 0 ? "active" : ""
            }`}
        >
          <i
            className={`bi ${post.likes?.length > 0
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

      {/* COMMENTS */}

      {showComments && (

        <div className="fb-comment-section">

          <div className="fb-comment-input-row">

            <div className="fb-avatar-sm">
              {post.author?.profilePic ? (
                <img
                  src={post.author.profilePic}
                  alt="profile"
                  className="feed-avatar-img"
                />
              ) : (
                authorName.charAt(0)
              )}
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCommentSubmit();
                  }
                }}
              />

              <button onClick={handleCommentSubmit}>
                <i className="bi bi-send-fill"></i>
              </button>

            </div>

          </div>

          <div className="fb-comments-list">

            {post.comments?.map((c, i) => (

              <div key={i} className="fb-comment-item">

                <div className="fb-avatar-sm">
                  {c.user?.profilePic ? (
                    <img
                      src={c.user.profilePic}
                      alt="profile"
                      className="feed-avatar-img"
                    />
                  ) : (
                    c.user?.name?.charAt(0) || "U"
                  )}
                </div>

                <div className="fb-comment-bubble">

                  <span className="fb-comment-user">
                    {c.user?.name || "Deleted User"}
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