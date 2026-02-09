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
  'http://localhost:3000', // Your local CRA dev server
  'https://your-frontend-name.onrender.com' // Your live frontend URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // Important if you decide to use Cookies/Sessions later
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