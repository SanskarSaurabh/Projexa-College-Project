import { useState } from "react";
import { createPost } from "../api/PostApi";
import "../pages/Feed.css"; // We'll add specific styles to Feed.css

const CreatePost = ({ onPostCreated }) => {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await createPost({ text });
      setMessage("Post sent for approval!");
      setText("");
      if (onPostCreated) onPostCreated(); // Refresh the feed
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Error creating post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-post-card p-4 mb-4">
      <div className="d-flex align-items-center mb-3">
        <div className="avatar-sm me-2">
          <i className="bi bi-pencil-fill"></i>
        </div>
        <h5 className="text-white m-0">Share an Update</h5>
      </div>

      {message && (
        <div className={`alert-custom-mini mb-3 ${message.includes("Error") ? "error" : "success"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="textarea-wrapper mb-3">
          <textarea
            className="form-control post-input"
            rows="3"
            placeholder="Announce a placement, ask a question, or share news..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div className="post-options d-flex gap-3">
            <button type="button" className="btn-icon-option"><i className="bi bi-image"></i></button>
            <button type="button" className="btn-icon-option"><i className="bi bi-paperclip"></i></button>
            <button type="button" className="btn-icon-option"><i className="bi bi-hash"></i></button>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-submit-indigo px-4 py-2"
            disabled={isSubmitting || !text.trim()}
          >
            {isSubmitting ? "Posting..." : "Post to Feed"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;