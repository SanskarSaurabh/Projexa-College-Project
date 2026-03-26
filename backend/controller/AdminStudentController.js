import User from "../models/user.model.js";

/**
 * @DESC   Update Student Profile (Dynamic Fields)
 * @ROUTE  PUT /api/v1/user/update-profile
 * @ACCESS Private (Student Only)
 */
export const updateStudentProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;

    // SECURITY: In fields ko student manually change nahi kar sakta
    const forbiddenFields = ["password", "role", "isApproved", "email", "_id"];
    forbiddenFields.forEach((field) => delete updates[field]);

    // Update the user with new dynamic fields (Roll No, Resume, Marks etc.)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile details",
    });
  }
};

/**
 * @DESC   Get Current Logged-in Student Profile
 * @ROUTE  GET /api/v1/user/profile
 * @ACCESS Private
 */
export const getStudentProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching profile" });
  }
};

/**
 * @DESC   Search Students by Name (Admin/Placement)
 * @ROUTE  GET /api/v1/user/search
 * @ACCESS Private (Admin/Placement)
 */
export const searchStudents = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: "Search name is required" });
    }

    const students = await User.find({
      role: "student",
      name: { $regex: name, $options: "i" },
    }).select("-password");

    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: "Error searching students",
    });
  }
};

/**
 * @DESC   Delete Student
 * @ROUTE  DELETE /api/v1/user/:id
 * @ACCESS Private (Admin Only)
 */
export const deleteStudent = async (req, res) => {
  try {
    const student = await User.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json({
      message: "Student removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting student",
    });
  }
};