import express from "express";
import {
  getPendingUsers,
  approveUser,
  rejectUser,
  getUserStats,
  searchStudents,
  deleteStudent   // ✅ NEW
} from "../controller/AdminController.js";

import protect from "../Middleware/AuthMiddleware.js";
import isAdmin from "../Middleware/RoleMiddleware.js";

const router = express.Router();

// ================= ADMIN ROUTES =================

// Pending approvals
router.get("/pending-users", protect, isAdmin, getPendingUsers);

// Approve user
router.put("/approve-user/:id", protect, isAdmin, approveUser);

// Reject user (old)
router.delete("/reject-user/:id", protect, isAdmin, rejectUser);

// ✅ NEW: Direct delete student
router.delete("/delete-student/:id", protect, isAdmin, deleteStudent);

// Stats
router.get("/stats", protect, isAdmin, getUserStats);

// Search students
router.get("/search-students", protect, isAdmin, searchStudents);

export default router;