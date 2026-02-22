import { Server } from "socket.io";
import MessageModel from "./models/message.models.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "https://projexa-college-project-ojmv.vercel.app",
        "https://projexa-college-project-ojmv-git-main-sanskarsaurabhs-projects.vercel.app",
        "https://projexa-college-project-ojmv-cgvgmf9vj-sanskarsaurabhs-projects.vercel.app",
        "http://localhost:3000"
      ],
      methods: ["GET", "POST"],
      credentials: true
    },
  });

  io.on("connection", (socket) => {
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their personal room`);
    });

    socket.on("sendMessage", async (data) => {
      try {
        const { sender, receiver, text } = data;

        const message = await MessageModel.create({
          sender,
          receiver,
          text,
        });

        // 1. Send to the receiver
        io.to(receiver).emit("receiveMessage", message);
        
        // 2. Send back to the sender (this confirms the message was saved)
        io.to(sender).emit("receiveMessage", message);

      } catch (error) {
        console.error("Socket Message Error:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};