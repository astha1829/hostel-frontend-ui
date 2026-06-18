"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { 
  Building2, 
  Layers, 
  Home, 
  Users, 
  FileText, 
  ClipboardList, 
  CreditCard, 
  Banknote, 
  Calendar, 
  History,
  ChevronDown,
  LayoutDashboard
} from "lucide-react";
import { useSidebar } from "./client-layout";
import { useAuth } from "@/features/auth";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Hostels", href: "/hostels", icon: Building2 },
  { name: "Hostel Floors", href: "/floors", icon: Layers },
  { name: "Rooms", href: "/rooms", icon: Home },
  { name: "Students", href: "/students", icon: Users },
  { name: "Contracts", href: "/contracts", icon: FileText },
  { name: "Allotments", href: "/allotments", icon: ClipboardList },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Rent Payments", href: "/rent-payments", icon: Banknote },
  { name: "Contract Events", href: "/contract-events", icon: Calendar },
  { name: "Contract History", href: "/contract-history", icon: History },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const collapsed = mounted ? isCollapsed : false;

  return (
    <aside className={`h-screen bg-[#FFFFFF] border-r border-[#E9EDF5] flex flex-col fixed left-0 top-0 z-50 font-['Inter',sans-serif] transition-[width] duration-300 ease-in-out ${collapsed ? "w-[80px]" : "w-[260px]"}`}>
      {/* Logo Section */}
      <div className={`pt-[24px] mb-[24px] flex items-center shrink-0 transition-all duration-300 ${collapsed ? "px-[24px] justify-center" : "px-[28px] justify-start"}`}>
        <div className={`overflow-hidden transition-all duration-300 flex items-center justify-start ${collapsed ? "w-[32px]" : "w-[150px]"}`}>
          <Image
            src="/logo.png"
            alt="Logo"
            width={150}
            height={42}
            priority
            className="max-w-[150px] min-w-[150px] h-auto object-contain object-left"
          />
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-[14px] pb-[20px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex flex-col gap-[8px]">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href) || (pathname === '/' && item.href === '/dashboard');
            const Icon = item.icon;
            
            return (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className={`flex items-center h-[50px] rounded-[12px] transition-all duration-300 relative text-[15px] ${
                    isActive 
                      ? "bg-[#F4F0FF] text-[#6D4AFF] font-[600]" 
                      : "text-[#64748B] font-[500] hover:bg-[#F8FAFF]"
                  } ${collapsed ? "justify-center px-0 gap-0" : "px-[14px] gap-[16px]"}`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-[32px] bg-[#6D4AFF] rounded-full" />
                  )}
                  <Icon size={22} className={`shrink-0 ${isActive ? "text-[#6D4AFF]" : "text-[#7C8AA5]"}`} />
                  
                  <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${collapsed ? "w-0 opacity-0" : "w-full opacity-100"}`}>
                    {item.name}
                  </span>
                </Link>

                {/* Tooltip for Collapsed State */}
                {collapsed && (
                  <div className="absolute left-[64px] top-1/2 -translate-y-1/2 bg-[#1E293B] text-white text-[13px] font-[500] px-[12px] py-[6px] rounded-[6px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-lg">
                    {item.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom User Profile */}
      <div className={`border-t border-[#E9EDF5] bg-[#FFFFFF] shrink-0 transition-all duration-300 ${collapsed ? "p-[20px_0] flex justify-center" : "p-[20px_24px]"}`}>
        <div className={`flex items-center cursor-pointer group ${collapsed ? "justify-center" : "justify-between"}`}>
          <div className="flex items-center gap-[16px]">
            <div className="w-[48px] h-[48px] rounded-full overflow-hidden shrink-0 border border-slate-100">
              <img 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || "Admin")}&backgroundColor=6D4AFF`} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className={`flex flex-col whitespace-nowrap overflow-hidden transition-all duration-300 ${collapsed ? "w-0 opacity-0" : "w-[120px] opacity-100"}`}>
              <span className="text-[15px] font-[600] text-[#0F172A] leading-tight mb-[4px] truncate">
                {user?.name || "System Administrator"}
              </span>
              <span className="text-[14px] text-[#64748B] font-[400] leading-tight truncate">
                {user?.roles?.[0] || "Admin"}
              </span>
            </div>
          </div>
          
          <div className={`overflow-hidden transition-all duration-300 ${collapsed ? "w-0 opacity-0" : "w-[20px] opacity-100"}`}>
            <ChevronDown size={20} className="text-[#7C8AA5] group-hover:text-[#4F46E5] transition-colors shrink-0" />
          </div>
        </div>
      </div>
    </aside>
  );
}
