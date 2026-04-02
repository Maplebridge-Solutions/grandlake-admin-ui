import type { Metadata } from "next";
import { Work_Sans, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "GLK Transit Admin | Grand Lake Municipality Transit Admin Panel",
    template: "%s | GLK Transit Admin",
  },
  description:
    "The official transit app admin for the Municipality of Grand Lake. Manage bus routes, schedules, and digital ticketing with ease.",
  keywords: [
    "GLK Transit",
    "Grand Lake transit",
    "bus tracker",
    "digital bus ticket",
    "Grand Lake NB",
    "municipality transit app",
  ],
  authors: [{ name: "Maplebridge Solutions" }],
  creator: "Maplebridge Solutions",
  icons: { icon: "/assets/logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        workSans.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
