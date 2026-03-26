import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    text: { type: String },
    
    // OLD SINGLE MEDIA (UNCHANGED)
    media: {
      url: { type: String },
      public_id: { type: String },
      resource_type: { type: String }
    },

    // ✅ NEW MULTIPLE MEDIA SUPPORT (ADDED)
    mediaFiles: [
      {
        url: String,
        public_id: String,
        resource_type: String
      }
    ],

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: { type: String },

    isApproved: { type: Boolean, default: false },

    isEdited: { type: Boolean, default: false },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        userName: { type: String },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);