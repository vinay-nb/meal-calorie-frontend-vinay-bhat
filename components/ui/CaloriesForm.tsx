"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { post } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useMealStore } from "@/stores/mealStore";
import ResultCard from "@/components/ui/ResultCard";
import { AlertCircle, CheckCircle, Loader2, Search, UtensilsCrossed, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";

export default function CaloriesForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Keep track of what was actually submitted for the result card fallback
  const [submittedDish, setSubmittedDish] = useState("");
  const [submittedServings, setSubmittedServings] = useState<number>(1);

  const [countdown, setCountdown] = useState<number | null>(null);

  const setStoreResult = useMealStore((s) => s.setResult);
  const clearStoreResult = useMealStore((s) => s.clearResult);

  React.useEffect(() => {
    if (countdown === null || countdown <= 0) {
      if (countdown === 0) setCountdown(null);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          setApiError(null);
          return 0;
        }
        const next = prev - 1;
        setApiError(`Rate limit reached. Please try again in ${next}s.`);
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      dish: "",
      servings: 1,
    },
  });

  async function onSubmit(data: any) {
    setApiError(null);
    setSuccess(null);
    setLoading(true);
    setResult(null);
    setSubmittedDish(data.dish);
    setSubmittedServings(Number(data.servings));
    
    try {
      const payload = { dish_name: data.dish, servings: Number(data.servings) };
      const res = await post("/api/get-calories", payload);

      if (res.status === 404) {
        setApiError("Dish not found. Please try another meal name.");
        return;
      }
      if (res.status === 422) {
        setApiError("No calorie data available for this dish.");
        return;
      }
      if (res.status === 429) {
        const retryAfter = res.headers.get("Retry-After");
        let seconds = 60;
        if (retryAfter) {
          if (!isNaN(Number(retryAfter))) {
            seconds = Number(retryAfter);
          } else {
            const retryDate = new Date(retryAfter).getTime();
            const now = new Date().getTime();
            seconds = Math.max(0, Math.ceil((retryDate - now) / 1000));
          }
        }
        setCountdown(seconds);
        setApiError(`Rate limit reached. Please try again in ${seconds}s.`);
        return;
      }
      if (res.status >= 500) {
        setApiError("Server error — please try again later.");
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setApiError(err?.message || "Failed to fetch calories");
        return;
      }

      const body = await res.json();
      setResult(body);
      setSuccess("Successfully retrieved calorie data!");

      const mealResult = {
        dish_name: body.dish_name || data.dish,
        servings: body.servings ?? Number(data.servings),
        calories_per_serving:
          body.calories_per_serving ?? body.calories_per_unit,
        total_calories:
          body.total_calories ??
          (body.calories_per_serving && body.servings
            ? Math.round(body.calories_per_serving * body.servings)
            : undefined),
        source: body.source || body.data_source,
        macros: body.macros || body.nutrition,
        raw: body,
      };
      setStoreResult(mealResult);
    } catch (err) {
      setApiError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    clearStoreResult();
    reset(); // Reset form fields to default
    setApiError(null);
    setSuccess(null);
    setCountdown(null);
  }

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Background decoration elements */}
      {!result && (
        <>
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-orange-400/20 dark:bg-orange-600/20 rounded-full blur-3xl pointer-events-none"></div>
        </>
      )}

      <div
        className={cn(
          "relative z-10 w-full transition-all duration-500",
          !result && "p-8 sm:p-10 rounded-[2rem] shadow-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl"
        )}
      >
        {!result && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-slate-800 mb-6 border border-blue-100 dark:border-slate-700 shadow-inner">
              <UtensilsCrossed className="w-8 h-8 text-blue-500 dark:text-blue-400" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-3 text-slate-900 dark:text-white">
              Analyze Your Meal
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Enter any dish and serving size to instantly get its caloric breakdown.
            </p>
          </div>
        )}

        {!result && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex flex-col sm:flex-row gap-5">
              <label className="flex flex-col flex-1">
                <span className="text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  Meal Name
                </span>
                <input
                  {...register("dish", { 
                    required: "Meal name is required",
                    minLength: { value: 2, message: "Must be at least 2 characters" } 
                  })}
                  className={cn(
                    "w-full rounded-xl border bg-white/50 px-4 py-3.5 focus:outline-none focus:ring-2 transition-all shadow-sm text-base placeholder:text-slate-400 dark:bg-slate-800/50",
                    errors.dish
                      ? "border-red-300 focus:ring-red-500/50 focus:border-red-500 dark:border-red-500/50"
                      : "border-slate-200 focus:ring-blue-500/50 focus:border-blue-500 dark:border-slate-700"
                  )}
                  placeholder="e.g. Chicken Caesar Salad"
                />
                {errors.dish && (
                  <span className="text-xs text-red-500 mt-1.5">{errors.dish.message as string}</span>
                )}
              </label>

              <label className="flex flex-col sm:w-32">
                <span className="text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  Servings
                </span>
                <input
                  type="number"
                  {...register("servings", { 
                    required: "Required",
                    min: { value: 1, message: "Min 1" },
                    max: { value: 100, message: "Max 100" }
                  })}
                  className={cn(
                    "w-full rounded-xl border bg-white/50 px-4 py-3.5 focus:outline-none focus:ring-2 transition-all shadow-sm text-base dark:bg-slate-800/50",
                    errors.servings
                      ? "border-red-300 focus:ring-red-500/50 focus:border-red-500 dark:border-red-500/50"
                      : "border-slate-200 focus:ring-blue-500/50 focus:border-blue-500 dark:border-slate-700"
                  )}
                />
                {errors.servings && (
                  <span className="text-xs text-red-500 mt-1.5">{errors.servings.message as string}</span>
                )}
              </label>
            </div>

            {apiError && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-500/10 p-3.5 rounded-xl border border-red-100 dark:border-red-500/20">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="font-medium">{apiError}</p>
              </div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                className="w-full h-14 text-lg font-medium rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                disabled={loading || !!countdown}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                {loading ? "Analyzing…" : "Get Calories"}
              </Button>
            </div>
          </form>
        )}

        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
            <div className="mb-6 flex flex-col gap-4">
              <Button
                variant="ghost"
                onClick={handleReset}
                className="self-start text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 font-medium px-4 py-2 h-auto rounded-xl transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Search Another Meal
              </Button>
              
              {success && (
                <div className="flex items-center gap-3 text-sm text-green-700 bg-green-50 dark:text-green-300 dark:bg-green-500/10 p-4 rounded-2xl border border-green-200 dark:border-green-500/20 shadow-sm">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="font-medium">{success}</p>
                </div>
              )}
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
              <ResultCard
                result={{
                  dish_name: result.dish_name || submittedDish,
                  servings: result.servings ?? submittedServings,
                  calories_per_serving:
                    result.calories_per_serving ?? result.calories_per_unit,
                  total_calories:
                    result.total_calories ??
                    (result.calories_per_serving && result.servings
                      ? Math.round(result.calories_per_serving * result.servings)
                      : undefined),
                  source: result.source || result.data_source,
                  macros: result.macros || result.nutrition,
                  raw: result,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
