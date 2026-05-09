"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export function useAuthGuard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      setIsChecking(false);
    }
  }, [user, router]);

  return { isAuthenticated: !!user, isChecking };
}
