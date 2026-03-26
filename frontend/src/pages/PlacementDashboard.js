import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { createJob, getAllJobs, deleteJob, updateJob } from "../api/PlacementApi";
import "./PlacementDashboard.css";

const PlacementDashboard = () => {

  const [jobs, setJobs] = useState([]);

  const [form, setForm] = useState({
    companyName: "",
    role: "",
    department: "",
    minMarks: "",
    maxBacklogs: "",
    aboutCompany: "",
    jobDescription: "",
    requirements: "",
    applyLink: ""
  });

  const [activeJobId, setActiveJobId] = useState(null);

  const [selectedJob, setSelectedJob] = useState(null);

  const [editMode, setEditMode] = useState(false);


  const fetchJobs = async () => {

    try {

      const res = await getAllJobs();

      setJobs(res.data.jobs);

    } catch (err) {

      console.error("Error fetching jobs");

    }

  };


  useEffect(() => {

    fetchJobs();

  }, []);


  const handleChange = (e) => {

    setForm({ ...form, [e.target.name]: e.target.value });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    await createJob(form);

    setForm({
      companyName: "",
      role: "",
      department: "",
      minMarks: "",
      maxBacklogs: "",
      aboutCompany: "",
      jobDescription: "",
      requirements: "",
      applyLink: ""
    });

    fetchJobs();

  };


  const handleDelete = async (jobId) => {

    await deleteJob(jobId);

    fetchJobs();

  };


  const handleSelectJob = (jobId) => {

    setActiveJobId(jobId);

  };


  const handleEditSave = async () => {

    await updateJob(selectedJob._id, selectedJob);

    setEditMode(false);

    fetchJobs();

  };


  return (

    <div className="pd-root">

      <Navbar />

      <div className="pd-glow-layer">

        <div className="pd-glow pd-orange"></div>

        <div className="pd-glow pd-yellow"></div>

      </div>


      <div className="container pd-content">

        <header className="pd-header mb-5">

          <span className="pd-badge">Internal Management</span>

          <h2 className="pd-title">

            Placement <span className="text-orange">Hub</span>

          </h2>

          <p className="pd-subtitle">

            Configure opportunities and filter eligible candidates.

          </p>

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
                
                <div className="row g-2 mb-3">

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

                <div className="pd-input-group">
                  <textarea name="aboutCompany" placeholder="About Company" value={form.aboutCompany} onChange={handleChange} rows="3"/>
                </div>

                <div className="pd-input-group">
                  <textarea name="jobDescription" placeholder="Job Description" value={form.jobDescription} onChange={handleChange} rows="3"/>
                </div>

                <div className="pd-input-group">
                  <textarea name="requirements" placeholder="Requirements / Skills Needed" value={form.requirements} onChange={handleChange} rows="3"/>
                </div>

                {/* APPLY LINK FIELD */}

                <div className="pd-input-group">
                  <input
                    name="applyLink"
                    placeholder="Paste Apply Link Here"
                    value={form.applyLink}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="pd-btn-gradient">

                  Publish Job <i className="bi bi-chevron-right ms-1"></i>

                </button>

              </form>

            </div>

          </div>


          {/* JOB LIST */}

          <div className="col-lg-8">

            <div className="pd-glass-card p-4 mb-4">

              <h5 className="fw-bold mb-4">Active Listings</h5>

              <div className="pd-scroll-area">

                {jobs.length === 0 ?

                  <p className="text-muted text-center py-4">No jobs posted yet.</p>

                : null}


                {jobs.map((job) => (

                  <div
                    key={job._id}
                    className={`pd-job-item ${activeJobId === job._id ? 'active' : ''}`}
                    onClick={() => handleSelectJob(job._id)}
                  >

                    <div className="pd-job-meta">

                      <h6 className="fw-bold m-0">{job.companyName}</h6>

                      <span className="pd-role-tag">{job.role}</span>

                    </div>


                    <div style={{display:"flex", gap:"8px"}}>

                      <button
                        className="pd-check-btn"
                        onClick={(e)=>{
                          e.stopPropagation();
                          setSelectedJob(job);
                        }}
                      >
                        View JD
                      </button>


                      <button
                        className="pd-check-btn pd-delete-btn"
                        onClick={(e)=>{
                          e.stopPropagation();
                          handleDelete(job._id);
                        }}
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* JOB DESCRIPTION MODAL */}

      {selectedJob && (

        <div className="pd-modal-overlay">

          <div className="pd-modal-card">

            <div className="pd-modal-header">

              <h4>{selectedJob.companyName}</h4>

              <button onClick={()=>setSelectedJob(null)}>✕</button>

            </div>


            <div className="pd-modal-content">

              <h6>Role</h6>

              <p>{selectedJob.role}</p>


              <h6>About Company</h6>

              {editMode ?

                <textarea
                  value={selectedJob.aboutCompany || ""}
                  onChange={(e)=>setSelectedJob({...selectedJob,aboutCompany:e.target.value})}
                />

              :

                <p>{selectedJob.aboutCompany || "Not provided"}</p>

              }


              <h6>Job Description</h6>

              {editMode ?

                <textarea
                  value={selectedJob.jobDescription || ""}
                  onChange={(e)=>setSelectedJob({...selectedJob,jobDescription:e.target.value})}
                />

              :

                <p>{selectedJob.jobDescription || "Not provided"}</p>

              }


              <h6>Requirements</h6>

              {editMode ?

                <textarea
                  value={selectedJob.requirements || ""}
                  onChange={(e)=>setSelectedJob({...selectedJob,requirements:e.target.value})}
                />

              :

                <p>{selectedJob.requirements || "Not provided"}</p>

              }


              {/* APPLY BUTTON */}

             


              <div style={{marginTop:"20px"}}>

                {editMode ?

                  <button className="pd-check-btn" onClick={handleEditSave}>
                    Save
                  </button>

                :

                  <button className="pd-check-btn" onClick={()=>setEditMode(true)}>
                    Edit JD
                  </button>

                }

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};

export default PlacementDashboard;