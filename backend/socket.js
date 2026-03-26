import { Server } from "socket.io";
import MessageModel from "./models/message.models.js";

export const initSocket = (server) => {

  const io = new Server(server, {
    cors: {
      origin: [
        "https://projexa-college-project-ojmv.vercel.app",
        "https://projexa-college-project-ojmv-git-main-sanskarsaurabhs-projects.vercel.app",
        "https://projexa-college-project-ojmv-cgvgmf9vj-sanskarsaurabhs-projects.vercel.app",
        "http://localhost:3000",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  /* ================= ONLINE USERS TRACK ================= */

  const onlineUsers = new Map(); 
  // userId -> number of active sockets

  io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    /* ================= JOIN PRIVATE ROOM ================= */

    socket.on("join", (userId) => {

      socket.userId = userId;

      socket.join(userId);

      if (onlineUsers.has(userId)) {
        onlineUsers.set(userId, onlineUsers.get(userId) + 1);
      } else {
        onlineUsers.set(userId, 1);
      }

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));

      console.log(`User ${userId} joined room`);

    });

    /* ================= JOIN GROUP ROOM ================= */

    socket.on("joinGroup", (groupId) => {

      socket.join(groupId);

      console.log(`User joined group ${groupId}`);

    });

    /* ================= LOGOUT ================= */

    socket.on("logout", () => {

      if (socket.userId && onlineUsers.has(socket.userId)) {

        const count = onlineUsers.get(socket.userId);

        if (count === 1) {
          onlineUsers.delete(socket.userId);
        } else {
          onlineUsers.set(socket.userId, count - 1);
        }

        io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      }

    });

    /* ================= TYPING ================= */

    socket.on("typing", ({ sender, receiver }) => {
      io.to(receiver).emit("typing", sender);
    });

    socket.on("stopTyping", ({ sender, receiver }) => {
      io.to(receiver).emit("stopTyping", sender);
    });

    /* ================= SEND MESSAGE ================= */

    socket.on("sendMessage", async (data) => {

      try {

        const {
          sender,
          receiver,
          groupId,
          text,
          fileUrl,
          fileType,
          fileName
        } = data;

        const message = await MessageModel.create({
          sender,
          receiver,
          groupId,
          text,
          fileUrl,
          fileType,
          fileName
        });

        /* GROUP MESSAGE */

        if (groupId) {

          io.to(groupId).emit("receiveMessage", message);

        }

        /* PRIVATE MESSAGE */

        else {

          io.to(receiver).emit("receiveMessage", message);
          io.to(sender).emit("receiveMessage", message);

        }

      } catch (error) {

        console.error("Socket Message Error:", error);

      }

    });

    /* ================= DISCONNECT ================= */

    socket.on("disconnect", () => {

      if (socket.userId && onlineUsers.has(socket.userId)) {

        const count = onlineUsers.get(socket.userId);

        if (count === 1) {
          onlineUsers.delete(socket.userId);
        } else {
          onlineUsers.set(socket.userId, count - 1);
        }

        io.emit("onlineUsers", Array.from(onlineUsers.keys()));

      }

      console.log("User disconnected:", socket.id);

    });

  });

};