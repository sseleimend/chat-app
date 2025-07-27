import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { axiosInstance } from "../lib/axios";

interface AuthStore {
  authUser: object | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;

  checkAuth: () => Promise<void>;
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
  }))
);
