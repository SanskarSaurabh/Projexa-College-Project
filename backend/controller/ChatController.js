import MessageModel from "../models/message.models.js";
import UserModel from "../models/user.model.js";
import GroupModel from "../models/group.models.js";

/* ================= GET CHAT HISTORY ================= */

export const getChatHistory = async (req, res) => {
  try {

    const { userId } = req.params;

    const messages = await MessageModel.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    }).sort({ createdAt: 1 });

    /* MARK MESSAGES AS READ */

    await MessageModel.updateMany(
      {
        sender: userId,
        receiver: req.user._id,
        read: false
      },
      {
        $set: { read: true }
      }
    );

    return res.status(200).send({
      success: true,
      messages,
    });

  } catch (error) {

    return res.status(500).send({
      success: false,
      message: "Error fetching history",
    });

  }
};


/* ================= GET CHAT USERS ================= */

export const getChatUsers = async (req, res) => {

  try {

    const users = await UserModel.find({
      role: "student",
      isApproved: true,
      _id: { $ne: req.user._id },
    }).select("name email role profilePic");

    /* GET LAST MESSAGE FOR EACH USER */

    const usersWithLastMessage = await Promise.all(

      users.map(async (u) => {

        const lastMessage = await MessageModel.findOne({
          $or: [
            { sender: req.user._id, receiver: u._id },
            { sender: u._id, receiver: req.user._id },
          ]
        }).sort({ createdAt: -1 });

        return {
          ...u._doc,
          lastMessageTime: lastMessage ? lastMessage.createdAt : null
        };

      })

    );

    /* SORT USERS BY LAST MESSAGE */

    usersWithLastMessage.sort((a, b) => {
      return new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0);
    });

    return res.status(200).send({
      success: true,
      users: usersWithLastMessage,
    });

  } catch (error) {

    return res.status(500).send({
      success: false,
      message: "Error fetching users",
    });

  }

};


/* ================= GET GROUPS ================= */

export const getGroups = async (req, res) => {

  try {

    const groups = await GroupModel.find({
      members: req.user._id
    }).populate("members", "name email");

    return res.status(200).send({
      success: true,
      groups
    });

  } catch (error) {

    return res.status(500).send({
      success: false,
      message: "Error fetching groups"
    });

  }

};


/* ================= DELETE CHAT HISTORY ================= */

export const deleteChatHistory = async (req, res) => {

  try {

    const { userId } = req.params;

    await MessageModel.deleteMany({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    });

    return res.status(200).send({
      success: true,
      message: "Chat history deleted successfully",
    });

  } catch (error) {

    return res.status(500).send({
      success: false,
      message: "Error deleting chat history",
    });

  }
};


/* ================= GET UNREAD COUNTS ================= */

export const getUnreadCounts = async (req, res) => {

  try {

    const userId = req.user._id;

    const unread = await MessageModel.aggregate([
      {
        $match: {
          receiver: userId,
          read: false
        }
      },
      {
        $group: {
          _id: "$sender",
          count: { $sum: 1 }
        }
      }
    ]);

    return res.status(200).send({
      success: true,
      unread
    });

  } catch (error) {

    return res.status(500).send({
      success: false,
      message: "Error fetching unread messages"
    });

  }
};


/* ================= CREATE GROUP ================= */

export const createGroup = async (req,res)=>{

  try{

    const { name, members } = req.body;

    const group = await GroupModel.create({
      name,
      createdBy:req.user._id,
      admins:[req.user._id],
      members:[...members, req.user._id]
    });

    /* POPULATE MEMBERS */

    const populatedGroup = await GroupModel.findById(group._id)
    .populate("members","name email");

    res.status(200).json({
      success:true,
      group: populatedGroup
    });

  }catch(error){

    res.status(500).json({
      success:false,
      message:"Error creating group"
    });

  }

};


/* ================= ADD GROUP MEMBER ================= */

export const addGroupMember = async (req,res)=>{

  try{

    const { groupId, userId } = req.body;

    const group = await GroupModel.findById(groupId);

    if(!group){
      return res.status(404).json({
        success:false,
        message:"Group not found"
      });
    }

    /* ADMIN CHECK FIX */

    if(!group.admins.some(a => a.toString() === req.user._id.toString())){
      return res.status(403).json({
        success:false,
        message:"Only admin can add members"
      });
    }

    /* DUPLICATE MEMBER CHECK FIX */

    if(group.members.some(m => m.toString() === userId)){
      return res.status(400).json({
        success:false,
        message:"User already in group"
      });
    }

    group.members.push(userId);

    await group.save();

    /* RETURN UPDATED POPULATED GROUP */

    const updatedGroup = await GroupModel.findById(groupId)
    .populate("members","name email");

    res.json({
      success:true,
      group: updatedGroup
    });

  }catch(error){

    res.status(500).json({
      success:false,
      message:"Error adding member"
    });

  }

};


/* ================= REMOVE GROUP MEMBER ================= */

export const removeGroupMember = async (req,res)=>{

  try{

    const { groupId, userId } = req.body;

    const group = await GroupModel.findById(groupId);

    if(!group){
      return res.status(404).json({
        success:false,
        message:"Group not found"
      });
    }

    /* ADMIN CHECK FIX */

    if(!group.admins.some(a => a.toString() === req.user._id.toString())){
      return res.status(403).json({
        success:false,
        message:"Only admin can remove members"
      });
    }

    group.members = group.members.filter(
      m => m.toString() !== userId
    );

    await group.save();

    /* RETURN UPDATED POPULATED GROUP */

    const updatedGroup = await GroupModel.findById(groupId)
    .populate("members","name email");

    res.json({
      success:true,
      group: updatedGroup
    });

  }catch(error){

    res.status(500).json({
      success:false,
      message:"Error removing member"
    });

  }

};


/* ================= DELETE GROUP ================= */

export const deleteGroup = async (req, res) => {
  try {

    const { groupId } = req.params;

    const group = await GroupModel.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found"
      });
    }

    // ✅ OPTIONAL: only members allowed
    if (!group.members.some(m => m.toString() === req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: "Not allowed"
      });
    }

    // ✅ DELETE FROM DATABASE
    await GroupModel.findByIdAndDelete(groupId);

    res.json({
      success: true,
      message: "Group deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting group"
    });
  }
};