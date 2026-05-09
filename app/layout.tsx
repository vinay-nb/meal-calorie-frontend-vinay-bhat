import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/ui/Header";

export const metadata: Metadata = {
  title: {
    default: "Meal Calorie Tracker ",
    template: "%s | Meal Calorie Tracker",
  },
  description: "Instantly analyze your meals and get accurate calorie and macronutrient breakdowns. Track your daily nutrition with ease and build healthier habits.",
  keywords: ["calorie tracker", "nutrition analysis", "meal calories", "diet tracker"],
  authors: [{ name: "Vinay Bhat" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Elms+Sans:ital,wght@0,100..900;1,100..900&family=Jost:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Header />

        <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
