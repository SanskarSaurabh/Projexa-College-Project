import API from "./Axios";

// --- Student / Staff ---

/**
 * CREATE POST
 * 'data' will be a FormData object containing 'text' and 'file'
 * We MUST include the multipart/form-data header for the file to reach the server.
 */
export const createPost = (data) => API.post("/posts", data, {
    headers: {
        "Content-Type": "multipart/form-data",
    },
});

export const getFeedPosts = () => API.get("/posts");

// --- Social Interactions ---

export const likePost = (id) => API.put(`/posts/like/${id}`);

export const addComment = (id, text) => API.post(`/posts/comment/${id}`, { text });

// --- Admin ---

export const getPendingPosts = () => API.get("/posts/pending");
export const approvePost = (id) => API.put(`/posts/approve/${id}`);
export const rejectPost = (id) => API.delete(`/posts/reject/${id}`);