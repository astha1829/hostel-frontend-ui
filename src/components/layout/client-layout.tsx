"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
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

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

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

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
      <AppSidebar />
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-[padding] duration-300 ease-in-out ${
          isMounted && isCollapsed ? "pl-[80px]" : "pl-[260px]"
        }`}
      >
        <AppHeader />
        <main className="flex-1 w-full flex flex-col pt-[28px] px-[32px] lg:px-[48px] xl:px-[60px] pb-[32px]">
          <div className="flex-1">
            {children}
          </div>
          <footer className="mt-12 pb-4 text-center text-sm font-medium text-slate-400">
            © 2026 Georgia Campus Hostel Management System. All rights reserved.
          </footer>
        </main>
      </div>
    </SidebarContext.Provider>
  );
}
