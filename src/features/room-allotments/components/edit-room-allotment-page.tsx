"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ArrowRightLeft, CheckCircle2, BedDouble } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useRoomAllotmentDetails } from "../hooks/use-room-allotment-details";
import { DetailFormSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import Link from "next/link";

export const EditRoomAllotmentPage = ({ id }: { id: string }) => {
  const router = useRouter();
  const {
    allotment,
    hostels,
    students,
    contracts,
    floors,
    rooms,
    isLoading,
    isSaving,
    error,
    formData,
    formErrors,
    handleInputChange,
    handleHostelChange,
    handleFloorChange,
    handleStudentChange,
    saveChanges,
    reload,
  } = useRoomAllotmentDetails(id);

  if (isLoading) {
    return <DetailFormSkeleton />;
  }

  if (error || !allotment) {
    return (
      <ErrorState
        title="Failed to Load Allotment"
        message={error || "Room Allotment not found."}
        onRetry={reload}
        isLoading={isLoading}
      />
    );
  }

  const hostelOptions = (hostels || []).map((h) => ({
    label: h.hostel_name,
    value: h.id,
  }));

  const studentOptions = (students || []).map((s) => ({
    label: `${s.student_name} ${s.last_name || ""}`.trim(),
    value: s.id,
  }));

  const contractOptions = (contracts || []).map((c) => ({
    label: `Contract #${c.contract_no} - ${c.status}`,
    value: c.id,
  }));

  const floorOptions = (floors || []).map((f) => ({
    label: `Floor ${f.floor_no}`,
    value: String(f.floor_no),
  }));

  const roomOptions = (rooms || []).map((r) => ({
    label: `Room ${r.room_no}`,
    value: r.room_no,
  }));

  const isActive = allotment.status?.toLowerCase() === "active";

  const selectedRoomDetails = rooms?.find(r => r.room_no === formData.room_no);
  const capacity = selectedRoomDetails?.capacity || 0;
  // Use occupied_beds from backend if available, otherwise assume 0
  const occupiedBeds = (selectedRoomDetails as any)?.occupied_beds || 0; 
  const availableBeds = Math.max(0, capacity - occupiedBeds);
  const occupancyPercent = capacity > 0 ? Math.round((occupiedBeds / capacity) * 100) : 0;

  return (
    <div className="w-full max-w-none px-[32px] py-[24px] font-['Inter']">
      
      {/* Top Header Section */}
      <div className="flex justify-between items-start mb-[16px]">
        <div className="flex flex-col">
          <Link href="/room-allotments" className="flex items-center text-[14px] font-[500] text-[#64748B] hover:text-[#0F172A] mb-4">
            <ChevronLeft size={16} className="mr-1" />
            Back to Allotments
          </Link>
          <h1 className="text-[48px] font-[800] text-[#0F172A] leading-none mb-3">
            Edit Allotment
          </h1>
          <p className="text-[18px] font-[400] text-[#64748B] m-0">
            Modify student room allocation and billing parameters.
          </p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="h-[120px] bg-white rounded-[20px] border border-[#EEF2F7] mb-[16px] px-[32px] flex items-center shadow-sm w-full">
        <div className="flex items-center w-full justify-between divide-x divide-[#EEF2F7]">
          
          <div className="flex items-center gap-4 pr-6">
            <img src={`https://ui-avatars.com/api/?name=${allotment.student_name}&background=EEF2FF&color=6D4AFF`} className="w-[64px] h-[64px] rounded-full object-cover" />
            <div className="flex flex-col">
              <span className="text-[20px] font-[700] text-[#0F172A] leading-tight">
                {allotment.student_name ? allotment.student_name.split("-")[0] : "Unlinked"}
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-[#64748B]">
                <FileTextIcon size={14} />
                <span className="text-[14px] font-[500] uppercase">
                  SR-10-2026-00001
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col px-6">
            <span className="text-[14px] font-[500] text-[#64748B] mb-1">Contract</span>
            <span className="text-[20px] font-[700] text-[#0F172A] leading-tight">
              #{contracts.find(c => c.id === formData.hostel_contract_id)?.contract_no || "N/A"}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-[8px] h-[8px] rounded-full bg-[#16A34A]"></div>
              <span className="form-label">Active</span>
            </div>
          </div>

          <div className="flex flex-col px-6 flex-1 max-w-[280px]">
            <span className="text-[14px] font-[500] text-[#64748B] mb-1">Hostel</span>
            <span className="text-[20px] font-[700] text-[#0F172A] leading-tight truncate">
              {allotment.hostel_name || "Unassigned Hostel"}
            </span>
          </div>

          <div className="flex items-center gap-4 px-6 flex-2 justify-center">
            <div className="flex flex-col">
              <span className="text-[14px] font-[500] text-[#64748B] mb-1">Current Room</span>
              <span className="text-[18px] font-[700] text-[#0F172A] leading-tight">
                Room {allotment.room_no} - Floor {allotment.floor_no}
              </span>
            </div>
            <ArrowRightLeft size={20} className="text-[#94A3B8] mx-2" />
            <div className="flex flex-col">
              <span className="text-[14px] font-[500] text-[#64748B] mb-1">New Room</span>
              <span className="text-[18px] font-[700] text-[#6D4AFF] leading-tight">
                Room {formData.room_no || "..."} - Floor {formData.floor_no || "..."}
              </span>
            </div>
          </div>

          <div className="flex flex-col pl-6 items-end justify-center">
            <span className="text-[14px] font-[500] text-[#64748B] mb-1">Status</span>
            <div className={`px-4 py-1.5 rounded-full ${isActive ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#F1F5F9] text-[#64748B]'} flex items-center justify-center font-[600] text-[14px]`}>
              {allotment.status || "Active"}
            </div>
          </div>

        </div>
      </div>

      {/* Content Grid */}
      <div className="flex flex-col gap-[16px]">
        
        {/* Section 1 */}
        <div className="bg-white rounded-[18px] border border-[#EEF2F7] p-[24px] shadow-sm">
          <div className="flex items-center gap-3 mb-[16px]">
            <div className="w-[32px] h-[32px] rounded-lg bg-[#6D4AFF] flex items-center justify-center text-white font-[700] text-[15px]">
              1
            </div>
            <h2 className="text-[18px] font-[700] text-[#0F172A]">Student & Contract Connections</h2>
          </div>
          <div className="grid grid-cols-2 gap-x-[20px]">
            <Select
              label="ALLOTTED STUDENT *"
              value={formData.student_id || ""}
              onChange={(e) => handleStudentChange(e.target.value)}
              error={formErrors.student_id}
              options={studentOptions}
              disabled={isSaving}
              className="h-[52px] rounded-[12px] border-[#E2E8F0] focus:border-[#6D4AFF] focus:ring-[#6D4AFF] text-[15px] font-[500]"
              labelClassName="text-[12px] uppercase font-[700] text-[#334155] tracking-wider mb-2"
            />
            <Select
              label="LEASE CONTRACT *"
              value={formData.hostel_contract_id || ""}
              onChange={(e) => handleInputChange("hostel_contract_id", e.target.value)}
              error={formErrors.hostel_contract_id}
              options={contractOptions}
              disabled={isSaving || !formData.student_id}
              className="h-[52px] rounded-[12px] border-[#E2E8F0] focus:border-[#6D4AFF] focus:ring-[#6D4AFF] text-[15px] font-[500]"
              labelClassName="text-[12px] uppercase font-[700] text-[#334155] tracking-wider mb-2"
            />
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-[18px] border border-[#EEF2F7] p-[24px] shadow-sm">
          <div className="flex items-center gap-3 mb-[16px]">
            <div className="w-[32px] h-[32px] rounded-lg bg-[#6D4AFF] flex items-center justify-center text-white font-[700] text-[15px]">
              2
            </div>
            <h2 className="text-[18px] font-[700] text-[#0F172A]">Hostel Location Allocation</h2>
          </div>
          <div className="grid grid-cols-3 gap-x-[20px] mb-[16px]">
            <Select
              label="TARGET HOSTEL *"
              value={formData.hostel_id || ""}
              onChange={(e) => handleHostelChange(e.target.value)}
              error={formErrors.hostel_id}
              options={hostelOptions}
              disabled={isSaving}
              className="h-[52px] rounded-[12px] border-[#E2E8F0] focus:border-[#6D4AFF] focus:ring-[#6D4AFF] text-[15px] font-[500]"
              labelClassName="text-[12px] uppercase font-[700] text-[#334155] tracking-wider mb-2"
            />
            <Select
              label="FLOOR LEVEL *"
              value={String(formData.floor_no || "")}
              onChange={(e) => handleFloorChange(e.target.value)}
              error={formErrors.floor_no}
              options={floorOptions}
              disabled={isSaving || !formData.hostel_id}
              className="h-[52px] rounded-[12px] border-[#E2E8F0] focus:border-[#6D4AFF] focus:ring-[#6D4AFF] text-[15px] font-[500]"
              labelClassName="text-[12px] uppercase font-[700] text-[#334155] tracking-wider mb-2"
            />
            <Select
              label="ROOM NUMBER CODE *"
              value={formData.room_no || ""}
              onChange={(e) => handleInputChange("room_no", e.target.value)}
              error={formErrors.room_no}
              options={roomOptions}
              disabled={isSaving || !formData.floor_no}
              className="h-[52px] rounded-[12px] border-[#E2E8F0] focus:border-[#6D4AFF] focus:ring-[#6D4AFF] text-[15px] font-[500]"
              labelClassName="text-[12px] uppercase font-[700] text-[#334155] tracking-wider mb-2"
            />
          </div>

          {/* Room Selector & Preview Row */}
          {formData.floor_no && rooms.length > 0 && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              
              {/* Room Cards Area */}
              <div className="xl:col-span-2 bg-[#F8FAFC] rounded-[12px] border border-[#EEF2F7] p-[20px]">
                <h3 className="text-[14px] font-[700] text-[#0F172A] mb-4">Available Rooms on Floor {formData.floor_no}</h3>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  {rooms.map((r) => {
                    const isSelected = r.room_no === formData.room_no;
                    // Logic from user: Room 101 Occupied, Room 102 Available, but based on actual records
                    const rOccupiedBeds = (r as any).occupied_beds || 0;
                    const isOccupied = rOccupiedBeds >= r.capacity || r.status?.toLowerCase() === "occupied";
                    const isAvailable = !isOccupied && !isSelected;

                    let cardClass = "relative w-[140px] h-[70px] rounded-[12px] border-2 cursor-pointer flex items-center px-3 gap-3 transition-all";
                    let iconBg = "";
                    let iconColor = "";

                    if (isSelected) {
                      cardClass += " border-[#6D4AFF] bg-[#F7F5FF] shadow-[0_0_15px_rgba(109,74,255,0.15)]";
                      iconBg = "bg-[#6D4AFF]";
                      iconColor = "text-white";
                    } else if (isOccupied) {
                      cardClass += " border-[#FECACA] bg-[#FEF2F2] opacity-70";
                      iconBg = "bg-[#FCA5A5]";
                      iconColor = "text-white";
                    } else {
                      cardClass += " border-[#BBF7D0] bg-[#F0FDF4]";
                      iconBg = "bg-[#86EFAC]";
                      iconColor = "text-white";
                    }

                    return (
                      <div 
                        key={r.id} 
                        className={cardClass}
                        onClick={() => !isOccupied && handleInputChange("room_no", r.room_no)}
                      >
                        <div className={`w-[28px] h-[28px] rounded-md flex items-center justify-center ${iconBg} ${iconColor}`}>
                          <BedDouble size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-[700] text-[#0F172A]">Room {r.room_no}</span>
                          <span className={`text-[11px] font-[600] ${isSelected ? 'text-[#6D4AFF]' : isOccupied ? 'text-[#EF4444]' : 'text-[#16A34A]'}`}>
                            {isSelected ? 'Selected' : isOccupied ? 'Occupied' : 'Available'}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 w-[20px] h-[20px] rounded-full bg-[#6D4AFF] text-white flex items-center justify-center border-2 border-white">
                            <CheckCircle2 size={12} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-4 text-[12px] font-[600] text-[#64748B]">
                  <div className="flex items-center gap-2">
                    <div className="w-[8px] h-[8px] rounded-full bg-[#EF4444]"></div>
                    Occupied
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-[8px] h-[8px] rounded-full bg-[#16A34A]"></div>
                    Available
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-[8px] h-[8px] rounded-full bg-[#6D4AFF]"></div>
                    Selected
                  </div>
                </div>
              </div>

              {/* Room Preview Sidebar */}
              <div className="xl:col-span-1 bg-white rounded-[12px] border border-[#EEF2F7] p-[20px] shadow-sm flex flex-col justify-center">
                <h3 className="text-[16px] font-[700] text-[#0F172A] mb-4">Room {formData.room_no || "---"} Preview</h3>
                
                <div className="flex justify-between items-center mb-6">
                  <div className="flex flex-col">
                    <span className="form-label">Capacity</span>
                    <span className="text-[16px] font-[700] text-[#0F172A]">{capacity} Beds</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="form-label">Occupied</span>
                    <span className="text-[16px] font-[700] text-[#0F172A]">{formData.room_no ? occupiedBeds : "-"} Beds</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="form-label">Available</span>
                    <span className="text-[16px] font-[700] text-[#0F172A]">{formData.room_no ? availableBeds : "-"} Beds</span>
                  </div>
                </div>

                <div className="w-full h-[12px] bg-[#F1F5F9] rounded-full mb-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#22C55E] to-[#16A34A] rounded-full transition-all duration-500" 
                    style={{ width: formData.room_no ? `${occupancyPercent}%` : '0%' }}
                  ></div>
                </div>
                <div className="text-center text-[13px] font-[600] text-[#64748B]">
                  {formData.room_no ? `${occupancyPercent}% Occupied` : "Select a room"}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Section 3 */}
        <div className="bg-white rounded-[18px] border border-[#EEF2F7] p-[24px] shadow-sm">
          <div className="flex items-center gap-3 mb-[16px]">
            <div className="w-[32px] h-[32px] rounded-lg bg-[#6D4AFF] flex items-center justify-center text-white font-[700] text-[15px]">
              3
            </div>
            <h2 className="text-[18px] font-[700] text-[#0F172A]">Contract & Billing Parameters</h2>
          </div>
          <div className="grid grid-cols-2 gap-x-[20px] gap-y-[24px]">
            <div className="flex items-center justify-between gap-[20px]">
              <Select
                label="ALLOTMENT STATUS *"
                value={formData.status || ""}
                onChange={(e) => handleInputChange("status", e.target.value)}
                error={formErrors.status}
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                  { label: "Pending", value: "Pending" },
                ]}
                disabled={isSaving}
                className="w-full h-[52px] rounded-[12px] border-[#E2E8F0] focus:border-[#6D4AFF] focus:ring-[#6D4AFF] text-[15px] font-[500]"
                labelClassName="text-[12px] uppercase font-[700] text-[#334155] tracking-wider mb-2"
              />
              <Input
                label="MONTHLY RENT ($) *"
                type="number"
                value={formData.rent ?? ""}
                onChange={(e) => handleInputChange("rent", e.target.value)}
                error={formErrors.rent}
                disabled={isSaving}
                className="w-full h-[52px] rounded-[12px] border-[#E2E8F0] focus:border-[#6D4AFF] focus:ring-[#6D4AFF] text-[15px] font-[500]"
                labelClassName="text-[12px] uppercase font-[700] text-[#334155] tracking-wider mb-2"
              />
            </div>

            <div className="flex items-center gap-[20px] pt-8 pl-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-[20px] h-[20px]">
                  <input
                    type="checkbox"
                    checked={!!formData.add_transaction_charge}
                    onChange={(e) => handleInputChange("add_transaction_charge", e.target.checked)}
                    disabled={isSaving}
                    className="peer appearance-none w-[20px] h-[20px] border-2 border-[#E2E8F0] rounded-[6px] checked:bg-[#6D4AFF] checked:border-[#6D4AFF] cursor-pointer transition-all"
                  />
                  <CheckCircle2 size={14} className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                </div>
                <span className="text-[15px] font-[700] text-[#0F172A] select-none group-hover:text-[#6D4AFF] transition-colors">Add Transaction Charge</span>
              </label>
            </div>

            <div className="col-span-2">
              <Input
                label="REMARKS"
                value={formData.remarks || ""}
                onChange={(e) => handleInputChange("remarks", e.target.value)}
                placeholder="Add stay comments or special notes..."
                disabled={isSaving}
                className="w-full h-[52px] rounded-[12px] border-[#E2E8F0] focus:border-[#6D4AFF] focus:ring-[#6D4AFF] text-[15px] font-[500]"
                labelClassName="text-[12px] uppercase font-[700] text-[#334155] tracking-wider mb-2"
              />
            </div>
            
          </div>
          
          {/* Bottom Action Bar */}
          <div className="mt-8 pt-6 border-t border-[#EEF2F7] flex justify-end gap-3">
            <button
              onClick={() => router.push("/room-allotments")}
              disabled={isSaving}
              className="h-[52px] px-8 rounded-[12px] border border-[#E2E8F0] bg-white text-[15px] font-[600] text-[#334155] hover:bg-[#F8FAFC] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveChanges}
              disabled={isSaving}
              className="h-[52px] px-8 rounded-[12px] bg-[#6D4AFF] text-white text-[15px] font-[600] shadow-[0_4px_12px_rgba(109,74,255,0.25)] hover:opacity-90 transition-opacity"
            >
              {isSaving ? "Saving..." : "Save Allotment"}
            </button>
          </div>
          
        </div>

      </div>
    </div>
  );
};

const FileTextIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);
