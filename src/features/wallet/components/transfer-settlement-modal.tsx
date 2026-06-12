"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Save, AlertTriangle, ShieldCheck, HelpCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { WalletApi } from "../api";
import { RoomAllotment } from "../../room-allotments/types";
import { RoomTransferSettlePayload, RoomTransferSettleResult } from "../types";

interface TransferSettlementModalProps {
  studentId: string;
  studentName: string;
  currentWalletBalance: number;
  onClose: () => void;
  onSuccess: (result: RoomTransferSettleResult) => void;
}

export const TransferSettlementModal: React.FC<TransferSettlementModalProps> = ({
  studentId,
  studentName,
  currentWalletBalance,
  onClose,
  onSuccess,
}) => {
  const [allotments, setAllotments] = useState<RoomAllotment[]>([]);
  const [isLoadingAllotments, setIsLoadingAllotments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Form Fields
  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [calculationMode, setCalculationMode] = useState<"full_month_round" | "daily_prorata">(
    "full_month_round"
  );
  const [remarks, setRemarks] = useState("");

  // Advanced Manual Overrides (strings for input handling)
  const [overrideMonthsUsedOld, setOverrideMonthsUsedOld] = useState("");
  const [overrideMonthsRemaining, setOverrideMonthsRemaining] = useState("");
  const [overrideOldMonthlyRent, setOverrideOldMonthlyRent] = useState("");
  const [overrideOldTotalPaid, setOverrideOldTotalPaid] = useState("");
  const [overrideNewMonthlyRent, setOverrideNewMonthlyRent] = useState("");

  // Auto-calculated state for preview
  const [computedOldTotalPaid, setComputedOldTotalPaid] = useState(0);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);

  // Load student's allotments
  useEffect(() => {
    const fetchAllotments = async () => {
      setIsLoadingAllotments(true);
      try {
        const res = await WalletApi.getStudentRoomAllotments(studentId);
        setAllotments(res.data);
        
        // Pick default source and target
        const active = res.data.find((a) => a.status === "Active");
        const pending = res.data.find((a) => a.status === "Pending" || a.status === "Draft");
        
        if (active) setSourceId(active.id);
        if (pending) setTargetId(pending.id);
      } catch (err) {
        console.error("Failed to load student allotments", err);
      } finally {
        setIsLoadingAllotments(false);
      }
    };
    fetchAllotments();
  }, [studentId]);

  // Load and sum completed payments for source allotment
  useEffect(() => {
    if (!sourceId) {
      setComputedOldTotalPaid(0);
      return;
    }
    const fetchPayments = async () => {
      setIsLoadingPayments(true);
      try {
        // We use the centralized API client or direct http
        const res: any = await WalletApi.getStudentRoomAllotments(studentId); // or fetch payments directly
        // Instead, let's fetch payments directly using http client
        const paymentsRes: any = await require("@/lib/http").http.get(
          "/room-allotment-payments",
          { params: { room_allotment_id: sourceId, student_id: studentId } }
        );
        const total = (paymentsRes.data || []).reduce(
          (sum: number, p: any) => sum + (p.total_amount ? Number(p.total_amount) : 0),
          0
        );
        setComputedOldTotalPaid(total);
      } catch (err) {
        console.error("Failed to fetch allotment payments for preview", err);
        setComputedOldTotalPaid(0);
      } finally {
        setIsLoadingPayments(false);
      }
    };
    fetchPayments();
  }, [sourceId, studentId]);

  const selectedSource = allotments.find((a) => a.id === sourceId);
  const selectedTarget = allotments.find((a) => a.id === targetId);

  // Math calculation logic matching the NestJS backend
  const calculatePreview = () => {
    if (!selectedSource || !selectedTarget) return null;

    // Start Date
    const startDate = selectedSource.created_at
      ? new Date(selectedSource.created_at)
      : new Date();
    const effDate = new Date(effectiveDate);

    // Stay days diff
    const msDiff = Math.max(0, effDate.getTime() - startDate.getTime());
    const daysDiff = msDiff / (1000 * 60 * 60 * 24);

    let monthsStayed = 0;
    if (daysDiff > 0) {
      if (calculationMode === "daily_prorata") {
        monthsStayed = daysDiff / 30.0;
      } else {
        // full_month_round
        const startYear = startDate.getFullYear();
        const startMonth = startDate.getMonth();
        const startDay = startDate.getDate();
        const effYear = effDate.getFullYear();
        const effMonth = effDate.getMonth();
        const effDay = effDate.getDate();

        let months = (effYear - startYear) * 12 + (effMonth - startMonth);
        if (effDay > startDay) months += 1;
        if (months <= 0) months = 1;
        monthsStayed = months;
      }
    }

    // Parameters
    const oldMonthlyRent = overrideOldMonthlyRent !== ""
      ? Number(overrideOldMonthlyRent)
      : selectedSource.rent ?? 0;

    const monthsUsedOld = overrideMonthsUsedOld !== ""
      ? Number(overrideMonthsUsedOld)
      : monthsStayed;

    const oldTotalPaid = overrideOldTotalPaid !== ""
      ? Number(overrideOldTotalPaid)
      : computedOldTotalPaid;

    const newMonthlyRent = overrideNewMonthlyRent !== ""
      ? Number(overrideNewMonthlyRent)
      : selectedTarget.rent ?? 0;

    const monthsRemaining = overrideMonthsRemaining !== ""
      ? Number(overrideMonthsRemaining)
      : 12 - Math.min(12, monthsUsedOld); // Assuming 12 months lease default if empty

    // Consumed stay
    const oldConsumedAmount = Number((monthsUsedOld * oldMonthlyRent).toFixed(2));
    const oldUnusedAmount = Math.max(0, Number((oldTotalPaid - oldConsumedAmount).toFixed(2)));

    // New allotment requirements
    const newRequiredAmount = Number((newMonthlyRent * monthsRemaining).toFixed(2));

    // Wallet credit details
    const walletCreditAdded = oldUnusedAmount;
    const walletTotalBalance = currentWalletBalance + walletCreditAdded;
    
    const walletCreditApplied = Math.min(walletTotalBalance, newRequiredAmount);
    const remainingPayable = Number((newRequiredAmount - walletCreditApplied).toFixed(2));
    const walletBalanceAfter = Number((walletTotalBalance - walletCreditApplied).toFixed(2));

    return {
      monthsStayed,
      oldMonthlyRent,
      monthsUsedOld,
      oldTotalPaid,
      newMonthlyRent,
      monthsRemaining,
      oldConsumedAmount,
      oldUnusedAmount,
      newRequiredAmount,
      walletCreditAdded,
      walletCreditApplied,
      remainingPayable,
      walletBalanceAfter,
      startDate,
    };
  };

  const preview = calculatePreview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId || !targetId) {
      setApiError("Please select both source and target allotments.");
      return;
    }
    if (new Date(effectiveDate) < (selectedSource?.created_at ? new Date(selectedSource.created_at) : new Date())) {
      setApiError("Effective transfer date cannot be earlier than stay start date.");
      return;
    }

    setIsSubmitting(true);
    setApiError(null);
    try {
      const payload: RoomTransferSettlePayload = {
        student_id: studentId,
        source_room_allotment_id: sourceId,
        target_room_allotment_id: targetId,
        effective_date: effectiveDate,
        calculation_mode: calculationMode,
        remarks: remarks.trim() || undefined,
        months_used_old: overrideMonthsUsedOld !== "" ? Number(overrideMonthsUsedOld) : undefined,
        months_remaining: overrideMonthsRemaining !== "" ? Number(overrideMonthsRemaining) : undefined,
        old_monthly_rent: overrideOldMonthlyRent !== "" ? Number(overrideOldMonthlyRent) : undefined,
        old_total_paid: overrideOldTotalPaid !== "" ? Number(overrideOldTotalPaid) : undefined,
        new_monthly_rent: overrideNewMonthlyRent !== "" ? Number(overrideNewMonthlyRent) : undefined,
      };

      const result = await WalletApi.settleRoomTransfer(payload);
      onSuccess(result);
    } catch (err: any) {
      setApiError(err.message || "Failed to execute transfer settlement. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sourceOptions = allotments
    .filter((a) => a.status === "Active")
    .map((a) => ({
      label: `Room ${a.room_no} (${a.hostel_name || "Hostel"}) - Active`,
      value: a.id,
    }));

  const targetOptions = allotments
    .filter((a) => a.status === "Pending" || a.status === "Draft")
    .map((a) => ({
      label: `Room ${a.room_no} (${a.hostel_name || "Hostel"}) - ${a.status}`,
      value: a.id,
    }));

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
  };

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
        className="relative w-full animate-scale-in max-w-[750px] overflow-visible rounded-xl border-border/80 shadow-xl flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="dialog-header p-6 border-b border-border/60">
          <div>
            <h3 className="dialog-title text-xl font-extrabold text-foreground flex items-center gap-2 m-0">
              <CreditCard size={20} className="text-primary" />
              <span>Transfer Settlement Wizard</span>
            </h3>
            <span className="text-[13px] text-muted-foreground mt-1 block">
              Settle room stay credits, compute refunds, and migrate <strong>{studentName}</strong> to a new room.
            </span>
          </div>
          <button className="dialog-close-btn top-6 right-6" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div 
            className="dialog-body flex flex-col gap-6 max-h-[60vh] overflow-y-auto p-6 pr-5" 
          >
            {apiError && (
              <div className="px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-[13px] font-medium flex items-center gap-2">
                <AlertTriangle size={15} />
                <span>{apiError}</span>
              </div>
            )}

            {/* Target Allotment Empty Warning Notice */}
            {!isLoadingAllotments && targetOptions.length === 0 && (
              <div className="px-5 py-4 bg-warning/10 border border-warning/20 rounded-md text-warning flex gap-3 items-start text-[13px] leading-relaxed">
                <AlertTriangle size={18} className="mt-0.5 shrink-0 text-warning" />
                <div>
                  <span className="font-bold block mb-0.5">Target Allotment Required</span>
                  <span>
                    No draft or pending room allotments found for this student. You must create the target allotment in <strong>Pending</strong> or <strong>Draft</strong> state under the Allotments panel first before running a transfer settlement.
                  </span>
                </div>
              </div>
            )}

            {/* Section 1: Primary Parameters */}
            <div className="flex flex-col gap-4">
              <h4 className="m-0 text-[13px] font-extrabold uppercase tracking-widest text-muted-foreground">
                1. Settlement Configurations
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Source Selection */}
                <div className="form-group">
                  <label className="form-label font-bold">Source Allotment (Active) *</label>
                  {isLoadingAllotments ? (
                    <div className="h-10 bg-secondary/20 rounded-md animate-pulse" />
                  ) : sourceOptions.length === 0 ? (
                    <div className="text-[13px] text-destructive font-semibold py-2 flex items-center gap-1.5">
                      <AlertTriangle size={14} />
                      <span>No active residency found to migrate.</span>
                    </div>
                  ) : (
                    <Select
                      value={sourceId}
                      onChange={(e) => setSourceId(e.target.value)}
                      options={sourceOptions}
                      disabled={isSubmitting}
                      className="text-sm h-10"
                    />
                  )}
                </div>

                {/* Target Selection */}
                <div className="form-group">
                  <label className="form-label font-bold">Target Allotment (Pending/Draft) *</label>
                  {isLoadingAllotments ? (
                    <div className="h-10 bg-secondary/20 rounded-md animate-pulse" />
                  ) : targetOptions.length === 0 ? (
                    <div className="text-[13px] text-muted-foreground px-3 py-2 bg-secondary/10 border border-dashed border-border rounded-sm h-10 flex items-center">
                      No valid target allotments found.
                    </div>
                  ) : (
                    <Select
                      value={targetId}
                      onChange={(e) => setTargetId(e.target.value)}
                      options={[{ label: "Select target room...", value: "" }, ...targetOptions]}
                      disabled={isSubmitting}
                      className="text-sm h-10"
                    />
                  )}
                </div>

                {/* Transfer Date */}
                <div className="form-group">
                  <label className="form-label font-bold">Effective Transfer Date *</label>
                  <input
                    type="date"
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                    className="form-input text-sm h-10"
                    required
                    disabled={isSubmitting}
                  />
                  <span className="text-xs text-muted-foreground mt-1 block">
                    Billing stay cycles are updated starting from this date.
                  </span>
                </div>

                {/* Calculation Mode */}
                <div className="form-group">
                  <label className="form-label font-bold">Calculation Mode</label>
                  <Select
                    value={calculationMode}
                    onChange={(e) => setCalculationMode(e.target.value as any)}
                    options={[
                      { label: "Full Month Round Up", value: "full_month_round" },
                      { label: "Daily Pro-rata", value: "daily_prorata" },
                    ]}
                    disabled={isSubmitting}
                    className="text-sm h-10"
                  />
                  <span className="text-xs text-muted-foreground mt-1 block">
                    Daily computes stays by dividing days; Monthly rounds up partial stay durations.
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Advanced Overrides */}
            <div className="border border-border/80 rounded-md overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full px-5 py-3.5 bg-secondary/10 border-none flex justify-between items-center cursor-pointer text-[13px] font-bold text-foreground transition-colors hover:bg-secondary/20"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle size={15} className="text-primary" />
                  <span>Advanced Calculation Overrides (Optional)</span>
                </span>
                <span className={`text-xs text-muted-foreground transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>
              {showAdvanced && (
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-border/60 bg-card">
                  <Input
                    label="Months Used (Old Allotment)"
                    type="number"
                    placeholder="e.g. 3.5"
                    value={overrideMonthsUsedOld}
                    onChange={(e) => setOverrideMonthsUsedOld(e.target.value)}
                    className="text-[13px] h-9"
                  />
                  <Input
                    label="Months Remaining (New Allotment)"
                    type="number"
                    placeholder="e.g. 8.5"
                    value={overrideMonthsRemaining}
                    onChange={(e) => setOverrideMonthsRemaining(e.target.value)}
                    className="text-[13px] h-9"
                  />
                  <Input
                    label="Old Monthly Rent ($)"
                    type="number"
                    placeholder="e.g. 450"
                    value={overrideOldMonthlyRent}
                    onChange={(e) => setOverrideOldMonthlyRent(e.target.value)}
                    className="text-[13px] h-9"
                  />
                  <Input
                    label="Old Total Paid Amount ($)"
                    type="number"
                    placeholder="e.g. 1350"
                    value={overrideOldTotalPaid}
                    onChange={(e) => setOverrideOldTotalPaid(e.target.value)}
                    className="text-[13px] h-9"
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="New Monthly Rent ($)"
                      type="number"
                      placeholder="e.g. 500"
                      value={overrideNewMonthlyRent}
                      onChange={(e) => setOverrideNewMonthlyRent(e.target.value)}
                      className="text-[13px] h-9"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Remarks */}
            <div className="form-group">
              <label className="form-label font-bold">Transfer Remarks / Justification</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Write justification remarks for staying audit logs..."
                className="form-input text-sm min-h-[60px] resize-y font-inherit p-2.5"
                disabled={isSubmitting}
              />
            </div>

            {/* LIVE PREVIEW SECTION */}
            {preview && (
              <div className="mt-2 p-5 bg-primary/5 border border-primary/10 rounded-md flex flex-col gap-4 shadow-sm">
                <h4 className="m-0 text-[13px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-2">
                  <ShieldCheck size={16} />
                  <span>Settlement Preview Calculator</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                  {/* Left Column: Source Stay */}
                  <div className="flex flex-col gap-2 bg-card p-4 rounded-sm border border-border/60 text-[13px]">
                    <span className="font-bold uppercase text-[11px] text-muted-foreground tracking-widest border-b border-border/50 pb-1 mb-1">
                      Source Tenancy (Old)
                    </span>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stay Started:</span>
                      <span className="font-semibold">{preview.startDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration Stayed:</span>
                      <span className="font-semibold">{preview.monthsUsedOld.toFixed(2)} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Paid Amount:</span>
                      <span className="font-semibold font-mono">{formatPrice(preview.oldTotalPaid)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Consumed Rent Stay:</span>
                      <span className="font-semibold text-destructive font-mono">
                        -{formatPrice(preview.oldConsumedAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-dashed border-border mt-1">
                      <span className="font-bold text-foreground">Wallet Refund Credit:</span>
                      <span className="font-extrabold text-success font-mono text-[15px]">
                        +{formatPrice(preview.walletCreditAdded)}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Target Stay */}
                  <div className="flex flex-col gap-2 bg-card p-4 rounded-sm border border-border/60 text-[13px]">
                    <span className="font-bold uppercase text-[11px] text-muted-foreground tracking-widest border-b border-border/50 pb-1 mb-1">
                      Target Tenancy (New)
                    </span>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Migrated Lease Term:</span>
                      <span className="font-semibold">{preview.monthsRemaining.toFixed(1)} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Target Total Required:</span>
                      <span className="font-semibold font-mono">{formatPrice(preview.newRequiredAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Wallet Credit Applied:</span>
                      <span className="font-semibold text-primary font-mono">
                        -{formatPrice(preview.walletCreditApplied)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-dashed border-border mt-1">
                      <span className="font-bold text-foreground">Remaining Payable:</span>
                      <span className="font-extrabold text-foreground font-mono text-[15px]">
                        {formatPrice(preview.remainingPayable)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Audit summary banner */}
                <div className="flex justify-between items-center px-4 py-3 bg-secondary/10 rounded-sm text-[13px] border border-border/40">
                  <span className="font-bold text-muted-foreground">Final Student Wallet Balance After:</span>
                  <strong className="text-base text-primary font-mono">
                    {formatPrice(preview.walletBalanceAfter)}
                  </strong>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-border/60 bg-secondary/5">
            <Button variant="secondary" size="md" type="button" onClick={onClose} disabled={isSubmitting} className="h-10">
              Cancel
            </Button>
            <Button 
              variant="primary" 
              size="md" 
              type="submit" 
              disabled={isSubmitting || !sourceId || !targetId} 
              className="gap-1.5 h-10 shadow-sm shadow-primary/15"
            >
              <Save size={16} />
              <span>{isSubmitting ? "Executing..." : "Execute Settlement"}</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>,
    document.body
  );
};
