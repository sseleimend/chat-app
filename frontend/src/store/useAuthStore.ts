import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface AuthStore {
  authUser: object | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;

  checkAuth: () => Promise<void>;
  signup: (data: object) => Promise<void>;
  logout: () => Promise<void>;
  login: (data: object) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  immer((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,

    checkAuth: async () => {
      try {
        const res = await axiosInstance.get("/auth/check");

        set({ authUser: res.data });
      } catch (error) {
        console.log("Error in checkAuth", error);

        set({ authUser: null });
      } finally {
        set({ isCheckingAuth: false });
      }
    },

    signup: async (data) => {
      set({ isSigningUp: true });
      try {
        const res = await axiosInstance.post("/auth/signup", data);
        set({ authUser: res.data });
        toast.success("Account created successfully");
      } catch (error) {
        console.log("Error in signup", error);

        if (error instanceof AxiosError)
          toast.error(error.response?.data.message);
      } finally {
        set({ isSigningUp: false });
      }
    },

    logout: async () => {
      try {
        await axiosInstance.post("/auth/logout");
        set({ authUser: null });
        toast.success("Logged out successfully");
      } catch (error) {
        console.log("Error in logout", error);

        if (error instanceof AxiosError)
          toast.error(error.response?.data.message);
      }
    },

    login: async (data) => {
      set({ isLoggingIn: true });
      try {
        const res = await axiosInstance.post("/auth/login", data);
        set({ authUser: res.data });
        toast.success("Logged in successfully");
      } catch (error) {
        console.log("Error in login", error);

        if (error instanceof AxiosError)
          toast.error(error.response?.data.message);
      } finally {
        set({ isLoggingIn: false });
      }
    },
  }))
);
