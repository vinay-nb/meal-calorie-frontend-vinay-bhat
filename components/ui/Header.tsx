"use client";
import React from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuthStore } from "@/stores/authStore";
import { decodeJwt } from "@/lib/jwt";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function Header() {
  const { user, clearAuth } = useAuthStore();
  const [decodedUser, setDecodedUser] = React.useState<any>(null);
  const router = useRouter();

  React.useEffect(() => {
    if (user) {
      fetch("/api/auth/me")
        .then((res) => res.json())
        .then((data) => setDecodedUser(data.payload))
        .catch(() => {});
    }
  }, [user]);

  const name =
    user?.first_name ||
    (decodedUser && (decodedUser.name || decodedUser.first_name || decodedUser.email));

  function handleLogout() {
    clearAuth();
    router.push("/login");
  }

  return (
    <header className="w-full py-3 sm:py-4 bg-white dark:bg-slate-900 shadow-sm border-b border-slate-100 dark:border-slate-800/80 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 ">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              MC
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Meal Calorie
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-tight">
                Count Generator
              </div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {user && (
            <div className="flex items-center gap-2 sm:gap-3 bg-slate-50 dark:bg-slate-800/50 px-1.5 py-1.5 sm:px-2 sm:py-1.5 rounded-full border border-slate-100 dark:border-slate-700/50">
              <div className="hidden sm:flex flex-col text-right px-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                  {name ? `Hi, ${name}` : "Welcome"}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                  {user?.email || (decodedUser && decodedUser.email) || ""}
                </span>
              </div>
              <div className="sm:hidden text-sm font-semibold text-slate-700 dark:text-slate-200 px-2">
                {name ? name.split(" ")[0] : "Hi"}
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800/50 shadow-sm flex-shrink-0">
                {name ? name[0].toUpperCase() : "U"}
              </div>
            </div>
          )}

          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            {user ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900/50 transition-colors hidden sm:flex"
              >
                Logout
              </Button>
            ) : (
              <Link href="/login">
                <Button
                  variant="default"
                  size="sm"
                  className="h-9 sm:h-10 px-4 sm:px-6 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20"
                >
                  Sign in
                </Button>
              </Link>
            )}
            {user && (
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleLogout}
                className="h-10 w-10 rounded-xl sm:hidden border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
