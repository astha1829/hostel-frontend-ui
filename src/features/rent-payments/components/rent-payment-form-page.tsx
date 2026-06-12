"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, X, Calendar, DollarSign, ListFilter, Plus, Info } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/loading-skeleton";
import { useRentPaymentForm } from "../hooks/use-rent-payment-form";
import { showCancelConfirm } from "@/utils/swal";

interface RentPaymentFormPageProps {
  id?: string;
}

export const RentPaymentFormPage: React.FC<RentPaymentFormPageProps> = ({ id }) => {
  const router = useRouter();

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
    students,
    contracts,
    allotments,
    allotmentPayments,
    contractEvents,
    isLoadingMetadata,
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

  if (isLoadingDetails) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <PageHeader
          title={id ? "Edit Rent Entry" : "New Rent Entry"}
          description="Fetching payment parameters from ledger..."
        />
        <TableSkeleton rows={8} />
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

  const contractOptions = [
    { label: "Select Contract...", value: "" },
    ...contracts.map((c) => ({
      label: `${c.contract_no} (${c.contract_type})`,
      value: c.id,
    })),
  ];

  const allotmentOptions = [
    { label: "Select Room Allotment...", value: "" },
    ...allotments.map((a) => ({
      label: a.hostel_name ? `${a.hostel_name} - Room ${a.room_no}` : `Room ${a.room_no}`,
      value: a.id,
    })),
  ];

  const allotmentPaymentOptions = [
    { label: "Select Linked Allotment Payment (Optional)...", value: "" },
    ...allotmentPayments.map((p) => {
      const code = p.room_allotment_name || `RAP-${p.id.substring(0, 5)}`;
      return {
        label: `${code} - Total: $${Number(p.total_amount).toFixed(2)}`,
        value: p.id,
      };
    }),
  ];

  const contractEventOptions = [
    { label: "Select Associated Event (Optional)...", value: "" },
    ...contractEvents.map((e) => ({
      label: e.event_no ? `${e.event_no} - ${e.action_type}` : `Event-${e.id.substring(0, 8)} (${e.action_type})`,
      value: e.id,
    })),
  ];

  const directionOptions = [
    { label: "Credit (+)", value: "credit" },
    { label: "Debit (-)", value: "debit" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title={id ? "Edit Rent Payment Entry" : "New Rent Payment Entry"}
        description={id ? "Modify financial ledger details or link references." : "Register a new rent payment entry, link billing month, and record directions."}
        backHref={id ? `/rent-payments/${id}` : "/rent-payments"}
        backText={id ? "Ledger Details" : "Rent Payments"}
      />

      {apiError && (
        <div className="py-4 px-5 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm font-medium">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        <div className="flex flex-col gap-6">
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* CARD 1: Ledger Identification */}
            <Card className="border-border/80 shadow-sm">
              <CardHeader className="border-b border-border/50 py-5 px-6">
                <CardTitle className="text-lg">Ledger Identification</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col gap-5">
                  
                  {/* Student Selection */}
                  <div className="form-group">
                    <label className="form-label">Student *</label>
                    <Select
                      value={formData.student_id}
                      onChange={(e) => handleStudentChange(e.target.value)}
                      options={studentOptions}
                      disabled={isLoadingMetadata || !!id}
                      className={fieldErrors.student_id ? "border-destructive" : ""}
                    />
                    {fieldErrors.student_id && <span className="form-error">{fieldErrors.student_id}</span>}
                  </div>

                  {/* Hostel Contract Selection */}
                  <div className="form-group">
                    <label className="form-label">Hostel Contract *</label>
                    <Select
                      value={formData.hostel_contract_id}
                      onChange={(e) => handleInputChange("hostel_contract_id", e.target.value)}
                      options={contractOptions}
                      disabled={!formData.student_id || !!id}
                      className={fieldErrors.hostel_contract_id ? "border-destructive" : ""}
                    />
                    {!formData.student_id && (
                      <span className="form-helper text-muted-foreground text-[13px]">Select a student first to load contracts.</span>
                    )}
                    {fieldErrors.hostel_contract_id && <span className="form-error">{fieldErrors.hostel_contract_id}</span>}
                  </div>

                  {/* Room Allotment Selection */}
                  <div className="form-group">
                    <label className="form-label">Room Allotment *</label>
                    <Select
                      value={formData.room_allotment_id}
                      onChange={(e) => handleInputChange("room_allotment_id", e.target.value)}
                      options={allotmentOptions}
                      disabled={!formData.student_id || !!id}
                      className={fieldErrors.room_allotment_id ? "border-destructive" : ""}
                    />
                    {!formData.student_id && (
                      <span className="form-helper text-muted-foreground text-[13px]">Select a student first to load room allotments.</span>
                    )}
                    {fieldErrors.room_allotment_id && <span className="form-error">{fieldErrors.room_allotment_id}</span>}
                  </div>

                  {/* Name / Entry Identifier */}
                  <div className="form-group">
                    <label className="form-label">Rent Payment Code / ID</label>
                    <Input
                      value={formData.name || ""}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="e.g. REC-12345 (Leave empty to auto-generate)"
                    />
                    <span className="form-helper text-muted-foreground text-[13px]">Alphanumeric voucher/payment identification code.</span>
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* CARD 2: Transaction Parameters */}
            <Card className="border-border/80 shadow-sm">
              <CardHeader className="border-b border-border/50 py-5 px-6">
                <CardTitle className="text-lg">Transaction Parameters</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col gap-5">
                  
                  {/* Against Month */}
                  <div className="form-group">
                    <label className="form-label">Against Month * (YYYY-MM)</label>
                    <Input
                      value={formData.against_month || ""}
                      onChange={(e) => handleInputChange("against_month", e.target.value)}
                      placeholder="e.g. 2026-06"
                      className={fieldErrors.against_month ? "border-destructive" : ""}
                    />
                    {fieldErrors.against_month && <span className="form-error">{fieldErrors.against_month}</span>}
                  </div>

                  {/* Direction */}
                  <div className="form-group">
                    <label className="form-label">Direction *</label>
                    <Select
                      value={formData.direction}
                      onChange={(e) => handleInputChange("direction", e.target.value)}
                      options={directionOptions}
                    />
                  </div>

                  {/* Amount */}
                  <div className="form-group">
                    <label className="form-label text-foreground font-bold">Amount * ($)</label>
                    <Input
                      type="number"
                      value={formData.amount ?? ""}
                      onChange={(e) => handleInputChange("amount", e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0.01"
                      className={`bg-secondary/15 font-bold text-[1.05rem] text-foreground ${fieldErrors.amount ? "border-destructive" : "border-border/80"}`}
                    />
                    {fieldErrors.amount && <span className="form-error">{fieldErrors.amount}</span>}
                  </div>

                  {/* Posting Datetime */}
                  <div className="form-group">
                    <label className="form-label">Posting Date/Time *</label>
                    <input
                      type="datetime-local"
                      value={formData.posting_datetime || ""}
                      onChange={(e) => handleInputChange("posting_datetime", e.target.value)}
                      className={`form-input w-full ${fieldErrors.posting_datetime ? "border-destructive" : ""}`}
                    />
                    {fieldErrors.posting_datetime && <span className="form-error">{fieldErrors.posting_datetime}</span>}
                  </div>

                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* CARD 3: Reference Linkages */}
            <Card className="border-border/80 shadow-sm">
              <CardHeader className="border-b border-border/50 py-5 px-6">
                <CardTitle className="text-lg">Reference Linkages</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col gap-5">
                  
                  {/* Room Allotment Payment */}
                  <div className="form-group">
                    <label className="form-label">Room Allotment Payment Link</label>
                    <Select
                      value={formData.room_allotment_payment_id}
                      onChange={(e) => handleInputChange("room_allotment_payment_id", e.target.value)}
                      options={allotmentPaymentOptions}
                      disabled={!formData.student_id}
                    />
                    {!formData.student_id && (
                      <span className="form-helper text-muted-foreground text-[13px]">Select a student first to load payments.</span>
                    )}
                  </div>

                  {/* Associated Contract Event */}
                  <div className="form-group">
                    <label className="form-label">Associated Contract Event</label>
                    <Select
                      value={formData.hostel_contract_event_id}
                      onChange={(e) => handleInputChange("hostel_contract_event_id", e.target.value)}
                      options={contractEventOptions}
                      disabled={!formData.student_id}
                    />
                    {!formData.student_id && (
                      <span className="form-helper text-muted-foreground text-[13px]">Select a student first to load contract events.</span>
                    )}
                  </div>

                  {/* Entry Key */}
                  <div className="form-group">
                    <label className="form-label">Entry Key</label>
                    <Input
                      value={formData.entry_key || ""}
                      onChange={(e) => handleInputChange("entry_key", e.target.value)}
                      placeholder="e.g. payment::RAP-2026::REC-123"
                    />
                    <span className="form-helper text-muted-foreground text-[13px]">Unique key linking records. Auto-generated if RAP is selected and left empty.</span>
                  </div>

                  {/* Reference Doctype */}
                  <div className="form-group">
                    <label className="form-label">Reference Doctype</label>
                    <Input
                      value={formData.reference_doctype || ""}
                      onChange={(e) => handleInputChange("reference_doctype", e.target.value)}
                      placeholder="e.g. Room Allotment Payment"
                    />
                  </div>

                  {/* Reference Name */}
                  <div className="form-group">
                    <label className="form-label">Reference Name</label>
                    <Input
                      value={formData.reference_name || ""}
                      onChange={(e) => handleInputChange("reference_name", e.target.value)}
                      placeholder="e.g. RAP-2026-001"
                    />
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* CARD 4: Audit Remarks */}
            <Card className="border-border/80 shadow-sm flex flex-col">
              <CardHeader className="border-b border-border/50 py-5 px-6">
                <CardTitle className="text-lg">Audit Remarks</CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="form-group flex-1 flex flex-col">
                  <label className="form-label mb-2">Audit Comments / Internal Notes</label>
                  <textarea
                    value={formData.remarks || ""}
                    onChange={(e) => handleInputChange("remarks", e.target.value)}
                    placeholder="Record any internal auditing logs, payment exceptions, or transaction comments here..."
                    className="form-input text-sm resize-y flex-1 min-h-[200px]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 py-5 px-6 border-t border-border/60 bg-card rounded-lg shadow-sm">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleCancelClick}
            disabled={isSubmitting}
            className="gap-1.5"
          >
            <X size={16} />
            <span>Cancel</span>
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting}
            className="gap-1.5"
          >
            <Save size={16} />
            <span>{isSubmitting ? "Saving record..." : "Save Rent Payment"}</span>
          </Button>
        </div>

      </form>
    </div>
  );
};
