import JobModel from "../models/Job.models.js";
import UserModel from "../models/user.model.js";

// CREATE JOB (Placement Officer)
export const createJob = async (req, res) => {
  try {
    const { companyName, role, department, minMarks, maxBacklogs } = req.body;

    if (!companyName || !role || !department) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    const job = await JobModel.create({
      companyName,
      role,
      department,
      minMarks,
      maxBacklogs,
      createdBy: req.user._id,
    });

    return res.status(201).send({
      success: true,
      message: "Job created successfully",
      job,
    });

  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error creating job",
    });
  }
};

// GET ALL JOBS
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await JobModel.find().sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      jobs,
    });

  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error fetching jobs",
    });
  }
};

// GET ELIGIBLE STUDENTS FOR A JOB
export const getEligibleStudents = async (req, res) => {
  try {
    const job = await JobModel.findById(req.params.id);

    if (!job) {
      return res.status(404).send({
        success: false,
        message: "Job not found",
      });
    }

    const students = await UserModel.find({
      role: "student",
      department: job.department,
      marks: { $gte: job.minMarks },
      backlogs: { $lte: job.maxBacklogs },
      isApproved: true,
    }).select("-password");

    return res.status(200).send({
      success: true,
      eligibleStudents: students,
    });

  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error fetching eligible students",
    });
  }
};
