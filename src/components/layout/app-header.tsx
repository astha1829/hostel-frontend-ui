"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, ChevronDown, Menu, Search, LogOut, User as UserIcon, Settings } from "lucide-react";
import { useSidebar } from "./client-layout";
import { useAuth } from "@/features/auth";

export function AppHeader() {
  const { toggleSidebar } = useSidebar();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
  };

  return (
    <header className="h-[84px] bg-[#FFFFFF] flex items-center justify-between px-8 sticky top-0 z-40 w-full border-b border-[#EAECEF] shadow-[0_1px_2px_rgba(15,23,42,0.04)] font-['Inter',sans-serif]">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer rounded-lg hover:bg-slate-50"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-6">
        {/* Search Input */}
        <div className="relative hidden md:block w-[300px]">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-[#6D4AFF] transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 bg-white text-slate-400 hover:text-slate-600 rounded-full shadow-sm border border-slate-200 transition-colors cursor-pointer hover:bg-slate-50">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#E91E63] rounded-full animate-pulse"></span>
        </button>
        
        {/* User Profile Area */}
        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setDropdownOpen(prev => !prev)}
            className="flex items-center gap-3 cursor-pointer group p-1.5 rounded-xl hover:bg-slate-50/80 transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center overflow-hidden bg-slate-100">
              <img 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || "Admin")}&backgroundColor=6D4AFF`} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold text-slate-900 leading-tight group-hover:text-[#6D4AFF] transition-colors">
                {user?.name || "System Administrator"}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {user?.roles?.[0] || "Admin"}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 ml-1 transition-transform duration-200 group-hover:text-[#6D4AFF] ${dropdownOpen ? "rotate-180" : ""}`} />
          </div>

          {/* Premium Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-[240px] bg-white border border-slate-200/80 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Header Info */}
              <div className="px-4 py-3 border-b border-slate-100 flex flex-col gap-0.5">
                <span className="text-sm font-bold text-slate-800 leading-tight">
                  {user?.name || "System Administrator"}
                </span>
                <span className="text-xs text-slate-400 truncate">
                  {user?.email || "admin@example.com"}
                </span>
              </div>

              {/* Items */}
              <div className="p-1.5 flex flex-col gap-0.5">
                <button 
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-colors text-left cursor-pointer"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <span>Profile</span>
                  <span className="ml-auto text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase tracking-wider">Future</span>
                </button>
                
                <button 
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-colors text-left cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Settings</span>
                  <span className="ml-auto text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase tracking-wider">Future</span>
                </button>
              </div>

              {/* Footer / Logout */}
              <div className="border-t border-slate-100 p-1.5 mt-1.5">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm font-semibold text-red-600 hover:text-red-700 rounded-xl hover:bg-red-50/50 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
