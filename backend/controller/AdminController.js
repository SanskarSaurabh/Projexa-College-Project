import User from "../models/user.model.js";

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

  res.json({ message: "User approved successfully" });
};

// reject user
export const rejectUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User rejected and deleted" });
};
