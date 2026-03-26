import express from "express";
import {
  loginUser,
  registerUser,
  updateProfilePic,
  forgotPassword,
  resetPassword
} from "../controller/AuthController.js";

import protect from "../Middleware/AuthMiddleware.js";

const router = express.Router();

// ================= AUTH =================
router.post("/register", registerUser);
router.post("/login", loginUser);

// ================= PROFILE =================
router.put("/update-profile-pic", protect, updateProfilePic);

// ================= FORGOT PASSWORD =================
router.post("/forgot-password", forgotPassword);

// ================= RESET PASSWORD =================
router.post("/reset-password/:token", resetPassword);

export default router;