import API from "./Axios";

// student / staff
export const createPost = (data) => API.post("/posts", data);
export const getFeedPosts = () => API.get("/posts");

// admin
export const getPendingPosts = () => API.get("/posts/pending");
export const approvePost = (id) => API.put(`/posts/approve/${id}`);
export const rejectPost = (id) => API.delete(`/posts/reject/${id}`);
