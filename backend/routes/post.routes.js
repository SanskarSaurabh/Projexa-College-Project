import express from "express";
import {
  createPost,
  getApprovedPosts,
  getPendingPosts,
  approvePost,
  rejectPost,
  toggleLikePost,
  addComment
} from "../controller/PostController.js";
import protect from "../Middleware/AuthMiddleware.js";
import isAdmin from "../Middleware/RoleMiddleware.js";
import upload from "../Middleware/UploadMiddleware.js";

const router = express.Router();

// --- PUBLIC / REGISTERED USER ROUTES ---

// 1. Get all approved posts for the feed
router.get("/", protect, getApprovedPosts);

// 2. Create a new post (handles text + multimedia)
// NOTE: 'upload.single("file")' must match the name used in your React FormData.append
router.post("/", protect, upload.single("file"), createPost);

// --- SOCIAL INTERACTION ROUTES ---

// 3. Like/Unlike a post
router.put("/like/:id", protect, toggleLikePost);

// 4. Add a comment to a post
router.post("/comment/:id", protect, addComment);

// --- ADMIN MODERATION ROUTES ---

// 5. Get list of posts awaiting approval
router.get("/pending", protect, isAdmin, getPendingPosts);

// 6. Approve a post (make it visible to everyone)
router.put("/approve/:id", protect, isAdmin, approvePost);

// 7. Reject/Delete a post
router.delete("/reject/:id", protect, isAdmin, rejectPost);

export default router;