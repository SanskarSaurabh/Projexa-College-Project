import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { getAllJobs, getApplicants } from "../api/PlacementApi";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; 
import "./PlacementApplicants.css";

const PlacementApplicants = () => {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedJobName, setSelectedJobName] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const getDynamicHeaders = useCallback(() => {
    if (!applicants || applicants.length === 0) return [];
    
    const allKeys = new Set();
    applicants.forEach(app => {
      const dataToRead = app.studentId || app.snapshot || {};
      Object.keys(dataToRead).forEach(key => {
        // FIXED: "resumeLink" removed from unwanted list so it can be displayed
        const unwanted = [
          "_id", "__v", "profilePic", "updatedAt", "createdAt", "name", 
          "password", "role", "isApproved", "email"
        ];
        if (!unwanted.includes(key) && dataToRead[key] !== null) {
          allKeys.add(key);
        }
      });
    });
    return Array.from(allKeys);
  }, [applicants]);

  const fetchJobs = async () => {
    try {
      const res = await getAllJobs();
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error("Error fetching jobs");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleViewApplicants = async (id, companyName) => {
    setLoading(true);
    try {
      const res = await getApplicants(id);
      if (!res.data.applicants || res.data.applicants.length === 0) {
        setShowPopup(true);
        setApplicants([]);
        setSelectedJobName("");
      } else {
        setApplicants(res.data.applicants);
        setSelectedJobName(companyName);
      }
    } catch (error) {
      setShowPopup(true);
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  const dynamicHeaders = getDynamicHeaders();

  const downloadCSV = () => {
    if (applicants.length === 0) return;
    const headers = ["Name", "Email", ...dynamicHeaders, "Applied At"];
    const rows = applicants.map(app => {
      const student = app.studentId || app.snapshot || {};
      return [
        `"${student.name || 'N/A'}"`,
        `"${student.email || 'N/A'}"`,
        ...dynamicHeaders.map(header => `"${student[header] || "N/A"}"`),
        `"${new Date(app.appliedAt).toLocaleString()}"`
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${selectedJobName}_Applicants.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    if (applicants.length === 0) return;
    try {
      const doc = new jsPDF({ orientation: 'landscape' });
      const headers = [["Name", "Email", ...dynamicHeaders, "Date"]];
      const tableRows = applicants.map(app => {
        const student = app.studentId || app.snapshot || {};
        return [
          student.name || "N/A",
          student.email || "N/A",
          ...dynamicHeaders.map(h => student[h] || "N/A"),
          new Date(app.appliedAt).toLocaleDateString()
        ];
      });

      doc.setFontSize(16);
      doc.text(`${selectedJobName} - Applicants List`, 14, 15);

      autoTable(doc, {
        head: headers,
        body: tableRows,
        startY: 25,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [255, 95, 0], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: 25 },
      });

      doc.save(`${selectedJobName}_Applicants.pdf`);
    } catch (error) {
      console.error("PDF Export Error:", error);
    }
  };

  return (
    <div className="pa-root">
      <Navbar />
      <div className="pa-glow-layer">
        <div className="pa-glow pa-orange"></div>
        <div className="pa-glow pa-yellow"></div>
      </div>

      <div className="container pa-content mt-4">
        <div className="pa-header text-center mb-5">
          <h2 className="fw-bold">Placement <span style={{color: '#ff5f00'}}>Administration</span></h2>
        </div>

        <div className="row g-4">
          {/* LEFT: JOB LIST */}
          <div className="col-lg-4">
            <div className="pa-glass-card pa-anim h-100">
              <h5 className="mb-4 fw-bold border-bottom pb-2">
                <i className="bi bi-briefcase me-2 text-primary"></i>Active Jobs
              </h5>
              <div className="pa-job-list" style={{maxHeight: '600px', overflowY: 'auto'}}>
                {jobs.map((job) => (
                  <div key={job._id} className={`pa-job-row ${selectedJobName === job.companyName ? 'active-job' : ''}`}>
                    <div className="pa-info">
                      <span className="pa-company d-block fw-bold">{job.companyName}</span>
                      <small className="text-muted">{job.role}</small>
                    </div>
                    <button className="pa-btn" onClick={() => handleViewApplicants(job._id, job.companyName)} disabled={loading}>
                      {loading && selectedJobName === job.companyName ? "..." : "View"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: APPLICANTS TABLE */}
          <div className="col-lg-8">
            {applicants.length > 0 ? (
              <div className="pa-glass-card pa-anim">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                  <h5 className="m-0 fw-bold">List for {selectedJobName}</h5>
                  <div className="d-flex gap-2">
                    <button className="pa-btn btn-sm bg-success text-white" onClick={downloadCSV} title="Download Excel/CSV">
                       <i className="bi bi-file-spreadsheet"></i> CSV
                    </button>
                    <button className="pa-btn btn-sm bg-danger text-white" onClick={downloadPDF} title="Download PDF">
                       <i className="bi bi-file-pdf"></i> PDF
                    </button>
                  </div>
                </div>
                
                <div className="table-responsive">
                  <table className="pa-table w-100">
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        {/* Dynamic Headers for CGPA, Marks, etc. */}
                        {dynamicHeaders.map(h => (
                          <th key={h} className="text-capitalize">
                            {h === "resumeLink" ? "Resume" : h.replace(/([A-Z])/g, ' $1')}
                          </th>
                        ))}
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applicants.map((app, i) => {
                        const student = app.studentId || app.snapshot || {};
                        return (
                          <tr key={i}>
                            <td>
                              <div className="pa-user-cell d-flex align-items-center gap-2">
                                <img 
                                  src={student.profilePic || `https://ui-avatars.com/api/?name=${student.name}&background=random`} 
                                  className="pa-table-avatar rounded-circle"
                                  width="35"
                                  alt=""
                                />
                                <div className="d-flex flex-column">
                                   <span className="pa-user-name fw-semibold">{student.name || "Student"}</span>
                                   <small className="text-muted" style={{fontSize: '11px'}}>{student.email}</small>
                                </div>
                              </div>
                            </td>
                            {/* DYNAMIC DATA CELLS */}
                            {dynamicHeaders.map(h => (
                              <td key={h}>
                                {h === "resumeLink" && student[h] ? (
                                  <a 
                                    href={student[h]} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="btn btn-sm btn-outline-danger py-0"
                                    style={{fontSize: '11px', borderRadius: '5px'}}
                                  >
                                    <i className="bi bi-file-earmark-pdf"></i> View PDF
                                  </a>
                                ) : String(student[h]).startsWith("http") ? (
                                  <a href={student[h]} target="_blank" rel="noreferrer" className="badge bg-light text-primary text-decoration-none">
                                    <i className="bi bi-link"></i> Link
                                  </a>
                                ) : (
                                  student[h] || "—"
                                )}
                              </td>
                            ))}
                            <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="pa-glass-card text-center py-5">
                <i className="bi bi-people display-4 text-muted"></i>
                <p className="mt-3 text-muted">Select a job to view student data and resumes.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="pa-popup-overlay">
          <div className="pa-popup card p-4 shadow text-center">
            <i className="bi bi-exclamation-circle text-warning display-5"></i>
            <h4 className="mt-3">No Applicants</h4>
            <button className="pa-btn w-100 mt-2" onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacementApplicants;