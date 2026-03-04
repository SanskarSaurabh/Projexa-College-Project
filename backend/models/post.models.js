import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    text: { type: String},
    
    // Multimedia Support
    media: {
      url: { type: String },
      public_id: { type: String }, // Used to delete from Cloudinary
      resource_type: { type: String } // 'image', 'video', or 'raw' (for docs)
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: { type: String }, // student / staff
    isApproved: { type: Boolean, default: false },

    // Social Features
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
  { timestamps: true } // Handles Date and Time automatically
);

export default mongoose.model("Post", postSchema);