import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Check if it's a PDF
    const isPDF = file.mimetype === "application/pdf";
    
    return {
      folder: "campus_connect_profile_docs",
      // IMPORTANT: PDF ke liye 'image' resource_type use karein 
      // taaki Cloudinary use previewable PDF ki tarah treat kare
      resource_type: isPDF ? "image" : "auto", 
      format: isPDF ? "pdf" : undefined, 
      public_id: `file_${Date.now()}`,
      // Access control (Optional but safe)
      access_mode: 'public'
    };
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } 
});

export default upload;