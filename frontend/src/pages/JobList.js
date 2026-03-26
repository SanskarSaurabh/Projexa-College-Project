import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAllJobs, applyJob } from "../api/PlacementApi"; // added applyJob import
import "./JobList.css";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getAllJobs();
        setJobs(res.data.jobs);
      } catch (error) {
        console.error("Error fetching jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // NEW: Handle Application Logic
  const handleApplyClick = async (jobId, applyLink) => {
    try {
      // 1. Backend API hit karke data save karte hain
      const res = await applyJob(jobId);

      if (res.data.success) {
        alert("Application recorded successfully!");
        
        // 2. Data save hone ke baad external link kholte hain
        if (applyLink) {
          window.open(applyLink, "_blank");
        } else {
          alert("Note: No external link provided for this job.");
        }
      }
    } catch (error) {
      // Agar backend se error aaye (jaise "Already Applied")
      const errorMsg = error.response?.data?.message || "Error applying for job";
      alert(errorMsg);
      
      // Error ke bawajood agar aap link khulwana chahte hain toh niche wali line uncomment karein:
      // if (applyLink) window.open(applyLink, "_blank");
    }
  };

  return (
    <div className="az-wrapper">
      <div className="az-blobs">
        <div className="az-blob az-blob-1"></div>
        <div className="az-blob az-blob-2"></div>
      </div>

      <Navbar />

      <div className="container az-content">
        <header className="az-page-header mb-5">
          <div className="az-brand-mini">
            <div className="az-logo-small">K</div>
            <div className="az-titles-stack">
              <span className="az-badge-tag">CAREER GATEWAY</span>
              <h2>Placement Opportunities</h2>
              <p>Handpicked job listings for KRMU students.</p>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="az-loader-container">
            <div className="az-spinner"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="az-card az-empty-state">
            <i className="bi bi-briefcase"></i>
            <p>No active job listings at the moment.</p>
          </div>
        ) : (
          <div className="row g-4">
            {jobs.map((job, index) => (
              <div key={job._id} className="col-md-6 col-xl-4">
                <div
                  className="az-card az-job-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="az-card-top">
                    <div className="az-company-avatar">
                      {job.companyName.charAt(0)}
                    </div>
                    <span className="az-dept-badge">{job.department}</span>
                  </div>

                  <div className="az-job-body">
                    <h4 className="az-company-title">{job.companyName}</h4>
                    <p className="az-role-subtitle">{job.role}</p>
                  </div>

                  <div className="az-eligibility-grid">
                    <div className="az-stat-item">
                      <span className="az-stat-label">MIN SCORE</span>
                      <span className="az-stat-value">{job.minMarks}%</span>
                    </div>
                    <div className="az-stat-item">
                      <span className="az-stat-label">BACKLOGS</span>
                      <span className="az-stat-value">{job.maxBacklogs} MAX</span>
                    </div>
                  </div>

                  <button
                    className="az-btn-primary az-full-width"
                    onClick={() => setSelectedJob(job)}
                  >
                    View Details & Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* JOB DETAILS MODAL */}
      {selectedJob && (
        <div className="pd-modal-overlay">
          <div className="pd-modal-card">
            <div className="pd-modal-header">
              <h4>{selectedJob.companyName}</h4>
              <button onClick={() => setSelectedJob(null)}>✕</button>
            </div>

            <div className="pd-modal-content">
              <h6>Role</h6>
              <p>{selectedJob.role}</p>

              <h6>Department</h6>
              <p>{selectedJob.department}</p>

              <h6>About Company</h6>
              <p>{selectedJob.aboutCompany || "Not provided"}</p>

              <h6>Job Description</h6>
              <p>{selectedJob.jobDescription || "Not provided"}</p>

              <h6>Requirements</h6>
              <p>{selectedJob.requirements || "Not provided"}</p>

              <div style={{ marginTop: "20px" }}>
                <button
                  className="az-btn-primary"
                  onClick={() => handleApplyClick(selectedJob._id, selectedJob.applyLink)}
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobList;