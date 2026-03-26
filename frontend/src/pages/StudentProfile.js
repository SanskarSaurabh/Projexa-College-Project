import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import PostCard from "./PostCard"; // Importing your PostCard component
import { likePost, addComment, deletePostApi, editPostApi } from "../api/PostApi";
import { toast } from "react-hot-toast";
import "./StudentProfile.css";

const StudentProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    universityRollNo: "",
    email: "",
    phoneNumber: "",
    department: "",
    marks: "",
    backlogs: "",
    tenthMarks: "",
    twelfthMarks: "",
    ugGPA: "",
    pgGPA: "",
    resumeLink: "",
    linkedinProfile: "",
    githubProfile: "",
    portfolioLink: "",
    codingProfiles: "",
    profilePic: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  // POSTS STATES
  const [myPosts, setMyPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [commentText, setCommentText] = useState({});

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  // Actions Logic (Synced with Feed.js)
  const handleActions = {
    like: async (id) => {
      await likePost(id);
      fetchMyPosts();
    },

    comment: async (id) => {
      if (!commentText[id]?.trim()) return;
      await addComment(id, commentText[id]);
      setCommentText(prev => ({
        ...prev,
        [id]: ""
      }));
      fetchMyPosts();
    },

    deletePost: async (id) => {
      try {
        await deletePostApi(id);
        toast.success("Post deleted successfully");
        fetchMyPosts();
      } catch (error) {
        toast.error("Failed to delete post");
      }
    },

    editPost: async (id, text) => {
      try {
        await editPostApi(id, text);
        toast.success("Post updated. Waiting for admin approval.");
        fetchMyPosts();
      } catch (error) {
        toast.error("Failed to edit post");
      }
    },

    share: (post) => {
      const postUrl = `${window.location.origin}/post/${post._id}`;
      if (navigator.share) {
        navigator.share({
          title: "My Campus Post",
          text: post.text,
          url: postUrl
        });
      } else {
        navigator.clipboard.writeText(postUrl);
        toast.success("Post link copied!");
      }
    }
  };

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${API_BASE}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        const u = res.data.user;
        setFormData({
          name: u.name || "",
          universityRollNo: u.universityRollNo || "",
          email: u.email || "",
          phoneNumber: u.phoneNumber || "",
          department: u.department || "",
          marks: u.marks || "",
          backlogs: u.backlogs || "",
          tenthMarks: u.tenthMarks || "",
          twelfthMarks: u.twelfthMarks || "",
          ugGPA: u.ugGPA || "",
          pgGPA: u.pgGPA || "",
          resumeLink: u.resumeLink || "",
          linkedinProfile: u.linkedinProfile || "",
          githubProfile: u.githubProfile || "",
          portfolioLink: u.portfolioLink || "",
          codingProfiles: u.codingProfiles || "",
          profilePic: u.profilePic || "",
        });
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load profile.");
    } finally {
      setIsFetching(false);
    }
  }, [API_BASE]);

  const fetchMyPosts = useCallback(async () => {
    setPostsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_BASE}/posts/user-posts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setMyPosts(data.posts || []);
      }
    } catch (err) {
      console.error("Error fetching posts", err);
    } finally {
      setPostsLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchProfile();
    fetchMyPosts();
  }, [fetchProfile, fetchMyPosts]);

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File is too large! Maximum limit is 10MB.");
      return;
    }

    if (type === 'resume' && file.type !== 'application/pdf') {
      toast.error("Please upload a PDF file for your resume.");
      return;
    }

    const data = new FormData();
    data.append("file", file);

    type === 'image' ? setUploading(true) : setResumeUploading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_BASE}/upload`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const fileUrl = res.data.secure_url || res.data.url || res.data.path;
      
      if (type === 'image') {
        setFormData(prev => ({ ...prev, profilePic: fileUrl }));
        toast.success("Photo updated!");
      } else {
        setFormData(prev => ({ ...prev, resumeLink: fileUrl }));
        toast.success("Resume uploaded!");
      }
    } catch (error) {
      toast.error("Upload failed.");
    } finally {
      type === 'image' ? setUploading(false) : setResumeUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`${API_BASE}/user/update-profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        toast.success("Profile synced successfully!");
        const existingUser = JSON.parse(localStorage.getItem("user")) || {};
        localStorage.setItem("user", JSON.stringify({ ...existingUser, ...formData }));
      }
    } catch (err) {
      toast.error("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) return <div className="az-profile-wrapper"><div className="az-loader">Loading Profile...</div></div>;

  return (
    <div className="az-profile-wrapper">
      <div className="az-blob az-blob-1"></div>
      <div className="az-blob az-blob-2"></div>
      
      <Navbar />

      <div className="az-profile-main pa-anim">
        {/* --- SECTION 1: PROFILE CARD --- */}
        <div className="az-profile-card">
          <form onSubmit={handleSubmit}>
            <div className="az-profile-header">
              <div className="az-brand-text">
                <h1>Student <span>Profile</span></h1>
                <p>Academic & Professional Portfolio</p>
              </div>

              <div className="az-avatar-section">
                <div className="az-avatar-wrapper">
                  {formData.profilePic ? (
                    <img src={formData.profilePic} alt="Profile" />
                  ) : (
                    <div className="az-avatar-initials">{formData.name?.charAt(0) || "U"}</div>
                  )}
                  <label className="az-upload-overlay">
                    <input type="file" onChange={(e) => handleFileUpload(e, 'image')} hidden accept="image/*" />
                    <i className="bi bi-camera-fill"></i>
                  </label>
                </div>
                <small className="az-status-text">{uploading ? "Uploading..." : "Click to change photo"}</small>
              </div>
            </div>

            <div className="az-form-content">
              {/* SECTION: IDENTITY */}
              <div className="az-section">
                <h3 className="az-section-label"><i className="bi bi-person-badge"></i> Personal Details</h3>
                <div className="az-input-row">
                  <div className="az-input-group">
                    <i className="bi bi-person"></i>
                    <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="az-input-group">
                    <i className="bi bi-hash"></i>
                    <input type="text" name="universityRollNo" placeholder="University Roll No" value={formData.universityRollNo} onChange={handleChange} required />
                  </div>
                </div>
                <div className="az-input-row">
                  <div className="az-input-group">
                    <i className="bi bi-envelope"></i>
                    <input type="email" name="email" value={formData.email} disabled />
                  </div>
                  <div className="az-input-group">
                    <i className="bi bi-telephone"></i>
                    <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* SECTION: ACADEMICS */}
              <div className="az-section">
                <h3 className="az-section-label"><i className="bi bi-book"></i> Academic Scores</h3>
                <div className="az-input-row">
                  <div className="az-input-group">
                    <i className="bi bi-mortarboard"></i>
                    <input type="text" name="department" placeholder="Department (e.g., MCA)" value={formData.department} onChange={handleChange} required />
                  </div>
                  <div className="az-input-group">
                    <i className="bi bi-graph-up-arrow"></i>
                    <input type="number" step="0.01" name="marks" placeholder="Overall CGPA" value={formData.marks} onChange={handleChange} required />
                  </div>
                </div>
                <div className="az-input-row">
                  <div className="az-input-group">
                    <i className="bi bi-percent"></i>
                    <input type="number" name="tenthMarks" placeholder="10th Marks %" value={formData.tenthMarks} onChange={handleChange} />
                  </div>
                  <div className="az-input-group">
                    <i className="bi bi-percent"></i>
                    <input type="number" name="twelfthMarks" placeholder="12th Marks %" value={formData.twelfthMarks} onChange={handleChange} />
                  </div>
                </div>
                <div className="az-input-row">
                  <div className="az-input-group">
                    <i className="bi bi-award"></i>
                    <input type="number" step="0.01" name="ugGPA" placeholder="UG GPA/CGPA" value={formData.ugGPA} onChange={handleChange} />
                  </div>
                  <div className="az-input-group">
                    <i className="bi bi-award-fill"></i>
                    <input type="number" step="0.01" name="pgGPA" placeholder="PG GPA/CGPA" value={formData.pgGPA} onChange={handleChange} />
                  </div>
                </div>
                <div className="az-input-group">
                  <i className="bi bi-x-circle"></i>
                  <input type="number" name="backlogs" placeholder="Number of Backlogs" value={formData.backlogs} onChange={handleChange} />
                </div>
              </div>

              {/* SECTION: PROFESSIONAL LINKS */}
              <div className="az-section">
                <h3 className="az-section-label"><i className="bi bi-briefcase"></i> Resume & Professional Links</h3>
                <div className="az-input-group az-resume-upload-box">
                  <i className="bi bi-file-earmark-pdf-fill" style={{color: '#ff4d4d'}}></i>
                  <div className="az-resume-controls">
                    <input type="file" id="resume-file" onChange={(e) => handleFileUpload(e, 'resume')} accept=".pdf" hidden />
                    <label htmlFor="resume-file" className="az-resume-label">
                      {resumeUploading ? "Uploading..." : formData.resumeLink ? "✅ Resume Uploaded" : "Upload Resume (PDF)"}
                    </label>
                    {formData.resumeLink && (
                      <a href={formData.resumeLink} target="_blank" rel="noopener noreferrer" className="az-view-link">
                         View
                      </a>
                    )}
                  </div>
                </div>
                <div className="az-input-row">
                  <div className="az-input-group">
                    <i className="bi bi-linkedin"></i>
                    <input type="url" name="linkedinProfile" placeholder="LinkedIn URL" value={formData.linkedinProfile} onChange={handleChange} />
                  </div>
                  <div className="az-input-group">
                    <i className="bi bi-github"></i>
                    <input type="url" name="githubProfile" placeholder="GitHub URL" value={formData.githubProfile} onChange={handleChange} />
                  </div>
                </div>
                <div className="az-input-row">
                  <div className="az-input-group">
                    <i className="bi bi-globe"></i>
                    <input type="url" name="portfolioLink" placeholder="Portfolio / Website" value={formData.portfolioLink} onChange={handleChange} />
                  </div>
                  <div className="az-input-group">
                    <i className="bi bi-code-square"></i>
                    <input type="text" name="codingProfiles" placeholder="LeetCode / GeeksForGeeks" value={formData.codingProfiles} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="az-btn-primary" disabled={loading || uploading || resumeUploading}>
              {loading ? "Saving Profile..." : "Sync All Changes"}
              {!loading && <i className="bi bi-cloud-upload"></i>}
            </button>
          </form>
        </div>

        {/* --- SECTION 2: MY ACTIVITY (STOCKED LIKE FEED) --- */}
        <div className="az-activity-card mt-5">
           <header className="premium-header mb-4" style={{border: 'none', padding: 0}}>
             <div className="header-content">
                <h1 style={{fontSize: '1.4rem'}}>My <span>Activity</span></h1>
                <p>Manage your shared updates and media</p>
             </div>
          </header>

          <div className="posts-stack">
            {postsLoading ? (
              <div className="text-center w-100 py-5"><div className="custom-loader"></div></div>
            ) : myPosts.length > 0 ? (
              myPosts.map((post, index) => (
                <div 
                  key={post._id} 
                  className="post-reveal-wrapper" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <PostCard
                    post={post}
                    actions={handleActions}
                    commentText={commentText}
                    setCommentText={setCommentText}
                  />
                  
                </div>
              ))
            ) : (
              <div className="az-no-posts text-center py-5 w-100">
                <i className="bi bi-camera-reels display-6 text-muted"></i>
                <p className="text-muted mt-2">You haven't posted anything yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;