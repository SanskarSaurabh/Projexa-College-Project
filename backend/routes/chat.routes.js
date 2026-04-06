import express from "express";

import {
  getChatHistory,
  getChatUsers,
  deleteChatHistory,
  getUnreadCounts,
  createGroup,
  addGroupMember,
  removeGroupMember,
  getGroups,
  deleteGroup,
  getGroupMessages
} from "../controller/ChatController.js";

import protect from "../Middleware/AuthMiddleware.js";

const router = express.Router();

/* USERS */

router.get("/users", protect, getChatUsers);

/* GROUPS */

router.get("/groups", protect, getGroups);

router.get("/group/messages/:groupId", protect, getGroupMessages);

router.post("/group/create", protect, createGroup);

router.post("/group/add-member", protect, addGroupMember);

router.post("/group/remove-member", protect, removeGroupMember);

router.delete("/group/:groupId", protect, deleteGroup);

/* UNREAD */

router.get("/unread", protect, getUnreadCounts);

/* CHAT */

router.get("/:userId", protect, getChatHistory);

router.delete("/:userId", protect, deleteChatHistory);

export default router;