import MessageModel from "../models/message.models.js";
import UserModel from "../models/user.model.js";

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
    return res.status(500).send({ success: false, message: "Error fetching history" });
  }
};

export const getChatUsers = async (req, res) => {
  try {
    const users = await UserModel.find({
      role: "student",
      isApproved: true,
      _id: { $ne: req.user._id },
    }).select("name email role"); // Added role for UI

    return res.status(200).send({ success: true, users });
  } catch (error) {
    return res.status(500).send({ success: false, message: "Error fetching users" });
  }
};