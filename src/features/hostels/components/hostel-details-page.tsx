"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, Building2, MapPin, Edit2, RefreshCw, Layers, 
  Activity, Home, BedDouble, Info, X, Save
} from "lucide-react";
import { useHostelDetails } from "../hooks/use-hostel-details";
import { DetailFormSkeleton, TableSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { HostelStatusBadge } from "./hostel-status-badge";
import { HostelFloorsTable } from "./hostel-floors-table";
import { HostelDetailsForm } from "./hostel-details-form";

interface HostelDetailsPageProps {
  id: string;
}

export const HostelDetailsPage: React.FC<HostelDetailsPageProps> = ({ id }) => {
  const router = useRouter();
  const {
    hostel,
    floors,
    isLoading,
    error,
    reload,
    toggleEditMode,
    isEditMode,
    formData,
    formErrors,
    handleInputChange,
    saveChanges,
    isSaving,
  } = useHostelDetails(id);

  const totalRooms = React.useMemo(() => {
    return floors?.reduce((acc, floor) => acc + (floor.rooms?.length || 0), 0) || 0;
  }, [floors]);

  const totalCapacity = React.useMemo(() => {
    return floors?.reduce((acc, floor) => {
      return acc + (floor.rooms?.reduce((roomAcc, r) => roomAcc + (r.capacity || 0), 0) || 0);
    }, 0) || 0;
  }, [floors]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <DetailFormSkeleton />
        <TableSkeleton rows={4} />
      </div>
    );
  }

  if (error || !hostel) {
    return (
      <ErrorState
        title="Failed to Retrieve Hostel Information"
        message={error || "The requested hostel record could not be found."}
        onRetry={reload}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Back Link */}
      <div className="flex items-center mb-2">
        <Link 
          href="/hostels" 
          className="inline-flex items-center text-[13px] font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Hostels
        </Link>
      </div>

      {/* Hero Card */}
      <div className="bg-white rounded-[16px] border border-border shadow-[0_8px_30px_rgba(15,23,42,0.02)] p-4 md:p-5 flex flex-col md:flex-row items-center gap-5">
        {/* Left Icon */}
        <div className="w-[64px] h-[64px] rounded-[14px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Building2 size={30} strokeWidth={1.5} />
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-[32px] font-bold text-slate-900 leading-[1.2] mb-3">
            {hostel.hostel_name}
          </h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-[15px] font-medium text-slate-500">
            <span className="inline-flex px-3 py-0.5 bg-primary/10 text-primary rounded-full font-semibold">
              {hostel.hostel_id}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span className="flex items-center gap-1.5">
              <MapPin size={18} className="text-slate-400" />
              {hostel.zone || "Zone 1"}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <HostelStatusBadge status={hostel.status} />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 mt-3 md:mt-0">
          {!isEditMode ? (
            <>
              <button 
                onClick={reload}
                className="w-10 h-10 rounded-[10px] border border-border text-slate-500 hover:bg-slate-50 flex items-center justify-center shadow-sm transition-colors"
              >
                <RefreshCw size={18} />
              </button>
              <button 
                onClick={() => router.push(`/hostel-floors?hostel_id=${hostel.id}`)}
                className="h-10 px-5 rounded-[10px] border border-primary/20 text-primary hover:bg-primary/5 flex items-center justify-center gap-2 font-semibold text-[13px] shadow-sm transition-colors"
              >
                <Layers size={18} />
                View Floors
              </button>
              <button 
                onClick={toggleEditMode}
                className="h-10 px-5 rounded-[10px] bg-primary text-white hover:bg-primary/90 flex items-center justify-center gap-2 font-semibold text-[13px] shadow-sm transition-colors"
              >
                <Edit2 size={18} />
                Edit Details
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={toggleEditMode}
                disabled={isSaving}
                className="h-10 px-5 rounded-[10px] bg-white border border-border text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 font-semibold text-[13px] shadow-sm transition-colors disabled:opacity-50"
              >
                <X size={18} />
                Cancel
              </button>
              <button 
                onClick={saveChanges}
                disabled={isSaving}
                className="h-10 px-5 rounded-[10px] bg-primary text-white hover:bg-primary/90 flex items-center justify-center gap-2 font-semibold text-[13px] shadow-sm transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stats Strip */}
      <div className="bg-white rounded-[16px] border border-border shadow-[0_8px_30px_rgba(15,23,42,0.02)] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
          {/* Stat 1 */}
          <div className="p-4 md:p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-[12px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Activity size={20} />
            </div>
            <div className="flex flex-col">
              <p className="text-[14px] font-semibold text-slate-900 mb-2">Operational Status</p>
              <HostelStatusBadge status={hostel.status} />
            </div>
          </div>

          {/* Stat 2 */}
          <div className="p-4 md:p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-[12px] bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Layers size={20} />
            </div>
            <div className="flex flex-col">
              <p className="text-[14px] font-semibold text-slate-900 mb-1">Registered Floors</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-[32px] font-bold text-slate-900 leading-none">
                  {hostel.number_of_floors || 0}
                </h3>
                <span className="text-[15px] text-slate-500 font-medium">Floors</span>
              </div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="p-4 md:p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-[12px] bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <Home size={20} />
            </div>
            <div className="flex flex-col">
              <p className="text-[14px] font-semibold text-slate-900 mb-1">Total Rooms</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-[32px] font-bold text-slate-900 leading-none">
                  {totalRooms}
                </h3>
                <span className="text-[15px] text-slate-500 font-medium">Room{totalRooms !== 1 && 's'}</span>
              </div>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="p-4 md:p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-[12px] bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <BedDouble size={20} />
            </div>
            <div className="flex flex-col">
              <p className="text-[14px] font-semibold text-slate-900 mb-1">Total Bed Capacity</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-[32px] font-bold text-slate-900 leading-none">
                  {totalCapacity}
                </h3>
                <span className="text-[15px] text-slate-500 font-medium">Beds</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area - 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Information Card */}
        <div className="lg:col-span-7 bg-white rounded-[16px] border border-border shadow-[0_8px_30px_rgba(15,23,42,0.02)] overflow-hidden flex flex-col">
          {/* Card Header */}
          <div className="p-4 md:p-5 flex items-center gap-4 border-b border-border/60">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Info size={20} strokeWidth={2.5} />
            </div>
            <h2 className="text-[22px] font-bold text-slate-900">{isEditMode ? "Edit Hostel Information" : "Hostel Information"}</h2>
          </div>

          {isEditMode ? (
            <div className="p-4 md:p-5">
              <HostelDetailsForm
                hostel={hostel}
                isEditMode={isEditMode}
                formData={formData}
                formErrors={formErrors}
                onInputChange={handleInputChange}
              />
            </div>
          ) : (
            <div className="p-4 md:p-5 flex flex-col gap-6">
              <div className="rounded-[12px] border border-border/80 divide-y divide-border/80 overflow-hidden">
                <div className="bg-slate-50/50 px-4 py-3 border-b border-border/80">
                  <h3 className="text-[16px] font-semibold text-primary">General Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 p-4 gap-4 md:gap-6 items-center hover:bg-slate-50/30 transition-colors">
                  <span className="text-[14px] font-medium text-slate-500">Hostel Identifier (Code)</span>
                  <span className="text-[16px] font-semibold text-slate-900">{hostel.hostel_id}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 p-4 gap-4 md:gap-6 items-center hover:bg-slate-50/30 transition-colors">
                  <span className="text-[14px] font-medium text-slate-500">Zone Location</span>
                  <span className="text-[16px] font-semibold text-slate-900">{hostel.zone || "N/A"}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 p-4 gap-4 md:gap-6 items-center hover:bg-slate-50/30 transition-colors">
                  <span className="text-[14px] font-medium text-slate-500">Number of Floors</span>
                  <span className="text-[16px] font-semibold text-slate-900">{hostel.number_of_floors || 0} Floors Registered</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 p-4 gap-4 md:gap-6 items-center hover:bg-slate-50/30 transition-colors">
                  <span className="text-[14px] font-medium text-slate-500">Operational Status</span>
                  <div>
                    <HostelStatusBadge status={hostel.status} />
                  </div>
                </div>

                <div className="bg-slate-50/50 px-4 py-3 border-y border-border/80 mt-2">
                  <h3 className="text-[16px] font-semibold text-primary">Contact Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 p-4 gap-4 md:gap-6 items-center hover:bg-slate-50/30 transition-colors">
                  <span className="text-[14px] font-medium text-slate-500">Authorized Representative</span>
                  <span className="text-[16px] font-semibold text-slate-900">{hostel.auth_person_name || "N/A"}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 p-4 gap-4 md:gap-6 items-center hover:bg-slate-50/30 transition-colors">
                  <span className="text-[14px] font-medium text-slate-500">Direct Contact Number</span>
                  <span className="text-[16px] font-semibold text-slate-900">{hostel.contact || "N/A"}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Floor Allocation */}
        <div className="lg:col-span-5 bg-white rounded-[16px] border border-border shadow-[0_8px_30px_rgba(15,23,42,0.02)] overflow-hidden flex flex-col">
          {/* Card Header */}
          <div className="p-4 md:p-5 flex flex-col gap-2 border-b border-border/60">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Layers size={20} strokeWidth={2.5} />
              </div>
              <h2 className="text-[22px] font-bold text-slate-900">Floor Allocation</h2>
            </div>
            <p className="text-[14px] font-medium text-slate-500 pl-[56px]">
              Breakdown of rooms mapped inside this hostel.
            </p>
          </div>

          <div className="p-4 md:p-5">
            <HostelFloorsTable floors={floors} hostel={hostel} />
          </div>
        </div>
      </div>
    </div>
  );
};
