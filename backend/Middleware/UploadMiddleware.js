import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "campus_connect_posts",
    resource_type: "auto", // ✅ This tells Cloudinary to decide if it's an image, video, or raw file
    allowed_formats: ["jpg", "png", "jpeg", "gif", "mp4", "pdf", "docx", "txt","mov"],
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // ✅ Fixed syntax: moved into 'limits'
});

export default upload;