import { io } from "socket.io-client";

// This replaces the hardcoded localhost with your Render environment variable
const socket = io(process.env.API_URL || "http://localhost:5000/api", {
    transports: ["websocket", "polling"],
  });

export default socket;