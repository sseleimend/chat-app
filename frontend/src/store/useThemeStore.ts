import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeStore {
  theme: string;
  setTheme: (theme: string) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "synthwave",
      setTheme: (theme: string) => set({ theme }),
    }),
    {
      name: "theme",
    }
  )
);
