import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/ui/navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "ATMIA Hostel Management System",
  description: "Enterprise grade hostel operations, rooms allotment, and payment platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="bg-[#F8FAFC] text-foreground antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <Navbar />
        <main className="flex-1 flex flex-col p-6 sm:p-8 lg:p-10 max-w-[1680px] w-full mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
