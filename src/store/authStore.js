import { create } from "zustand";
import { getMeAPI, loginAPI, logoutAPI } from "../api/auth.api.js";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  hasInitialized: false, // ← add this

  login: async (credentials) => {
    const response = await loginAPI(credentials);
    const user = response.data.data;
    set({ user, isAuthenticated: true });
    return user;
  },

  logout: async () => {
    await logoutAPI();
    set({ user: null, isAuthenticated: false });
  },

  fetchMe: async () => {
    // ← guard at the store level, not component level
    if (useAuthStore.getState().hasInitialized) return;
    try {
      const response = await getMeAPI();
      set({
        user: response.data.data,
        isAuthenticated: true,
        isLoading: false,
        hasInitialized: true,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        hasInitialized: true,
      });
    }
  },
  refreshUser: async () => {
    try {
      const response = await getMeAPI();
      set({
        user: response.data.data,
        isAuthenticated: true,
      });
    } catch {
      set({ user: null, isAuthenticated: false });
    }
  },
}));

export default useAuthStore;
