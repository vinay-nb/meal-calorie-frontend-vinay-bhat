import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analyze Meal",
  description: "Enter your meal details and get a comprehensive caloric and macronutrient breakdown instantly.",
};

export default function CaloriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
