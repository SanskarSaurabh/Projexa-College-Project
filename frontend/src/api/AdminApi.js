import API from "./Axios";

// get users waiting for approval
export const getPendingUsers = () => API.get("/admin/pending-users");

// approve user
export const approveUser = (id) =>
  API.put(`/admin/approve-user/${id}`);

// reject user
export const rejectUser = (id) =>
  API.delete(`/admin/reject-user/${id}`);
