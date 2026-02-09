import { Server } from "socket.io";
import MessageModel from "./models/message.models.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
    });

    socket.on("sendMessage", async (data) => {
      const { sender, receiver, text } = data;

      // save message in DB
      const message = await MessageModel.create({
        sender,
        receiver,
        text,
      });

      // send to receiver in real-time
      io.to(receiver).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
