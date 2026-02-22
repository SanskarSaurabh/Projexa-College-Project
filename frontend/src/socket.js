import { io } from "socket.io-client";

// This variable likely has "/api" at the end now
const baseUri = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// This line strips the "/api" only for the socket connection
const socket = io(baseUri.replace(/\/api$/, ""), {
  transports: ["websocket", "polling"],
  withCredentials: true,
  forceNew: true 
});

// Add these listeners to see EXACTLY what is happening in your console
socket.on("connect", () => {
  console.log("✅ Connected to Server!");
});

socket.on("connect_error", (err) => {
  console.error("❌ Connection Error:", err.message);
  // If you see "Invalid Namespace" here, the .replace() above didn't fire correctly
});

export default socket;