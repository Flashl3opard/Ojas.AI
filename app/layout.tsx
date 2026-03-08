import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import AOSProvider from "./components/AOSProvider";
import { QueryProvider } from "./lib/query-client";
import ThemeSync from "./components/ThemeSync";

// Work Sans font with normal and bold weights
const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal"],
});

export const metadata: Metadata = {
  title: "Ojas AI - A comprehensive Ayurvedic Diet Plan Recommender",
  description: "Personalized Ayurvedic Diet Plan Recommendation System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${workSans.variable} antialiased bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100`}
      >
        <QueryProvider>
          <ThemeSync />
          <AOSProvider>{children}</AOSProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
