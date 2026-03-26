import express from "express";
import protect from "../Middleware/AuthMiddleware.js";
import upload from "../Middleware/UploadMiddleware.js";

const router = express.Router();

router.post("/", protect, upload.single("file"), (req, res) => {

  try {

    return res.status(200).json({
      success: true,
      url: req.file.path,
      type: req.file.mimetype,
      name: req.file.originalname
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Upload failed"
    });

  }

});

export default router;