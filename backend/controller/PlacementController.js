import JobModel from "../models/Job.models.js";
import UserModel from "../models/user.model.js";

// --- CREATE NEW JOB ---
export const createJob = async (req, res) => {
  try {
    const {
      companyName,
      role,
      department,
      minMarks,
      maxBacklogs,
      aboutCompany,
      jobDescription,
      requirements,
      applyLink
    } = req.body;

    if (!companyName || !role || !department) {
      return res.status(400).send({
        success: false,
        message: "Required fields are missing (Company, Role, Department)",
      });
    }

    const job = await JobModel.create({
      companyName,
      role,
      department,
      minMarks,
      maxBacklogs,
      aboutCompany,
      jobDescription,
      requirements,
      applyLink,
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
      error: error.message
    });
  }
};

// --- FETCH ALL JOBS ---
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

// --- APPLY FOR JOB (SNAPSHOT + LIVE REFERENCE) ---
export const applyJob = async (req, res) => {
  try {
    const job = await JobModel.findById(req.params.id);

    if (!job) {
      return res.status(404).send({ success: false, message: "Job not found" });
    }

    // Check if already applied using studentId
    const isAlreadyApplied = job.applicants.find(
      (a) => a.studentId?.toString() === req.user._id.toString()
    );

    if (isAlreadyApplied) {
      return res.status(400).send({
        success: false,
        message: "You have already applied for this position"
      });
    }

    // Generate Snapshot (For History/Record)
    const userSnapshot = req.user.toObject();
    const fieldsToRemove = ["password", "role", "isApproved", "__v", "createdAt", "updatedAt"];
    fieldsToRemove.forEach(field => delete userSnapshot[field]);

    const applicantData = {
      studentId: req.user._id, // Key for Live Data
      snapshot: userSnapshot,  // Back-up data
      appliedAt: new Date()
    };

    job.applicants.push(applicantData);
    await job.save();

    return res.status(200).send({
      success: true,
      message: "Application submitted successfully!"
    });
  } catch (error) {
    console.error("Apply Error:", error);
    return res.status(500).send({
      success: false,
      message: "Error applying for job"
    });
  }
};

// --- GET LIST OF APPLICANTS (LIVE DATA FIX) ---
export const getApplicants = async (req, res) => {
  try {
    const { id } = req.params;

    // IMPORTANT: Path 'applicants.studentId' ko populate kar rahe hain
    // taaki Admin ko hamesha latest marks/roll no dikhe
    const job = await JobModel.findById(id).populate({
      path: "applicants.studentId",
      select: "-password -role -isApproved" // Security: sensitive fields exclude karein
    });

    if (!job) {
      return res.status(404).send({
        success: false,
        message: "Job record not found"
      });
    }

    // Frontend ko 'job.applicants' array bhej rahe hain
    return res.status(200).send({
      success: true,
      applicants: job.applicants 
    });
  } catch (error) {
    console.error("Fetch Applicants Error:", error);
    return res.status(500).send({
      success: false,
      message: "Error retrieving applicants list"
    });
  }
};

// --- UPDATE JOB (DEPRECATION WARNING FIXED) ---
export const updateJob = async (req, res) => {
  try {
    // Fix for: [MONGOOSE] Warning: the `new` option is deprecated.
    const job = await JobModel.findByIdAndUpdate(req.params.id, req.body, { 
      returnDocument: 'after', // Replacement for 'new: true'
      runValidators: true 
    });

    if (!job) return res.status(404).send({ success: false, message: "Job not found" });

    return res.status(200).send({
      success: true,
      message: "Job details updated",
      job 
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error updating job details"
    });
  }
};

// --- DELETE JOB ---
export const deleteJob = async (req, res) => {
  try {
    const job = await JobModel.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).send({ success: false, message: "Job not found" });

    return res.status(200).send({
      success: true,
      message: "Job deleted successfully"
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error deleting job"
    });
  }
};

// --- ELIGIBILITY CHECK ---
export const getEligibleStudents = async (req, res) => {
  try {
    const job = await JobModel.findById(req.params.id);
    if (!job) return res.status(404).send({ success: false, message: "Job not found" });

    const students = await UserModel.find({
      role: "student",
      department: job.department,
      marks: { $gte: job.minMarks },
      backlogs: { $lte: job.maxBacklogs },
      isApproved: true,
    }).select("-password");

    return res.status(200).send({
      success: true,
      eligibleStudents: students 
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error fetching eligible students list"
    });
  }
};