import api from "./axios.js";

export const getAllStatusAPI = () => api.get("/status");
export const updateMyStatusAPI = (data) => api.patch("/status/me", data);
export const toggleTemporaryAvailabilityAPI = () => api.patch("/status/me/toggle");

export const getEODTimelineAPI = () => api.get("/eod");
export const submitEODAPI = (data) => api.post("/eod", data);
export const getAdminDashboardStatsAPI = () => api.get("/admin/dashboard");