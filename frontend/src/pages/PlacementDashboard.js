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
    <div className="placement-wrapper">
      <Navbar />
      <div className="container py-5">
        <header className="mb-5">
          <span className="badge-system mb-2">CORPORATE RELATIONS</span>
          <h2 className="display-6 fw-bold text-white">Placement Management</h2>
        </header>

        <div className="row g-4">
          {/* POST JOB FORM */}
          <div className="col-lg-4">
            <div className="glass-card p-4">
              <h5 className="text-white mb-4 fw-bold">Post New Job</h5>
              <form onSubmit={handleSubmit} className="placement-form">
                <input className="form-control mb-3" name="companyName" placeholder="Company Name" value={form.companyName} onChange={handleChange} required />
                <input className="form-control mb-3" name="role" placeholder="Job Role" value={form.role} onChange={handleChange} required />
                <input className="form-control mb-3" name="department" placeholder="Department" value={form.department} onChange={handleChange} required />
                <div className="row g-2 mb-4">
                  <div className="col-6">
                    <input className="form-control" name="minMarks" placeholder="Min %" value={form.minMarks} onChange={handleChange} required />
                  </div>
                  <div className="col-6">
                    <input className="form-control" name="maxBacklogs" placeholder="Max Backlogs" value={form.maxBacklogs} onChange={handleChange} required />
                  </div>
                </div>
                <button type="submit" className="btn btn-indigo w-100 fw-bold">Publish Opportunity</button>
              </form>
            </div>
          </div>

          {/* JOB LIST & ELIGIBLE STUDENTS */}
          <div className="col-lg-8">
            <div className="glass-card p-4 mb-4">
              <h5 className="text-white mb-4 fw-bold">Current Opportunities</h5>
              <div className="job-scroll-area">
                {jobs.map((job) => (
                  <div key={job._id} className={`job-item p-3 mb-2 ${activeJobId === job._id ? 'active' : ''}`}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-white mb-1 fw-bold">{job.companyName}</h6>
                        <span className="text-white-50 smaller uppercase">{job.role}</span>
                      </div>
                      <button className="btn btn-outline-indigo btn-sm fw-bold" onClick={() => handleEligible(job._id)}>
                        Check Eligibility
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* HIGH-VISIBILITY STUDENT TABLE */}
            {activeJobId && (
              <div className="glass-card p-4 content-fade-in">
                <h5 className="text-white mb-4 fw-bold">Eligible Candidates</h5>
                {eligible.length === 0 ? (
                  <div className="no-data-alert">No students meet the requirements for this role.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table high-visibility-table">
                      <thead>
                        <tr>
                          <th>Student Name</th>
                          <th>Dept.</th>
                          <th>Marks %</th>
                          <th>Backlogs</th>
                        </tr>
                      </thead>
                      <tbody>
                        {eligible.map((s) => (
                          <tr key={s._id}>
                            <td className="text-white fw-bold">{s.name}</td>
                            <td className="text-light">{s.department}</td>
                            <td><span className="marks-pill">{s.marks}%</span></td>
                            <td>
                              <span className={`status-badge ${s.backlogs === 0 ? 'safe' : 'warn'}`}>
                                {s.backlogs} Backlogs
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