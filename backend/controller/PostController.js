import PostModel from "../models/post.models.js";

/* CREATE POST */

export const createPost = async (req, res) => {
  try {

    const { text } = req.body || {};

    if (!text?.trim() && (!req.files || req.files.length === 0)) {
      return res.status(400).send({
        success:false,
        message:"You must provide either text or a file."
      });
    }

    /* ✅ MULTIPLE FILE HANDLING */
    const mediaFiles = req.files?.map(file => {

      const isVideo = file.mimetype.startsWith("video");
      const isImage = file.mimetype.startsWith("image");

      return {
        url: file.path,
        public_id: file.filename,
        resource_type: isVideo ? "video" : isImage ? "image" : "raw"
      };

    }) || [];

    /* ✅ BACKWARD SUPPORT */
    let mediaData = null;

    if (mediaFiles.length > 0) {
      mediaData = mediaFiles[0];
    }

    const post = await PostModel.create({
      text:text || "",
      author:req.user._id,
      role:req.user.role,
      media: mediaData,
      mediaFiles: mediaFiles,
      isApproved:false,
      isEdited:false
    });

    return res.status(201).send({
      success:true,
      post
    });

  } catch(error){

    console.error(error);

    return res.status(500).send({
      success:false,
      message:"Internal server error"
    });

  }
};



/* GET FEED */

export const getApprovedPosts = async (req,res)=>{

  try{

    const posts = await PostModel
      .find({isApproved:true})
      .populate("author","name role profilePic")
      .populate("comments.user","name profilePic")
      .sort({createdAt:-1});   // ✅ FIXED (NO JUMPING)

    res.status(200).send({
      success:true,
      posts
    });

  }catch(error){

    res.status(500).send({
      success:false,
      message:"Error fetching posts"
    });

  }

};



/* LIKE */

export const toggleLikePost = async (req,res)=>{

  try{

    const post = await PostModel.findById(req.params.id);

    if(!post){
      return res.status(404).send({
        success:false,
        message:"Post not found"
      });
    }

    const isLiked = post.likes.includes(req.user._id);

    if(isLiked){

      post.likes = post.likes.filter(
        id => id.toString() !== req.user._id.toString()
      );

    }else{

      post.likes.push(req.user._id);

    }

    await post.save();

    res.status(200).send({
      success:true,
      likesCount:post.likes.length
    });

  }catch(error){

    res.status(500).send({
      success:false,
      message:"Error toggling like"
    });

  }

};



/* COMMENT */

export const addComment = async (req,res)=>{

  try{

    const {text} = req.body;

    if(!text){
      return res.status(400).send({
        success:false,
        message:"Comment required"
      });
    }

    const post = await PostModel.findById(req.params.id);

    if(!post){
      return res.status(404).send({
        success:false,
        message:"Post not found"
      });
    }

    post.comments.push({
      user:req.user._id,
      text
    });

    await post.save();

    res.status(200).send({
      success:true,
      post
    });

  }catch(error){

    res.status(500).send({
      success:false,
      message:"Error adding comment"
    });

  }

};



/* DELETE POST */

export const deletePost = async (req,res)=>{

  try{

    const post = await PostModel.findById(req.params.id);

    if(!post){
      return res.status(404).send({
        success:false,
        message:"Post not found"
      });
    }

    if(
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ){
      return res.status(403).send({
        success:false,
        message:"Not allowed"
      });
    }

    await PostModel.findByIdAndDelete(req.params.id);

    res.status(200).send({
      success:true,
      message:"Post deleted"
    });

  }catch(error){

    res.status(500).send({
      success:false,
      message:"Error deleting post"
    });

  }

};



/* EDIT POST */

export const editPost = async (req,res)=>{

  try{

    const {text} = req.body;

    const post = await PostModel.findById(req.params.id);

    if(!post){
      return res.status(404).send({
        success:false,
        message:"Post not found"
      });
    }

    if(
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ){
      return res.status(403).send({
        success:false,
        message:"Not allowed"
      });
    }

    post.text = text;
    post.isApproved = false;
    post.isEdited = true;

    await post.save();

    res.status(200).send({
      success:true,
      message:"Post updated and sent for admin approval",
      post
    });

  }catch(error){

    res.status(500).send({
      success:false,
      message:"Error editing post"
    });

  }

};



/* ADMIN ROUTES */

export const getPendingPosts = async (req,res)=>{

  try{

    const posts = await PostModel
      .find({isApproved:false})
      .populate("author", "name role profilePic")
      .populate("comments.user","name profilePic")  // ✅ FIXED

    res.status(200).send({
      success:true,
      posts
    });

  }catch(error){

    res.status(500).send({
      success:false,
      message:"Error fetching pending posts"
    });

  }

};



export const approvePost = async (req,res)=>{

  const post = await PostModel.findByIdAndUpdate(
    req.params.id,
    {isApproved:true},
    {new:true}
  );

  res.status(200).send({
    success:true,
    post
  });

};



export const rejectPost = async (req,res)=>{

  await PostModel.findByIdAndDelete(req.params.id);

  res.status(200).send({
    success:true
  });

};



/* GET SINGLE POST */

export const getSinglePost = async (req, res) => {
  try {

    const post = await PostModel.findById(req.params.id)
      .populate("author", "name role profilePic")
      .populate("comments.user","name profilePic")

    if (!post) {
      return res.status(404).send({
        success: false,
        message: "Post not found"
      });
    }

    res.status(200).send({
      success: true,
      post
    });

  } catch (error) {

    console.error(error);

    res.status(500).send({
      success: false,
      message: "Error fetching post"
    });

  }
};
/* GET USER'S OWN POSTS (FOR PROFILE) */
export const getUserPosts = async (req, res) => {
  try {
    // Sirf wahi posts fetch honge jinka author req.user._id hai
    const posts = await PostModel.find({ author: req.user._id })
      .populate("author", "name role profilePic")
      .populate("comments.user", "name profilePic")
      .sort({ createdAt: -1 }); // Newest posts first

    return res.status(200).send({
      success: true,
      posts
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error fetching user posts"
    });
  }
};