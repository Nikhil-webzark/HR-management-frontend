import api from "./axios.js";

export const getAllEmployeesAPI = (params) => api.get("/employees", { params });
export const getEmployeeByIdAPI = (id) => api.get(`/employees/${id}`);
export const createEmployeeAPI = (data) => api.post("/employees", data);
export const updateEmployeeAPI = (id, data) => api.put(`/employees/${id}`, data);
export const deleteEmployeeAPI = (id) => api.delete(`/employees/${id}`);
export const toggleAccountStatusAPI = (id) => api.patch(`/employees/${id}/toggle-status`);
export const resetPasswordAPI = (id, data) => api.patch(`/employees/${id}/reset-password`, data);