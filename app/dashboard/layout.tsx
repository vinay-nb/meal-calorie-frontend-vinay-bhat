import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View your meal search history and track your nutritional progress at a glance.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
