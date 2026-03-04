import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { createJob, getAllJobs, getEligibleStudents } from "../api/PlacementApi";
import "./PlacementDashboard.css";

const PlacementDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    companyName: "",
    role: "",
    department: "",
    minMarks: "",
    maxBacklogs: "",
  });
  const [eligible, setEligible] = useState([]);
  const [activeJobId, setActiveJobId] = useState(null);

  const fetchJobs = async () => {
    try {
      const res = await getAllJobs();
      setJobs(res.data.jobs);
    } catch (err) { console.error("Error fetching jobs"); }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createJob(form);
    setForm({ companyName: "", role: "", department: "", minMarks: "", maxBacklogs: "" });
    fetchJobs();
  };

  const handleEligible = async (jobId) => {
    setActiveJobId(jobId);
    const res = await getEligibleStudents(jobId);
    setEligible(res.data.eligibleStudents);
  };

  return (
    <div className="pd-root">
      <Navbar />
      
      {/* Background Blobs */}
      <div className="pd-glow-layer">
        <div className="pd-glow pd-orange"></div>
        <div className="pd-glow pd-yellow"></div>
      </div>

      <div className="container pd-content">
        <header className="pd-header mb-5">
          <span className="pd-badge">Internal Management</span>
          <h2 className="pd-title">Placement <span className="text-orange">Hub</span></h2>
          <p className="pd-subtitle">Configure opportunities and filter eligible candidates.</p>
        </header>

        <div className="row g-4">
          {/* POST JOB FORM */}
          <div className="col-lg-4">
            <div className="pd-glass-card p-4">
              <div className="pd-card-head mb-4">
                <i className="bi bi-plus-circle-fill me-2 text-orange"></i>
                <h5 className="m-0 fw-bold">Post Opportunity</h5>
              </div>
              
              <form onSubmit={handleSubmit} className="pd-form-stack">
                <div className="pd-input-group">
                  <i className="bi bi-building"></i>
                  <input name="companyName" placeholder="Company Name" value={form.companyName} onChange={handleChange} required />
                </div>
                <div className="pd-input-group">
                  <i className="bi bi-person-workspace"></i>
                  <input name="role" placeholder="Job Role" value={form.role} onChange={handleChange} required />
                </div>
                <div className="pd-input-group">
                  <i className="bi bi-mortarboard"></i>
                  <input name="department" placeholder="Department" value={form.department} onChange={handleChange} required />
                </div>
                
                <div className="row g-2 mb-4">
                  <div className="col-6">
                    <div className="pd-input-group small">
                      <input name="minMarks" placeholder="Min %" value={form.minMarks} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="pd-input-group small">
                      <input name="maxBacklogs" placeholder="Max Bklg" value={form.maxBacklogs} onChange={handleChange} required />
                    </div>
                  </div>
                </div>
                
                <button type="submit" className="pd-btn-gradient">
                  Publish Job <i className="bi bi-chevron-right ms-1"></i>
                </button>
              </form>
            </div>
          </div>

          {/* JOB LIST & ELIGIBLE STUDENTS */}
          <div className="col-lg-8">
            <div className="pd-glass-card p-4 mb-4">
              <h5 className="fw-bold mb-4">Active Listings</h5>
              <div className="pd-scroll-area">
                {jobs.length === 0 ? <p className="text-muted text-center py-4">No jobs posted yet.</p> : null}
                {jobs.map((job) => (
                  <div key={job._id} className={`pd-job-item ${activeJobId === job._id ? 'active' : ''}`}>
                    <div className="pd-job-meta">
                      <h6 className="fw-bold m-0">{job.companyName}</h6>
                      <span className="pd-role-tag">{job.role}</span>
                    </div>
                    <button className="pd-check-btn" onClick={() => handleEligible(job._id)}>
                      Review Students <i className="bi bi-people-fill ms-1"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* STUDENT TABLE */}
            {activeJobId && (
              <div className="pd-glass-card p-4 slide-up-anim">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold m-0">Eligible Candidates</h5>
                  <span className="pd-count-badge">{eligible.length} Found</span>
                </div>
                
                {eligible.length === 0 ? (
                  <div className="pd-empty-state">No candidates meet these specific criteria.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="pd-aesthetic-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Department</th>
                          <th>Marks %</th>
                          <th>Backlogs</th>
                        </tr>
                      </thead>
                      <tbody>
                        {eligible.map((s) => (
                          <tr key={s._id}>
                            <td className="fw-bold text-dark">{s.name}</td>
                            <td><span className="pd-dept-pill">{s.department}</span></td>
                            <td className="fw-bold text-orange">{s.marks}%</td>
                            <td>
                              <span className={`pd-status-pill ${s.backlogs === 0 ? 'safe' : 'risk'}`}>
                                {s.backlogs} Bklg
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementDashboard;