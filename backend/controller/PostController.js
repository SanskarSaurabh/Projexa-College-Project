import PostModel from "../models/post.models.js";

// CREATE POST (Student / Staff)
export const createPost = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).send({
        success: false,
        message: "Post text is required",
      });
    }

    const post = await PostModel.create({
      text,
      author: req.user._id,
      role: req.user.role,
      isApproved: false,
    });

    return res.status(201).send({
      success: true,
      message: "Post submitted for admin approval",
      post,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Post creation failed",
    });
  }
};

// GET APPROVED POSTS (Feed)
export const getApprovedPosts = async (req, res) => {
  try {
    const posts = await PostModel.find({ isApproved: true })
      .populate("author", "name role")
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      posts,
    });

  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error fetching posts",
    });
  }
};

// ADMIN: GET PENDING POSTS
export const getPendingPosts = async (req, res) => {
  try {
    const posts = await PostModel.find({ isApproved: false })
      .populate("author", "name role");

    return res.status(200).send({
      success: true,
      posts,
    });

  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error fetching pending posts",
    });
  }
};

// ADMIN: APPROVE POST
export const approvePost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);

    if (!post) {
      return res.status(404).send({
        success: false,
        message: "Post not found",
      });
    }

    post.isApproved = true;
    await post.save();

    return res.status(200).send({
      success: true,
      message: "Post approved successfully",
    });

  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error approving post",
    });
  }
};

// ADMIN: REJECT POST
export const rejectPost = async (req, res) => {
  try {
    await PostModel.findByIdAndDelete(req.params.id);

    return res.status(200).send({
      success: true,
      message: "Post rejected and deleted",
    });

  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error rejecting post",
    });
  }
};
