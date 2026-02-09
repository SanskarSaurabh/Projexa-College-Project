import express from "express"
import dotenv from "dotenv"

import cors from "cors"
import { connectDB } from "./config/connectDb.js"
import http from "http"
import { initSocket } from "./socket.js"
import AuthRoute from "./routes/auth.routes.js"
import adminRoute from "./routes/admin.routes.js"
import postRoute from "./routes/post.routes.js";
import placementRoute from "./routes/placement.routes.js";
import chatRoute from "./routes/chat.routes.js"







const app=express()
const server=http.createServer(app);
initSocket(server)


dotenv.config()

connectDB()


const allowedOrigins = [
  'https://projexa-college-project-ojmv.vercel.app',
  'https://projexa-college-project-ojmv-git-main-sanskarsaurabhs-projects.vercel.app',
  'https://projexa-college-project-ojmv-cgvgmf9vj-sanskarsaurabhs-projects.vercel.app',
  'http://localhost:3000' // Keep this for local testing
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

  

app.use("/api/auth",AuthRoute);

app.use("/api/admin", adminRoute);
app.use("/api/posts", postRoute);
app.use("/api/chat",chatRoute)

app.use("/api/placements", placementRoute);

const PORT = process.env.PORT || 5000;


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});