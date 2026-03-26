import express from "express";
import {
  createJob,
  getAllJobs,
  getEligibleStudents,
  deleteJob,
  updateJob,
  applyJob,
  getApplicants
} from "../controller/PlacementController.js";

import isPlacementOfficer from "../Middleware/PlacementRoleMiddleware.js";
import protect from "../Middleware/AuthMiddleware.js"

const router = express.Router();

router.post("/", protect, isPlacementOfficer, createJob);

router.get("/", protect, getAllJobs);

router.get("/:id/eligible", protect, isPlacementOfficer, getEligibleStudents);

router.delete("/:id", protect, isPlacementOfficer, deleteJob);

router.put("/:id", protect, isPlacementOfficer, updateJob);

router.post("/:id/apply", protect, applyJob);

router.get("/:id/applicants", protect, isPlacementOfficer, getApplicants);

export default router;