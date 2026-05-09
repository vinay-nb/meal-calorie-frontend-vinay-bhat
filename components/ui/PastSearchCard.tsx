"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { MealResult } from "@/types";
import { Utensils } from "lucide-react";

interface PastSearchCardProps {
  meal: MealResult;
  isActive: boolean;
  onClick: () => void;
}

export default function PastSearchCard({ meal, isActive, onClick }: PastSearchCardProps) {
  const caloriesPerServing = meal.calories_per_serving;
  const totalCalories =
    meal.total_calories ||
    (caloriesPerServing ? Math.round(caloriesPerServing * meal.servings) : null);

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-7 rounded-3xl border cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl dark:hover:shadow-blue-900/30 flex flex-col justify-between h-full group relative overflow-hidden",
        isActive
          ? "border-blue-500 bg-blue-50/80 dark:bg-blue-900/30 shadow-lg ring-2 ring-blue-500/50"
          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-blue-300 dark:hover:border-blue-700"
      )}
    >
      <div className="absolute top-0 right-0 -mt-2 -mr-2 w-32 h-32 bg-gradient-to-bl from-blue-100/50 to-transparent dark:from-blue-900/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>

      <div className="flex items-start justify-between gap-4 mb-8 relative z-10">
        <h3
          className="font-bold text-xl line-clamp-2 leading-tight text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
          title={meal.dish_name}
        >
          {meal.dish_name}
        </h3>
        <div className="flex items-center justify-center shrink-0 w-12 h-12 rounded-2xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm border border-blue-100 dark:border-slate-700 group-hover:border-blue-600">
          <Utensils className="w-6 h-6" />
        </div>
      </div>
      
      <div className="mt-auto space-y-5 relative z-10">
        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 group-hover:border-blue-100 dark:group-hover:border-blue-800 transition-colors">
          <span className="font-medium text-slate-500 dark:text-slate-400 text-base">Total Calories</span>
          <span className="font-bold text-blue-600 dark:text-blue-400 text-2xl flex items-baseline gap-1">
            {totalCalories ? `${totalCalories}` : "N/A"}
            <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-0.5">kcal</span>
          </span>
        </div>
        
        <div className="flex items-center justify-between px-2 pt-1 text-sm">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider">Per Serving</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {caloriesPerServing ? `${caloriesPerServing} kcal` : "N/A"}
            </span>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700/80"></div>
          <div className="flex flex-col items-end">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider">Servings</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{meal.servings}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
