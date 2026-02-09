import API from "./Axios";

// placement officer
export const createJob = (data) => API.post("/placements", data);
export const getEligibleStudents = (jobId) =>
  API.get(`/placements/${jobId}/eligible`);

// common
export const getAllJobs = () => API.get("/placements");
