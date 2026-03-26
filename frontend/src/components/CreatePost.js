import React, { useState } from "react";
import { createPost } from "../api/PostApi";
import toast from "react-hot-toast";

const CreatePost = ({ onPostCreated }) => {

  const [text, setText] = useState("");
  const [file, setFile] = useState(null); // OLD
  const [files, setFiles] = useState([]); // NEW
  const [uploadType, setUploadType] = useState("image");
  const [isUploading, setIsUploading] = useState(false);

  const mimeTypes = {
    image: "image/*",
    video: "video/*,video/quicktime",
    raw: ".pdf,.doc,.docx,.txt"
  };

  const handleFileChange = (e) => {

    const selectedFiles = Array.from(e.target.files);

    const validFiles = selectedFiles.filter(file => {

      if (file.size > 50 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 50MB`);
        return false;
      }

      return true;
    });

    setFiles(validFiles);

    if (validFiles.length > 0) {
      setFile(validFiles[0]); // backward support
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim() && files.length === 0) {
      return toast("Please add text or a file!", { icon: "⚠️" });
    }

    const loadingToast = toast.loading("Uploading to Cloudinary...");
    setIsUploading(true);

    const formData = new FormData();
    formData.append("text", text);

    if (files.length > 0) {

      files.forEach(f => {
        formData.append("mediaFiles", f);
      });

    } else if (file) {

      formData.append("file", file);

    }

    try {

      await createPost(formData);

      toast.success("Post submitted for approval!", { id: loadingToast });

      setText("");
      setFile(null);
      setFiles([]);

      if (onPostCreated) onPostCreated();

    } catch (error) {

      console.error(error);
      toast.error("Upload failed. Try again.", { id: loadingToast });

    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="create-post-card p-4 bg-dark-card border border-secondary rounded shadow">

      <h5 className="text-white mb-3">Create a Post</h5>

      <form onSubmit={handleSubmit}>

        <textarea
          className="form-control bg-dark text-white border-secondary mb-3"
          rows="3"
          placeholder="What's happening?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="row g-2 align-items-center mb-3">

          <div className="col-auto dropdown-wrapper">

            <select
              className="form-select bg-dark text-white border-secondary"
              value={uploadType}
              onChange={(e) => {
                setUploadType(e.target.value);
                setFile(null);
                setFiles([]);
              }}
            >
              <option value="image">📷 Photo</option>
              <option value="video">🎥 Video</option>
              <option value="raw">📄 Document</option>
            </select>

          </div>

          <div className="col">
            <input
              type="file"
              multiple
              className="form-control bg-dark text-white border-secondary"
              accept={mimeTypes[uploadType]}
              onChange={handleFileChange}
            />
          </div>

        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="btn btn-indigo w-100 fw-bold"
        >
          {isUploading ? "Uploading..." : "Post Update"}
        </button>

      </form>
    </div>
  );
};

export default CreatePost;