import User from "../models/user.model.js";
import { sendApprovalEmail } from "../utils/sendEmail.js";

// get all users waiting for approval
export const getPendingUsers = async (req, res) => {
  const users = await User.find({ isApproved: false }).select("-password");
  res.json(users);
};

// approve user
export const approveUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.isApproved = true;
  await user.save();

  // ✅ EMAIL SEND
  await sendApprovalEmail(user.email, user.name);

  res.json({ message: "User approved successfully" });
};

// reject user
export const rejectUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User rejected and deleted" });
};

/* ================= NEW ADMIN STATS ================= */

export const getUserStats = async (req, res) => {
  try {

    const totalStudents = await User.countDocuments({ role: "student" });

    const pendingStudents = await User.countDocuments({
      role: "student",
      isApproved: false
    });

    const approvedStudents = await User.countDocuments({
      role: "student",
      isApproved: true
    });

    res.json({
      totalStudents,
      pendingStudents,
      approvedStudents
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching user stats" });
  }
};