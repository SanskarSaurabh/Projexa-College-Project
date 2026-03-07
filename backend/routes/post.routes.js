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
  editPost
} from "../controller/PostController.js";

import protect from "../Middleware/AuthMiddleware.js";
import isAdmin from "../Middleware/RoleMiddleware.js";
import upload from "../Middleware/UploadMiddleware.js";

const router = express.Router();

/* FEED */

router.get("/", protect, getApprovedPosts);

/* CREATE */

router.post("/", protect, upload.single("file"), createPost);

/* SOCIAL */

router.put("/like/:id", protect, toggleLikePost);

router.post("/comment/:id", protect, addComment);

/* EDIT + DELETE */

router.put("/edit/:id", protect, editPost);

router.delete("/:id", protect, deletePost);

/* ADMIN */

router.get("/pending", protect, isAdmin, getPendingPosts);

router.put("/approve/:id", protect, isAdmin, approvePost);

router.delete("/reject/:id", protect, isAdmin, rejectPost);

export default router;