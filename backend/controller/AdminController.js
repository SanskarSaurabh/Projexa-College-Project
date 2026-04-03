import User from "../models/user.model.js";
import { sendApprovalEmail } from "../utils/sendEmail.js";

// ================= GET PENDING USERS =================
export const getPendingUsers = async (req, res) => {
  const users = await User.find({ isApproved: false }).select("-password");
  res.json(users);
};

// ================= APPROVE USER =================
export const approveUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.isApproved = true;
  await user.save();

  await sendApprovalEmail(user.email, user.name);

  res.json({ message: "User approved successfully" });
};

// ================= REJECT USER =================
export const rejectUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User rejected and deleted" });
};

// ================= ✅ DELETE STUDENT (NEW CLEAN) =================
export const deleteStudent = async (req, res) => {
  try {

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully"
    });

  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({
      success: false,
      message: "Delete failed",
      error: error.message
    });
  }
};

// ================= USER STATS =================
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

// ================= SEARCH STUDENTS =================
export const searchStudents = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name query is required"
      });
    }

    const students = await User.find({
      role: "student",
      $or: [
        { name: { $regex: name, $options: "i" } },
        { email: { $regex: name, $options: "i" } }
      ]
    })
    .limit(10)
    .select("-password");

    res.status(200).json({
      success: true,
      count: students.length,
      students
    });

  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({
      success: false,
      message: "Error searching students",
      error: error.message
    });
  }
};