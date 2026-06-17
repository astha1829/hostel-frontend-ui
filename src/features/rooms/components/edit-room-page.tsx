"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  Layers, 
  BedDouble, 
  Tag, 
  DollarSign, 
  Eye, 
  Save, 
  Download, 
  Printer, 
  CheckCircle2, 
  Info, 
  Users 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DetailFormSkeleton, TableSkeleton } from "@/components/ui/loading-skeleton";
import { useRoomDetails } from "../hooks/use-room-details";

interface EditRoomPageProps {
  id: string;
}

export const EditRoomPage: React.FC<EditRoomPageProps> = ({ id }) => {
  const router = useRouter();
  
  // Notice we use initialEditMode=true
  const {
    room,
    isLoading,
    isSaving,
    error,
    formData,
    formErrors,
    successMessage,
    handleInputChange,
    saveChanges,
  } = useRoomDetails(id, true);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 p-6">
        <DetailFormSkeleton />
        <TableSkeleton rows={4} />
      </div>
    );
  }

  if (error || !room) {
    const isNotFound = error?.toLowerCase().includes("404") || error?.toLowerCase().includes("not found");
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-border rounded-xl bg-card max-w-lg mx-auto my-8 shadow-sm">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 mb-5 text-muted-foreground">
          <Info size={36} />
        </div>
        <h3 className="text-xl font-bold text-foreground">Room Not Found</h3>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          {isNotFound ? "The requested room record does not exist." : error}
        </p>
        <Button
          variant="primary"
          size="md"
          onClick={() => router.push('/rooms')}
          className="mt-6 flex items-center gap-2"
        >
          <span>Back to Rooms</span>
        </Button>
      </div>
    );
  }

  const capacityOptions = [
    { label: "1 Bed", value: 1 },
    { label: "2 Beds", value: 2 },
    { label: "3 Beds", value: 3 },
    { label: "4 Beds", value: 4 },
    { label: "5 Beds", value: 5 },
  ];

  const roomTypeOptions = [
    { label: "Normal", value: "Normal" },
  ];

  const statusOptions = [
    { label: "Available", value: "Available" },
    { label: "Occupied", value: "Occupied" },
    { label: "Maintenance", value: "Maintenance" },
    { label: "Inactive", value: "Inactive" },
  ];

  const formatRent = (rent: string | number) => {
    const numericRent = typeof rent === "string" ? parseFloat(rent) : rent;
    if (isNaN(numericRent)) return "$0.00";
    return `$${numericRent}`;
  };

  const getStatusColor = (status?: string) => {
    const s = status?.toLowerCase();
    if (s === "available" || s === "active") return "text-[#16A34A] bg-[#DCFCE7]";
    if (s === "occupied" || s === "full") return "text-[#1D4ED8] bg-[#DBEAFE]";
    if (s === "maintenance") return "text-[#D97706] bg-[#FEF3C7]";
    return "text-[#64748B] bg-[#F1F5F9]";
  };

  const qrCodeSource = room.qr_code || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(id)}`;

  // Mock Occupancy Calculation
  const capacity = room.capacity || 4;
  const occupied = room.status?.toLowerCase() === "occupied" ? capacity : (room.status?.toLowerCase() === "available" ? 0 : 0);
  const available = capacity - occupied;
  const occupancyPercent = capacity > 0 ? Math.round((occupied / capacity) * 100) : 0;
  
  // Circumference for the radial progress
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (occupancyPercent / 100) * circumference;

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] bg-[#F8FAFC] font-inter antialiased overflow-y-auto">
      
      {/* Top Header Section */}
      <div className="px-6 pt-[20px] pb-4 shrink-0 flex justify-between items-start">
        <div className="flex flex-col">
          <div className="flex items-center text-[14px] font-[500] text-[#64748B] mb-2">
            <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => router.push('/rooms')}>Rooms</span>
            <span className="mx-2">/</span>
            <span className="text-[#0F172A]">Edit Room</span>
          </div>
          <h1 className="text-[52px] font-[700] tracking-tight text-[#0F172A] leading-[1.1] mb-5">
            Room {room.room_no}
          </h1>
          
          {/* Quick Badges row */}
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded-full text-[13px] font-[600] flex items-center gap-1.5 ${getStatusColor(room.status)}`}>
              <div className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
              <span className="capitalize">{room.status}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[13px] font-[600] text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200">
              <Layers size={14} className="text-slate-400" />
              <span>Floor {room.floor?.floor_no || 1}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[13px] font-[600] text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200">
              <BedDouble size={14} className="text-slate-400" />
              <span>{room.capacity} Beds</span>
            </div>
            <div className="flex items-center gap-1.5 text-[13px] font-[600] text-[#5B3DF5] bg-[#EEF2FF] px-3 py-1.5 rounded-full border border-[#E0E7FF]">
              <span>{room.room_type || "Normal Room"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[13px] font-[600] text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200">
              <DollarSign size={14} className="text-slate-400" />
              <span>{formatRent(room.rent)} / Month</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 items-center pt-2">
          <Button variant="outline" className="h-[44px] bg-white text-slate-700 border-slate-200 hover:bg-slate-50" onClick={() => router.push(`/rooms/${id}`)}>
            <Eye size={16} className="mr-2 text-slate-400" />
            View Room
          </Button>
          <Button variant="primary" className="h-[44px] bg-[#5B3DF5] hover:bg-[#4C33D1] text-white shadow-sm" onClick={saveChanges} isLoading={isSaving}>
            <Save size={16} className="mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-6 pb-6 flex flex-col">
        {successMessage && (
          <div className="flex items-center gap-3 p-3 mb-4 bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0] rounded-lg text-sm font-semibold shrink-0">
            <CheckCircle2 size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="flex flex-row gap-5 items-stretch">
          
          {/* LEFT COLUMN: 65% - Room Details Form */}
          <div className="w-[65%] flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-5 border-b border-slate-100 bg-white shrink-0">
              <h2 className="text-[28px] font-[700] text-[#0F172A] m-0 leading-tight">Room Details</h2>
              <p className="text-[15px] font-[400] text-[#64748B] leading-[1.6] mt-1 m-0">Update room operational information and settings.</p>
            </div>
            
            <div className="p-5 flex-1">
              <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                
                {/* Row 1 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[15px] font-[600] text-[#334155]">Room Number <span className="text-red-500">*</span></label>
                  <Input 
                    type="text" 
                    className="h-[44px] text-[15px] font-[500] text-[#0F172A]" 
                    value={formData.room_no || ""}
                    onChange={(e) => handleInputChange("room_no", e.target.value)}
                    error={formErrors.room_no}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[15px] font-[600] text-[#334155]">Floor <span className="text-red-500">*</span></label>
                  <Select 
                    className="h-[44px] text-[15px] font-[500] text-[#0F172A]"
                    value={room.hostel_floor_id || ""}
                    options={[{ label: `Floor ${room.floor?.floor_no || 1}`, value: room.hostel_floor_id || "" }]}
                    disabled
                  />
                </div>

                {/* Row 2 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[15px] font-[600] text-[#334155]">Capacity (Beds) <span className="text-red-500">*</span></label>
                  <Select 
                    className="h-[44px] text-[15px] font-[500] text-[#0F172A]"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange("capacity", Number(e.target.value))}
                    options={capacityOptions}
                    error={formErrors.capacity}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[15px] font-[600] text-[#334155]">Room Type <span className="text-red-500">*</span></label>
                  <Select 
                    className="h-[44px] text-[15px] font-[500] text-[#0F172A]"
                    value={formData.room_type}
                    onChange={(e) => handleInputChange("room_type", e.target.value)}
                    options={roomTypeOptions}
                    error={formErrors.room_type}
                  />
                </div>

                {/* Row 3 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[15px] font-[600] text-[#334155]">Operational Status <span className="text-red-500">*</span></label>
                  <Select 
                    className="h-[44px] text-[15px] font-[500] text-[#0F172A]"
                    value={formData.status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                    options={statusOptions}
                    error={formErrors.status}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[15px] font-[600] text-[#334155]">Rent Rate ($ / Month) <span className="text-red-500">*</span></label>
                  <Input 
                    type="number" 
                    min={0}
                    step="0.01"
                    className="h-[44px] text-[15px] font-[500] text-[#0F172A]"
                    value={formData.rent === undefined ? "" : formData.rent}
                    onChange={(e) => handleInputChange("rent", Number(e.target.value))}
                    error={formErrors.rent}
                  />
                </div>

                {/* Row 4 (Full Width) */}
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-[15px] font-[600] text-[#334155]">Sort Index</label>
                  <Input 
                    type="number" 
                    min={0}
                    className="h-[44px] text-[15px] font-[500] text-[#0F172A]"
                    value={formData.idx === undefined ? "" : formData.idx}
                    onChange={(e) => handleInputChange("idx", Number(e.target.value))}
                  />
                  <p className="text-[13px] font-[400] text-[#94A3B8] mt-0.5">Used for room ordering in listings.</p>
                </div>

                {/* Row 5 (Full Width) */}
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-[15px] font-[600] text-[#334155]">Digital Key QR Code URL</label>
                  <Input 
                    type="url" 
                    className="h-[44px] text-[15px] font-[500] text-[#0F172A]"
                    placeholder="e.g. https://example.com/qr.png"
                    value={formData.qr_code || ""}
                    onChange={(e) => handleInputChange("qr_code", e.target.value)}
                  />
                  <p className="text-[13px] font-[400] text-[#94A3B8] mt-0.5">Provide a URL to generate the digital access QR code.</p>
                </div>

              </div>
            </div>
          </div>
          
          {/* RIGHT COLUMN: 35% - Cards */}
          <div className="w-[35%] flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm p-4 gap-4">
            
            {/* Room Preview */}
            <div className="w-full h-[100px] rounded-xl bg-gradient-to-br from-[#8161FF] to-[#5B3DF5] relative overflow-hidden shrink-0 flex flex-col justify-center p-4 text-white shadow-md">
              <div className="absolute right-[-5%] top-0 opacity-20 pointer-events-none">
                <BedDouble size={120} strokeWidth={1} />
              </div>
              <p className="text-[13px] font-[700] tracking-widest text-white/80 uppercase mb-0.5">Room Preview</p>
              <h3 className="text-[28px] font-[700] leading-tight mb-1.5">Room {room.room_no}</h3>
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-[500] text-white/90 flex items-center gap-1.5 m-0">
                  <span>Floor {room.floor?.floor_no || 1}</span>
                  <span className="w-1 h-1 rounded-full bg-white/50" />
                  <span>{room.capacity} Beds</span>
                  <span className="w-1 h-1 rounded-full bg-white/50" />
                  <span>{room.room_type || "Normal Room"}</span>
                </p>
                <div className="bg-[#DCFCE7] text-[#16A34A] px-3 py-1 rounded-full text-[13px] font-[700] inline-block">
                  {room.status || "Available"}
                </div>
              </div>
            </div>

            {/* Digital Access */}
            <div className="flex flex-col shrink-0 mt-2">
              <h3 className="text-[28px] font-[700] text-[#0F172A] mb-1">Digital Access</h3>
              <p className="text-[15px] font-[400] text-[#64748B] leading-[1.6] mb-4">Scan the QR code or use digital key card for room access.</p>
              
              <div className="flex justify-center mb-4">
                <div className="border border-slate-200 p-2 rounded-xl bg-white shadow-sm inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrCodeSource} alt="QR Code" className="w-[96px] h-[96px] block" />
                </div>
              </div>
              
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-[14px] font-[500] text-[#64748B]">Room ID</span>
                  <span className="text-[15px] font-[600] text-[#0F172A]">RM-{room.room_no}</span>
                </div>
                <div className="w-full h-px bg-slate-100" />
                <div className="flex justify-between items-center">
                  <span className="text-[14px] font-[500] text-[#64748B]">Floor</span>
                  <span className="text-[15px] font-[600] text-[#0F172A]">{room.floor?.floor_no || 1}</span>
                </div>
                <div className="w-full h-px bg-slate-100" />
                <div className="flex justify-between items-center">
                  <span className="text-[14px] font-[500] text-[#64748B]">Capacity</span>
                  <span className="text-[15px] font-[600] text-[#0F172A]">{room.capacity} Beds</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-[44px] text-[14px] font-[500] border-slate-200 text-slate-700 w-full hover:bg-slate-50">
                  <Download size={16} className="mr-2 text-slate-400" />
                  Download
                </Button>
                <Button variant="outline" className="h-[44px] text-[14px] font-[500] border-[#E0E7FF] text-[#5B3DF5] bg-[#EEF2FF] w-full hover:bg-[#E0E7FF]">
                  <Printer size={16} className="mr-2" />
                  Print Key Card
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-slate-100 shrink-0 my-2" />

            {/* Occupancy Overview */}
            <div className="flex flex-col shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-[28px] font-[700] text-[#0F172A]">Occupancy Overview</h3>
              </div>
              
              <div className="flex items-center justify-between mb-4 mt-2">
                <div className="grid grid-cols-3 gap-4 flex-1">
                  <div className="flex flex-col">
                    <span className="text-[14px] font-[500] text-[#64748B] mb-1">Capacity</span>
                    <span className="text-[15px] font-[600] text-[#0F172A]">{capacity}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-[500] text-[#64748B] mb-1">Occupied</span>
                    <span className="text-[15px] font-[600] text-[#0F172A]">{occupied}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-[500] text-[#64748B] mb-1">Available</span>
                    <span className="text-[15px] font-[600] text-[#16A34A]">{available}</span>
                  </div>
                </div>
                
                {/* Circular Progress Ring */}
                <div className="relative w-[60px] h-[60px] flex items-center justify-center shrink-0 ml-4">
                  <svg width="60" height="60" className="transform -rotate-90">
                    <circle cx="30" cy="30" r="24" fill="transparent" stroke="#EEF2FF" strokeWidth="6" />
                    <circle 
                      cx="30" cy="30" r="24" 
                      fill="transparent" 
                      stroke="#5B3DF5" 
                      strokeWidth="6" 
                      strokeDasharray={2 * Math.PI * 24} 
                      strokeDashoffset={2 * Math.PI * 24 - (occupancyPercent / 100) * (2 * Math.PI * 24)} 
                      strokeLinecap="round"
                      className="transition-all duration-500 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-[14px] font-[700] text-[#0F172A]">{occupancyPercent}%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1.5 mt-2">
                <div className="w-full h-2 rounded-full bg-[#EEF2FF] overflow-hidden">
                  <div className="h-full bg-[#5B3DF5] rounded-full transition-all duration-500" style={{ width: `${occupancyPercent}%` }} />
                </div>
                <span className="text-[13px] text-[#64748B] font-[500]">{occupancyPercent}% Occupied</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="h-[64px] shrink-0 border-t border-slate-200 bg-white flex items-center justify-start px-6">
        <Button variant="outline" className="h-[44px] border-slate-200 text-slate-600 bg-white hover:bg-slate-50 min-w-[100px]" onClick={() => router.push('/rooms')}>
          Cancel
        </Button>
      </div>

    </div>
  );
};
