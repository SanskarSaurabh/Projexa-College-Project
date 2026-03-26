import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";
import nodemailer from "nodemailer";


// ================= REGISTER =================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
      isApproved: false,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful. Await admin approval.",
      user,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error in registering user",
    });
  }
};


// ================= LOGIN =================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isApproved) {
      return res.status(403).json({ message: "Admin approval pending" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      role: user.role,
      profilePic: user.profilePic,
      token: generateToken(user._id),
    });

  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
};


// ================= UPDATE PROFILE PIC =================
export const updateProfilePic = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profilePic = req.body.image;
    await user.save();

    res.json({
      success: true,
      profilePic: user.profilePic,
    });

  } catch (error) {
    res.status(500).json({ message: "Profile update failed" });
  }
};


// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 Generate token
    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 min

    await user.save();

    // 🔥 Email setup
    const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    await transporter.sendMail({
      to: user.email,
      subject: "Reset Password",
      html: `
        <h3>Password Reset</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
      `
    });

    res.status(200).json({
      success: true,
      message: "Reset link sent to email",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    // 🔥 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    // clear token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};