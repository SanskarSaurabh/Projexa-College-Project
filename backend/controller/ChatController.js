import MessageModel from "../models/message.models.js";
import UserModel from "../models/user.model.js";

/* ================= GET CHAT HISTORY ================= */
export const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await MessageModel.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).send({
      success: true,
      messages,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error fetching history",
    });
  }
};

/* ================= GET CHAT USERS ================= */
export const getChatUsers = async (req, res) => {
  try {
    const users = await UserModel.find({
      role: "student",
      isApproved: true,
      _id: { $ne: req.user._id },
    }).select("name email role");

    return res.status(200).send({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error fetching users",
    });
  }
};

/* ================= DELETE CHAT HISTORY ================= */
export const deleteChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    await MessageModel.deleteMany({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    });

    return res.status(200).send({
      success: true,
      message: "Chat history deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error deleting chat history",
    });
  }
};