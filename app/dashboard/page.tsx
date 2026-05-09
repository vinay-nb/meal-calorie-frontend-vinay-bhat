"use client";
import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useMealStore } from "@/stores/mealStore";
import { MealResult } from "@/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import ResultCard from "@/components/ui/ResultCard";
import PastSearchCard from "@/components/ui/PastSearchCard";
import { Search, History, Flame, X } from "lucide-react";

export default function DashboardPage() {
  const { isAuthenticated, isChecking } = useAuthGuard();
  const { user } = useAuthStore();
  const { history } = useMealStore();
  const router = useRouter();
  const [activeResult, setActiveResult] = useState<MealResult | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isAuthenticated || isChecking) {
    return null;
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-6xl mx-auto p-6 lg:p-8">
        
        {/* Header Section */}
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] p-8 sm:p-12 shadow-sm border border-slate-200 dark:border-slate-800 mb-12 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
          
          <div className="relative z-10 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-3 mb-4">
              Welcome back{user?.first_name ? `, ${user.first_name}` : ""}
              <span className="text-3xl sm:text-4xl inline-block origin-bottom-right transition-transform hover:rotate-12 cursor-default">👋</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg sm:text-xl max-w-xl leading-relaxed">
              Track your daily nutrition and explore the caloric details of your favorite meals instantly.
            </p>
          </div>
          
          <Button
            onClick={() => router.push("/calories")}
            size="lg"
            className="relative z-10 bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/20 rounded-2xl px-8 h-16 text-lg font-medium w-full sm:w-auto flex items-center gap-3 transition-all hover:scale-105 active:scale-95 group"
          >
            <Search className="w-6 h-6 group-hover:-rotate-12 transition-transform duration-300" />
            Find New Meal
          </Button>
        </div>

        {/* History Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-4 px-2">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400">
              <History className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Recent Searches</h2>
          </div>

          {!mounted ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse h-64 bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800"></div>
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-16 text-center shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/50 dark:to-slate-950/50 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-slate-50 dark:bg-slate-800 mb-8 border border-slate-100 dark:border-slate-700 shadow-inner">
                  <Flame className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No history yet</h3>
                <p className="text-slate-500 dark:text-slate-400 text-lg max-w-md mx-auto mb-10 leading-relaxed">
                  Your past meal searches will appear here. Start by analyzing a new meal to track your nutrition!
                </p>
                <Button
                  onClick={() => router.push("/calories")}
                  className="rounded-xl border-slate-200 dark:border-slate-700 bg-white text-slate-900 hover:bg-slate-50 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 h-14 px-8 text-base shadow-sm hover:shadow-md transition-all border"
                >
                  Search your first meal
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {history.map((meal, idx) => (
                <PastSearchCard
                  key={idx}
                  meal={meal}
                  isActive={activeResult === meal}
                  onClick={() => setActiveResult(meal)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modal Overlay */}
        {activeResult && mounted && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 sm:p-6 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setActiveResult(null)}>
            <div 
              className="relative w-full max-w-xl bg-slate-50 dark:bg-slate-900 rounded-[2rem] shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden flex flex-col max-h-[90vh] ring-1 ring-white/10 dark:ring-white/5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 backdrop-blur-xl">
                <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white tracking-tight">
                  <div className="p-2 bg-orange-100 dark:bg-orange-500/20 rounded-xl">
                    <Flame className="w-6 h-6 text-orange-500 dark:text-orange-400" />
                  </div>
                  Nutrition Facts
                </h2>
                <button 
                  onClick={() => setActiveResult(null)} 
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4 sm:p-6 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/50">
                <ResultCard result={activeResult} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
