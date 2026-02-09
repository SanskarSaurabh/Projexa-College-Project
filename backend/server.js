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

app.use(cors());
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