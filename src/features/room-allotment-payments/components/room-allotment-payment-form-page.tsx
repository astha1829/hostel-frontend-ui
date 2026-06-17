"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { X, Save, FileText } from "lucide-react";
import { useRoomAllotmentPaymentForm } from "../hooks/use-room-allotment-payment-form";
import { showCancelConfirm } from "@/utils/swal";

interface RoomAllotmentPaymentFormPageProps {
  id?: string;
}

export const RoomAllotmentPaymentFormPage: React.FC<RoomAllotmentPaymentFormPageProps> = ({ id }) => {
  const router = useRouter();

  const handleSuccess = (paymentId: string) => {
    if (id) {
      router.push("/room-allotment-payments");
    } else {
      router.push(`/room-allotment-payments/${paymentId}`);
    }
  };

  const handleCancel = () => {
    if (id) {
      router.push(`/room-allotment-payments/${id}`);
    } else {
      router.push("/room-allotment-payments");
    }
  };

  const {
    formData,
    originalPayment,
    students,
    allotments,
    isLoadingDetails,
    isSubmitting,
    fieldErrors,
    apiError,
    handleStudentChange,
    handleRoomAllotmentChange,
    handleInputChange,
    handleSubmit,
  } = useRoomAllotmentPaymentForm({
    id,
    onSuccess: handleSuccess,
    onCancel: handleCancel,
  });

  const handleCancelClick = async () => {
    const isDirty = formData.student_id !== "" || formData.room_allotment_id !== "" || formData.summary_json !== "";
    if (isDirty) {
      const result = await showCancelConfirm();
      if (!result.isConfirmed) return;
    }
    handleCancel();
  };

  // Derive dynamic values for the UI
  const student = students.find((s) => s.id === formData.student_id);
  const studentName = student ? `${student.student_name} ${student.last_name || ""}`.trim() : "Student Name";
  const initials = studentName.substring(0, 2).toUpperCase() || "SC";
  
  const allotment = allotments.find((a) => a.id === formData.room_allotment_id);
  const hostelName = allotment?.hostel_name || originalPayment?.hostel_name || "Atmia Alphabet Girl Hostel";
  const roomDetails = allotment ? `Room ${allotment.room_no}, Floor ${allotment.floor_no || 1}` : "Room 105, Floor 1";
  const contractNo = originalPayment?.hostel_contract_id ? `#${originalPayment.hostel_contract_id.toString().substring(0, 3)}` : "#106";

  const paymentIdDisplay = id ? `#${id.substring(0, 8).toUpperCase()}` : "#NEW";
  
  const formatDate = (dateString?: string, defaultStr = "Jun 04, 2026") => {
    if (!dateString) return defaultStr;
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    } catch {
      return defaultStr;
    }
  };

  const formatDateTime = (dateString?: string, defaultStr = "Jun 04, 2026 09:18 AM") => {
    if (!dateString) return defaultStr;
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch {
      return defaultStr;
    }
  };

  const createdOn = formatDate(originalPayment?.created_at, "Jun 04, 2026");
  const createdOnTime = formatDateTime(originalPayment?.created_at, "Jun 04, 2026 09:18 AM");
  const updatedOnTime = formatDateTime(originalPayment?.updated_at, "Jun 15, 2026 10:42 AM");
  const linkedMonthsCount = formData.months?.length || 0;

  const statusColor = formData.payment_status === "Paid" ? "#22C55E" : formData.payment_status === "Pending" ? "#F59E0B" : "#EF4444";

  if (isLoadingDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground mt-2">Loading payment details...</p>
      </div>
    );
  }

  const transactionTypeOptions = [
    { label: "Rent Payment", value: "Rent Payment" },
    { label: "Room Transfer", value: "Room Transfer" },
    { label: "Security Deposit", value: "Security Deposit" },
    { label: "Penalty Booking", value: "Penalty Booking" },
    { label: "Refund", value: "Refund" },
    { label: "Ad-hoc Settle", value: "Ad-hoc Settle" },
  ];

  const statusOptions = [
    { label: "Pending", value: "Pending" },
    { label: "Paid", value: "Paid" },
    { label: "Failed", value: "Failed" },
  ];

  const studentOptions = [
    { label: "Select Student...", value: "" },
    ...students.map((s) => ({
      label: `${s.student_name} ${s.last_name || ""}`.trim().toUpperCase(),
      value: s.id,
    })),
  ];

  const allotmentOptions = [
    { label: "Select Room Allotment...", value: "" },
    ...allotments.map((a) => ({
      label: `${a.hostel_name || "Hostel"} - Room ${a.room_no}`,
      value: a.id,
    })),
  ];

  // Common styles
  const cardStyle = {
    backgroundColor: "#FFFFFF",
    borderRadius: "18px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 4px 20px rgba(15,23,42,0.04)",
  };

  const inputStyle = {
    height: "48px",
    borderRadius: "12px",
    border: "1px solid #DCE3EE",
    backgroundColor: "#FFFFFF",
    padding: "0 16px",
    fontSize: "16px",
    fontWeight: "500",
    color: "#0F172A",
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155",
    letterSpacing: "0.01em",
    marginBottom: "8px",
  };

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
      <div className="w-full max-w-none px-6 lg:px-8 py-6">
        
        {/* TOP HEADER */}
        <div style={{ marginBottom: "24px" }}>
          <button 
            onClick={handleCancelClick}
            style={{ color: "#64748B", fontSize: "14px", fontWeight: "500", display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", padding: "0", marginBottom: "16px" }}
          >
            <span style={{ fontSize: "16px" }}>←</span> Back to Payments
          </button>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1 style={{ fontSize: "48px", fontWeight: "800", color: "#0F172A", margin: "0 0 8px 0", letterSpacing: "-0.02em" }}>
                Edit Room Allotment Payment
              </h1>
              <p style={{ fontSize: "15px", color: "#475569", lineHeight: "1.6", margin: "0" }}>
                Update payment details and financial information.
              </p>
            </div>
            
            <div style={{ display: "flex", gap: "12px" }}>
              <button 
                onClick={handleCancelClick}
                disabled={isSubmitting}
                style={{ height: "48px", borderRadius: "12px", border: "1px solid #E5E7EB", backgroundColor: "#FFFFFF", color: "#0F172A", fontWeight: "600", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", padding: "0 20px", cursor: "pointer" }}
              >
                <X size={16} /> Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{ height: "48px", borderRadius: "12px", border: "none", backgroundColor: "#5B3DF5", color: "#FFFFFF", fontWeight: "600", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", padding: "0 20px", cursor: "pointer" }}
              >
                <Save size={16} /> {isSubmitting ? "Saving..." : "Save Payment Record"}
              </button>
            </div>
          </div>
        </div>

        {apiError && id ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-gray-200 rounded-[18px] shadow-sm mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Payment not found</h2>
            <p className="text-slate-500 mt-2 max-w-md">The payment record you are looking for does not exist or has been deleted. It may have been an invalid ID.</p>
            <button 
              onClick={() => router.push("/room-allotment-payments")} 
              style={{ height: "48px", borderRadius: "12px", border: "1px solid #E5E7EB", backgroundColor: "#FFFFFF", color: "#0F172A", fontWeight: "600", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", padding: "0 20px", cursor: "pointer", marginTop: "24px" }}
            >
              <span style={{ fontSize: "16px" }}>←</span> Back to Payments
            </button>
          </div>
        ) : apiError ? (
          <div className="px-5 py-4 bg-red-50 border border-red-200 rounded-[12px] text-red-600 text-sm font-medium mb-6">
            {apiError}
          </div>
        ) : null}

        {(!apiError || !id) && (
          <>
            {/* PAYMENT OVERVIEW CARD */}
            <div style={{ ...cardStyle, height: "120px", marginBottom: "24px", display: "flex", alignItems: "center" }}>
              
              {/* Col 1 */}
              <div style={{ flex: 1, padding: "0 24px", display: "flex", alignItems: "center", gap: "16px", borderRight: "1px solid #E5E7EB", height: "72px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#F3F0FF", color: "#5B3DF5", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "16px" }}>
                  {initials}
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "500", color: "#64748B", marginBottom: "2px" }}>Student</div>
                  <div style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A" }}>{studentName}</div>
                  <div style={{ fontSize: "14px", fontWeight: "500", color: "#64748B", marginTop: "2px" }}>Contract: {contractNo}</div>
                </div>
              </div>

              {/* Col 2 */}
              <div style={{ flex: 1, padding: "0 24px", borderRight: "1px solid #E5E7EB", height: "72px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontSize: "14px", fontWeight: "500", color: "#64748B", marginBottom: "2px" }}>Allotment</div>
                <div style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A" }}>{roomDetails}</div>
                <div style={{ fontSize: "14px", fontWeight: "500", color: "#64748B", marginTop: "2px" }}>{hostelName}</div>
              </div>

              {/* Col 3 */}
              <div style={{ flex: 1, padding: "0 24px", borderRight: "1px solid #E5E7EB", height: "72px", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "#EFF6FF", color: "#3B82F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FileText size={18} />
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "500", color: "#64748B", marginBottom: "2px" }}>Transaction Type</div>
                  <div style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A" }}>{formData.transaction_type}</div>
                </div>
              </div>

              {/* Col 4 */}
              <div style={{ flex: 1, padding: "0 24px", borderRight: "1px solid #E5E7EB", height: "72px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontSize: "14px", fontWeight: "500", color: "#64748B", marginBottom: "4px" }}>Payment Status</div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "18px", fontWeight: "700", color: "#0F172A" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: statusColor }}></div>
                  {formData.payment_status}
                </div>
                <div style={{ fontSize: "14px", fontWeight: "500", color: "#64748B", marginTop: "2px" }}>Linked Months: {linkedMonthsCount}</div>
              </div>

              {/* Col 5 */}
              <div style={{ flex: 1, padding: "0 24px", height: "72px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontSize: "14px", fontWeight: "500", color: "#64748B", marginBottom: "2px" }}>Payment ID</div>
                <div style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A" }}>{paymentIdDisplay}</div>
                <div style={{ fontSize: "14px", fontWeight: "500", color: "#64748B", marginTop: "2px" }}>Created on {createdOn}</div>
              </div>

            </div>

            {/* MAIN FORM */}
            <div className="w-full flex flex-col">
              
              {/* Section 1: Payment Information */}
              <div>
                <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#0F172A", marginBottom: "16px" }}>Payment Information</h2>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <label style={labelStyle}>Student <span style={{color:"#EF4444"}}>*</span></label>
                    <select 
                      value={formData.student_id}
                      onChange={(e) => handleStudentChange(e.target.value)}
                      style={{...inputStyle, appearance: "none", backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%2364748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>')`, backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center", borderColor: fieldErrors.student_id ? "#EF4444" : "#DCE3EE"}}
                    >
                      {studentOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Room Allotment <span style={{color:"#EF4444"}}>*</span></label>
                    <select 
                      value={formData.room_allotment_id}
                      onChange={(e) => handleRoomAllotmentChange(e.target.value)}
                      style={{...inputStyle, appearance: "none", backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%2364748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>')`, backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center", borderColor: fieldErrors.room_allotment_id ? "#EF4444" : "#DCE3EE"}}
                    >
                      {allotmentOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Transaction Type <span style={{color:"#EF4444"}}>*</span></label>
                    <select 
                      value={formData.transaction_type}
                      onChange={(e) => handleInputChange("transaction_type", e.target.value)}
                      style={{...inputStyle, appearance: "none", backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%2364748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>')`, backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center", borderColor: fieldErrors.transaction_type ? "#EF4444" : "#DCE3EE"}}
                    >
                      {transactionTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>Payment Status <span style={{color:"#EF4444"}}>*</span></label>
                    <select 
                      value={formData.payment_status}
                      onChange={(e) => handleInputChange("payment_status", e.target.value)}
                      style={{...inputStyle, appearance: "none", backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%2364748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>')`, backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center"}}
                    >
                      {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Posting Date & Time <span style={{color:"#EF4444"}}>*</span></label>
                    <div style={{ position: "relative" }}>
                      <input 
                        type="datetime-local" 
                        value={formData.posting_datetime || ""}
                        onChange={(e) => handleInputChange("posting_datetime", e.target.value)}
                        style={{...inputStyle, paddingRight: "40px"}}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ height: "1px", backgroundColor: "#E5E7EB", margin: "24px 0" }}></div>

              {/* Section 2: Amount Details */}
              <div>
                <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#0F172A", marginBottom: "16px" }}>Amount Details</h2>
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>Rent Amount ($)</label>
                    <input 
                      type="number"
                      value={formData.rent_amount ?? ""}
                      onChange={(e) => handleInputChange("rent_amount", e.target.value)}
                      style={inputStyle}
                      className="placeholder:text-[#94A3B8] placeholder:text-[15px]"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Penalty Amount ($)</label>
                    <input 
                      type="number"
                      value={formData.penalty_amount ?? ""}
                      onChange={(e) => handleInputChange("penalty_amount", e.target.value)}
                      style={inputStyle}
                      className="placeholder:text-[#94A3B8] placeholder:text-[15px]"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Additional Charges ($)</label>
                    <input 
                      type="number"
                      value={formData.transaction_charge ?? ""}
                      onChange={(e) => handleInputChange("transaction_charge", e.target.value)}
                      style={inputStyle}
                      className="placeholder:text-[#94A3B8] placeholder:text-[15px]"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Total Amount ($)</label>
                    <input 
                      type="number"
                      readOnly
                      value={formData.total_amount ?? ""}
                      style={{...inputStyle, backgroundColor: "#F8FAFC", color: "#0F172A", fontWeight: "600"}}
                    />
                  </div>
                </div>
                <div style={{ fontSize: "15px", lineHeight: "1.6", color: "#475569", marginTop: "12px" }}>
                  All amounts are in USD.
                </div>
              </div>

              <div style={{ height: "1px", backgroundColor: "#E5E7EB", margin: "24px 0" }}></div>

              {/* Section 3: Notes */}
              <div>
                <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#0F172A", marginBottom: "16px" }}>Notes</h2>
                
                <div>
                  <label style={labelStyle}>Internal Notes</label>
                  <textarea 
                    value={formData.summary_json || ""}
                    onChange={(e) => handleInputChange("summary_json", e.target.value)}
                    placeholder="Add any internal notes or remarks for this payment record."
                    style={{...inputStyle, height: "140px", paddingTop: "12px", paddingBottom: "12px", resize: "none"}}
                    className="placeholder:text-[#94A3B8] placeholder:text-[15px]"
                  />
                </div>
                <div style={{ fontSize: "15px", lineHeight: "1.6", color: "#475569", marginTop: "12px" }}>
                  Add any internal notes or remarks for this payment record.
                </div>
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
};
