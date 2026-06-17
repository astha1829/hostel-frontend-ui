"use client"
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Hostels", href: "/hostels" },
  { name: "Hostel Floors", href: "/hostel-floors" },
  { name: "Rooms", href: "/rooms" },
  { name: "Students", href: "/students" },
  { name: "Contracts", href: "/hostel-contracts" },
  { name: "Allotments", href: "/room-allotments" },
  { name: "Payments", href: "/room-allotment-payments" },
  { name: "Rent Payments", href: "/rent-payments" },
  { name: "Contract Events", href: "/hostel-contract-events" },
  { name: "Contract History", href: "/hostel-contract-history" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center px-6 h-16 w-full max-w-[1680px] mx-auto gap-8">
        <div className="flex items-center gap-2 text-primary font-bold text-xl shrink-0">
          <Building className="h-6 w-6" />
          <span>ATMIA</span>
        </div>

        <nav className="flex items-center gap-2 overflow-x-auto w-full scrollbar-none">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
