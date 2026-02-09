import express from "express";
import {
  createPost,
  getApprovedPosts,
  getPendingPosts,
  approvePost,
  rejectPost,
} from "../controller/PostController.js";

import protect from "../middleware/authMiddleware.js";
import isAdmin from "../Middleware/RoleMiddleware.js";


const router = express.Router();

// student / staff
router.post("/", protect, createPost);
router.get("/", protect, getApprovedPosts);

// admin
router.get("/pending", protect, isAdmin, getPendingPosts);
router.put("/approve/:id", protect, isAdmin, approvePost);
router.delete("/reject/:id", protect, isAdmin, rejectPost);

export default router;
