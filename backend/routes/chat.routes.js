import express from "express";
import {
  getChatHistory,
  getChatUsers,
  deleteChatHistory,
} from "../controller/ChatController.js";
import protect from "../Middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/users", protect, getChatUsers);
router.get("/:userId", protect, getChatHistory);
router.delete("/:userId", protect, deleteChatHistory); // NEW ROUTE

export default router;