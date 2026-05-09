"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { post } from "@/lib/api";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { emailValidation, passwordValidation, nameValidation } from "@/lib/validations";

type Props = {
  mode?: "register" | "login";
};

export default function AuthForm({ mode = "register" }: Props) {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const password = watch("password");

  async function onSubmit(data: any) {
    setApiError(null);
    setLoading(true);
    try {
      const path =
        mode === "register" ? "/api/auth/register" : "/api/auth/login";
      const payload =
        mode === "register"
          ? { first_name: data.firstName, last_name: data.lastName, email: data.email, password: data.password }
          : { email: data.email, password: data.password };
      
      const res = await post(path, payload);

      if (res.ok) {
        const body = await res.json();
        setAuth(body.user);
        router.push("/dashboard");
        return;
      }

      const err = await res.json().catch(() => ({}));
      setApiError(err?.message || `${mode} failed`);
    } catch (err) {
      setApiError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Background decoration elements */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn(
          "relative z-10 p-8 sm:p-10 rounded-[2rem] shadow-xl border border-slate-200/60 dark:border-slate-800/60",
          "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl text-slate-900 dark:text-white"
        )}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-white">
            {mode === "register" ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            {mode === "register"
              ? "Join us to manage meals and track your calories."
              : "Sign in to manage meals and track your calories."}
          </p>
        </div>

        {mode === "register" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <label className="flex flex-col">
              <span className="text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
                First name
              </span>
              <input
                {...register("firstName", nameValidation)}
                className={cn(
                  "w-full rounded-xl border bg-white/50 px-4 py-3 focus:outline-none focus:ring-2 transition-all shadow-sm dark:bg-slate-800/50",
                  errors.firstName
                    ? "border-red-300 focus:ring-red-500/50 focus:border-red-500 dark:border-red-500/50"
                    : "border-slate-200 focus:ring-blue-500/50 focus:border-blue-500 dark:border-slate-700"
                )}
                placeholder="Jane"
              />
              {errors.firstName && (
                <span className="text-xs text-red-500 mt-1">{errors.firstName.message as string}</span>
              )}
            </label>
            <label className="flex flex-col">
              <span className="text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
                Last name
              </span>
              <input
                {...register("lastName", nameValidation)}
                className={cn(
                  "w-full rounded-xl border bg-white/50 px-4 py-3 focus:outline-none focus:ring-2 transition-all shadow-sm dark:bg-slate-800/50",
                  errors.lastName
                    ? "border-red-300 focus:ring-red-500/50 focus:border-red-500 dark:border-red-500/50"
                    : "border-slate-200 focus:ring-blue-500/50 focus:border-blue-500 dark:border-slate-700"
                )}
                placeholder="Doe"
              />
              {errors.lastName && (
                <span className="text-xs text-red-500 mt-1">{errors.lastName.message as string}</span>
              )}
            </label>
          </div>
        )}

        <label className="flex flex-col mb-4">
          <span className="text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
            Email
          </span>
          <input
            type="email"
            {...register("email", emailValidation)}
            className={cn(
              "w-full rounded-xl border bg-white/50 px-4 py-3 focus:outline-none focus:ring-2 transition-all shadow-sm dark:bg-slate-800/50",
              errors.email
                ? "border-red-300 focus:ring-red-500/50 focus:border-red-500 dark:border-red-500/50"
                : "border-slate-200 focus:ring-blue-500/50 focus:border-blue-500 dark:border-slate-700"
            )}
            placeholder="you@company.com"
          />
          {errors.email && (
            <span className="text-xs text-red-500 mt-1">{errors.email.message as string}</span>
          )}
        </label>

        <label className="flex flex-col mb-4">
          <span className="text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
            Password
          </span>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", passwordValidation)}
              className={cn(
                "w-full rounded-xl border bg-white/50 px-4 py-3 focus:outline-none focus:ring-2 transition-all shadow-sm dark:bg-slate-800/50 pr-12",
                errors.password
                  ? "border-red-300 focus:ring-red-500/50 focus:border-red-500 dark:border-red-500/50"
                  : "border-slate-200 focus:ring-blue-500/50 focus:border-blue-500 dark:border-slate-700"
              )}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <span className="text-xs text-red-500 mt-1">{errors.password.message as string}</span>
          )}
        </label>

        {mode === "register" && (
          <label className="flex flex-col mb-4">
            <span className="text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
              Confirm Password
            </span>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === password || "Passwords do not match",
                })}
                className={cn(
                  "w-full rounded-xl border bg-white/50 px-4 py-3 focus:outline-none focus:ring-2 transition-all shadow-sm dark:bg-slate-800/50 pr-12",
                  errors.confirmPassword
                    ? "border-red-300 focus:ring-red-500/50 focus:border-red-500 dark:border-red-500/50"
                    : "border-slate-200 focus:ring-blue-500/50 focus:border-blue-500 dark:border-slate-700"
                )}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-xs text-red-500 mt-1">{errors.confirmPassword.message as string}</span>
            )}
          </label>
        )}

        {apiError && (
          <div className="p-3 mt-4 text-sm text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-500/20">
            {apiError}
          </div>
        )}

        <div className="mt-8">
          <Button
            type="submit"
            size="lg"
            className="w-full h-12 text-base font-medium rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : null}
            {loading
              ? mode === "register"
                ? "Creating account…"
                : "Signing in…"
              : mode === "register"
                ? "Create account"
                : "Sign in"}
          </Button>
        </div>

        <div className="mt-6 text-center text-sm font-medium">
          {mode === "login" ? (
            <>
              <span className="text-slate-500 dark:text-slate-400">
                Don’t have an account?{" "}
              </span>
              <a
                href="/register"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Create one
              </a>
            </>
          ) : (
            <>
              <span className="text-slate-500 dark:text-slate-400">
                Already have an account?{" "}
              </span>
              <a
                href="/login"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Sign in
              </a>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
