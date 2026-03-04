import PostModel from "../models/post.models.js";


export const createPost = async (req, res) => {
  try {
    console.log("--- 🚀 Controller Reached ---");
    const { text } = req.body || {};

    if (!text?.trim() && !req.file) {
      return res.status(400).send({ 
        success: false, 
        message: "You must provide either text or a file." 
      });
    }

    // 3. Prepare Media (DYNAMICALLY DETECT TYPE)
    let mediaData = null;
    if (req.file) {
      // Multer-Cloudinary provides the mimetype (e.g., 'video/mp4')
      const isVideo = req.file.mimetype.startsWith("video");
      const isImage = req.file.mimetype.startsWith("image");

      mediaData = {
        url: req.file.path,
        public_id: req.file.filename,
        // If it's not video or image, we call it 'raw' (for PDFs/Docs)
        resource_type: isVideo ? "video" : isImage ? "image" : "raw"
      };
    }

    // 4. Database Save
    const post = await PostModel.create({
      text: text || "",
      author: req.user?._id,
      role: req.user?.role || "student",
      media: mediaData,
      isApproved: false,
    });

    return res.status(201).send({ success: true, post });

  } catch (error) {
    console.error("--- ❌ CRITICAL ERROR DETECTED ---");
    console.dir(error); 
    return res.status(500).send({ 
      success: false, 
      message: "Internal Server Error", 
      errorMessage: error.message 
    });
  }
};
// GET APPROVED POSTS (The Public Feed)
export const getApprovedPosts = async (req, res) => {
  try {
    const posts = await PostModel.find({ isApproved: true })
      .populate("author", "name role")
      .populate("comments.user", "name")
      .sort({ createdAt: -1 });

    return res.status(200).send({ success: true, posts });
  } catch (error) {
    console.error("Fetch Posts Error:", error);
    return res.status(500).send({ success: false, message: "Error fetching posts" });
  }
};

// TOGGLE LIKE (Like/Unlike)
export const toggleLikePost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) return res.status(404).send({ success: false, message: "Post not found" });

    const isLiked = post.likes.includes(req.user._id);

    if (isLiked) {
      // Remove like
      post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      // Add like
      post.likes.push(req.user._id);
    }

    await post.save();
    return res.status(200).send({ success: true, likesCount: post.likes.length });
  } catch (error) {
    console.error("Like Toggle Error:", error);
    return res.status(500).send({ success: false, message: "Error toggling like" });
  }
};

// ADD COMMENT
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).send({ success: false, message: "Comment text is required" });

    const post = await PostModel.findById(req.params.id);
    if (!post) return res.status(404).send({ success: false, message: "Post not found" });

    post.comments.push({
      user: req.user._id,
      userName: req.user.name,
      text,
    });

    await post.save();
    return res.status(200).send({ success: true, message: "Comment added", post });
  } catch (error) {
    console.error("Add Comment Error:", error);
    return res.status(500).send({ success: false, message: "Error adding comment" });
  }
};

// --- ADMIN ACTIONS ---

// Get all posts that are NOT yet approved
export const getPendingPosts = async (req, res) => {
  try {
    const posts = await PostModel.find({ isApproved: false }).populate("author", "name role");
    return res.status(200).send({ success: true, posts });
  } catch (error) {
    return res.status(500).send({ success: false, message: "Error fetching pending posts" });
  }
};

// Admin approves a post
export const approvePost = async (req, res) => {
  try {
    const post = await PostModel.findByIdAndUpdate(
      req.params.id, 
      { isApproved: true }, 
      { new: true }
    );
    return res.status(200).send({ success: true, message: "Post approved", post });
  } catch (error) {
    return res.status(500).send({ success: false, message: "Error approving post" });
  }
};

// Admin rejects and deletes a post
export const rejectPost = async (req, res) => {
  try {
    await PostModel.findByIdAndDelete(req.params.id);
    return res.status(200).send({ success: true, message: "Post rejected and deleted" });
  } catch (error) {
    return res.status(500).send({ success: false, message: "Error rejecting post" });
  }
};