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
      type: String,
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

    aboutCompany: {
      type: String,
    },

    jobDescription: {
      type: String,
    },

    requirements: {
      type: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    applyLink: {
      type: String
    },

    // --- UPDATED APPLICANTS SECTION (DYNAMIC) ---
    applicants: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        // Snapshot mein student ka apply karte waqt ka saara data save hoga
        // Isme name, roll no, marks, links sab automatically store ho jayenge
        snapshot: {
          type: Object 
        },
        appliedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);