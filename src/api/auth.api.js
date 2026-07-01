import api from "./axios.js";

export const loginAPI = (data) => api.post("/auth/login", data);
export const logoutAPI = () => api.post("/auth/logout");
export const getMeAPI = () => api.get("/auth/me");