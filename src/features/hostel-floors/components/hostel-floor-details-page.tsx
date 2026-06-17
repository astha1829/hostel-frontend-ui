"use client";

import React from "react";
import { Edit2, Save, X, RefreshCw, CheckCircle2, Building2, Layers, Hash, Home, Info, ArrowLeft, AlertTriangle, Building, BedDouble, ShieldAlert, Plus, Lightbulb, ChevronRight } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DetailFormSkeleton, TableSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useHostelFloorDetails } from "../hooks/use-hostel-floor-details";
import { HostelFloorRoomsTable } from "./hostel-floor-rooms-table";
import { RoomNumberSeriesSelect } from "./room-number-series-select";
import { showCancelConfirm } from "@/utils/swal";
import { CreateRoomModal } from "@/features/rooms/components/create-room-modal";

interface HostelFloorDetailsPageProps {
  id: string;
}

export const HostelFloorDetailsPage: React.FC<HostelFloorDetailsPageProps> = ({ id }) => {
  const {
    floor,
    isLoading,
    isSaving,
    error,
    isEditMode,
    formData,
    formErrors,
    successMessage,
    toggleEditMode,
    handleInputChange,
    saveChanges,
    reload,
  } = useHostelFloorDetails(id);

  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = React.useState(false);

  const handleRoomCreated = () => {
    setIsCreateRoomModalOpen(false);
    reload();
  };

  // Check if form data has unsaved edits
  const isDirty = React.useMemo(() => {
    if (!floor) return false;
    return (
      formData.floor_no !== floor.floor_no ||
      formData.room_number_series !== (floor.room_number_series || "") ||
      formData.idx !== (floor.idx || 0)
    );
  }, [formData, floor]);

  const handleCancel = async () => {
    if (isDirty) {
      const result = await showCancelConfirm();
      if (!result.isConfirmed) {
        return;
      }
    }
    toggleEditMode();
  };

  // Render Loader Skeleton
  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <DetailFormSkeleton />
        <TableSkeleton rows={4} />
      </div>
    );
  }

  // Render Error Panel
  if (error || !floor) {
    return (
      <ErrorState
        title="Failed to Retrieve Hostel Floor"
        message={error || "The requested hostel floor record could not be found."}
        onRetry={reload}
        isLoading={isLoading}
      />
    );
  }

  const roomsCount = floor.rooms?.length || 0;

  // Action Buttons for Page Header
  const headerActions = (
    <div className="flex gap-3 items-center">
      {isEditMode ? (
        <>
          <Button variant="secondary" size="md" onClick={handleCancel} disabled={isSaving}>
            <X size={16} />
            <span>Cancel</span>
          </Button>
          <Button className="btn-top-action">
            <Save size={16} />
            <span>Save Changes</span>
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline" size="md" onClick={reload} className="px-2" title="Reload details">
            <RefreshCw size={16} />
          </Button>
          <Button className="btn-top-action">
            <Edit2 size={16} />
            <span>Edit Details</span>
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-4 pb-4 animate-in fade-in duration-500">
      {/* Success Notification Banner */}
      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-success/15 text-success border border-success/25 rounded-md text-sm font-semibold animate-in slide-in-from-top-2 duration-300">
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {!isEditMode ? (
        <>
          {/* Top Breadcrumb */}
          <div className="flex items-center mb-2">
            <Link href="/hostel-floors" className="inline-flex items-center text-[13px] font-semibold text-slate-500 hover:text-slate-800 transition-colors">
              <ArrowLeft size={16} className="mr-1" />
              Back to Hostel Floors
            </Link>
          </div>

          {/* Header section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-[32px] font-bold text-[#0F172A] leading-none tracking-tight">Floor {floor.floor_no}</h1>
              <div className="h-6 w-[1px] bg-[#EAECEF]"></div>
              <div className="flex items-center gap-3 text-[14px] font-medium text-[#64748B]">
                <div className="flex items-center text-[#F59E0B] bg-[#F59E0B]/10 px-2.5 py-1 rounded-md gap-1.5">
                   <AlertTriangle size={14} />
                   <span className="text-[13px] font-semibold leading-none">Unassigned</span>
                </div>
                <div className="flex items-center gap-1.5">
                   <Home size={16} className="text-[#64748B]" />
                   <span className="leading-none mt-[1px]">{roomsCount} Rooms</span>
                </div>
                <span className="text-[#EAECEF] leading-none mt-[1px]">|</span>
                <div className="flex items-center gap-1.5">
                   <BedDouble size={16} className="text-[#64748B]" />
                   <span className="leading-none mt-[1px]">{floor.rooms?.reduce((acc, r) => acc + (r.capacity || 0), 0) || 0} Beds</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={reload} className="flex items-center justify-center h-[38px] px-[14px] rounded-[10px] border border-[#EAECEF] bg-[#FFFFFF] text-[#0F172A] font-semibold text-[13px] shadow-[0_1px_2px_rgba(0,0,0,.04)] hover:bg-[#F1F5F9] transition-colors">
                <RefreshCw size={14} className="mr-1.5 text-[#64748B]" />
                Refresh
              </button>
              <button onClick={toggleEditMode} className="btn-top-action">
                <Edit2 size={14} className="mr-1.5" />
                Edit Details
              </button>
            </div>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-[#FFFFFF] rounded-[12px] p-[16px] flex items-center gap-[16px] shadow-[0_1px_2px_rgba(0,0,0,.04)] border border-[#EAECEF] h-[80px]">
              <div className="w-[44px] h-[44px] rounded-[10px] bg-[#F97316]/10 flex items-center justify-center text-[#F97316] shrink-0">
                 <Layers size={22} />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                 <span className="text-[13px] font-semibold text-[#64748B] leading-none truncate">Floor Level</span>
                 <span className="text-[20px] font-bold text-[#0F172A] leading-none truncate">Floor {floor.floor_no}</span>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-[#FFFFFF] rounded-[12px] p-[16px] flex items-center gap-[16px] shadow-[0_1px_2px_rgba(0,0,0,.04)] border border-[#EAECEF] h-[80px]">
              <div className="w-[44px] h-[44px] rounded-[10px] bg-[#22C55E]/10 flex items-center justify-center text-[#22C55E] shrink-0">
                 <Building size={22} />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                 <span className="text-[13px] font-semibold text-[#64748B] leading-none truncate">Total Rooms</span>
                 <span className="text-[20px] font-bold text-[#0F172A] leading-none truncate">{roomsCount}</span>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-[#FFFFFF] rounded-[12px] p-[16px] flex items-center gap-[16px] shadow-[0_1px_2px_rgba(0,0,0,.04)] border border-[#EAECEF] h-[80px]">
              <div className="w-[44px] h-[44px] rounded-[10px] bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] shrink-0">
                 <BedDouble size={22} />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                 <span className="text-[13px] font-semibold text-[#64748B] leading-none truncate">Bed Capacity</span>
                 <span className="text-[20px] font-bold text-[#0F172A] leading-none truncate">{floor.rooms?.reduce((acc, r) => acc + (r.capacity || 0), 0) || 0}</span>
              </div>
            </div>
            {/* Card 4 */}
            <div className="bg-[#FFFFFF] rounded-[12px] p-[16px] flex items-center gap-[16px] shadow-[0_1px_2px_rgba(0,0,0,.04)] border border-[#EAECEF] h-[80px]">
              <div className="w-[44px] h-[44px] rounded-[10px] bg-[#5B3DF5]/10 flex items-center justify-center text-[#5B3DF5] shrink-0">
                 <ShieldAlert size={22} />
              </div>
              <div className="flex flex-col gap-1.5 min-w-0">
                 <span className="text-[13px] font-semibold text-[#64748B] leading-none truncate">Status</span>
                 <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#F59E0B]/10 rounded text-[#F59E0B] w-fit">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></div>
                   <span className="text-[12px] font-semibold leading-none pt-[1px]">Inactive</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Left Card: 7/12 */}
            <div className="lg:col-span-7 bg-[#FFFFFF] rounded-[12px] shadow-[0_1px_2px_rgba(0,0,0,.04)] border border-[#EAECEF] p-[16px]">
              <div className="flex items-center gap-[10px] mb-[16px] pb-[12px] border-b border-[#EAECEF]">
                 <Info size={20} className="text-[#5B3DF5]" />
                 <h2 className="text-[18px] font-bold text-[#0F172A] leading-none">General Information</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                 <div className="flex flex-col gap-1">
                    <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Associated Hostel</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[14px] font-semibold text-[#F97316]">Not Assigned</span>
                      <Edit2 size={12} className="text-[#64748B]" />
                    </div>
                 </div>
                 <div className="flex flex-col gap-1">
                    <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Hostel Code</span>
                    <span className="text-[14px] font-medium text-[#0F172A]">-</span>
                 </div>
                 <div className="flex flex-col gap-1">
                    <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Floor Level</span>
                    <span className="text-[14px] font-semibold text-[#0F172A]">Floor {floor.floor_no}</span>
                 </div>
                 <div className="flex flex-col gap-1">
                    <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Room Series</span>
                    <span className="text-[14px] font-semibold text-[#0F172A]">XOX</span>
                 </div>
                 <div className="flex flex-col gap-1">
                    <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Room Numbers</span>
                    <span className="text-[14px] font-semibold text-[#5B3DF5]">101 • 102 • 201 • 202</span>
                 </div>
                 <div className="flex flex-col gap-1">
                    <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Sort Index</span>
                    <span className="text-[14px] font-medium text-[#0F172A]">{floor.idx}</span>
                 </div>
                 <div className="flex flex-col gap-1">
                    <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Created On</span>
                    <span className="text-[14px] font-medium text-[#0F172A]">06 Jun 2026</span>
                 </div>
                 <div className="flex flex-col gap-1">
                    <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Last Updated</span>
                    <span className="text-[14px] font-medium text-[#0F172A]">13 Jun 2026</span>
                 </div>
              </div>
            </div>

            {/* Right Card: 5/12 */}
            <div className="lg:col-span-5 bg-[#FFFFFF] rounded-[12px] shadow-[0_1px_2px_rgba(0,0,0,.04)] border border-[#EAECEF] p-[16px] flex flex-col min-h-0">
              <div className="flex justify-between items-center mb-[16px] pb-[12px] border-b border-[#EAECEF]">
                <div className="flex items-center gap-[10px]">
                  <Home size={20} className="text-[#5B3DF5]" />
                  <h2 className="text-[18px] font-bold text-[#0F172A] leading-none">Room Allocations</h2>
                </div>
                <button onClick={() => setIsCreateRoomModalOpen(true)} className="flex items-center justify-center h-[32px] px-[12px] rounded-[8px] border border-[#EAECEF] bg-[#FFFFFF] text-[#5B3DF5] font-semibold text-[13px] shadow-[0_1px_2px_rgba(0,0,0,.04)] hover:bg-[#F8FAFC] transition-colors shrink-0">
                  <Plus size={14} className="mr-1.5" />
                  Add Room
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-1">
                <HostelFloorRoomsTable rooms={floor.rooms} onAddRoom={() => setIsCreateRoomModalOpen(true)} />
              </div>
            </div>
          </div>

          {/* Bottom Tip Card */}
          <div className="bg-[#5B3DF5]/5 rounded-[12px] p-[16px] border border-[#5B3DF5]/20 flex items-center justify-between">
            <div className="flex items-center gap-[12px]">
              <div className="w-[32px] h-[32px] rounded-full bg-[#5B3DF5]/10 flex items-center justify-center text-[#5B3DF5] shrink-0">
                <Lightbulb size={16} />
              </div>
              <div className="text-[13px] font-medium text-[#0F172A]">
                <span className="font-bold text-[#5B3DF5]">Tip: </span>
                You can manage rooms, beds and pricing for this floor from the Rooms section.
              </div>
            </div>
            <button className="flex items-center justify-center h-[36px] px-[16px] rounded-[8px] border border-[#EAECEF] bg-[#FFFFFF] text-[#5B3DF5] font-semibold text-[13px] shadow-[0_1px_2px_rgba(0,0,0,.04)] hover:bg-[#FFFFFF] transition-colors shrink-0">
              Go to Rooms <ChevronRight size={14} className="ml-1.5" />
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-5 animate-in fade-in duration-300">
          <PageHeader
            title={`Floor ${floor.floor_no}`}
            description="Modifying floor configuration"
            backHref="/hostel-floors"
            backText="Back to Hostel Floors"
            actions={headerActions}
            className="mb-2"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="flex flex-col gap-5 lg:col-span-4">
              <SectionCard
                title="Edit Specifications"
                description="Update details relating to the floor level or numbering schemas."
              >
                <div className="flex flex-col gap-5">
                  <div className="border border-border/80 rounded-lg p-5 bg-secondary/15 flex flex-col gap-5">
                    <div className="flex items-center gap-2 border-b border-border/80 pb-2">
                      <Layers size={16} className="text-primary" />
                      <span className="text-[13px] font-bold uppercase tracking-wider text-foreground">
                        Floor & Numbering Specifications
                      </span>
                    </div>

                    <div className="p-4 bg-secondary/10 rounded-md border border-border/50">
                      <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-muted-foreground" />
                        <span className="text-sm font-semibold text-muted-foreground">
                          Associated Hostel:
                        </span>
                        <span className="text-sm font-bold text-foreground">
                          {floor.hostel?.hostel_name || "Unassigned"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Input
                        label="Floor Number *"
                        type="number"
                        min={1}
                        value={formData.floor_no !== undefined ? formData.floor_no : ""}
                        onChange={(e) => handleInputChange("floor_no", e.target.value ? Number(e.target.value) : "")}
                        error={formErrors.floor_no}
                        placeholder="e.g. 2"
                      />

                      <RoomNumberSeriesSelect
                        value={formData.room_number_series || ""}
                        onChange={(value) => handleInputChange("room_number_series", value)}
                        error={formErrors.room_number_series}
                        disabled={isSaving}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Input
                        label="Index Order"
                        type="number"
                        min={0}
                        value={formData.idx !== undefined ? formData.idx : ""}
                        onChange={(e) => handleInputChange("idx", e.target.value ? Number(e.target.value) : "")}
                        error={formErrors.idx}
                        placeholder="e.g. 1"
                      />
                      <div />
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>

            <div className="flex flex-col gap-5 lg:col-span-8">
              <SectionCard
                title="Room Allocations"
                description={`Complete listing of rooms assigned to Floor ${floor.floor_no}`}
              >
                <div className="flex justify-end mb-3">
                  <button onClick={() => setIsCreateRoomModalOpen(true)} className="flex items-center justify-center h-[36px] px-[16px] rounded-[8px] bg-[#5B3DF5] text-white font-semibold text-[13px] shadow-[0_4px_12px_rgba(91,61,245,.2)] hover:bg-[#5B3DF5]/90 transition-colors shrink-0">
                    <Plus size={14} className="mr-1.5" />
                    Add Room
                  </button>
                </div>
                <HostelFloorRoomsTable rooms={floor.rooms} onAddRoom={() => setIsCreateRoomModalOpen(true)} />
              </SectionCard>
            </div>
          </div>
        </div>
      )}

      {/* Render modal at the end */}
      <CreateRoomModal
        isOpen={isCreateRoomModalOpen}
        onClose={() => setIsCreateRoomModalOpen(false)}
        onSuccess={handleRoomCreated}
        initialHostelId={floor?.hostel_id}
        initialFloorId={floor?.id}
      />
    </div>
  );
};
