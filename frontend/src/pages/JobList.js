import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAllJobs } from "../api/PlacementApi";
import "./JobList.css"; // Dedicated styles

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="jobs-wrapper">
      <Navbar />
      
      <div className="container py-5">
        <header className="jobs-header mb-5">
          <span className="badge-system mb-2">CAREER GATEWAY</span>
          <h2 className="display-6 fw-bold text-white">Placement Opportunities</h2>
          <p className="text-silver">Handpicked job listings for KRMU students.</p>
        </header>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-indigo-glow"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-jobs text-center p-5 card-slate">
            <i className="bi bi-briefcase display-1 text-dark-subtle mb-3"></i>
            <p className="text-silver">No active job listings at the moment.</p>
          </div>
        ) : (
          <div className="row g-4">
            {jobs.map((job) => (
              <div key={job._id} className="col-md-6 col-xl-4">
                <div className="job-card shadow-sm">
                  <div className="job-card-header d-flex justify-content-between align-items-start mb-3">
                    <div className="company-logo-placeholder">
                      {job.companyName.charAt(0)}
                    </div>
                    <span className="dept-tag">{job.department}</span>
                  </div>

                  <h4 className="text-white fw-bold mb-1">{job.companyName}</h4>
                  <p className="text-indigo-glow fw-semibold mb-4">{job.role}</p>

                  <div className="eligibility-grid">
                    <div className="eligibility-item">
                      <span className="label">Min Marks</span>
                      <span className="value">{job.minMarks}%</span>
                    </div>
                    <div className="eligibility-item">
                      <span className="label">Backlogs</span>
                      <span className="value text-warning">{job.maxBacklogs} Max</span>
                    </div>
                  </div>

                  <button className="btn btn-apply-now w-100 mt-4">
                    View Details & Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobList;