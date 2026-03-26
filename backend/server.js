import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { connectDB } from "./config/connectDb.js";
import { initSocket } from "./socket.js";

// Routes
import AuthRoute from "./routes/auth.routes.js";
import adminRoute from "./routes/admin.routes.js";
import postRoute from "./routes/post.routes.js";
import placementRoute from "./routes/placement.routes.js";
import chatRoute from "./routes/chat.routes.js";
import adminStudentRoutes from "./routes/AdminStudentRoutes.js"; // Student Profile Logic
import uploadRoutes from "./routes/upload.routes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

initSocket(server);
connectDB();

const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:5173', 
];

// --- 1. CORS CONFIGURATION ---
const corsMiddleware = cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const isAllowed = allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app');
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
});

app.use(corsMiddleware);
app.options(/(.*)/, corsMiddleware);

// --- 2. MIDDLEWARE ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 3. ROUTES ---
app.use("/api/auth", AuthRoute);
app.use("/api/admin", adminRoute);
app.use("/api/posts", postRoute); 
app.use("/api/chat", chatRoute);
app.use("/api/placements", placementRoute);
app.use("/api/upload", uploadRoutes);

/* ✅ FIX: AdminStudentRoutes ko /api/user par mount kiya gaya hai.
  Ab Profile fetch karne ke liye URL hoga: http://localhost:5000/api/user/profile
*/
app.use("/api/user", adminStudentRoutes); 

// --- 4. GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error("--- 🚨 SERVER ERROR DETECTED ---");
  console.error("Error Details:", err); 

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});