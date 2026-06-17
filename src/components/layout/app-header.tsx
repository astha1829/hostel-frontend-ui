"use client";

import React from "react";
import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import { useSidebar } from "./client-layout";

export function AppHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="h-[84px] bg-[#FFFFFF] flex items-center justify-between px-8 sticky top-0 z-40 w-full border-b border-[#EAECEF] shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 text-slate-500 hover:text-slate-700 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block w-[300px]">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-full h-10 pl-10 pr-4 bg-white border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
          />
        </div>

        <button className="relative p-2.5 bg-white text-slate-400 hover:text-slate-600 rounded-full shadow-sm border border-border transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#E91E63] rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center overflow-hidden bg-white">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900 leading-tight group-hover:text-primary transition-colors">Admin User</span>
            <span className="text-xs text-slate-500 font-medium">Super Admin</span>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 ml-1 group-hover:text-primary transition-colors" />
        </div>
      </div>
    </header>
  );
}
