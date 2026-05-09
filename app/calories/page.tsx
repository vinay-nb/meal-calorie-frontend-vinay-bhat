"use client";
import React from "react";
import CaloriesForm from "@/components/ui/CaloriesForm";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function CaloriesPage() {
  const { isAuthenticated, isChecking } = useAuthGuard();

  if (!isAuthenticated || isChecking) {
    return null;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <div className="w-full px-4">
        <CaloriesForm />
      </div>
    </div>
  );
}
