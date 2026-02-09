import API from "./Axios";

export const getChatUsers = () => API.get("/chat/users");
export const getChatHistory = (userId) =>
  API.get(`/chat/${userId}`);
