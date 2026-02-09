import { Server } from "socket.io";
import MessageModel from "./models/message.models.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      // List all your Vercel deployment URLs here
      origin: [
        "https://projexa-college-project-ojmv.vercel.app",
        "https://projexa-college-project-ojmv-git-main-sanskarsaurabhs-projects.vercel.app",
        "https://projexa-college-project-ojmv-cgvgmf9vj-sanskarsaurabhs-projects.vercel.app",
        "http://localhost:3000" // For local development
      ],
      methods: ["GET", "POST"],
      credentials: true
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    socket.on("sendMessage", async (data) => {
      try {
        const { sender, receiver, text } = data;

        // save message in DB
        const message = await MessageModel.create({
          sender,
          receiver,
          text,
        });

        // send to receiver in real-time
        io.to(receiver).emit("receiveMessage", message);
      } catch (error) {
        console.error("Socket Message Error:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};