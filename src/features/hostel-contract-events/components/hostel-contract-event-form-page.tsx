"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, X, Calendar, User, ChevronDown, ChevronUp, ArrowRight, Settings, Link as LinkIcon, RefreshCw, ArrowRightLeft } from "lucide-react";
import { useHostelContractEventForm } from "../hooks/use-hostel-contract-event-form";
import { showCancelConfirm } from "@/utils/swal";

interface HostelContractEventFormPageProps {
  id?: string;
}

export const HostelContractEventFormPage: React.FC<HostelContractEventFormPageProps> = ({ id }) => {
  const router = useRouter();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(true);

  const handleSuccess = (eventId: string) => {
    router.push(`/hostel-contract-events/${eventId}`);
  };

  const handleCancel = () => {
    if (id) {
      router.push(`/hostel-contract-events/${id}`);
    } else {
      router.push("/hostel-contract-events");
    }
  };

  const {
    formData,
    students,
    contracts,
    allotments,
    allotmentPayments,
    isLoadingMetadata,
    isLoadingDetails,
    isSubmitting,
    fieldErrors,
    apiError,
    handleStudentChange,
    handleInputChange,
    handleSubmit,
  } = useHostelContractEventForm({
    id,
    onSuccess: handleSuccess,
    onCancel: handleCancel,
  });

  const handleCancelClick = async () => {
    const isDirty = formData.student_id !== "" || formData.contract_type_before !== "" || formData.contract_type_after !== "";
    if (isDirty) {
      const result = await showCancelConfirm();
      if (!result.isConfirmed) return;
    }
    handleCancel();
  };

  if (isLoadingDetails) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[#64748B] text-[16px] font-[500]">Loading event details...</p>
      </div>
    );
  }

  const studentOptions = [
    { label: "Select Student...", value: "" },
    ...students.map((s) => ({
      label: `${s.student_name} ${s.last_name || ""}`.trim(),
      value: s.id,
    })),
  ];

  const actionTypeOptions = [
    { label: "Create", value: "Create" },
    { label: "Transfer", value: "Transfer" },
    { label: "Amend", value: "Amend" },
    { label: "Extend", value: "Extend" },
    { label: "Cancel", value: "Cancel" },
  ];

  const eventStatusOptions = [
    { label: "Confirmed", value: "Confirmed" },
    { label: "Pending", value: "Pending" },
    { label: "Pending Review", value: "Pending Review" },
    { label: "Approved", value: "Approved" },
    { label: "Completed", value: "Completed" },
    { label: "Cancelled", value: "Cancelled" },
  ];

  const contractOptions = [
    { label: "Select Contract (Optional)...", value: "" },
    ...contracts.map((c) => ({
      label: `${c.contract_no} (${c.contract_type})`,
      value: c.id,
    })),
  ];

  const allotmentOptions = [
    { label: "Select Room Allotment (Optional)...", value: "" },
    ...allotments.map((a) => ({
      label: a.hostel_name ? `${a.hostel_name} - Room ${a.room_no}` : `Room ${a.room_no}`,
      value: a.id,
    })),
  ];

  const allotmentPaymentOptions = [
    { label: "Select Settlement RAP Link (Optional)...", value: "" },
    ...allotmentPayments.map((p) => {
      const code = p.room_allotment_name || `RAP-${p.id.substring(0, 5)}`;
      return {
        label: `${code} - Total: $${Number(p.total_amount).toFixed(2)}`,
        value: p.id,
      };
    }),
  ];

  const student = students.find((s) => s.id === formData.student_id);
  const studentName = student ? `${student.student_name} ${student.last_name || ""}`.trim() : "Shaurya Chovdadia";

  return (
    <div className="w-full max-w-none px-6 py-5 bg-[#F8FAFC] min-h-screen text-[16px] font-[500] text-[#0F172A]" style={{ fontFamily: "'Inter', sans-serif", WebkitFontSmoothing: "antialiased", textRendering: "optimizeLegibility" }}>
      
      {/* HEADER */}
      <button
        type="button"
        onClick={handleCancelClick}
        className="text-[14px] font-[500] text-[#64748B] flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0 mb-4 hover:text-[#0F172A]"
      >
        <ChevronLeft size={16} /> Back to Event Details
      </button>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.05] m-0 mb-2">
            Edit Hostel Contract Event
          </h1>
          <p className="text-[16px] font-[500] text-[#64748B] m-0">
            Modify auditing parameters or transitional logs.
          </p>
        </div>
        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={handleCancelClick}
            disabled={isSubmitting}
            className="h-[44px] px-4 rounded-[10px] border border-[#E2E8F0] bg-white text-[#0F172A] text-[15px] font-[600] flex items-center gap-2 cursor-pointer shadow-sm hover:bg-slate-50"
          >
            <X size={16} /> Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-[44px] px-5 rounded-[10px] bg-[#6D4CFF] text-white text-[15px] font-[600] flex items-center gap-2 cursor-pointer shadow-sm hover:bg-[#5b3df5] border-none"
          >
            <Save size={16} /> {isSubmitting ? "Saving..." : "Save Event"}
          </button>
        </div>
      </div>

      {apiError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-[10px] text-red-600 text-[14px] font-[500] mb-6">
          {apiError}
        </div>
      )}

      {/* SUMMARY INFORMATION CARD */}
      <div className="h-[96px] bg-white border border-[#E2E8F0] rounded-[16px] shadow-sm mb-6 flex items-center">
        <div className="flex-1 border-r border-[#E2E8F0] flex items-center gap-3 px-6 h-12">
          <div className="w-8 h-8 rounded-[8px] bg-[#F4F1FF] text-[#5B3DF5] flex items-center justify-center shrink-0">
            <User size={16} />
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-[500] text-[#64748B] mb-0.5">Student</div>
            <div className="text-[16px] font-[700] text-slate-900 truncate w-full">{studentName}</div>
          </div>
        </div>

        <div className="flex-1 border-r border-[#E2E8F0] flex items-center gap-3 px-6 h-12">
          <div className="w-8 h-8 rounded-[8px] bg-[#F4F1FF] text-[#5B3DF5] flex items-center justify-center shrink-0">
            <ArrowRightLeft size={16} />
          </div>
          <div>
            <div className="text-[13px] font-[500] text-[#64748B] mb-0.5">Event Type</div>
            <div className="text-[16px] font-[700] text-slate-900">{formData.action_type || "Transfer"}</div>
          </div>
        </div>

        <div className="flex-1 border-r border-[#E2E8F0] flex items-center px-6 h-12">
          <div>
            <div className="text-[13px] font-[500] text-[#64748B] mb-0.5">Status</div>
            <div className="flex items-center gap-2 text-[16px] font-[700] text-slate-900">
              <div className={`w-2 h-2 rounded-full ${formData.event_status === 'Completed' || !formData.event_status ? 'bg-green-500' : 'bg-amber-500'}`}></div>
              {formData.event_status || "Completed"}
            </div>
          </div>
        </div>

        <div className="flex-1 border-r border-[#E2E8F0] flex items-center gap-3 px-6 h-12">
          <div className="w-8 h-8 rounded-[8px] bg-[#F4F1FF] text-[#5B3DF5] flex items-center justify-center shrink-0">
            <Settings size={16} />
          </div>
          <div>
            <div className="text-[13px] font-[500] text-[#64748B] mb-0.5">Triggered By</div>
            <div className="text-[16px] font-[700] text-slate-900">{formData.triggered_by || "System Settle"}</div>
          </div>
        </div>

        <div className="flex-1 flex items-center gap-3 pl-6 h-12">
          <div className="w-8 h-8 rounded-[8px] bg-[#F4F1FF] text-[#5B3DF5] flex items-center justify-center shrink-0">
            <Calendar size={16} />
          </div>
          <div>
            <div className="text-[13px] font-[500] text-[#64748B] mb-0.5">Effective Date</div>
            <div className="text-[16px] font-[700] text-slate-900">{formData.effective_date ? new Date(formData.effective_date).toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'}) : "09/01/2026"}</div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-[16px]">
        
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-[16px]">
          
          {/* SECTION 1: Contract Transition */}
          <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm p-[24px]">
            <h2 className="text-[18px] font-[700] text-[#0F172A] mb-[20px]">Contract Transition</h2>
            <div className="flex items-center gap-4">
              <div className="flex-1 flex flex-col gap-[6px]">
                <label className="text-sm font-semibold text-slate-700">Source Contract</label>
                <select
                  value={formData.source_hostel_contract_id || ""}
                  onChange={(e) => handleInputChange("source_hostel_contract_id", e.target.value)}
                  className="h-[44px] rounded-[10px] border border-[#DDE3EC] bg-white px-3 text-base font-medium text-gray-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-100"
                >
                  <option value="">102 (2 Sharing)</option>
                  {contractOptions.map((opt) => opt.value && <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="mt-7 text-[#94A3B8]">
                <ArrowRight size={20} />
              </div>
              <div className="flex-1 flex flex-col gap-[6px]">
                <label className="text-sm font-semibold text-slate-700">Target Contract</label>
                <select
                  value={formData.target_hostel_contract_id || ""}
                  onChange={(e) => handleInputChange("target_hostel_contract_id", e.target.value)}
                  className="h-[44px] rounded-[10px] border border-[#DDE3EC] bg-white px-3 text-base font-medium text-gray-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-100"
                >
                  <option value="">106 (Regular)</option>
                  {contractOptions.map((opt) => opt.value && <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: Room Allotment Transition */}
          <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm p-[24px]">
            <h2 className="text-[18px] font-[700] text-[#0F172A] mb-[20px]">Room Allotment Transition</h2>
            <div className="flex items-center gap-4">
              <div className="flex-1 flex flex-col gap-[6px]">
                <label className="text-sm font-semibold text-slate-700">Source Room Allotment</label>
                <select
                  value={formData.source_room_allotment_id || ""}
                  onChange={(e) => handleInputChange("source_room_allotment_id", e.target.value)}
                  className="h-[44px] rounded-[10px] border border-[#DDE3EC] bg-white px-3 text-base font-medium text-gray-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-100"
                >
                  <option value="">Atmia Alphabet Girl Hostel - Room 105</option>
                  {allotmentOptions.map((opt) => opt.value && <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="mt-7 text-[#94A3B8]">
                <ArrowRight size={20} />
              </div>
              <div className="flex-1 flex flex-col gap-[6px]">
                <label className="text-sm font-semibold text-slate-700">Target Room Allotment</label>
                <select
                  value={formData.target_room_allotment_id || ""}
                  onChange={(e) => handleInputChange("target_room_allotment_id", e.target.value)}
                  className="h-[44px] rounded-[10px] border border-[#DDE3EC] bg-white px-3 text-base font-medium text-gray-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-100"
                >
                  <option value="">Atmia Alphabet Girl Hostel - Room 105</option>
                  {allotmentOptions.map((opt) => opt.value && <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: Event Details */}
          <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm p-[24px]">
            <h2 className="text-[18px] font-[700] text-[#0F172A] mb-[20px]">Event Details</h2>
            
            <div className="flex flex-col gap-[16px]">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-[6px]">
                  <label className="text-sm font-semibold text-slate-700">Action Type <span className="text-red-500">*</span></label>
                  <select
                    value={formData.action_type || ""}
                    onChange={(e) => handleInputChange("action_type", e.target.value)}
                    className="h-[44px] rounded-[10px] border border-[#DDE3EC] bg-white px-3 text-base font-medium text-gray-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-100"
                  >
                    {actionTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-[6px]">
                  <label className="text-sm font-semibold text-slate-700">Event Status <span className="text-red-500">*</span></label>
                  <select
                    value={formData.event_status || ""}
                    onChange={(e) => handleInputChange("event_status", e.target.value)}
                    className="h-[44px] rounded-[10px] border border-[#DDE3EC] bg-white px-3 text-base font-medium text-gray-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-100"
                  >
                    {eventStatusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-[6px]">
                  <label className="text-sm font-semibold text-slate-700">Contract Type Before</label>
                  <input
                    type="text"
                    value={formData.contract_type_before || ""}
                    onChange={(e) => handleInputChange("contract_type_before", e.target.value)}
                    placeholder="102 (2 Sharing)"
                    className="h-[44px] rounded-[10px] border border-[#DDE3EC] bg-white px-3 text-base font-medium text-gray-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-100 placeholder:text-[15px] placeholder:text-[#94A3B8] placeholder:font-normal"
                  />
                </div>
                <div className="flex flex-col gap-[6px]">
                  <label className="text-sm font-semibold text-slate-700">Contract Type After</label>
                  <input
                    type="text"
                    value={formData.contract_type_after || ""}
                    onChange={(e) => handleInputChange("contract_type_after", e.target.value)}
                    placeholder="106 (Regular)"
                    className="h-[44px] rounded-[10px] border border-[#DDE3EC] bg-white px-3 text-base font-medium text-gray-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-100 placeholder:text-[15px] placeholder:text-[#94A3B8] placeholder:font-normal"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-[6px] relative">
                <label className="text-sm font-semibold text-slate-700">Remarks / Notes</label>
                <textarea
                  value={formData.remarks || ""}
                  onChange={(e) => handleInputChange("remarks", e.target.value)}
                  placeholder="Add additional remarks if any..."
                  className="min-h-[120px] rounded-[10px] border border-[#DDE3EC] bg-white p-3 text-base font-medium text-gray-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-100 resize-none placeholder:text-[15px] placeholder:text-[#94A3B8] placeholder:font-normal"
                />
                <div className="absolute bottom-3 right-3 text-[12px] font-[500] text-[#64748B]">
                  {formData.remarks?.length || 0} / 500
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-[16px]">
          
          {/* SECTION 1: Audit Details & Timing */}
          <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm p-[24px]">
            <h2 className="text-[18px] font-[700] text-[#0F172A] mb-[20px]">Audit Details & Timing</h2>
            <div className="flex flex-col gap-[16px]">
              
              <div className="flex justify-between items-center pb-[16px] border-b border-[#F1F5F9]">
                <span className="text-[14px] font-[600] text-[#64748B]">Triggered By</span>
                <span className="text-[15px] font-[600] text-[#0F172A]">{formData.triggered_by || "System Settle"}</span>
              </div>

              <div className="flex justify-between items-center pb-[16px] border-b border-[#F1F5F9]">
                <span className="text-[14px] font-[600] text-[#64748B]">Triggered On</span>
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-[600] text-[#0F172A]">{formData.triggered_on || "06/11/2026 06:41 AM"}</span>
                  <Calendar size={14} className="text-[#64748B]" />
                </div>
              </div>

              <div className="flex justify-between items-center pb-[16px] border-b border-[#F1F5F9]">
                <span className="text-[14px] font-[600] text-[#64748B]">Effective Date</span>
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-[600] text-[#0F172A]">{formData.effective_date || "09/01/2026"}</span>
                  <Calendar size={14} className="text-[#64748B]" />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[14px] font-[600] text-[#64748B]">Last Updated</span>
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-[600] text-[#0F172A]">06/11/2026 06:41 AM</span>
                  <Calendar size={14} className="text-[#64748B]" />
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 2: Advanced References */}
          <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm">
            <button
              type="button"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="w-full p-[24px] flex justify-between items-center bg-transparent border-none cursor-pointer text-left focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <div className="w-[28px] h-[28px] rounded-[6px] bg-[#F4F1FF] text-[#5B3DF5] flex items-center justify-center shrink-0">
                  <LinkIcon size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[18px] font-[700] text-[#0F172A]">Advanced References</span>
                  <span className="text-[12px] font-[500] text-[#64748B]">Optional settlement linkages</span>
                </div>
              </div>
              <div className="text-slate-400">
                {isAdvancedOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </button>
            
            {isAdvancedOpen && (
              <div className="px-[24px] pb-[24px] border-t border-[#F1F5F9] pt-[20px] flex flex-col gap-[16px]">
                
                <div className="flex justify-between items-center pb-[16px] border-b border-[#F1F5F9]">
                  <span className="text-[14px] font-[600] text-[#64748B]">Settlement Reference</span>
                  <span className="text-[15px] font-[600] text-[#0F172A]">{formData.settlement_rap ? "RAP-Linked" : "RAP-RAP-019E"}</span>
                </div>

                <div className="flex justify-between items-center pb-[16px] border-b border-[#F1F5F9]">
                  <span className="text-[14px] font-[600] text-[#64748B]">Financial Record</span>
                  <span className="px-2 py-0.5 rounded-[4px] bg-green-50 text-green-700 text-[12px] font-[600]">Linked</span>
                </div>

                <div className="flex justify-between items-center pb-[16px] border-b border-[#F1F5F9]">
                  <span className="text-[14px] font-[600] text-[#64748B]">Ledger Entry</span>
                  <span className="px-2 py-0.5 rounded-[4px] bg-green-50 text-green-700 text-[12px] font-[600]">Available</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[14px] font-[600] text-[#64748B]">Remarks / Notes</span>
                  <span className="text-[15px] font-[600] text-[#64748B]">No additional notes</span>
                </div>

              </div>
            )}
          </div>

          {/* SECTION 3: Metadata */}
          <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm p-[24px]">
            <h2 className="text-[18px] font-[700] text-[#0F172A] mb-[20px]">Metadata</h2>
            <div className="flex flex-col gap-[16px]">
              
              <div className="flex justify-between items-center pb-[16px] border-b border-dashed border-[#E2E8F0]">
                <span className="text-[14px] font-[600] text-[#64748B]">Event ID</span>
                <span className="text-[15px] font-[600] text-[#0F172A]">{id || "EVT-2026-000145"}</span>
              </div>

              <div className="flex justify-between items-center pb-[16px] border-b border-[#F1F5F9]">
                <span className="text-[14px] font-[600] text-[#64748B]">Created By</span>
                <span className="text-[15px] font-[600] text-[#0F172A]">System Settle</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[14px] font-[600] text-[#64748B]">Created At</span>
                <span className="text-[15px] font-[600] text-[#0F172A]">06/11/2026 06:41 AM</span>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
