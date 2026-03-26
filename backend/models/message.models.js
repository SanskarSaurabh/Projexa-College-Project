import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
{
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  /* GROUP SUPPORT */

  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group"
  },

  text: {
    type: String
  },

  /* FILE SUPPORT */

  fileUrl: {
    type: String
  },

  fileType: {
    type: String
  },

  fileName: {
    type: String
  },

  /* UNREAD SYSTEM */

  read: {
    type: Boolean,
    default: false,
  }

},
{ timestamps: true }
);

export default mongoose.model("Message", messageSchema);