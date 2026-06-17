"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Send, Check, Building2, User, FileText, Calendar, DollarSign, Activity, AlertCircle, FileBadge, CheckCircle2 } from "lucide-react";
import { useHostelContractForm } from "../hooks/use-hostel-contract-form";
import { showCancelConfirm } from "@/utils/swal";

export const HostelContractFormPage: React.FC = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);

  const handleSuccess = (contractId: string) => {
    router.push(`/hostel-contracts/${contractId}`);
  };

  const handleCancel = () => {
    router.push("/hostel-contracts");
  };

  const {
    formData,
    hostels,
    students,
    isLoadingOptions,
    fieldErrors,
    apiError,
    isSubmitting,
    handleInputChange,
    handleSubmit,
  } = useHostelContractForm({ onSuccess: handleSuccess, onCancel: handleCancel });

  const handleCancelClick = async () => {
    const isDirty =
      formData.contract_no !== "" ||
      formData.contract_type !== "Regular" ||
      formData.standard_duration_months !== 12 ||
      formData.status !== "Active" ||
      formData.sharing !== "Single" ||
      formData.contract_price !== 500;

    if (isDirty) {
      const result = await showCancelConfirm();
      if (!result.isConfirmed) return;
    }
    handleCancel();
  };

  const steps = [
    { num: 1, title: "Contract Details", sub: "Basic information" },
    { num: 2, title: "Student & Hostel", sub: "Link associations" },
    { num: 3, title: "Timeline", sub: "Contract schedule" },
    { num: 4, title: "Pricing", sub: "Amounts & terms" },
    { num: 5, title: "Review", sub: "Confirm & submit" },
  ];

  const calculateDays = (start?: string, end?: string) => {
    if (!start || !end) return 0;
    const diffTime = Math.abs(new Date(end).getTime() - new Date(start).getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysDuration = calculateDays(formData.contract_start_date, formData.contract_end_date);
  const selectedStudent = students.find(s => s.id === formData.student_id);
  const selectedHostel = hostels.find(h => h.id === formData.hostel_id);

  return (
    <form onSubmit={handleSubmit} className="w-full min-h-screen bg-[#F7F8FC] font-inter px-[24px] py-[24px] flex flex-col gap-[16px]">
      
      {/* HEADER SECTION */}
      <div className="w-full flex justify-between items-start">
        <div className="flex flex-col gap-[8px]">
          <button 
            type="button" 
            onClick={handleCancelClick}
            className="flex items-center gap-[6px] text-[#5B3DF5] font-[600] text-[14px] hover:underline"
          >
            <ArrowLeft size={16} /> Back to Contracts
          </button>
          <div className="flex flex-col mt-[4px]">
            <h1 className="text-[48px] font-[700] text-[#111827] leading-tight tracking-tight">Add Contract</h1>
            <p className="page-subtitle mt-[2px]">
              Register a new lease contract, select resident student, select target hostel, set pricing details.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-[12px] pt-[32px]">
          <button 
            type="button"
            className="h-[44px] px-[16px] rounded-[10px] bg-[#FFFFFF] border border-[#EAECEF] text-[#111827] font-[600] text-[14px] shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex items-center justify-center gap-2 hover:bg-[#F8FAFC] transition-all"
            disabled={isSubmitting}
          >
            <Save size={16} strokeWidth={2} />
            Save Draft
          </button>
          <button 
            type="submit"
            className="btn-top-action"
            disabled={isSubmitting}
          >
            <Send size={16} strokeWidth={2} />
            Submit for Approval
          </button>
        </div>
      </div>

      {/* ERROR BANNER */}
      {apiError && (
        <div className="w-full p-[16px] bg-[#FEF2F2] border border-[#FECACA] rounded-[10px] flex items-start gap-[12px]">
          <AlertCircle className="text-[#EF4444] shrink-0 mt-[2px]" size={18} />
          <div className="flex flex-col">
            <span className="text-[#991B1B] font-[600] text-[14px]">Contract Registration Failed</span>
            <span className="text-[#B91C1C] font-[400] text-[14px] mt-[2px]">{apiError}</span>
          </div>
        </div>
      )}

      {/* STEPPER */}
      <div className="w-full h-[72px] bg-[#FFFFFF] rounded-[16px] border border-[#EAECEF] shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex overflow-hidden">
        {steps.map((step, idx) => {
          const isActive = activeStep === step.num;
          return (
            <div key={step.num} className="flex-1 relative flex items-center px-[24px] cursor-pointer" onClick={() => setActiveStep(step.num)}>
              <div className="flex items-center gap-[16px] z-10 w-full">
                <div className={`w-[32px] h-[32px] rounded-full flex items-center justify-center text-[14px] font-[600] shrink-0 transition-colors ${isActive ? 'bg-[#5B3DF5] text-white' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
                  {step.num}
                </div>
                <div className="flex flex-col justify-center">
                  <span className={`text-[14px] font-[600] leading-tight ${isActive ? 'text-[#111827]' : 'text-[#64748B]'}`}>{step.title}</span>
                  <span className="text-[12px] font-[500] text-[#94A3B8] leading-tight mt-[2px]">{step.sub}</span>
                </div>
              </div>
              {isActive && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#5B3DF5]"></div>}
              {idx < steps.length - 1 && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-[44px] bg-[#EAECEF]"></div>}
            </div>
          );
        })}
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="w-full flex flex-col lg:flex-row gap-[20px] mt-[4px]">
        
        {/* LEFT COLUMN (75%) */}
        <div className="flex-[3] flex flex-col gap-[20px]">
          
          {/* SECTION 1 */}
          <div className="w-full bg-[#FFFFFF] rounded-[16px] border border-[#EAECEF] shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-[24px] flex flex-col">
            <div className="flex items-center gap-[16px] mb-[16px]">
              <div className="w-[48px] h-[44px] rounded-[12px] bg-[#F4F1FF] text-[#5B3DF5] flex items-center justify-center shrink-0">
                <FileBadge size={24} strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <h2 className="text-[20px] font-[600] text-[#111827] leading-tight">Contract Basics</h2>
                <p className="page-subtitle mt-[2px]">Identify the contract code, type, standard durations, and validity states.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-[16px]">
              <div className="flex flex-col">
                <div className="min-h-[44px] flex items-start">
                  <label className="status-badge text-[#64748B] uppercase tracking-wide">CONTRACT NUMBER <span className="text-[#EF4444]">*</span></label>
                </div>
                <input type="text" placeholder="e.g. CON-10045" value={formData.contract_no} onChange={(e) => handleInputChange("contract_no", e.target.value)} disabled={isSubmitting} className="w-full h-[44px] px-[16px] rounded-[10px] border border-[#EAECEF] bg-[#FFFFFF] body-text-primary placeholder-[#94A3B8] focus:outline-none focus:border-[#5B3DF5]" />
              </div>
              <div className="flex flex-col">
                <div className="min-h-[44px] flex items-start">
                  <label className="status-badge text-[#64748B] uppercase tracking-wide">CONTRACT TYPE <span className="text-[#EF4444]">*</span></label>
                </div>
                <div className="relative">
                  <select value={formData.contract_type} onChange={(e) => handleInputChange("contract_type", e.target.value)} disabled={isSubmitting} className="w-full h-[44px] px-[16px] pr-[32px] rounded-[10px] border border-[#EAECEF] bg-[#FFFFFF] body-text-primary appearance-none focus:outline-none focus:border-[#5B3DF5]">
                    <option value="Regular">Regular</option>
                    <option value="Scholar">Scholar</option>
                    <option value="Staff">Staff</option>
                  </select>
                  <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="min-h-[44px] flex items-start">
                  <label className="status-badge text-[#64748B] uppercase tracking-wide">STANDARD DURATION (MONTHS) <span className="text-[#EF4444]">*</span></label>
                </div>
                <input type="number" placeholder="12" value={formData.standard_duration_months ?? ""} onChange={(e) => handleInputChange("standard_duration_months", e.target.value)} disabled={isSubmitting} className="w-full h-[44px] px-[16px] rounded-[10px] border border-[#EAECEF] bg-[#FFFFFF] body-text-primary placeholder-[#94A3B8] focus:outline-none focus:border-[#5B3DF5]" />
              </div>
              <div className="flex flex-col">
                <div className="min-h-[44px] flex items-start">
                  <label className="status-badge text-[#64748B] uppercase tracking-wide">CONTRACT STATUS <span className="text-[#EF4444]">*</span></label>
                </div>
                <div className="relative">
                  <select value={formData.status} onChange={(e) => handleInputChange("status", e.target.value)} disabled={isSubmitting} className="w-full h-[44px] px-[16px] pr-[32px] rounded-[10px] border border-[#EAECEF] bg-[#FFFFFF] body-text-primary appearance-none focus:outline-none focus:border-[#5B3DF5]">
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Expired">Expired</option>
                    <option value="Break">Break</option>
                  </select>
                  <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="min-h-[44px] flex items-start">
                  <label className="status-badge text-[#64748B] uppercase tracking-wide">CONFIRMATION APPROVAL STATUS</label>
                </div>
                <div className="relative">
                  <select value={formData.confirm_status || "Pending"} onChange={(e) => handleInputChange("confirm_status", e.target.value)} disabled={isSubmitting} className="w-full h-[44px] px-[16px] pr-[32px] rounded-[10px] border border-[#EAECEF] bg-[#FFFFFF] body-text-primary appearance-none focus:outline-none focus:border-[#5B3DF5]">
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2 */}
          <div className="w-full bg-[#FFFFFF] rounded-[16px] border border-[#EAECEF] shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-[24px] flex flex-col">
            <div className="flex items-center gap-[16px] mb-[16px]">
              <div className="w-[48px] h-[44px] rounded-[12px] bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
                <Building2 size={24} strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <h2 className="text-[20px] font-[600] text-[#111827] leading-tight">Student & Hostel Associations</h2>
                <p className="page-subtitle mt-[2px]">Link contract parameters to hostels and registered students.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              <div className="flex flex-col gap-[8px]">
                <label className="status-badge text-[#64748B] uppercase tracking-wide">ASSIGNED HOSTEL <span className="text-[#EF4444]">*</span></label>
                <div className="relative">
                  <select value={formData.hostel_id} onChange={(e) => handleInputChange("hostel_id", e.target.value)} disabled={isSubmitting || isLoadingOptions} className="w-full h-[44px] px-[16px] pr-[32px] rounded-[10px] border border-[#EAECEF] bg-[#FFFFFF] body-text-primary appearance-none focus:outline-none focus:border-[#5B3DF5]">
                    <option value="">Select Hostel...</option>
                    {hostels.map(h => <option key={h.id} value={h.id}>{h.hostel_name}</option>)}
                  </select>
                  <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-[8px]">
                <label className="status-badge text-[#64748B] uppercase tracking-wide">REGISTERED STUDENT <span className="text-[#EF4444]">*</span></label>
                <div className="relative">
                  <select value={formData.student_id} onChange={(e) => handleInputChange("student_id", e.target.value)} disabled={isSubmitting || isLoadingOptions} className="w-full h-[44px] px-[16px] pr-[32px] rounded-[10px] border border-[#EAECEF] bg-[#FFFFFF] body-text-primary appearance-none focus:outline-none focus:border-[#5B3DF5]">
                    <option value="">Select Student...</option>
                    {students.map(s => <option key={s.id} value={s.id}>{`${s.student_name} ${s.last_name || ""}`.trim()}</option>)}
                  </select>
                  <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3 */}
          <div className="w-full bg-[#FFFFFF] rounded-[16px] border border-[#EAECEF] shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-[24px] flex flex-col">
            <div className="flex items-center gap-[16px] mb-[16px]">
              <div className="w-[48px] h-[44px] rounded-[12px] bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center shrink-0">
                <Calendar size={24} strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <h2 className="text-[20px] font-[600] text-[#111827] leading-tight">Timeline Schedule</h2>
                <p className="page-subtitle mt-[2px]">Record lease calendar dates and expected resident arrival times.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-[16px] items-end">
              <div className="flex flex-col gap-[8px]">
                <label className="status-badge text-[#64748B] uppercase tracking-wide">CONTRACT START DATE <span className="text-[#EF4444]">*</span></label>
                <div className="relative">
                  <input type="date" value={formData.contract_start_date} onChange={(e) => handleInputChange("contract_start_date", e.target.value)} disabled={isSubmitting} className="w-full h-[44px] px-[16px] rounded-[10px] border border-[#EAECEF] bg-[#FFFFFF] body-text-primary focus:outline-none focus:border-[#5B3DF5]" />
                </div>
              </div>
              <div className="flex flex-col gap-[8px]">
                <label className="status-badge text-[#64748B] uppercase tracking-wide">CONTRACT END DATE <span className="text-[#EF4444]">*</span></label>
                <div className="relative">
                  <input type="date" value={formData.contract_end_date || ""} onChange={(e) => handleInputChange("contract_end_date", e.target.value)} disabled={isSubmitting} className="w-full h-[44px] px-[16px] rounded-[10px] border border-[#EAECEF] bg-[#FFFFFF] body-text-primary focus:outline-none focus:border-[#5B3DF5]" />
                </div>
              </div>
              <div className="flex flex-col gap-[8px]">
                <label className="status-badge text-[#64748B] uppercase tracking-wide">EXPECTED ARRIVAL DATE</label>
                <div className="relative">
                  <input type="date" value={formData.arrival_date || ""} onChange={(e) => handleInputChange("arrival_date", e.target.value)} disabled={isSubmitting} className="w-full h-[44px] px-[16px] rounded-[10px] border border-[#EAECEF] bg-[#FFFFFF] body-text-primary focus:outline-none focus:border-[#5B3DF5]" />
                </div>
              </div>
              <div className="flex flex-col gap-[8px]">
                <label className="status-badge text-[#64748B] uppercase tracking-wide">DURATION PREVIEW</label>
                <div className="w-full h-[44px] px-[16px] rounded-[10px] bg-[#F4F1FF] flex items-center justify-center text-[14px] font-[600]">
                  <span className="text-[#5B3DF5]">{formData.standard_duration_months || 0} Months</span>
                  <span className="text-[#5B3DF5] mx-2">•</span>
                  <span className="text-[#111827]">{daysDuration} Days</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4 */}
          <div className="w-full bg-[#FFFFFF] rounded-[16px] border border-[#EAECEF] shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-[24px] flex flex-col">
            <div className="flex items-center gap-[16px] mb-[16px]">
              <div className="w-[48px] h-[44px] rounded-[12px] bg-[#F4F1FF] text-[#5B3DF5] flex items-center justify-center shrink-0">
                <DollarSign size={24} strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <h2 className="text-[20px] font-[600] text-[#111827] leading-tight">Pricing & Occupancy</h2>
                <p className="page-subtitle mt-[2px]">Define roommate sharing settings, price records, and submission status.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
              <div className="flex flex-col gap-[8px]">
                <label className="status-badge text-[#64748B] uppercase tracking-wide">SHARING MODE</label>
                <div className="relative">
                  <select value={formData.sharing || ""} onChange={(e) => handleInputChange("sharing", e.target.value)} disabled={isSubmitting} className="w-full h-[44px] px-[16px] pr-[32px] rounded-[10px] border border-[#EAECEF] bg-[#FFFFFF] body-text-primary appearance-none focus:outline-none focus:border-[#5B3DF5]">
                    <option value="Single Room">Single Room</option>
                    <option value="Double Sharing">Double Sharing</option>
                    <option value="Triple Sharing">Triple Sharing</option>
                  </select>
                  <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-[8px]">
                <label className="status-badge text-[#64748B] uppercase tracking-wide">CONTRACT PRICE ($) <span className="text-[#EF4444]">*</span></label>
                <input type="number" placeholder="500.00" value={formData.contract_price ?? ""} onChange={(e) => handleInputChange("contract_price", e.target.value)} disabled={isSubmitting} className="w-full h-[44px] px-[16px] rounded-[10px] border border-[#EAECEF] bg-[#FFFFFF] body-text-primary placeholder-[#94A3B8] focus:outline-none focus:border-[#5B3DF5]" />
              </div>
              <div className="flex flex-col gap-[8px]">
                <label className="status-badge text-[#64748B] uppercase tracking-wide">SUBMISSION STATUS <span className="text-[#EF4444]">*</span></label>
                <div className="flex items-center h-[44px] gap-[16px]">
                  <label className="flex items-center gap-[8px] cursor-pointer group">
                    <div className={`w-[16px] h-[16px] rounded-full border-2 flex items-center justify-center transition-colors ${!formData.is_submitted ? 'border-[#EAECEF] bg-white' : 'border-[#5B3DF5]'}`}>
                      {!formData.is_submitted && <div className="w-[8px] h-[8px] rounded-full bg-transparent group-hover:bg-[#EAECEF] transition-colors"></div>}
                    </div>
                    <span className="body-text-primary">Draft</span>
                    <input type="radio" checked={!formData.is_submitted} onChange={() => handleInputChange("is_submitted", false)} className="hidden" />
                  </label>
                  <label className="flex items-center gap-[8px] cursor-pointer group">
                    <div className={`w-[16px] h-[16px] rounded-full border-2 flex items-center justify-center transition-colors ${formData.is_submitted ? 'border-[#5B3DF5] bg-white' : 'border-[#EAECEF]'}`}>
                      {formData.is_submitted && <div className="w-[8px] h-[8px] rounded-full bg-[#5B3DF5]"></div>}
                    </div>
                    <span className="body-text-primary">Ready for Approval</span>
                    <input type="radio" checked={!!formData.is_submitted} onChange={() => handleInputChange("is_submitted", true)} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (25%) - STICKY SUMMARY CARD */}
        <div className="flex-1 min-w-[320px]">
          <div className="sticky top-[104px] w-full bg-[#FFFFFF] rounded-[16px] border border-[#EAECEF] shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-[24px] flex flex-col gap-[20px]">
            
            <div className="flex items-center gap-[12px]">
              <div className="w-[32px] h-[32px] rounded-[8px] bg-[#F4F1FF] text-[#5B3DF5] flex items-center justify-center shrink-0">
                <FileText size={16} strokeWidth={2} />
              </div>
              <h3 className="text-[18px] font-[600] text-[#111827]">Contract Summary</h3>
            </div>

            <div className="flex flex-col gap-[16px] mt-[4px]">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-[8px] text-[#64748B]">
                  <User size={14} />
                  <span className="text-[13px] font-[500]">Student</span>
                </div>
                <span className="body-text-primary uppercase tracking-tight">{selectedStudent ? `${selectedStudent.student_name} ${selectedStudent.last_name || ""}`.trim() : "—"}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-[8px] text-[#64748B]">
                  <Building2 size={14} />
                  <span className="text-[13px] font-[500]">Hostel</span>
                </div>
                <span className="body-text-primary">{selectedHostel?.hostel_name || "—"}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-[8px] text-[#64748B]">
                  <FileBadge size={14} />
                  <span className="text-[13px] font-[500]">Contract Type</span>
                </div>
                <span className="body-text-primary">{formData.contract_type || "—"}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-[8px] text-[#64748B]">
                  <Calendar size={14} />
                  <span className="text-[13px] font-[500]">Duration</span>
                </div>
                <span className="body-text-primary">{formData.standard_duration_months || 0} Months ({daysDuration} Days)</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-[8px] text-[#64748B]">
                  <Calendar size={14} />
                  <span className="text-[13px] font-[500]">Start Date</span>
                </div>
                <span className="body-text-primary">
                  {formData.contract_start_date ? new Date(formData.contract_start_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : "—"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-[8px] text-[#64748B]">
                  <Calendar size={14} />
                  <span className="text-[13px] font-[500]">End Date</span>
                </div>
                <span className="body-text-primary">
                  {formData.contract_end_date ? new Date(formData.contract_end_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : "—"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-[8px] text-[#64748B]">
                  <User size={14} />
                  <span className="text-[13px] font-[500]">Sharing Mode</span>
                </div>
                <span className="body-text-primary">{formData.sharing || "—"}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-[8px] text-[#64748B]">
                  <DollarSign size={14} />
                  <span className="text-[13px] font-[500]">Price</span>
                </div>
                <span className="body-text-primary">${Number(formData.contract_price || 0).toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-[8px] text-[#64748B]">
                  <CheckCircle2 size={14} />
                  <span className="text-[13px] font-[500]">Status</span>
                </div>
                <div className="inline-flex items-center justify-center h-[24px] px-[10px] rounded-full bg-[#DCFCE7] text-[#16A34A] status-badge">
                  {formData.status || "Active"}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-[8px] text-[#64748B]">
                  <Activity size={14} />
                  <span className="text-[13px] font-[500]">Approval Status</span>
                </div>
                <div className="inline-flex items-center justify-center h-[24px] px-[10px] rounded-full bg-[#FFF7ED] text-[#EA580C] status-badge">
                  {formData.confirm_status || "Pending"}
                </div>
              </div>
            </div>

            <div className="w-full h-[1px] bg-[#EAECEF] mt-[4px]"></div>

            <div className="flex justify-between items-end">
              <span className="text-[14px] font-[600] text-[#64748B]">Total Amount</span>
              <span className="text-[24px] font-[700] text-[#5B3DF5] leading-none">${Number(formData.contract_price || 0).toFixed(2)}</span>
            </div>

          </div>
        </div>

      </div>
    </form>
  );
};
