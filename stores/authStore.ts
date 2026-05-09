"use client";
import { create } from "zustand";
import { User } from "@/types";

type AuthState = {
  user: User | null;
  setAuth: (user: User) => void;
  clearAuth: () => void;
};

const initialUser =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("auth.user") || "null")
    : null;

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  setAuth: (user) => {
    try {
      localStorage.setItem("auth.user", JSON.stringify(user));
    } catch (e) {}
    set({ user });
  },
  clearAuth: () => {
    try {
      localStorage.removeItem("auth.user");
      // Also call the server-side logout to clear the cookie
      fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    } catch (e) {}
    set({ user: null });
  },
}));

export function getAuth() {
  if (typeof window === "undefined") return { user: null };
  return {
    user: JSON.parse(localStorage.getItem("auth.user") || "null"),
  };
}
