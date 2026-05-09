"use client";
import { MealResult } from "@/types";
import { cn } from "@/lib/utils";
import { Flame, Info, CheckCircle2 } from "lucide-react";

export default function ResultCard({ result }: { result: MealResult }) {
  // Calculate total calories
  const totalCalories =
    result.total_calories ??
    (result.calories_per_serving && result.servings
      ? Math.round(result.calories_per_serving * result.servings)
      : undefined);

  // Normalize raw fields for flexibility
  const raw: any = result.raw ?? {};
  const perServing: Record<string, number | undefined> =
    result.macros ?? raw.macronutrients_per_serving ?? raw.macronutrients ?? {};
  const totalMacros: Record<string, number | undefined> =
    (result as any).total_macronutrients ??
    raw.total_macronutrients ??
    raw.total_macros ??
    {};

  // Format numbers
  function fmt(n?: number) {
    if (n === undefined || n === null) return "—";
    return Number.isInteger(n) ? `${n}` : `${Math.round(n * 10) / 10}`;
  }

  // Macronutrient fields to display
  const nutrients = [
    { keys: ["protein"], label: "Protein" },
    { keys: ["total_fat", "fat"], label: "Fat" },
    { keys: ["carbohydrates", "carbs"], label: "Carbs" },
    { keys: ["fiber"], label: "Fiber" },
    { keys: ["sugars"], label: "Sugars" },
    { keys: ["saturated_fat", "saturatedFat"], label: "Saturated Fat" },
  ];

  const hasAnyMacro = nutrients.some((n) => {
    const ps = n.keys.map((k) => perServing[k]).find((v) => v != null);
    const tot = n.keys.map((k) => totalMacros[k]).find((v) => v != null);
    return !!(ps || tot);
  });

  return (
    <div
      className={cn(
        "w-full max-w-2xl mx-auto p-6 sm:p-8 bg-transparent text-slate-900 dark:text-white"
      )}
    >
      {/* Header: Dish name and source */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border-b border-slate-100 dark:border-slate-800/80 pb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap mb-1.5">
            <h3 className="text-2xl sm:text-3xl font-bold leading-tight break-words tracking-tight text-slate-900 dark:text-white">
              {result.dish_name}
            </h3>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium border border-blue-100 dark:border-blue-800/50">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {result.source ?? raw.source ?? "Verified Estimate"}
            </span>
          </div>
        </div>
        <div className="mt-3 sm:mt-0 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 text-center min-w-[100px]">
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
            Servings
          </div>
          <div className="text-3xl font-bold text-slate-800 dark:text-slate-200">{result.servings}</div>
        </div>
      </div>

      {/* Calories summary */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="relative p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/80 dark:to-slate-900 border border-slate-200/80 dark:border-slate-700/50 flex flex-col items-start shadow-sm overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Flame className="w-16 h-16 text-orange-500" />
          </div>
          <div className="relative z-10 flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Calories</span>
          </div>
          <div className="relative z-10 text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-baseline gap-1.5 mt-1">
            {totalCalories ? totalCalories : "—"}
            <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">kcal</span>
          </div>
        </div>

        <div className="relative p-5 rounded-2xl bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-900/10 dark:to-slate-900 border border-blue-100 dark:border-blue-900/30 flex flex-col items-start shadow-sm overflow-hidden">
          <div className="relative z-10 flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Per Serving</span>
          </div>
          <div className="relative z-10 text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-baseline gap-1.5 mt-1">
            {result.calories_per_serving ? result.calories_per_serving : "—"}
            <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">kcal</span>
          </div>
        </div>
      </div>

      {/* Macronutrients table */}
      {hasAnyMacro && (
        <div className="mt-8">
          <h4 className="text-sm font-semibold mb-4 text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
            Macronutrients Breakdown
          </h4>
          <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/30 shadow-sm custom-scrollbar">
            <table className="w-full min-w-[400px] text-left table-fixed border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50">
                  <th className="py-3 px-4 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nutrient</th>
                  <th className="py-3 px-4 text-right font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Per serving
                  </th>
                  <th className="py-3 px-4 text-right font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {nutrients.map((n) => {
                  const ps = n.keys
                    .map((k) => perServing[k])
                    .find((v) => v != null) as number | undefined;
                  let tot = n.keys
                    .map((k) => totalMacros[k])
                    .find((v) => v != null) as number | undefined;
                  if (
                    (tot === undefined || tot === null) &&
                    ps != null &&
                    result.servings
                  ) {
                    tot = Math.round(ps * result.servings * 10) / 10;
                  }
                  if (ps == null && tot == null) return null;
                  return (
                    <tr
                      key={n.label}
                      className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                    >
                      <td className="py-3.5 px-4 font-medium text-sm text-slate-700 dark:text-slate-300">
                        {n.label}
                      </td>
                      <td className="py-3.5 px-4 text-sm text-right font-semibold text-slate-900 dark:text-white">
                        {ps != null ? `${fmt(ps)} g` : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-sm text-right font-semibold text-slate-900 dark:text-white">
                        {tot != null ? `${fmt(tot)} g` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
