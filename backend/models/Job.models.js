import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    department: {
      type: String, // eligible department
      required: true,
    },

    minMarks: {
      type: Number,
      required: true,
    },

    maxBacklogs: {
      type: Number,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // placement officer
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
