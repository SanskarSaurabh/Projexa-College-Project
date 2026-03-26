import API from "./Axios";

/* CREATE POST */

export const createPost = (data)=>
API.post("/posts/create",data,{
headers:{
"Content-Type":"multipart/form-data"
}
});

/* FEED */

export const getFeedPosts=()=>API.get("/posts");

/* LIKE */

export const likePost=(id)=>API.put(`/posts/like/${id}`);

/* COMMENT */

export const addComment=(id,text)=>API.post(`/posts/comment/${id}`,{text});

/* EDIT */

export const editPostApi=(id,text)=>API.put(`/posts/edit/${id}`,{text});

/* DELETE */

export const deletePostApi=(id)=>API.delete(`/posts/${id}`);

/* ADMIN */

export const getPendingPosts=()=>API.get("/posts/pending");

export const approvePost=(id)=>API.put(`/posts/approve/${id}`);

export const rejectPost=(id)=>API.delete(`/posts/reject/${id}`);