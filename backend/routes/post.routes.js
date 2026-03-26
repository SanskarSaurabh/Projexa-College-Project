import express from "express";

import {
  createPost,
  getApprovedPosts,
  getPendingPosts,
  approvePost,
  rejectPost,
  toggleLikePost,
  addComment,
  deletePost,
  editPost,
  getSinglePost,
  getUserPosts
} from "../controller/PostController.js";

import protect from "../Middleware/AuthMiddleware.js";
import isAdmin from "../Middleware/RoleMiddleware.js";
import upload from "../Middleware/UploadMiddleware.js";

const router = express.Router();

/* FEED */
router.get("/", protect, getApprovedPosts);

/* CREATE */
router.post("/create", protect, upload.array("mediaFiles", 5), createPost);

/* SOCIAL */
router.put("/like/:id", protect, toggleLikePost);
router.post("/comment/:id", protect, addComment);

/* ADMIN */
router.get("/pending", protect, isAdmin, getPendingPosts);
router.put("/approve/:id", protect, isAdmin, approvePost);
router.delete("/reject/:id", protect, isAdmin, rejectPost);

/* EDIT + DELETE */
router.put("/edit/:id", protect, editPost);
router.delete("/:id", protect, deletePost);

/* 🔥 ALWAYS LAST */

router.get("/user-posts", protect, getUserPosts);
router.get("/:id", getSinglePost);

export default router;