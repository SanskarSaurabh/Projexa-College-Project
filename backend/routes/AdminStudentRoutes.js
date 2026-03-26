import express from "express";

// Controller functions ko import karein
// Note: Humne search aur delete ko UserController mein move kiya hai for better management
import {
  searchStudents,
  deleteStudent,
  updateStudentProfile,
  getStudentProfile
} from "../controller/AdminStudentController.js"; 

import protect from "../Middleware/AuthMiddleware.js";
import isAdmin from "../Middleware/RoleMiddleware.js";

const router = express.Router();

// ==========================================
//          STUDENT PROFILE ROUTES
// ==========================================

/* GET CURRENT STUDENT PROFILE */
// Isse student apni bhari hui details dekh sakega
router.get(
  "/profile",
  protect,
  getStudentProfile
);

/* UPDATE STUDENT PROFILE */
// Isse student apni dynamic fields (Resume, Marks, Roll No) update karega
router.put(
  "/update-profile",
  protect,
  updateStudentProfile
);


// ==========================================
//          ADMIN CONTROL ROUTES
// ==========================================

/* SEARCH STUDENTS BY NAME */
// Sirf Admin ya Placement cell hi search kar sakta hai
router.get(
  "/search-students",
  protect,
  isAdmin,
  searchStudents
);

/* DELETE STUDENT RECORD */
// Sirf Admin hi student record delete kar sakta hai
router.delete(
  "/delete-student/:id",
  protect,
  isAdmin,
  deleteStudent
);

export default router;