import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Save, FileText, RefreshCw, Minus, Plus as PlusIcon, Clock } from "lucide-react";
import { HostelContractHistoryApi } from "../api";
import { HostelContractHistoryRow, StudentSummary } from "../types";
import { showSuccess, showError, showLoading, closeLoading } from "@/utils/swal";

interface HostelContractHistoryModalProps {
  editRow?: HostelContractHistoryRow;
  history?: HostelContractHistoryRow[];
  onClose: () => void;
  onSuccess: () => void;
}

export const HostelContractHistoryModal: React.FC<HostelContractHistoryModalProps> = ({
  editRow,
  history = [],
  onClose,
  onSuccess,
}) => {
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [studentId, setStudentId] = useState("");
  const [contractRef, setContractRef] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const isEditMode = !!editRow;

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoadingStudents(true);
      try {
        const list = await HostelContractHistoryApi.getStudents();
        setStudents(list);
      } catch (err) {
        console.error("Failed to retrieve students list", err);
      } finally {
        setIsLoadingStudents(false);
      }
    };
    fetchStudents();
  }, []);

  // Prefill form in edit mode
  useEffect(() => {
    if (editRow) {
      setStudentId(editRow.student_id);
      setContractRef(editRow.contract_ref);
      setDisplayOrder(editRow.display_order ?? 1);
    }
  }, [editRow]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!studentId) errors.studentId = "Required";
    if (!contractRef.trim()) errors.contractRef = "Required";
    if (displayOrder < 1) errors.displayOrder = "Invalid";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    showLoading(isEditMode ? "Updating..." : "Saving...", "Please wait");
    try {
      const payload = {
        student_id: studentId,
        contract_ref: contractRef.trim(),
        display_order: Number(displayOrder),
      };

      if (isEditMode && editRow) {
        await HostelContractHistoryApi.updateHostelContractHistory(editRow.id, payload);
        closeLoading();
        await showSuccess("Updated Successfully", "Changes have been saved successfully.");
      } else {
        await HostelContractHistoryApi.createHostelContractHistory(payload);
        closeLoading();
        await showSuccess("Created Successfully", "Record has been created successfully.");
      }
      onSuccess();
    } catch (err: any) {
      closeLoading();
      showError(isEditMode ? "Update Failed" : "Creation Failed", err.message || "Failed to save history row.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerate = () => {
    const random = Math.floor(100 + Math.random() * 900);
    setContractRef(`HC-2026-${random}`);
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const selectedStudent = students.find((s) => s.id === studentId);

  const getInitials = (name?: string | null) => {
    if (!name) return "ST";
    const parts = name.trim().split(" ");
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  };

  if (!mounted) return null;

  return createPortal(
    <div 
      style={{ 
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, 
        backgroundColor: "rgba(15,23,42,0.45)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" 
      }} 
      onClick={onClose}
    >
      <div 
        style={{ 
          width: "1040px", maxWidth: "90vw", backgroundColor: "#FFFFFF", borderRadius: "20px", 
          boxShadow: "0 20px 50px rgba(15,23,42,0.12)", display: "flex", flexDirection: "column",
          fontFamily: "'Inter', sans-serif"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "24px", paddingBottom: "0" }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#F3F0FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileText size={24} color="#5B3DF5" />
            </div>
            <div>
              <h2 style={{ fontSize: "38px", fontWeight: "800", color: "#111827", margin: "0 0 4px 0", lineHeight: "1.1", letterSpacing: "-0.5px" }}>
                {isEditMode ? "Edit Contract History" : "Add Contract History"}
              </h2>
              <p style={{ fontSize: "15px", color: "#64748B", margin: 0 }}>
                {isEditMode ? "Modify existing historical contract reference and sequence ordering." : "Manually archive a historical contract reference for a student."}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ width: "36px", height: "36px", borderRadius: "8px", border: "none", backgroundColor: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* SECTION 1: Two Columns */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {/* Left Side: Student Dropdown */}
            <div style={{ padding: "20px", border: "1px solid #E5E7EB", borderRadius: "16px", backgroundColor: "#FFFFFF" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#111827", marginBottom: "8px" }}>
                Student <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                disabled={isEditMode}
                style={{ 
                  width: "100%", height: "52px", borderRadius: "10px", border: fieldErrors.studentId ? "1px solid #EF4444" : "1px solid #E5E7EB",
                  padding: "0 16px", fontSize: "16px", fontWeight: "500", color: "#111827", backgroundColor: "#FFFFFF",
                  outline: "none", appearance: "none", cursor: isEditMode ? "not-allowed" : "pointer",
                  boxShadow: "0 1px 2px rgba(15,23,42,0.02)"
                }}
              >
                <option value="">Select a student...</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.student_name} {s.last_name || ""} {s.passport_no ? `(${s.passport_no})` : ""}</option>
                ))}
              </select>
            </div>

            {/* Right Side: Profile Card */}
            <div style={{ backgroundColor: "#FAFAFF", border: "1px solid #E8EAF5", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              {selectedStudent ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#F3F0FF", color: "#5B3DF5", fontSize: "18px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {getInitials(selectedStudent.student_name)}
                    </div>
                    <div>
                      <div style={{ fontSize: "24px", fontWeight: "700", color: "#111827", lineHeight: "1.2", textTransform: "uppercase" }}>{selectedStudent.student_name} {selectedStudent.last_name || ""}</div>
                      <div style={{ fontSize: "14px", color: "#64748B" }}>Passport/ID: {selectedStudent.passport_no || "N/A"}</div>
                    </div>
                  </div>
                  <div style={{ height: "1px", backgroundColor: "#E8EAF5", marginBottom: "16px" }}></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                    <div>
                      <div style={{ fontSize: "13px", color: "#64748B", marginBottom: "4px" }}>Resident Status</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: "600", color: "#22C55E" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#22C55E" }}></div> Active Resident
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "13px", color: "#64748B", marginBottom: "4px" }}>Current Contract Reference</div>
                      <div style={{ fontSize: "15px", fontWeight: "700", color: "#111827" }}>HC-2026-{selectedStudent.id.substring(0, 4).toUpperCase()}</div>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", color: "#94A3B8", fontSize: "14px" }}>Select a student to view details.</div>
              )}
            </div>
          </div>

          {/* SECTION 2: Two Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {/* Contract Reference */}
            <div style={{ padding: "20px", border: "1px solid #E5E7EB", borderRadius: "16px", backgroundColor: "#FFFFFF" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#111827", marginBottom: "8px" }}>
                Contract Reference <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <div style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
                <input 
                  type="text" 
                  value={contractRef}
                  onChange={(e) => setContractRef(e.target.value)}
                  style={{ flex: 1, height: "46px", padding: "0 16px", borderRadius: "10px", border: fieldErrors.contractRef ? "1px solid #EF4444" : "1px solid #E5E7EB", fontSize: "16px", fontWeight: "500", color: "#111827", outline: "none" }}
                />
                <button 
                  onClick={handleGenerate}
                  style={{ height: "46px", padding: "0 16px", borderRadius: "10px", border: "1px solid #E0D4FC", backgroundColor: "#FFFFFF", color: "#5B3DF5", fontWeight: "600", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                >
                  <RefreshCw size={16} /> Generate
                </button>
              </div>
              <div style={{ fontSize: "13px", color: "#64748B" }}>Unique historical contract reference for tracking and audit.</div>
            </div>

            {/* Display Order */}
            <div style={{ padding: "20px", border: "1px solid #E5E7EB", borderRadius: "16px", backgroundColor: "#FFFFFF" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#111827", marginBottom: "8px" }}>
                Display Order <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <div style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
                <div style={{ display: "flex", width: "100%", height: "46px" }}>
                  <button 
                    onClick={() => setDisplayOrder(Math.max(1, displayOrder - 1))}
                    style={{ width: "46px", height: "46px", border: "1px solid #E5E7EB", borderRight: "none", borderRadius: "10px 0 0 10px", backgroundColor: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748B" }}
                  >
                    <Minus size={18} />
                  </button>
                  <input 
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                    style={{ flex: 1, height: "46px", border: fieldErrors.displayOrder ? "1px solid #EF4444" : "1px solid #E5E7EB", borderLeft: "none", borderRight: "none", textAlign: "center", fontSize: "16px", fontWeight: "600", color: "#111827", outline: "none" }}
                  />
                  <button 
                    onClick={() => setDisplayOrder(displayOrder + 1)}
                    style={{ width: "46px", height: "46px", border: "1px solid #E5E7EB", borderLeft: "none", borderRadius: "0 10px 10px 0", backgroundColor: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748B" }}
                  >
                    <PlusIcon size={18} />
                  </button>
                </div>
              </div>
              <div style={{ fontSize: "13px", color: "#64748B" }}>Lower numbers appear earlier in the history timeline.</div>
            </div>
          </div>

          {/* SECTION 3: Timeline Preview */}
          <div style={{ border: "1px solid #E5E7EB", borderRadius: "16px", backgroundColor: "#FFFFFF", padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <Clock size={18} color="#5B3DF5" />
              <div style={{ fontSize: "16px", fontWeight: "700", color: "#111827" }}>History Sequence Preview</div>
            </div>
            
            <div style={{ position: "relative", paddingLeft: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Vertical line */}
              <div style={{ position: "absolute", left: "12px", top: "12px", bottom: "12px", width: "2px", backgroundColor: "#E2E8F0" }}></div>

              {(() => {
                const studentHistory = history.filter(h => h.student_id === studentId);
                const baseHistory = isEditMode && editRow
                  ? studentHistory.filter(h => h.id !== editRow.id)
                  : studentHistory;

                const previewItems = baseHistory.map(h => ({
                  id: h.id,
                  ref: h.contract_ref,
                  date: h.created_at,
                  order: h.display_order,
                  isNew: false
                }));

                previewItems.push({
                  id: "new-item",
                  ref: contractRef || "—",
                  date: new Date().toISOString(),
                  order: displayOrder,
                  isNew: true
                });

                previewItems.sort((a, b) => a.order - b.order);

                return previewItems.map((item, idx) => (
                  <div key={item.id} style={{ position: "relative", backgroundColor: item.isNew ? "#F8FAFF" : "transparent", padding: item.isNew ? "16px" : "0", borderRadius: "12px", border: item.isNew ? "1px dashed #C7D2FE" : "none" }}>
                    {/* Node */}
                    <div style={{ position: "absolute", left: item.isNew ? "-34px" : "-32px", top: "50%", transform: "translateY(-50%)", width: "24px", height: "24px", borderRadius: "50%", backgroundColor: item.isNew ? "#5B3DF5" : "#E2E8F0", color: item.isNew ? "#FFF" : "#64748B", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 4px #FFFFFF" }}>
                      {idx + 1}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: item.isNew ? "#FFFFFF" : "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", border: item.isNew ? "1px solid #5B3DF5" : "1px solid #E2E8F0" }}>
                          <FileText size={18} color={item.isNew ? "#5B3DF5" : "#64748B"} />
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                            <div style={{ fontSize: "16px", fontWeight: "700", color: "#111827" }}>{item.ref}</div>
                            {item.isNew && <div style={{ fontSize: "11px", fontWeight: "600", color: "#5B3DF5", backgroundColor: "#F3F0FF", padding: "2px 6px", borderRadius: "12px" }}>New</div>}
                          </div>
                          <div style={{ fontSize: "13px", color: "#64748B" }}>
                            {item.isNew ? "New historical contract" : formatDate(item.date)} • {item.isNew ? "Will be " : ""}Display Order: {item.order}
                          </div>
                        </div>
                      </div>
                      
                      {item.isNew ? (
                        <div style={{ backgroundColor: "#F3F0FF", color: "#5B3DF5", fontSize: "12px", fontWeight: "600", padding: "4px 10px", borderRadius: "12px" }}>Pending</div>
                      ) : (
                        <div style={{ backgroundColor: "#DCFCE7", color: "#16A34A", fontSize: "12px", fontWeight: "600", padding: "4px 10px", borderRadius: "12px" }}>Active</div>
                      )}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div style={{ padding: "20px 24px", borderTop: "1px solid #E5E7EB", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button 
            onClick={onClose}
            style={{ height: "46px", padding: "0 24px", borderRadius: "10px", border: "1px solid #E5E7EB", backgroundColor: "#FFFFFF", color: "#111827", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{ height: "46px", padding: "0 24px", borderRadius: "10px", border: "none", background: "linear-gradient(90deg, #6D28D9 0%, #5B3DF5 100%)", color: "#FFFFFF", fontWeight: "600", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", boxShadow: "0 4px 14px rgba(91, 61, 245, 0.25)" }}
          >
            <Save size={16} /> {isSubmitting ? "Saving..." : (isEditMode ? "Save Changes" : "Add History Row")}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};
