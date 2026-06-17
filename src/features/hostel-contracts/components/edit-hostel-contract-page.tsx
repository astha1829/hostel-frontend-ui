"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FileText, Building2, Users, CheckCircle2, ChevronLeft, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useHostelContractDetails } from "../hooks/use-hostel-contract-details";
import { DetailFormSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import Link from "next/link";

export const EditHostelContractPage = ({ id }: { id: string }) => {
  const router = useRouter();
  const {
    contract,
    hostels,
    students,
    isLoading,
    isSaving,
    error,
    formData,
    formErrors,
    handleInputChange,
    saveChanges,
    reload,
  } = useHostelContractDetails(id, true);

  if (isLoading) {
    return <DetailFormSkeleton />;
  }

  if (error || !contract) {
    return (
      <ErrorState
        title="Failed to Load Contract"
        message={error || "Contract not found."}
        onRetry={reload}
        isLoading={isLoading}
      />
    );
  }

  const hostelOptions = hostels.map((h) => ({
    label: h.hostel_name,
    value: h.id,
  }));

  const studentOptions = students.map((s) => ({
    label: `${s.student_name} ${s.last_name || ""}`.trim(),
    value: s.id,
  }));

  const formatDateLabel = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const isConfirmed = contract.confirm_status?.toLowerCase() === "confirmed";

  return (
    <div className="w-full max-w-none px-6 lg:px-8 pt-[28px] pb-[24px] font-['Inter']">
      
      {/* Top Header Section */}
      <div className="flex justify-between items-start mb-[16px]">
        <div className="flex flex-col">
          <Link href="/hostel-contracts" className="flex items-center text-[14px] font-[500] text-[#64748B] hover:text-[#0F172A] mb-4">
            <ChevronLeft size={16} className="mr-1" />
            Back to Contracts
          </Link>
          <h1 className="text-[48px] font-[800] text-[#0F172A] leading-none mb-3">
            Edit Contract <span className="text-[#6D4AFF]">#{contract.contract_no}</span>
          </h1>
          <p className="text-[18px] font-[400] text-[#64748B] m-0">
            Modify residential lease parameters and billing records.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/hostel-contracts")}
            disabled={isSaving}
            className="h-[52px] px-6 rounded-[12px] border border-[#E2E8F0] bg-white text-[15px] font-[600] text-[#334155] hover:bg-[#F8FAFC] transition-colors flex items-center gap-2"
          >
            Cancel
          </button>
          <button
            onClick={saveChanges}
            disabled={isSaving}
            className="h-[52px] px-6 rounded-[12px] bg-gradient-to-r from-[#6D4AFF] to-[#5B3DF5] text-white text-[15px] font-[600] shadow-[0_8px_20px_rgba(109,74,255,0.25)] hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <FileText size={18} />
            {isSaving ? "Saving..." : "Save Contract"}
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="h-[120px] bg-white rounded-[20px] border border-[#EEF2F7] mb-[16px] px-[32px] flex items-center shadow-sm">
        <div className="grid grid-cols-4 w-full divide-x divide-[#EEF2F7]">
          
          <div className="flex items-center gap-4 px-6 first:pl-0">
            <div className="w-[56px] h-[56px] rounded-[14px] bg-[#F7F5FF] flex items-center justify-center text-[#6D4AFF]">
              <Users size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-[500] text-[#64748B] mb-1">Student</span>
              <span className="text-[16px] font-[700] text-[#0F172A] leading-tight truncate max-w-[200px]">
                {contract.student_name ? contract.student_name.split("-")[0] : "Unlinked"}
              </span>
              <span className="text-[12px] font-[500] text-[#94A3B8] mt-0.5">
                {contract.student_name ? contract.student_name.split("-")[1] : ""}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 px-6">
            <div className="w-[56px] h-[56px] rounded-[14px] bg-[#F7F5FF] flex items-center justify-center text-[#6D4AFF]">
              <Building2 size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-[500] text-[#64748B] mb-1">Hostel</span>
              <span className="text-[16px] font-[700] text-[#0F172A] leading-tight truncate max-w-[200px]">
                {contract.hostel_name || "Unassigned"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 px-6">
            <div className="w-[56px] h-[56px] rounded-[14px] bg-[#F7F5FF] flex items-center justify-center text-[#6D4AFF]">
              <Users size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-[500] text-[#64748B] mb-1">Sharing Type</span>
              <span className="text-[16px] font-[700] text-[#0F172A] leading-tight">
                {contract.sharing ? `${contract.sharing} Sharing` : "Single"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 px-6">
            <div className="w-[56px] h-[56px] rounded-[14px] bg-[#F0FDF4] flex items-center justify-center text-[#16A34A]">
              <CheckCircle2 size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-[500] text-[#64748B] mb-1">Status</span>
              <div className="flex items-center gap-2">
                <span className={`text-[16px] font-[700] ${contract.status?.toLowerCase() === 'active' ? 'text-[#16A34A]' : 'text-[#0F172A]'}`}>
                  {contract.status || "Active"}
                </span>
                <span className="text-[#94A3B8]">•</span>
                <span className={`text-[16px] font-[700] ${isConfirmed ? 'text-[#16A34A]' : 'text-[#EA580C]'}`}>
                  {contract.confirm_status || "Confirmed"}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-2 gap-[16px]">
        
        {/* Card 1: Contract Basics */}
        <div className="bg-white rounded-[20px] border border-[#EEF2F7] p-[24px]">
          <div className="flex items-center gap-3 mb-[16px]">
            <div className="w-[40px] h-[44px] rounded-[10px] bg-[#6D4AFF] flex items-center justify-center text-white">
              <FileText size={20} />
            </div>
            <h2 className="text-[20px] font-[700] text-[#0F172A]">Contract Basics</h2>
          </div>
          <div className="grid grid-cols-2 gap-y-[20px] gap-x-[20px]">
            <div className="col-span-2 grid grid-cols-3 gap-[20px]">
              <Input
                label="Contract Number *"
                value={formData.contract_no || ""}
                onChange={(e) => handleInputChange("contract_no", e.target.value)}
                error={formErrors.contract_no}
                disabled={isSaving}
                className="h-[52px] rounded-[12px] border-[#E2E8F0] focus:border-[#6D4AFF] focus:ring-[#6D4AFF] text-[15px] font-[500]"
                labelClassName="text-[14px] font-[600] text-[#334155] mb-2"
              />
              <Select
                label="Contract Type *"
                value={formData.contract_type || ""}
                onChange={(e) => handleInputChange("contract_type", e.target.value)}
                error={formErrors.contract_type}
                options={[
                  { label: "Regular", value: "Regular" },
                  { label: "2 Sharing", value: "2 Sharing" },
                  { label: "3 Sharing", value: "3 Sharing" },
                ]}
                disabled={isSaving}
                className="h-[52px] rounded-[12px] border-[#E2E8F0] focus:border-[#6D4AFF] focus:ring-[#6D4AFF] text-[15px] font-[500]"
                labelClassName="text-[14px] font-[600] text-[#334155] mb-2"
              />
              <Input
                label="Standard Duration (Months)"
                type="number"
                value={formData.standard_duration_months ?? ""}
                onChange={(e) => handleInputChange("standard_duration_months", e.target.value)}
                disabled={isSaving}
                className="h-[52px] rounded-[12px] border-[#E2E8F0] focus:border-[#6D4AFF] focus:ring-[#6D4AFF] text-[15px] font-[500]"
                labelClassName="text-[14px] font-[600] text-[#334155] mb-2"
              />
            </div>
            <Select
              label="Contract Status *"
              value={formData.status || ""}
              onChange={(e) => handleInputChange("status", e.target.value)}
              error={formErrors.status}
              options={[
                { label: "Active", value: "Active" },
                { label: "Expired", value: "Expired" },
                { label: "Break", value: "Break" },
                { label: "Superseded", value: "Superseded" },
              ]}
              disabled={isSaving}
              className="h-[52px] rounded-[12px] border-[#E2E8F0] focus:border-[#6D4AFF] focus:ring-[#6D4AFF] text-[15px] font-[500]"
              labelClassName="text-[14px] font-[600] text-[#334155] mb-2"
            />
            <Select
              label="Confirmation Approval Status *"
              value={formData.confirm_status || ""}
              onChange={(e) => handleInputChange("confirm_status", e.target.value)}
              options={[
                { label: "Confirmed", value: "Confirmed" },
                { label: "Pending", value: "Pending" },
                { label: "Rejected", value: "Rejected" },
              ]}
              disabled={isSaving}
              className="h-[52px] rounded-[12px] border-[#E2E8F0] focus:border-[#6D4AFF] focus:ring-[#6D4AFF] text-[15px] font-[500]"
              labelClassName="text-[14px] font-[600] text-[#334155] mb-2"
            />
          </div>
        </div>

        {/* Card 2: Timeline Schedule */}
        <div className="bg-white rounded-[20px] border border-[#EEF2F7] p-[24px]">
          <div className="flex items-center gap-3 mb-[16px]">
            <div className="w-[40px] h-[44px] rounded-[10px] bg-[#6D4AFF] flex items-center justify-center text-white">
              <Calendar size={20} />
            </div>
            <h2 className="text-[20px] font-[700] text-[#0F172A]">Timeline Schedule</h2>
          </div>
          <div className="grid grid-cols-2 gap-y-[20px] gap-x-[20px]">
            <Input
              label="Contract Start Date *"
              type="date"
              value={formData.contract_start_date ? formData.contract_start_date.split('T')[0] : ""}
              onChange={(e) => handleInputChange("contract_start_date", e.target.value)}
              error={formErrors.contract_start_date}
              disabled={isSaving}
              className="h-[52px] rounded-[12px] border-[#E2E8F0] focus:border-[#6D4AFF] focus:ring-[#6D4AFF] text-[15px] font-[500]"
              labelClassName="text-[14px] font-[600] text-[#334155] mb-2"
            />
            <Input
              label="Contract End Date *"
              type="date"
              value={formData.contract_end_date ? formData.contract_end_date.split('T')[0] : ""}
              onChange={(e) => handleInputChange("contract_end_date", e.target.value)}
              error={formErrors.contract_end_date}
              disabled={isSaving}
              className="h-[52px] rounded-[12px] border-[#E2E8F0] focus:border-[#6D4AFF] focus:ring-[#6D4AFF] text-[15px] font-[500]"
              labelClassName="text-[14px] font-[600] text-[#334155] mb-2"
            />
            <Input
              label="Expected Arrival Date *"
              type="date"
              value={formData.arrival_date ? formData.arrival_date.split('T')[0] : ""}
              onChange={(e) => handleInputChange("arrival_date", e.target.value)}
              disabled={isSaving}
              className="h-[52px] rounded-[12px] border-[#E2E8F0] focus:border-[#6D4AFF] focus:ring-[#6D4AFF] text-[15px] font-[500]"
              labelClassName="text-[14px] font-[600] text-[#334155] mb-2"
            />
            
            {/* Timeline Visualization */}
            <div className="flex flex-col justify-end pb-2 pl-4">
              <div className="relative flex items-center justify-between w-full mt-6">
                <div className="absolute top-[5px] left-0 right-0 h-[2px] bg-[#E2E8F0] z-0"></div>
                
                <div className="flex flex-col items-center z-10 relative">
                  <div className="w-[12px] h-[12px] rounded-full bg-[#16A34A] ring-4 ring-white"></div>
                  <span className="text-[12px] font-[500] text-[#64748B] mt-2 mb-0.5">Start Date</span>
                  <span className="form-label">{formatDateLabel(formData.contract_start_date)}</span>
                </div>
                
                <div className="flex flex-col items-center z-10 relative">
                  <div className="w-[12px] h-[12px] rounded-full bg-[#6D4AFF] ring-4 ring-white"></div>
                  <span className="text-[12px] font-[500] text-[#64748B] mt-2 mb-0.5">Expected Arrival</span>
                  <span className="form-label">{formatDateLabel(formData.arrival_date)}</span>
                </div>
                
                <div className="flex flex-col items-center z-10 relative">
                  <div className="w-[12px] h-[12px] rounded-full bg-[#EF4444] ring-4 ring-white"></div>
                  <span className="text-[12px] font-[500] text-[#64748B] mt-2 mb-0.5">End Date</span>
                  <span className="form-label">{formatDateLabel(formData.contract_end_date)}</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Card 3: Student & Hostel */}
        <div className="bg-white rounded-[20px] border border-[#EEF2F7] p-[24px]">
          <div className="flex items-center gap-3 mb-[16px]">
            <div className="w-[40px] h-[44px] rounded-[10px] bg-[#6D4AFF] flex items-center justify-center text-white">
              <Users size={20} />
            </div>
            <h2 className="text-[20px] font-[700] text-[#0F172A]">Student & Hostel Associations</h2>
          </div>
          <div className="grid grid-cols-2 gap-x-[20px]">
            <Select
              label="Assigned Hostel *"
              value={formData.hostel_id || ""}
              onChange={(e) => handleInputChange("hostel_id", e.target.value)}
              error={formErrors.hostel_id}
              options={hostelOptions}
              disabled={isSaving}
              className="h-[52px] rounded-[12px] border-[#E2E8F0] focus:border-[#6D4AFF] focus:ring-[#6D4AFF] text-[15px] font-[500]"
              labelClassName="text-[14px] font-[600] text-[#334155] mb-2"
            />
            <Select
              label="Registered Student *"
              value={formData.student_id || ""}
              onChange={(e) => handleInputChange("student_id", e.target.value)}
              error={formErrors.student_id}
              options={studentOptions}
              disabled={isSaving}
              className="h-[52px] rounded-[12px] border-[#E2E8F0] focus:border-[#6D4AFF] focus:ring-[#6D4AFF] text-[15px] font-[500]"
              labelClassName="text-[14px] font-[600] text-[#334155] mb-2"
            />
          </div>
        </div>

        {/* Card 4: Financials */}
        <div className="bg-white rounded-[20px] border border-[#EEF2F7] p-[24px]">
          <div className="flex items-center gap-3 mb-[16px]">
            <div className="w-[40px] h-[44px] rounded-[10px] bg-[#6D4AFF] flex items-center justify-center text-white">
              <FileText size={20} />
            </div>
            <h2 className="text-[20px] font-[700] text-[#0F172A]">Financials & Room Sharing Terms</h2>
          </div>
          <div className="grid grid-cols-2 gap-y-[20px] gap-x-[20px]">
            <Select
              label="Sharing Mode *"
              value={formData.sharing || ""}
              onChange={(e) => handleInputChange("sharing", e.target.value)}
              options={[
                { label: "Single Room", value: "Single" },
                { label: "Double Room Sharing", value: "Double" },
                { label: "Triple Room Sharing", value: "Triple" },
                { label: "Quadruple Room Sharing", value: "Quadruple" },
              ]}
              disabled={isSaving}
              className="h-[52px] rounded-[12px] border-[#E2E8F0] focus:border-[#6D4AFF] focus:ring-[#6D4AFF] text-[15px] font-[500]"
              labelClassName="text-[14px] font-[600] text-[#334155] mb-2"
            />
            <Input
              label="Contract Price ($) *"
              type="number"
              value={formData.contract_price ?? ""}
              onChange={(e) => handleInputChange("contract_price", e.target.value)}
              disabled={isSaving}
              className="h-[52px] rounded-[12px] border-[#E2E8F0] focus:border-[#6D4AFF] focus:ring-[#6D4AFF] text-[15px] font-[500]"
              labelClassName="text-[14px] font-[600] text-[#334155] mb-2"
            />
            <div className="col-span-2 pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-[20px] h-[20px]">
                  <input
                    type="checkbox"
                    checked={!!formData.is_submitted}
                    onChange={(e) => handleInputChange("is_submitted", e.target.checked)}
                    disabled={isSaving}
                    className="peer appearance-none w-[20px] h-[20px] border-2 border-[#E2E8F0] rounded-[6px] checked:bg-[#6D4AFF] checked:border-[#6D4AFF] cursor-pointer transition-all"
                  />
                  <CheckCircle2 size={14} className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                </div>
                <span className="text-[14px] font-[600] text-[#0F172A] select-none group-hover:text-[#6D4AFF] transition-colors">Flag as Submitted</span>
              </label>
              <p className="text-[13px] font-[400] text-[#64748B] ml-[32px] mt-1">
                Contract marked as submitted and ready for processing.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
