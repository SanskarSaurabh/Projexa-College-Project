import { io } from "socket.io-client";

/* ================= BASE URL ================= */

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/* Remove /api for socket connection */

const SOCKET_URL = API_URL.replace(/\/api$/, "");

/* ================= SOCKET CONNECTION ================= */

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000
});

/* ================= DEBUG LISTENERS ================= */

socket.on("connect", () => {
  console.log("✅ Socket Connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("⚠️ Socket Disconnected:", reason);
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket Connection Error:", err.message);
});

export default socket;