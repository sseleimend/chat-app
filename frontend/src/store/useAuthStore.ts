import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { io, type Socket } from "socket.io-client";

const BASE_URL = "http://localhost:3000";

interface AuthStore {
  authUser: {
    _id: string;
    profilePic: string;
    fullName: string;
    email: string;
    createdAt: string;
  } | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: Array<string>;
  socket: Socket | null;

  checkAuth: () => Promise<void>;
  signup: (data: object) => Promise<void>;
  logout: () => Promise<void>;
  login: (data: object) => Promise<void>;
  updateProfile: (data: object) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export const useAuthStore = create<AuthStore>()(
  immer((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
      try {
        const res = await axiosInstance.get("/auth/check");
        set({ authUser: res.data });
        get().connectSocket();
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
        get().connectSocket();
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
        get().disconnectSocket();
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

        get().connectSocket();
      } catch (error) {
        console.log("Error in login", error);

        if (error instanceof AxiosError)
          toast.error(error.response?.data.message);
      } finally {
        set({ isLoggingIn: false });
      }
    },

    updateProfile: async (data) => {
      set({ isUpdatingProfile: true });
      try {
        const res = await axiosInstance.put("/auth/update-profile", data);
        set({ authUser: res.data });
        toast.success("Profile updated successfully");
      } catch (error) {
        console.log("Error in updateProfile", error);

        if (error instanceof AxiosError)
          toast.error(error.response?.data.message);
      } finally {
        set({ isUpdatingProfile: false });
      }
    },

    connectSocket: () => {
      const { authUser } = get();
      if (!authUser || get().socket?.connected) return;

      const socket = io(BASE_URL);
      socket.connect();
    },
    disconnectSocket: () => {},
  }))
);
