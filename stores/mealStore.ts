"use client";
import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";

import { Macro, MealResult } from "@/types";

type MealState = {
  lastResult: MealResult | null;
  history: MealResult[];
  setResult: (r: MealResult) => void;
  clearResult: () => void;
};

const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") return resolve(null);
      const request = indexedDB.open("mealStoreDB", 1);
      request.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains("keyval")) {
          db.createObjectStore("keyval");
        }
      };
      request.onsuccess = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains("keyval")) return resolve(null);
        const tx = db.transaction("keyval", "readonly");
        const store = tx.objectStore("keyval");
        const req = store.get(name);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      };
      request.onerror = () => resolve(null);
    });
  },
  setItem: async (name: string, value: string): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") return resolve();
      const request = indexedDB.open("mealStoreDB", 1);
      request.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains("keyval")) {
          db.createObjectStore("keyval");
        }
      };
      request.onsuccess = (e: any) => {
        const db = e.target.result;
        const tx = db.transaction("keyval", "readwrite");
        const store = tx.objectStore("keyval");
        store.put(value, name);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      };
      request.onerror = () => resolve();
    });
  },
  removeItem: async (name: string): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") return resolve();
      const request = indexedDB.open("mealStoreDB", 1);
      request.onsuccess = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains("keyval")) return resolve();
        const tx = db.transaction("keyval", "readwrite");
        const store = tx.objectStore("keyval");
        store.delete(name);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      };
      request.onerror = () => resolve();
    });
  },
};

export const useMealStore = create<MealState>()(
  persist(
    (set) => ({
      lastResult: null,
      history: [],
      setResult: (r) =>
        set((state) => {
          // Filter out existing entry with same dish name and servings to maintain uniqueness
          const filteredHistory = state.history.filter(
            (item) => 
              !(item.dish_name.trim().toLowerCase() === r.dish_name.trim().toLowerCase() && 
                item.servings === r.servings)
          );
          const newHistory = [r, ...filteredHistory].slice(0, 8);
          return { lastResult: r, history: newHistory };
        }),
      clearResult: () => set({ lastResult: null }),
    }),
    {
      name: "meal-store",
      storage: createJSONStorage(() => idbStorage),
    }
  )
);

