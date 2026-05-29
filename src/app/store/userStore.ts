import { create } from "zustand";

export const useUserStore = create((set) => ({
  userId: "",
  setUserId: (id: string) => set({ userId: id }),
}));
