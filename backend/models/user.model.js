import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    
    // University Roll Number
    universityRollNo: {
      type: String,
      unique: true,
      sparse: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: { type: String, required: true },

    // Phone Number
    phoneNumber: {
      type: String,
    },

    role: {
      type: String,
      enum: ["student", "admin", "staff", "placement"],
      default: "student",
    },

    // --- ACADEMICS ---
    department: String,
    marks: Number,
    backlogs: Number,
    tenthMarks: Number,
    twelfthMarks: Number,
    ugGPA: Number,
    pgGPA: Number,
    
    // --- PROFESSIONAL & SOCIAL LINKS ---
    resumeLink: String,
    linkedinProfile: String,
    githubProfile: String,
    portfolioLink: String,
    
    // Coding Profiles
    codingProfiles: {
      type: String,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },
    
    profilePic: {
      type: String,
      default: "",
    },

    // 🔥 NEW (Forgot Password ke liye)
    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);