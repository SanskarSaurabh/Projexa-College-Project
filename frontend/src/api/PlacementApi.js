import API from "./Axios";

export const createJob = (data) => API.post("/placements", data);

export const getEligibleStudents = (jobId) =>
  API.get(`/placements/${jobId}/eligible`);

export const getAllJobs = () => API.get("/placements");

export const deleteJob = (jobId) =>
  API.delete(`/placements/${jobId}`);

export const updateJob = (jobId, data) =>
  API.put(`/placements/${jobId}`, data);

export const applyJob = (jobId) =>
  API.post(`/placements/${jobId}/apply`);

export const getApplicants = (jobId) =>
  API.get(`/placements/${jobId}/applicants`);