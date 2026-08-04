import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/store/zustand";
import { Timestamp } from "firebase/firestore";

export const requireAuth = async () => {
  try {
    const user = await useAuthStore.getState().user;
    if (user && user.createdAt instanceof Timestamp) {
      user.createdAt = user.createdAt.toDate().toISOString();
    }
    return { user };
  } catch {
    throw redirect({ to: "/connect" });
  }
};
