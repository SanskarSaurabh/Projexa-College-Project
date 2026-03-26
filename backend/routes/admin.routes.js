import express from "express";
import {
  getPendingUsers,
  approveUser,
  rejectUser,
  getUserStats
} from "../controller/AdminController.js";

import protect from "../Middleware/AuthMiddleware.js";
import isAdmin from "../Middleware/RoleMiddleware.js";

const router = express.Router();

// admin only
router.get("/pending-users", protect, isAdmin, getPendingUsers);
router.put("/approve-user/:id", protect, isAdmin, approveUser);
router.delete("/reject-user/:id", protect, isAdmin, rejectUser);

/* NEW ADMIN STATS ROUTE */

router.get("/stats", protect, isAdmin, getUserStats);

export default router;