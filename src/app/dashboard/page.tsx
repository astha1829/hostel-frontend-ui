"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Layers,
  Bed,
  Users,
  FileText,
  CreditCard,
  Banknote,
  Calendar,
  History,
  ChevronRight,
  Plus
} from "lucide-react";
import { useAuth } from "@/features/auth";
import { http } from "@/lib/http";
import { RoomsApi } from "@/features/rooms/api";

interface DashboardStats {
  hostelsCount: number;
  floorsCount: number;
  roomsCount: number;
  studentsCount: number;
  contractsCount: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [stats, setStats] = useState<DashboardStats>({
    hostelsCount: 0,
    floorsCount: 0,
    roomsCount: 0,
    studentsCount: 0,
    contractsCount: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [hostels, floors, rooms, students, contracts] = await Promise.allSettled([
          http.get<any>("/hostels"),
          http.get<any>("/hostel-floors"),
          RoomsApi.getRooms(),
          http.get<any>("/students"),
          http.get<any>("/hostel-contracts")
        ]);

        const hostelsCount = hostels.status === "fulfilled" && hostels.value
          ? (hostels.value.meta?.total ?? hostels.value.data?.length ?? 0)
          : 0;

        const floorsCount = floors.status === "fulfilled" && floors.value
          ? (floors.value.meta?.total ?? floors.value.data?.length ?? 0)
          : 0;

        const roomsCount = rooms.status === "fulfilled" && rooms.value
          ? rooms.value.length
          : 0;

        const studentsCount = students.status === "fulfilled" && students.value
          ? (students.value.meta?.total ?? students.value.data?.length ?? 0)
          : 0;

        const contractsCount = contracts.status === "fulfilled" && contracts.value
          ? (contracts.value.meta?.total ?? contracts.value.data?.length ?? 0)
          : 0;

        setStats({
          hostelsCount,
          floorsCount,
          roomsCount,
          studentsCount,
          contractsCount
        });
      } catch (err) {
        console.error("Error loading dashboard stats", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, []);

  const statCards = [
    {
      title: "Total Hostels",
      value: stats.hostelsCount,
      description: "Managed properties",
      icon: Building2,
      href: "/hostels",
      accentBg: "bg-[#6D4AFF]",
      iconStyle: "bg-[#F4F1FF] text-[#6D4AFF] border-[#E5DEFF]"
    },
    {
      title: "Total Floors",
      value: stats.floorsCount,
      description: "Registered floors",
      icon: Layers,
      href: "/floors",
      accentBg: "bg-[#22C55E]",
      iconStyle: "bg-[#ECFDF5] text-[#10B981] border-[#A7F3D0]"
    },
    {
      title: "Total Rooms",
      value: stats.roomsCount,
      description: "Total rooms available",
      icon: Bed,
      href: "/rooms",
      accentBg: "bg-[#3B82F6]",
      iconStyle: "bg-[#EFF6FF] text-[#3B82F6] border-[#BFDBFE]"
    },
    {
      title: "Total Students",
      value: stats.studentsCount,
      description: "Registered students",
      icon: Users,
      href: "/students",
      accentBg: "bg-[#F97316]",
      iconStyle: "bg-[#FFF7ED] text-[#F97316] border-[#FFEDD5]"
    },
    {
      title: "Active Contracts",
      value: stats.contractsCount,
      description: "Active lease agreements",
      icon: FileText,
      href: "/contracts",
      accentBg: "bg-[#EC4899]",
      iconStyle: "bg-[#FFF1F2] text-[#F43F5E] border-[#FECDD3]"
    }
  ];

  const sections = [
    {
      title: "Operations",
      accentColor: "text-[#6D4AFF]",
      barColor: "bg-[#6D4AFF]",
      items: [
        {
          title: "Hostels",
          description: "Manage hostel details and facilities",
          href: "/hostels",
          icon: Building2,
          iconStyle: "bg-[#F4F1FF] text-[#6D4AFF] border-[#E5DEFF]"
        },
        {
          title: "Floors",
          description: "Configure floors and their structure",
          href: "/floors",
          icon: Layers,
          iconStyle: "bg-[#ECFDF5] text-[#10B981] border-[#A7F3D0]"
        },
        {
          title: "Rooms",
          description: "Manage rooms and their allocations",
          href: "/rooms",
          icon: Bed,
          iconStyle: "bg-[#EFF6FF] text-[#3B82F6] border-[#BFDBFE]"
        },
        {
          title: "Students",
          description: "Manage student records and profiles",
          href: "/students",
          icon: Users,
          iconStyle: "bg-[#FFF7ED] text-[#F97316] border-[#FFEDD5]"
        },
        {
          title: "Contracts",
          description: "Create and manage lease agreements",
          href: "/contracts",
          icon: FileText,
          iconStyle: "bg-[#FFF1F2] text-[#F43F5E] border-[#FECDD3]"
        }
      ]
    },
    {
      title: "Finance",
      accentColor: "text-[#22C55E]",
      barColor: "bg-[#22C55E]",
      items: [
        {
          title: "Payments",
          description: "Track payments and deposit records",
          href: "/payments",
          icon: CreditCard,
          iconStyle: "bg-[#F4F1FF] text-[#6D4AFF] border-[#E5DEFF]"
        },
        {
          title: "Rent Payments",
          description: "Manage recurring rent payments",
          href: "/rent-payments",
          icon: Banknote,
          iconStyle: "bg-[#ECFDF5] text-[#10B981] border-[#A7F3D0]"
        }
      ]
    },
    {
      title: "Audit & History",
      accentColor: "text-[#F97316]",
      barColor: "bg-[#F97316]",
      items: [
        {
          title: "Contract Events",
          description: "Track contract state changes and events",
          href: "/contract-events",
          icon: Calendar,
          iconStyle: "bg-[#FFF7ED] text-[#F97316] border-[#FFEDD5]"
        },
        {
          title: "Contract History",
          description: "View historical contract records",
          href: "/contract-history",
          icon: History,
          iconStyle: "bg-[#FFF7ED] text-[#F97316] border-[#FFEDD5]"
        }
      ]
    }
  ];

  return (
    <div className="w-full max-w-full flex flex-col gap-10 font-sans text-[#0F172A]">
      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 flex flex-col gap-3">
          <h1 className="text-[44px] font-bold text-[#0F172A] tracking-[-0.03em] leading-[1.1] font-sans">
            Dashboard Overview
          </h1>
          <p className="text-[24px] font-semibold text-[#0F172A] font-sans">
            Welcome back, <span className="font-bold">{user?.name || "Admin"}</span>! 👋
          </p>
          <p className="text-[16px] font-medium text-[#64748B] max-w-2xl font-sans">
            Manage hostels, students, rooms, contracts and payments from a single platform.
          </p>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={() => router.push("/hostels")}
              className="h-11 px-5 rounded-xl text-[14px] font-semibold text-white bg-gradient-to-r from-[#6D4AFF] to-[#5938E3] hover:from-[#5B3CE3] hover:to-[#4C2ECC] transition-all flex items-center gap-2 shadow-[0_4px_12px_rgba(109,76,255,0.15)] cursor-pointer font-sans"
            >
              <Plus size={18} />
              <span>Add Hostel</span>
            </button>
            <button
              onClick={() => router.push("/students/new")}
              className="h-11 px-5 rounded-xl text-[14px] font-semibold text-[#0F172A] bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] transition-all flex items-center gap-2 cursor-pointer font-sans"
            >
              <Plus size={18} />
              <span>Add Student</span>
            </button>
            <button
              onClick={() => router.push("/contracts/new")}
              className="h-11 px-5 rounded-xl text-[14px] font-semibold text-[#0F172A] bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] transition-all flex items-center gap-2 cursor-pointer font-sans"
            >
              <FileText size={18} />
              <span>Create Contract</span>
            </button>
          </div>
        </div>

        {/* Decorative Illustration */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <svg
            viewBox="0 0 400 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto max-w-[400px] select-none pointer-events-none"
          >
            {/* Sun/Moon */}
            <circle cx="340" cy="50" r="24" fill="#EEF2F6" />
            
            {/* Background clouds / shapes */}
            <circle cx="320" cy="110" r="45" fill="#EEF2F6" opacity="0.4" />
            <circle cx="90" cy="120" r="25" fill="#EEF2F6" opacity="0.4" />

            {/* Distant trees/shrubs (circles) */}
            <circle cx="65" cy="155" r="16" fill="#D8B4FE" opacity="0.7" />
            <circle cx="365" cy="165" r="14" fill="#D8B4FE" opacity="0.7" />
            <circle cx="380" cy="170" r="12" fill="#C7D2FE" opacity="0.8" />
            
            {/* Back building (tall, center) */}
            <rect x="220" y="50" width="80" height="130" rx="4" fill="#EEF2F6" stroke="#C7D2FE" strokeWidth="1.5" />
            {/* Back building roof */}
            <path d="M220 50L260 35L300 50Z" fill="#E2E8F0" stroke="#C7D2FE" strokeWidth="1.5" />
            {/* Back building windows */}
            <rect x="235" y="65" width="12" height="18" rx="2" fill="#FFFFFF" stroke="#C7D2FE" strokeWidth="1" />
            <rect x="254" y="65" width="12" height="18" rx="2" fill="#FFFFFF" stroke="#C7D2FE" strokeWidth="1" />
            <rect x="273" y="65" width="12" height="18" rx="2" fill="#FFFFFF" stroke="#C7D2FE" strokeWidth="1" />
            
            <rect x="235" y="95" width="12" height="18" rx="2" fill="#FFFFFF" stroke="#C7D2FE" strokeWidth="1" />
            <rect x="254" y="95" width="12" height="18" rx="2" fill="#FFFFFF" stroke="#C7D2FE" strokeWidth="1" />
            <rect x="273" y="95" width="12" height="18" rx="2" fill="#FFFFFF" stroke="#C7D2FE" strokeWidth="1" />

            <rect x="235" y="125" width="12" height="18" rx="2" fill="#FFFFFF" stroke="#C7D2FE" strokeWidth="1" />
            <rect x="254" y="125" width="12" height="18" rx="2" fill="#FFFFFF" stroke="#C7D2FE" strokeWidth="1" />
            <rect x="273" y="125" width="12" height="18" rx="2" fill="#FFFFFF" stroke="#C7D2FE" strokeWidth="1" />

            {/* Left Building (lavender) */}
            <rect x="150" y="80" width="60" height="100" rx="4" fill="#F3E8FF" stroke="#D8B4FE" strokeWidth="1.5" />
            {/* Left building windows */}
            <rect x="162" y="95" width="10" height="14" rx="2" fill="#FFFFFF" stroke="#D8B4FE" strokeWidth="1" />
            <rect x="178" y="95" width="10" height="14" rx="2" fill="#FFFFFF" stroke="#D8B4FE" strokeWidth="1" />
            
            <rect x="162" y="120" width="10" height="14" rx="2" fill="#FFFFFF" stroke="#D8B4FE" strokeWidth="1" />
            <rect x="178" y="120" width="10" height="14" rx="2" fill="#FFFFFF" stroke="#D8B4FE" strokeWidth="1" />
            
            <rect x="162" y="145" width="10" height="14" rx="2" fill="#FFFFFF" stroke="#D8B4FE" strokeWidth="1" />
            <rect x="178" y="145" width="10" height="14" rx="2" fill="#FFFFFF" stroke="#D8B4FE" strokeWidth="1" />

            {/* Right Building (light blue) */}
            <rect x="308" y="90" width="50" height="90" rx="4" fill="#EFF6FF" stroke="#C7D2FE" strokeWidth="1.5" />
            {/* Right building windows */}
            <rect x="318" y="105" width="10" height="12" rx="1.5" fill="#FFFFFF" stroke="#C7D2FE" strokeWidth="1" />
            <rect x="332" y="105" width="10" height="12" rx="1.5" fill="#FFFFFF" stroke="#C7D2FE" strokeWidth="1" />
            
            <rect x="318" y="125" width="10" height="12" rx="1.5" fill="#FFFFFF" stroke="#C7D2FE" strokeWidth="1" />
            <rect x="332" y="125" width="10" height="12" rx="1.5" fill="#FFFFFF" stroke="#C7D2FE" strokeWidth="1" />
            
            <rect x="318" y="145" width="10" height="12" rx="1.5" fill="#FFFFFF" stroke="#C7D2FE" strokeWidth="1" />
            <rect x="332" y="145" width="10" height="12" rx="1.5" fill="#FFFFFF" stroke="#C7D2FE" strokeWidth="1" />

            {/* Tree trunks */}
            <rect x="63" y="170" width="4" height="15" fill="#D8B4FE" />
            <rect x="363" y="175" width="4" height="10" fill="#D8B4FE" />

            {/* Ground Line */}
            <line x1="50" y1="180" x2="380" y2="180" stroke="#C7D2FE" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => router.push(card.href)}
              className="relative bg-white rounded-2xl border border-[#E2E8F0] py-[16px] px-5 flex items-center gap-4 h-[110px] shadow-[0_1px_2px_rgba(15,23,42,0.02)] cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group overflow-hidden"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-105 ${card.iconStyle}`}>
                <Icon size={22} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[#64748B] text-[14px] font-semibold leading-none mb-1.5 font-sans">
                  {card.title}
                </span>
                <span className="text-[36px] font-bold text-[#0F172A] tracking-[-0.02em] leading-none mb-1.5 font-sans">
                  {isLoading ? "..." : card.value}
                </span>
                <span className="text-[#94A3B8] text-[13px] font-medium leading-none truncate font-sans">
                  {card.description}
                </span>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-[4px] ${card.accentBg}`} />
            </div>
          );
        })}
      </div>

      {/* Operations, Finance, Audit & History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {sections.map((section) => (
          <div
            key={section.title}
            className="bg-white rounded-[18px] border border-[#E2E8F0] p-6 flex flex-col gap-6 shadow-[0_1px_2px_rgba(15,23,42,0.02)] h-full"
          >
            {/* Section Header */}
            <div className="flex flex-col gap-2 pb-2">
              <h3 className={`text-[24px] font-bold ${section.accentColor} font-sans`}>
                {section.title}
              </h3>
              <div className={`w-10 h-[3.5px] ${section.barColor} rounded-full`} />
            </div>

            {/* Section Items */}
            <div className="flex flex-col gap-1.5">
              {section.items.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={item.title}
                    onClick={() => router.push(item.href)}
                    className="flex items-center justify-between p-3.5 hover:bg-[#F8FAFC] rounded-xl transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center min-w-0">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${item.iconStyle} mr-4`}>
                        <ItemIcon size={20} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[16px] font-semibold text-[#0F172A] leading-snug group-hover:text-[#6D4AFF] transition-colors font-sans">
                          {item.title}
                        </span>
                        <span className="text-[14px] text-[#64748B] font-medium leading-normal truncate font-sans">
                          {item.description}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#6D4AFF] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
