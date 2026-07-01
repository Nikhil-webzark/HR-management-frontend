import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://hr-management-backend-3uuw.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthMe = error.config?.url?.includes("/auth/me");
    const status = error.response?.status;

    // Log the error for debugging
    console.error(`API Error [${status}]:`, {
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data,
    });

    // Redirect to login only on 401 (not /auth/me check)
    if (status === 401 && !isAuthMe) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;