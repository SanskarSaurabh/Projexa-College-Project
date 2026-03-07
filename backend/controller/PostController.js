import PostModel from "../models/post.models.js";

/* CREATE POST */

export const createPost = async (req, res) => {
  try {

    const { text } = req.body || {};

    if (!text?.trim() && !req.file) {
      return res.status(400).send({
        success:false,
        message:"You must provide either text or a file."
      });
    }

    let mediaData = null;

    if (req.file) {

      const isVideo = req.file.mimetype.startsWith("video");
      const isImage = req.file.mimetype.startsWith("image");

      mediaData = {
        url:req.file.path,
        public_id:req.file.filename,
        resource_type:isVideo ? "video" : isImage ? "image" : "raw"
      };

    }

    const post = await PostModel.create({
      text:text || "",
      author:req.user._id,
      role:req.user.role,
      media:mediaData,
      isApproved:false
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
      .populate("author","name role")
      .populate("comments.user","name")
      .sort({createdAt:-1});

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
      userName:req.user.name,
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

    /* Allow author OR admin */

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

    await post.save();

    res.status(200).send({
      success:true,
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

  const posts = await PostModel
    .find({isApproved:false})
    .populate("author","name role");

  res.status(200).send({
    success:true,
    posts
  });

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