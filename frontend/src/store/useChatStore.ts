import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { immer } from "zustand/middleware/immer";
import { AxiosError } from "axios";

export interface User {
  _id: string;
  fullName: string;
  profilePic: string;
  name: string;
}

interface ChatStore {
  messages: object[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;

  getUsers: () => void;
  getMessages: (userId: string) => void;
  setSelectedUser: (selectedUser: User) => void;
}

export const useChatStore = create<ChatStore>()(
  immer((set) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
      set({ isUsersLoading: true });
      try {
        const res = await axiosInstance.get("/message/users");
        set({ users: res.data });
      } catch (error) {
        console.log("Error in getUsers", error);

        if (error instanceof AxiosError)
          toast.error(error.response?.data.message);
      } finally {
        set({ isUsersLoading: false });
      }
    },
    getMessages: async (userId) => {
      set({ isMessagesLoading: true });
      try {
        const res = await axiosInstance.get("/message/" + userId);
        set({ messages: res.data });
      } catch (error) {
        console.log("Error in getMessages", error);

        if (error instanceof AxiosError)
          toast.error(error.response?.data.message);
      } finally {
        set({ isMessagesLoading: false });
      }
    },
    setSelectedUser: (selectedUser) => set({ selectedUser }),
  }))
);
