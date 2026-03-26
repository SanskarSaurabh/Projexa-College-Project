import React, { useEffect, useState } from "react";
import API from "../api/Axios";
import PostCard from "./PostCard";
import "./SinglePost.css";

const SinglePost = () => {

  const [post, setPost] = useState(null);

  const id = window.location.pathname.split("/").pop();

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const res = await API.get(`/posts/${id}`);
      setPost(res.data.post);
    } catch (error) {
      console.error(error);
    }
  };

  // 🔥 Loading state (prevents blank screen)
  if (!post) {
    return (
      <div className="single-post-page">
        <p style={{ color: "#333" }}>Loading post...</p>
      </div>
    );
  }

  return (
    <div className="single-post-page">
      <div className="single-post-container">

        <PostCard
          post={post}
          actions={{
            like: () => {},
            comment: () => {},
            deletePost: () => {},
            editPost: () => {},
            share: () => {}
          }}
          commentText={{ [post._id]: "" }}
          setCommentText={() => {}}
        />

      </div>
    </div>
  );
};

export default SinglePost;