"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Save, Layers, Clock, Calendar as CalendarIcon, ArrowUpCircle } from "lucide-react";
import { useRentPaymentForm } from "../hooks/use-rent-payment-form";
import { showCancelConfirm } from "@/utils/swal";

interface RentPaymentFormPageProps {
  id?: string;
}

export const RentPaymentFormPage: React.FC<RentPaymentFormPageProps> = ({ id }) => {
  const router = useRouter();
  const [dummyStatus, setDummyStatus] = useState("Pending");

  const handleSuccess = (paymentId: string) => {
    router.push(`/rent-payments/${paymentId}`);
  };

  const handleCancel = () => {
    if (id) {
      router.push(`/rent-payments/${id}`);
    } else {
      router.push("/rent-payments");
    }
  };

  const {
    formData,
    originalPayment,
    students,
    contracts,
    allotments,
    allotmentPayments,
    contractEvents,
    isLoadingDetails,
    isSubmitting,
    fieldErrors,
    apiError,
    handleStudentChange,
    handleInputChange,
    handleSubmit,
  } = useRentPaymentForm({
    id,
    onSuccess: handleSuccess,
    onCancel: handleCancel,
  });

  const handleCancelClick = async () => {
    const isDirty = formData.student_id !== "" || formData.hostel_contract_id !== "" || formData.room_allotment_id !== "" || formData.remarks !== "";
    if (isDirty) {
      const result = await showCancelConfirm();
      if (!result.isConfirmed) return;
    }
    handleCancel();
  };

  // Derive display values
  const student = students.find((s) => s.id === formData.student_id);
  const studentName = student ? `${student.student_name} ${student.last_name || ""}`.trim().toUpperCase() : "SHAURYA CHOVADIA";
  const initials = studentName.substring(0, 2).toUpperCase() || "SC";

  const allotment = allotments.find((a) => a.id === formData.room_allotment_id);
  const roomNo = allotment?.room_no || "105";
  const floorNo = allotment?.floor_no?.toString() || "1";
  const hostelName = allotment?.hostel_name || originalPayment?.hostel_name || "Atmia Alphabet Girl Hostel";

  const contract = contracts.find((c) => c.id === formData.hostel_contract_id);
  const contractDisplay = contract ? `${contract.contract_no} (${contract.contract_type})` : "102 (2 Sharing)";

  const formatDateTime = (dateString?: string, defaultStr = "04 Jun 2026 09:18 AM") => {
    if (!dateString) return defaultStr;
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).replace(",", "");
    } catch {
      return defaultStr;
    }
  };

  const formatMonthLabel = (yyyyMm?: string, defaultStr = "Oct 2026") => {
    if (!yyyyMm) return defaultStr;
    try {
      const [y, m] = yyyyMm.split("-");
      if (!y || !m) return defaultStr;
      const d = new Date(parseInt(y), parseInt(m) - 1, 1);
      return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    } catch {
      return defaultStr;
    }
  };

  const createdOnTime = formatDateTime(originalPayment?.created_at, "04 Jun 2026 09:18 AM");
  const updatedOnTime = formatDateTime(originalPayment?.updated_at, "15 Jun 2026 10:42 AM");
  const displayMonth = formatMonthLabel(formData.against_month, "Oct 2026");

  const statusColor = dummyStatus === "Paid" ? "#22C55E" : dummyStatus === "Pending" ? "#F59E0B" : "#EF4444";
  const statusBg = dummyStatus === "Paid" ? "#DCFCE7" : dummyStatus === "Pending" ? "#FEF3C7" : "#FEE2E2";
  const statusText = dummyStatus === "Paid" ? "#166534" : dummyStatus === "Pending" ? "#92400E" : "#991B1B";

  const directionOptions = [
    { label: "Credit (+)", value: "credit" },
    { label: "Debit (-)", value: "debit" },
  ];

  const statusOptions = [
    { label: "Pending", value: "Pending" },
    { label: "Paid", value: "Paid" },
    { label: "Failed", value: "Failed" },
  ];

  const allotmentPaymentOptions = [
    { label: "Select Linked Payment...", value: "" },
    ...allotmentPayments.map((p) => {
      const code = p.room_allotment_name || `RAP-${p.id.substring(0, 8)}`;
      return {
        label: `${code} - Total: $${Number(p.total_amount).toFixed(2)}`,
        value: p.id,
      };
    }),
  ];

  const contractEventOptions = [
    { label: "Select Associated Event...", value: "" },
    ...contractEvents.map((e) => ({
      label: e.event_no ? `${e.event_no} - ${e.action_type}` : `Event-${e.id.substring(0, 8)} (${e.action_type})`,
      value: e.id,
    })),
  ];

  if (isLoadingDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-slate-500 mt-2">Loading ledger details...</p>
      </div>
    );
  }

  const cardStyle = {
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    border: "1px solid #E5E7EB",
    padding: "20px",
  };

  const inputStyle = {
    height: "48px",
    borderRadius: "8px",
    border: "1px solid #E5E7EB",
    backgroundColor: "#FFFFFF",
    padding: "0 14px",
    fontSize: "16px",
    fontWeight: "500",
    color: "#111827",
    width: "100%",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155",
    marginBottom: "8px",
  };

  const headerStyle = {
    fontSize: "24px",
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: "16px",
  };

  const sectionContainerStyle = {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  };

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <div className="w-full max-w-none px-6 lg:px-8 py-6">

        {/* HEADER */}
        <div style={{ marginBottom: "16px" }}>
          <button
            onClick={handleCancelClick}
            style={{ color: "#64748B", fontSize: "14px", fontWeight: "500", display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", padding: "0", marginBottom: "10px" }}
          >
            <span style={{ fontSize: "16px" }}>←</span> Back to Rent Payments
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1 style={{ fontSize: "48px", fontWeight: "800", color: "#0F172A", margin: "0 0 4px 0", letterSpacing: "-0.03em", lineHeight: "1.1" }}>
                Edit Rent Payment Entry
              </h1>
              <p style={{ fontSize: "16px", fontWeight: "500", color: "#0F172A", margin: "0", WebkitFontSmoothing: "antialiased", textRendering: "optimizeLegibility" }}>
                Modify financial ledger details or link references.
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={handleCancelClick}
                disabled={isSubmitting}
                style={{ height: "42px", borderRadius: "8px", border: "1px solid #E5E7EB", backgroundColor: "#FFFFFF", color: "#0F172A", fontWeight: "600", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", padding: "0 16px", cursor: "pointer" }}
              >
                <X size={16} /> Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{ height: "42px", borderRadius: "8px", border: "none", backgroundColor: "#5B3DF5", color: "#FFFFFF", fontWeight: "600", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", padding: "0 20px", cursor: "pointer" }}
              >
                <Save size={16} /> {isSubmitting ? "Saving..." : "Save Rent Payment"}
              </button>
            </div>
          </div>
        </div>

        {apiError && (
          <div style={{ padding: "12px 16px", backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", color: "#DC2626", fontSize: "14px", fontWeight: "500", marginBottom: "16px" }}>
            {apiError}
          </div>
        )}

        {/* TOP SUMMARY STRIP */}
        <div style={{ ...cardStyle, height: "80px", marginBottom: "16px", display: "flex", alignItems: "center", padding: "0" }}>

          <div style={{ flex: 1, padding: "0 20px", display: "flex", alignItems: "center", gap: "12px", borderRight: "1px solid #E5E7EB", height: "48px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: "#F3F0FF", color: "#5B3DF5", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "14px" }}>
              {initials}
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "500", color: "#64748B", marginBottom: "2px" }}>Student</div>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A" }}>{studentName}</div>
            </div>
          </div>

          <div style={{ flex: 1, padding: "0 20px", borderRight: "1px solid #E5E7EB", height: "48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: "14px", fontWeight: "500", color: "#64748B", marginBottom: "2px" }}>Room</div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A" }}>{roomNo}</div>
          </div>

          <div style={{ flex: 1, padding: "0 20px", borderRight: "1px solid #E5E7EB", height: "48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: "14px", fontWeight: "500", color: "#64748B", marginBottom: "2px" }}>Floor</div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A" }}>{floorNo}</div>
          </div>

          <div style={{ flex: 1, padding: "0 20px", borderRight: "1px solid #E5E7EB", height: "48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: "14px", fontWeight: "500", color: "#64748B", marginBottom: "2px" }}>Contract</div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A" }}>{contractDisplay}</div>
          </div>

          <div style={{ flex: 1, padding: "0 20px", height: "48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: "14px", fontWeight: "500", color: "#64748B", marginBottom: "2px" }}>Hostel</div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{hostelName}</div>
          </div>

        </div>

        {/* MAIN FORM */}
        <div className="w-full flex flex-col gap-4">

              {/* SECTION 1: Payment Details */}
              <div style={cardStyle}>
                <h2 style={headerStyle}>Payment Details</h2>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <label style={labelStyle}>Against Month (YYYY-MM) <span style={{ color: "#EF4444" }}>*</span></label>
                    <div style={{ position: "relative" }}>
                      <input
                        value={formData.against_month}
                        onChange={(e) => handleInputChange("against_month", e.target.value)}
                        placeholder="2026-10"
                        className="placeholder:text-slate-400 placeholder:text-[15px]"
                        style={{ ...inputStyle, paddingRight: "36px", borderColor: fieldErrors.against_month ? "#EF4444" : "#E5E7EB" }}
                      />
                      <CalendarIcon size={16} color="#64748B" style={{ position: "absolute", right: "12px", top: "14px" }} />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Direction <span style={{ color: "#EF4444" }}>*</span></label>
                    <select
                      value={formData.direction}
                      onChange={(e) => handleInputChange("direction", e.target.value)}
                      style={{ ...inputStyle, appearance: "none", backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%2364748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>')`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", borderColor: fieldErrors.direction ? "#EF4444" : "#E5E7EB" }}
                    >
                      {directionOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Amount ( $ ) <span style={{ color: "#EF4444" }}>*</span></label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "12px", color: "#64748B", fontSize: "14px" }}>$</span>
                      <input
                        type="number"
                        value={formData.amount || ""}
                        onChange={(e) => handleInputChange("amount", e.target.value)}
                        placeholder="200.00"
                        className="placeholder:text-slate-400 placeholder:text-[15px]"
                        style={{ ...inputStyle, paddingLeft: "26px", borderColor: fieldErrors.amount ? "#EF4444" : "#E5E7EB" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Payment Status <span style={{ color: "#EF4444" }}>*</span></label>
                    <select
                      value={dummyStatus}
                      onChange={(e) => setDummyStatus(e.target.value)}
                      style={{ ...inputStyle, appearance: "none", backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%2364748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>')`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
                    >
                      {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px" }}>
                  <div style={{ gridColumn: "span 1" }}>
                    <label style={labelStyle}>Posting Date / Time <span style={{ color: "#EF4444" }}>*</span></label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="datetime-local"
                        value={formData.posting_datetime || ""}
                        onChange={(e) => handleInputChange("posting_datetime", e.target.value)}
                        style={{ ...inputStyle, paddingRight: "10px", borderColor: fieldErrors.posting_datetime ? "#EF4444" : "#E5E7EB" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Reference Information */}
              <div style={cardStyle}>
                <h2 style={headerStyle}>Reference Information</h2>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>Linked Payment <span style={{ color: "#EF4444" }}>*</span></label>
                    <select
                      value={formData.room_allotment_payment_id}
                      onChange={(e) => handleInputChange("room_allotment_payment_id", e.target.value)}
                      style={{ ...inputStyle, appearance: "none", backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%2364748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>')`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
                    >
                      {allotmentPaymentOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Associated Contract Event (Optional)</label>
                    <select
                      value={formData.hostel_contract_event_id}
                      onChange={(e) => handleInputChange("hostel_contract_event_id", e.target.value)}
                      style={{ ...inputStyle, appearance: "none", backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%2364748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>')`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", color: !formData.hostel_contract_event_id ? "#64748B" : "#0F172A" }}
                    >
                      {contractEventOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Audit Notes */}
              <div style={cardStyle}>
                <h2 style={headerStyle}>Audit Notes</h2>

                <div>
                  <label style={{ ...labelStyle, fontWeight: "500", fontSize: "12px", color: "#64748B", marginBottom: "8px" }}>Audit Comments / Internal Notes</label>
                  <textarea
                    value={formData.remarks || ""}
                    onChange={(e) => handleInputChange("remarks", e.target.value)}
                    placeholder="Updated approval note"
                    className="placeholder:text-slate-400 placeholder:text-[15px]"
                    style={{ ...inputStyle, height: "80px", paddingTop: "12px", paddingBottom: "12px", resize: "none" }}
                  />
                </div>
                <div style={{ fontSize: "16px", fontWeight: "500", color: "#0F172A", marginTop: "8px", WebkitFontSmoothing: "antialiased" }}>
                  Internal notes are for administrative reference only.
                </div>
              </div>

        </div>

      </div>
    </div>
  );
};
