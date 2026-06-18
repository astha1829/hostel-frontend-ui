"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/features/auth";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";

interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  toggleSidebar: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

function FullscreenLoader() {
  return (
    <div className="fixed inset-0 bg-[#FAFBFC] flex flex-col items-center justify-center z-[9999] font-['Inter',sans-serif]">
      <div className="flex flex-col items-center gap-5">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-purple-100 animate-pulse" />
          <div className="absolute inset-0 rounded-full border-4 border-t-[#6D4AFF] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <span className="text-slate-800 font-bold tracking-tight text-lg">Georgia Campus</span>
          <span className="text-slate-400 text-sm font-medium animate-pulse">Restoring your secure session...</span>
        </div>
      </div>
    </div>
  );
}

function ClientLayoutContent({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem("sidebar-collapsed");
    if (stored === "true") {
      setIsCollapsed(true);
    }
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const newState = !prev;
      localStorage.setItem("sidebar-collapsed", String(newState));
      return newState;
    });
  };

  // Enforce Route Guarding
  useEffect(() => {
    if (!isMounted || isLoading) return;

    if (pathname === "/login") {
      if (isAuthenticated) {
        router.replace("/dashboard");
      }
    } else {
      if (!isAuthenticated) {
        router.replace("/login");
      }
    }
  }, [isMounted, isLoading, isAuthenticated, pathname, router]);

  // Loading state when restoring session or mounting component
  if (!isMounted || isLoading) {
    return <FullscreenLoader />;
  }

  const isLoginPage = pathname === "/login";

  // If unauthenticated and on a protected route, show loader while redirecting
  if (!isAuthenticated && !isLoginPage) {
    return <FullscreenLoader />;
  }

  // If authenticated and on login page, show loader while redirecting
  if (isAuthenticated && isLoginPage) {
    return <FullscreenLoader />;
  }

  // Raw layout for login page
  if (isLoginPage) {
    return <div className="w-full min-h-screen bg-slate-50">{children}</div>;
  }

  // Standard protected layout
  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
      <AppSidebar />
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-[padding] duration-300 ease-in-out ${
          isMounted && isCollapsed ? "pl-0" : "pl-[260px]"
        }`}
      >
        <AppHeader />
        <main className="flex-1 w-full flex flex-col pt-[28px] px-[32px] lg:px-[48px] xl:px-[60px] pb-[32px]">
          <div className="flex-1">
            {children}
          </div>
          <footer className="mt-12 pb-4 flex justify-between items-center border-t border-[#E2E8F0] pt-6 text-sm font-medium text-slate-400 font-['Poppins',sans-serif]">
            <span>© 2026 ATMIA Hostel Management System</span>
            <div className="flex items-center gap-2">
              <span>System Status: <span className="text-slate-600 font-semibold">Operational</span></span>
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
            </div>
          </footer>
        </main>
      </div>
    </SidebarContext.Provider>
  );
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ClientLayoutContent>{children}</ClientLayoutContent>
    </AuthProvider>
  );
}
