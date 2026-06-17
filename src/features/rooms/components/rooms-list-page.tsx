"use client";

import React, { useState } from "react";
import { Plus, Search, Home, CheckCircle2, Users, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { TableSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useRooms } from "../hooks/use-rooms";
import { RoomsTable } from "./rooms-table";
import { HostelSelector } from "@/features/hostel-floors/components/hostel-selector";
import { FloorSelector } from "./floor-selector";
import { CreateRoomModal } from "./create-room-modal";

export const RoomsListPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const {
    rooms,
    allRoomsRaw,
    hostels,
    floors,
    isLoading,
    error,
    search,
    setSearch,
    selectedHostelId,
    setSelectedHostelId,
    selectedFloorId,
    setSelectedFloorId,
    selectedStatus,
    setSelectedStatus,
    reload,
  } = useRooms();

  // Compute stat metrics
  const stats = React.useMemo(() => {
    const total = allRoomsRaw.length;
    const available = allRoomsRaw.filter(r => r.status?.toLowerCase() === "available" || r.status?.toLowerCase() === "active").length;
    const occupied = allRoomsRaw.filter(r => r.status?.toLowerCase() === "occupied" || r.status?.toLowerCase() === "full").length;
    const maintenance = allRoomsRaw.filter(r => r.status?.toLowerCase() === "maintenance").length;
    return { total, available, occupied, maintenance };
  }, [allRoomsRaw]);

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Rooms"
        message={error}
        onRetry={reload}
        isLoading={isLoading}
      />
    );
  }

  const statusOptions = [
    { label: "All Statuses", value: "" },
    { label: "Available", value: "available" },
    { label: "Occupied", value: "occupied" },
    { label: "Maintenance", value: "maintenance" },
    { label: "Inactive", value: "inactive" },
  ];
  return (
    <div className="flex flex-col font-inter">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-[16px]">
        <div className="flex flex-col">
          <h1 className="page-title">Rooms Directory</h1>
          <p className="page-subtitle">Oversee bed allocation, type configurations, and key cards.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)} 
          className="h-[46px] px-[20px] rounded-[12px] bg-[linear-gradient(135deg,#6D4AFF,#5B34F5)] text-white font-[600] text-[14px] flex items-center shadow-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={18} className="mr-[8px]" />
          Add Room
        </button>
      </div>

        {/* Summary Metrics Row */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-[16px]">
            {/* Total Rooms */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-[12px] p-[16px] hover:-translate-y-[2px] transition-all duration-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[14px] font-[600] text-[#64748B] tracking-tight">Total Rooms</span>
                <div className="w-[32px] h-[32px] rounded-[8px] bg-[#F4F1FF] text-[#6D4CFF] flex items-center justify-center shrink-0">
                  <Home size={16} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[32px] font-[800] text-[#0F172A] leading-none tracking-tight">
                  {stats.total}
                </span>
                <span className="text-[13px] font-[500] text-[#64748B]">All registered rooms</span>
              </div>
            </div>

            {/* Available Rooms */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-[12px] p-[16px] hover:-translate-y-[2px] transition-all duration-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[14px] font-[600] text-[#64748B] tracking-tight">Available Rooms</span>
                <div className="w-[32px] h-[32px] rounded-[8px] bg-[#DCFCE7] text-[#22C55E] flex items-center justify-center shrink-0">
                  <CheckCircle2 size={16} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[32px] font-[800] text-[#0F172A] leading-none tracking-tight">
                  {stats.available}
                </span>
                <span className="text-[13px] font-[500] text-[#64748B]">Ready for allocation</span>
              </div>
            </div>

            {/* Occupied Rooms */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-[12px] p-[16px] hover:-translate-y-[2px] transition-all duration-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[14px] font-[600] text-[#64748B] tracking-tight">Occupied Rooms</span>
                <div className="w-[32px] h-[32px] rounded-[8px] bg-[#EEF2FF] text-[#6D4CFF] flex items-center justify-center shrink-0">
                  <Users size={16} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[32px] font-[800] text-[#0F172A] leading-none tracking-tight">
                  {stats.occupied}
                </span>
                <span className="text-[13px] font-[500] text-[#64748B]">Currently occupied</span>
              </div>
            </div>

            {/* Occupancy Rate */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-[12px] p-[16px] hover:-translate-y-[2px] transition-all duration-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[14px] font-[600] text-[#64748B] tracking-tight">Occupancy Rate</span>
                <div className="w-[32px] h-[32px] rounded-[8px] bg-[#FEF3C7] text-[#F59E0B] flex items-center justify-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[32px] font-[800] text-[#0F172A] leading-none tracking-tight">
                  {stats.total > 0 ? Math.round((stats.occupied / stats.total) * 100) : 0}%
                </span>
                <span className="text-[13px] font-[500] text-[#64748B]">Overall utilization</span>
              </div>
            </div>
          </div>
        )}

        {/* Search Filter Bar */}
        <div className="bg-[#FFFFFF] rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.04)] h-[72px] px-6 flex items-center gap-[16px] mb-[16px]">
          <div className="relative w-[320px] h-[40px]">
            <Search size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search rooms by number, type, capacity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-full pl-[44px] pr-[12px] rounded-[8px] border border-[#E5E7EB] text-[14px] font-[500] text-[#0F172A] focus:outline-none focus:border-[#5B3DF5] placeholder:text-[#94A3B8] placeholder:font-[400] transition-colors"
            />
          </div>

          <div className="relative min-w-[180px]">
            <select 
              value={selectedHostelId}
              onChange={(e) => setSelectedHostelId(e.target.value)}
              className="w-full h-[40px] px-[12px] pr-[32px] rounded-[8px] border border-[#E5E7EB] text-[14px] font-[600] text-[#0F172A] bg-white appearance-none focus:outline-none focus:border-[#5B3DF5] transition-colors cursor-pointer"
            >
              <option value="">All Hostels</option>
              {hostels.map(h => (
                <option key={h.id} value={h.id}>{h.hostel_name}</option>
              ))}
            </select>
            <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>

          <div className="relative min-w-[160px]">
            <select 
              value={selectedFloorId}
              onChange={(e) => setSelectedFloorId(e.target.value)}
              disabled={!selectedHostelId}
              className="w-full h-[40px] px-[12px] pr-[32px] rounded-[8px] border border-[#E5E7EB] text-[14px] font-[600] text-[#0F172A] bg-white appearance-none focus:outline-none focus:border-[#5B3DF5] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">All Floors</option>
              {floors.map(f => (
                <option key={f.id} value={f.id}>Floor {f.floor_no}</option>
              ))}
            </select>
            <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>

          <div className="relative min-w-[160px]">
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-[40px] px-[12px] pr-[32px] rounded-[8px] border border-[#E5E7EB] text-[14px] font-[600] text-[#0F172A] bg-white appearance-none focus:outline-none focus:border-[#5B3DF5] transition-colors cursor-pointer"
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>

          <div className="flex-1"></div>

          <button 
            onClick={() => {
              setSearch("");
              setSelectedHostelId("");
              setSelectedFloorId("");
              setSelectedStatus("");
            }}
            className="h-[44px] px-[20px] rounded-[8px] border border-[#E5E7EB] bg-[#FFFFFF] text-[#0F172A] font-[600] text-[14px] shadow-sm hover:bg-[#F8FAFC] transition-colors"
          >
            Reset
          </button>
          
          <button className="btn-top-action">
            <Search size={16} strokeWidth={2.5} />
            Search
          </button>
        </div>

        {/* Main Table Area */}
        {isLoading ? (
          <div className="bg-[#FFFFFF] rounded-[14px] border border-[#EAECEF] p-4"><TableSkeleton rows={5} /></div>
        ) : rooms.length === 0 ? (
          <div className="bg-[#FFFFFF] rounded-[14px] border border-[#EAECEF] p-16 flex flex-col items-center justify-center">
            <Home size={40} className="text-[#94A3B8] opacity-60 mb-4" />
            <h3 className="text-[#0F172A] font-bold text-lg">No Rooms Found</h3>
            <p className="text-[#64748B] font-medium mt-1">
              No room records matched the selected query filters. Try adjusting your parameters.
            </p>
          </div>
        ) : (
          <RoomsTable rooms={rooms} />
        )}

      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          reload();
        }}
      />
    </div>
  );
};
