import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Save, User, Calendar, Clock, Layers, ShieldCheck, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const [displayOrder, setDisplayOrder] = useState("1");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

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
      setDisplayOrder(editRow.display_order?.toString() ?? "1");
    }
  }, [editRow]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!studentId) {
      errors.studentId = "Student selection is required.";
    }
    if (!contractRef.trim()) {
      errors.contractRef = "Contract reference is required.";
    }
    if (displayOrder.trim() === "" || isNaN(Number(displayOrder)) || Number(displayOrder) < 0) {
      errors.displayOrder = "Display order must be a positive integer.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const formatDateTime = (dateTimeStr?: string | null) => {
    if (!dateTimeStr) return "—";
    const d = new Date(dateTimeStr);
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError(null);
    showLoading(isEditMode ? "Updating..." : "Creating...", "Please wait");
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
      const msg = err.message || `Failed to ${isEditMode ? "update" : "create"} history row.`;
      setApiError(msg);
      showError(isEditMode ? "Update Failed" : "Creation Failed", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const studentOptions = [
    { label: "Select Student...", value: "" },
    ...students.map((s) => ({
      label: `${s.student_name} ${s.last_name || ""}`.trim() + (s.passport_no ? ` (${s.passport_no})` : ""),
      value: s.id,
    })),
  ];

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const selectedStudent = students.find((s) => s.id === studentId);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <Card 
        className="relative w-full max-w-lg bg-white rounded-xl shadow-xl flex flex-col" 
        style={{ overflow: "visible" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dialog-header">
          <div>
            <h3 className="dialog-title">{isEditMode ? "Edit Contract History Log" : "Add Contract History Log"}</h3>
            <span style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))" }}>
              {isEditMode 
                ? "Update historical contract reference and ordering parameters." 
                : "Manually archive a historical contract record for a student."}
            </span>
          </div>
          <button className="dialog-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="dialog-body" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {apiError && (
              <div style={{
                padding: "0.75rem 1rem",
                backgroundColor: "hsl(var(--destructive) / 0.1)",
                border: "1px solid hsl(var(--destructive) / 0.2)",
                borderRadius: "var(--radius-md)",
                color: "hsl(var(--destructive))",
                fontSize: "0.8125rem",
                fontWeight: 500
              }}>
                {apiError}
              </div>
            )}

            {/* Student Select */}
            <div className="form-group">
              <label className="form-label">Student *</label>
              <Select
                value={studentId}
                onChange={(e) => {
                  setStudentId(e.target.value);
                  setFieldErrors(prev => {
                    const next = { ...prev };
                    delete next.studentId;
                    return next;
                    });
                }}
                options={studentOptions}
                disabled={isLoadingStudents || isSubmitting || isEditMode}
                style={{
                  borderColor: fieldErrors.studentId ? "hsl(var(--destructive))" : undefined,
                  fontSize: "0.875rem"
                }}
              />
              {fieldErrors.studentId && <span className="form-error">{fieldErrors.studentId}</span>}
              {isEditMode && (
                <span style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))", marginTop: "0.25rem" }}>
                  Student relation cannot be changed after creation.
                </span>
              )}
            </div>

            {/* A. Student Preview Card */}
            {selectedStudent && (
              <div style={{
                padding: "1rem",
                backgroundColor: "hsl(var(--secondary) / 0.15)",
                border: "1px solid hsl(var(--border) / 0.8)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                marginTop: "-0.5rem",
                marginBottom: "0.5rem"
              }} className="animate-slide-in">
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "50%",
                    backgroundColor: "hsl(var(--primary) / 0.08)",
                    color: "hsl(var(--primary))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.875rem"
                  }}>
                    {selectedStudent.student_name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "ST"}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                      {selectedStudent.student_name} {selectedStudent.last_name || ""}
                    </span>
                    {selectedStudent.passport_no && (
                      <span style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))", fontFamily: "var(--font-mono, monospace)" }}>
                        ID: {selectedStudent.passport_no}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", borderTop: "1px solid hsl(var(--border) / 0.3)", paddingTop: "0.75rem", fontSize: "0.75rem" }}>
                  <div>
                    <span style={{ display: "block", color: "hsl(var(--muted-foreground))", fontWeight: 600 }}>Resident Status</span>
                    <span style={{ fontWeight: 600, color: "hsl(var(--success))" }}>Active Resident</span>
                  </div>
                  <div>
                    <span style={{ display: "block", color: "hsl(var(--muted-foreground))", fontWeight: 600 }}>Active Contract Reference</span>
                    <span style={{ fontFamily: "var(--font-mono, monospace)", fontWeight: 600 }}>
                      HC-2026-{selectedStudent.id.substring(0, 4).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Contract Reference */}
            <div className="form-group">
              <label className="form-label">Contract Reference *</label>
              <Input
                value={contractRef}
                onChange={(e) => {
                  setContractRef(e.target.value);
                  setFieldErrors(prev => {
                    const next = { ...prev };
                    delete next.contractRef;
                    return next;
                  });
                }}
                placeholder="e.g. HC-2025-0019"
                disabled={isSubmitting}
                style={{
                  borderColor: fieldErrors.contractRef ? "hsl(var(--destructive))" : undefined,
                  fontSize: "0.875rem"
                }}
              />
              {fieldErrors.contractRef && <span className="form-error">{fieldErrors.contractRef}</span>}
              <span style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))", marginTop: "0.25rem", display: "block" }}>
                Example: <code style={{ fontFamily: "var(--font-mono, monospace)", fontWeight: 600 }}>HC-2026-001</code>. Used for historical contract tracking and audit records.
              </span>
            </div>

            {/* Display Order */}
            <div className="form-group">
              <label className="form-label">Display Order *</label>
              <Input
                type="number"
                value={displayOrder}
                onChange={(e) => {
                  setDisplayOrder(e.target.value);
                  setFieldErrors(prev => {
                    const next = { ...prev };
                    delete next.displayOrder;
                    return next;
                  });
                }}
                placeholder="e.g. 1"
                disabled={isSubmitting}
                min="0"
                style={{
                  borderColor: fieldErrors.displayOrder ? "hsl(var(--destructive))" : undefined,
                  fontSize: "0.875rem"
                }}
              />
              {fieldErrors.displayOrder && <span className="form-error">{fieldErrors.displayOrder}</span>}
              <span style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))", marginTop: "0.25rem", display: "block" }}>
                Lower numbers appear earlier in the history timeline.
              </span>
            </div>

            {/* Timeline Preview */}
            {studentId && (
              <div style={{
                marginTop: "0.5rem",
                padding: "1rem",
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border) / 0.8)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem"
              }}>
                <span style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "hsl(var(--muted-foreground))", letterSpacing: "0.05em" }}>
                  {isEditMode ? "Current Timeline Position" : "History Sequence Preview"}
                </span>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", position: "relative", paddingLeft: "1.25rem" }}>
                  <div style={{
                    position: "absolute",
                    left: "5px",
                    top: "8px",
                    bottom: "8px",
                    width: "2px",
                    backgroundColor: "hsl(var(--border) / 0.6)"
                  }} />

                  {(() => {
                    const studentHistory = history.filter(h => h.student_id === studentId);
                    const baseHistory = isEditMode && editRow
                      ? studentHistory.filter(h => h.id !== editRow.id)
                      : studentHistory;

                    const previewItems = baseHistory.map(h => ({
                      id: h.id,
                      ref: h.contract_ref,
                      order: h.display_order,
                      isCurrent: false,
                      isNew: false
                    }));

                    previewItems.push({
                      id: isEditMode && editRow ? editRow.id : "new-preview-item",
                      ref: contractRef.trim() || (isEditMode ? "Current" : "New Contract"),
                      order: Number(displayOrder) || 0,
                      isCurrent: isEditMode,
                      isNew: !isEditMode
                    });

                    previewItems.sort((a, b) => a.order - b.order);
                    const circleNumbers = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];

                    return previewItems.map((item, idx) => {
                      const dotColor = item.isNew || item.isCurrent 
                        ? "hsl(var(--primary))" 
                        : "hsl(var(--muted-foreground) / 0.6)";

                      return (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem", position: "relative" }}>
                          <div style={{
                            position: "absolute",
                            left: "-1.25rem",
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            backgroundColor: dotColor,
                            border: "2px solid hsl(var(--card))",
                            zIndex: 2
                          }} />
                          
                          <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: item.isNew || item.isCurrent ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}>
                            {circleNumbers[idx] || `${idx + 1}`}
                          </span>
                          
                          <span style={{ 
                            fontFamily: "var(--font-mono, monospace)", 
                            fontSize: "0.8125rem",
                            fontWeight: item.isNew || item.isCurrent ? 700 : 500,
                            color: item.isNew || item.isCurrent ? "hsl(var(--primary))" : "hsl(var(--foreground))"
                          }}>
                            {item.ref}
                          </span>

                          {item.isNew && (
                            <Badge variant="success" style={{ fontSize: "0.625rem", padding: "0 0.25rem", height: "16px", display: "inline-flex", alignItems: "center" }}>
                              New
                            </Badge>
                          )}
                          {item.isCurrent && (
                            <span style={{ fontSize: "0.75rem", color: "hsl(var(--primary))", fontWeight: 600 }}>
                              ← Current
                            </span>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {/* Edit Audit Metadata Cards */}
            {isEditMode && editRow && (
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
                marginTop: "0.5rem",
                paddingTop: "0.75rem",
                borderTop: "1px solid hsl(var(--border) / 0.5)"
              }}>
                <div style={{ gridColumn: "span 2" }}>
                  <span style={{ display: "block", fontSize: "0.7125rem", fontWeight: 600, color: "hsl(var(--muted-foreground))", textTransform: "uppercase" }}>Record ID</span>
                  <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.75rem", color: "hsl(var(--foreground))" }}>{editRow.id}</span>
                </div>
                <div>
                  <span style={{ display: "block", fontSize: "0.7125rem", fontWeight: 600, color: "hsl(var(--muted-foreground))", textTransform: "uppercase" }}>Created Date</span>
                  <span style={{ fontSize: "0.75rem", color: "hsl(var(--foreground))" }}>{formatDateTime(editRow.created_at)}</span>
                </div>
                <div>
                  <span style={{ display: "block", fontSize: "0.7125rem", fontWeight: 600, color: "hsl(var(--muted-foreground))", textTransform: "uppercase" }}>Last Updated</span>
                  <span style={{ fontSize: "0.75rem", color: "hsl(var(--foreground))" }}>{formatDateTime(editRow.updated_at)}</span>
                </div>
              </div>
            )}

          </div>

          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
            padding: "1rem 1.5rem",
            borderTop: "1px solid hsl(var(--border))",
            backgroundColor: "hsl(var(--card))",
          }}>
            <Button variant="secondary" size="md" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" disabled={isSubmitting} style={{ gap: "0.375rem" }}>
              <Save size={16} />
              <span>{isSubmitting ? (isEditMode ? "Saving..." : "Adding...") : (isEditMode ? "Save Changes" : "Add History Row")}</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>,
    document.body
  );
};
