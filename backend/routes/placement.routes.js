import express from "express";
import {
  createJob,
  getAllJobs,
  getEligibleStudents,
} from "../controller/PlacementController.js";

import isPlacementOfficer from "../Middleware/PlacementRoleMiddleware.js";
import protect from "../Middleware/AuthMiddleware.js"

const router = express.Router();

// placement officer
router.post("/", protect, isPlacementOfficer, createJob);

// common
router.get("/", protect, getAllJobs);
router.get("/:id/eligible", protect, isPlacementOfficer, getEligibleStudents);

export default router;
