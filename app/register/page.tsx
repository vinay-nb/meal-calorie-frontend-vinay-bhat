import AuthForm from "@/components/ui/AuthForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Join Meal Calorie Tracker today. Start analyzing your favorite dishes and building a healthier lifestyle.",
};

export default function Page() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <AuthForm mode="register" />
      </div>
    </div>
  );
}
