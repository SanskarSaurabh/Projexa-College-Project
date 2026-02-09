import { io } from "socket.io-client";

// This replaces the hardcoded localhost with your Render environment variable
const socket = io(process.env.REACT_APP_API_URL , {
    transports: ["websocket", "polling"],
  });
// || "http://localhost:5000/api"
export default socket;