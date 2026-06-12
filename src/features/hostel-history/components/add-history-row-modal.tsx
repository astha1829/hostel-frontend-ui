"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { HostelHistoryApi } from "../api";
import { HostelOption } from "../types";

interface AddHistoryRowModalProps {
  roomAllotmentId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddHistoryRowModal: React.FC<AddHistoryRowModalProps> = ({
  roomAllotmentId,
  onClose,
  onSuccess,
}) => {
  const [hostels, setHostels] = useState<HostelOption[]>([]);
  const [isLoadingHostels, setIsLoadingHostels] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [hostelId, setHostelId] = useState("");
  const [floorRoomNo, setFloorRoomNo] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toTransferDate, setToTransferDate] = useState("");
  const [monthsElapsed, setMonthsElapsed] = useState("");
  const [idx, setIdx] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHostels = async () => {
      setIsLoadingHostels(true);
      try {
        const list = await HostelHistoryApi.getHostels();
        setHostels(list);
        if (list.length > 0) {
          setHostelId(list[0].id);
        }
      } catch (err) {
        console.error("Failed to retrieve hostels list", err);
      } finally {
        setIsLoadingHostels(false);
      }
    };
    fetchHostels();
  }, []);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!hostelId) {
      errors.hostelId = "Hostel selection is required.";
    }
    if (!floorRoomNo.trim()) {
      errors.floorRoomNo = "Floor & Room designation is required.";
    }
    if (fromDate && toTransferDate) {
      const start = new Date(fromDate);
      const end = new Date(toTransferDate);
      if (end < start) {
        errors.toTransferDate = "Transfer Date cannot be earlier than From Date.";
      }
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError(null);
    try {
      const payload: any = {
        room_allotment_id: roomAllotmentId,
        hostel_id: hostelId,
        floor_room_no: floorRoomNo.trim(),
        from_date: fromDate || undefined,
        to_transfer_date: toTransferDate || undefined,
        months_elapsed: monthsElapsed ? Number(monthsElapsed) : undefined,
        idx: idx ? Number(idx) : undefined,
      };

      await HostelHistoryApi.createHostelHistory(payload);
      onSuccess();
    } catch (err: any) {
      setApiError(err.message || "Failed to record stay history entry. Please verify fields.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hostelOptions = [
    { label: "Select Hostel...", value: "" },
    ...hostels.map((h) => ({
      label: h.hostel_name,
      value: h.id,
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
            <h3 className="dialog-title">Add History Row</h3>
            <span style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))" }}>
              Manually insert a stay duration and room transfer timeline record.
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

            {/* Hostel Select */}
            <div className="form-group">
              <label className="form-label">Hostel *</label>
              <Select
                value={hostelId}
                onChange={(e) => {
                  setHostelId(e.target.value);
                  setFieldErrors(prev => {
                    const next = { ...prev };
                    delete next.hostelId;
                    return next;
                  });
                }}
                options={hostelOptions}
                disabled={isLoadingHostels || isSubmitting}
                style={{
                  borderColor: fieldErrors.hostelId ? "hsl(var(--destructive))" : undefined,
                  fontSize: "0.875rem"
                }}
              />
              {fieldErrors.hostelId && <span className="form-error">{fieldErrors.hostelId}</span>}
            </div>

            {/* Floor & Room designation */}
            <div className="form-group">
              <label className="form-label">Floor & Room *</label>
              <Input
                value={floorRoomNo}
                onChange={(e) => {
                  setFloorRoomNo(e.target.value);
                  setFieldErrors(prev => {
                    const next = { ...prev };
                    delete next.floorRoomNo;
                    return next;
                  });
                }}
                placeholder="e.g. Floor 3 - Room 327"
                disabled={isSubmitting}
                style={{
                  borderColor: fieldErrors.floorRoomNo ? "hsl(var(--destructive))" : undefined,
                  fontSize: "0.875rem"
                }}
              />
              {fieldErrors.floorRoomNo && <span className="form-error">{fieldErrors.floorRoomNo}</span>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {/* From Date */}
              <div className="form-group">
                <label className="form-label">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="form-input"
                  style={{ fontSize: "0.875rem" }}
                  disabled={isSubmitting}
                />
              </div>

              {/* Transfer Date */}
              <div className="form-group">
                <label className="form-label">Transfer Date</label>
                <input
                  type="date"
                  value={toTransferDate}
                  onChange={(e) => {
                    setToTransferDate(e.target.value);
                    setFieldErrors(prev => {
                      const next = { ...prev };
                      delete next.toTransferDate;
                      return next;
                    });
                  }}
                  className="form-input"
                  style={{
                    borderColor: fieldErrors.toTransferDate ? "hsl(var(--destructive))" : undefined,
                    fontSize: "0.875rem"
                  }}
                  disabled={isSubmitting}
                />
                {fieldErrors.toTransferDate && <span className="form-error">{fieldErrors.toTransferDate}</span>}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {/* Months Elapsed */}
              <div className="form-group">
                <label className="form-label">Months Elapsed</label>
                <Input
                  type="number"
                  value={monthsElapsed}
                  onChange={(e) => setMonthsElapsed(e.target.value)}
                  placeholder="e.g. 6"
                  disabled={isSubmitting}
                  style={{ fontSize: "0.875rem" }}
                  min="0"
                />
              </div>

              {/* Index (idx) */}
              <div className="form-group">
                <label className="form-label">Row Order Index (idx)</label>
                <Input
                  type="number"
                  value={idx}
                  onChange={(e) => setIdx(e.target.value)}
                  placeholder="e.g. 1"
                  disabled={isSubmitting}
                  style={{ fontSize: "0.875rem" }}
                  min="0"
                />
              </div>
            </div>

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
              <span>{isSubmitting ? "Adding..." : "Add Row"}</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>,
    document.body
  );
};
