import API from "./Axios";

export const getChatUsers = () => API.get("/chat/users");

export const getChatHistory = (userId) =>
  API.get(`/chat/${userId}`);

export const deleteChatHistory = (userId) =>
  API.delete(`/chat/${userId}`); // NEW