import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { immer } from "zustand/middleware/immer";
import { AxiosError } from "axios";
import { useAuthStore } from "./useAuthStore";

export interface User {
  _id: string;
  fullName: string;
  profilePic: string;
  name: string;
}

interface ChatStore {
  messages: Array<{
    _id: string;
    senderId: string;
    createdAt: string;
    image: string;
    text: string;
  }>;
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;

  getUsers: () => void;
  getMessages: (userId: string) => void;
  setSelectedUser: (selectedUser: User | null) => void;
  sendMessage: (messageData: object) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
}

export const useChatStore = create<ChatStore>()(
  immer((set, get) => ({
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
    sendMessage: async (data) => {
      const { selectedUser } = get();
      try {
        const res = await axiosInstance.post(
          `/message/send/${selectedUser?._id}`,
          data
        );
        set((state) => {
          state.messages.push(res.data);
        });
      } catch (error) {
        console.log("Error in sendMessage", error);

        if (error instanceof AxiosError)
          toast.error(error.response?.data.message);
      }
    },
    subscribeToMessages: () => {
      const { selectedUser } = get();
      if (!selectedUser) return;

      const socket = useAuthStore.getState().socket;
      socket?.on("newMessage", (newMessage) => {
        const isMessageSentFromSelectedUser =
          newMessage.senderId === selectedUser._id;
        if (!isMessageSentFromSelectedUser) return;
        set((state) => {
          state.messages.push(newMessage);
        });
      });
    },
    unsubscribeFromMessages: () => {
      const socket = useAuthStore.getState().socket;
      socket?.off("newMessage");
    },
    setSelectedUser: (selectedUser) => set({ selectedUser }),
  }))
);
