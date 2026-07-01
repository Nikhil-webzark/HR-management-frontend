import axios from "axios";

const api = axios.create({
  baseURL: "https://hr-management-backend-3uuw.onrender.com/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthMe = error.config?.url?.includes("/auth/me");
    const is401 = error.response?.status === 401;

    // Only redirect on 401 if it's NOT the /auth/me check
    if (is401 && !isAuthMe) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;