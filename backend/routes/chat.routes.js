import express from "express";

import {
  getChatHistory,
  getChatUsers,
  deleteChatHistory,
  getUnreadCounts
} from "../controller/ChatController.js";

import protect from "../Middleware/AuthMiddleware.js";

const router = express.Router();

/* USERS LIST */

router.get("/users", protect, getChatUsers);

/* UNREAD COUNTS */

router.get("/unread", protect, getUnreadCounts);

/* CHAT HISTORY */

router.get("/:userId", protect, getChatHistory);

/* DELETE CHAT */

router.delete("/:userId", protect, deleteChatHistory);

export default router;