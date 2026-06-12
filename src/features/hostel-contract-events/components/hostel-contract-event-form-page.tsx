"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, X, Calendar, Activity, Layers, User, ShieldAlert, ChevronDown, ChevronUp } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/loading-skeleton";
import { useHostelContractEventForm } from "../hooks/use-hostel-contract-event-form";
import { showCancelConfirm } from "@/utils/swal";

interface HostelContractEventFormPageProps {
  id?: string;
}

export const HostelContractEventFormPage: React.FC<HostelContractEventFormPageProps> = ({ id }) => {
  const router = useRouter();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

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
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <PageHeader
          title={id ? "Edit Contract Event" : "New Contract Event"}
          description="Fetching contract event parameters from audit ledger..."
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

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title={id ? "Edit Hostel Contract Event" : "New Hostel Contract Event"}
        description={id ? "Modify auditing parameters or transitional logs." : "Record a new contract transition, extend contracts, or cancel room allotments."}
        backHref={id ? `/hostel-contract-events/${id}` : "/hostel-contract-events"}
        backText={id ? "Event Details" : "Contract Events"}
      />

      {apiError && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm font-medium">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Two-column layout grid for desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column: Summary & Transition */}
          <div className="flex flex-col gap-6">
            
            {/* CARD 1: Core Identifiers */}
            <Card className="border border-border/80 shadow-sm">
              <CardHeader className="border-b border-border/50 py-5 px-6">
                <CardTitle className="text-lg">Event Summary Parameters</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  {/* Student Selection */}
                  <div className="form-group sm:col-span-2">
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

                  {/* Action Type */}
                  <div className="form-group">
                    <label className="form-label">Action Type *</label>
                    <Select
                      value={formData.action_type}
                      onChange={(e) => handleInputChange("action_type", e.target.value)}
                      options={actionTypeOptions}
                      className={fieldErrors.action_type ? "border-destructive" : ""}
                    />
                    {fieldErrors.action_type && <span className="form-error">{fieldErrors.action_type}</span>}
                  </div>

                  {/* Event Status */}
                  <div className="form-group">
                    <label className="form-label">Event Status *</label>
                    <Select
                      value={formData.event_status}
                      onChange={(e) => handleInputChange("event_status", e.target.value)}
                      options={eventStatusOptions}
                      className={fieldErrors.event_status ? "border-destructive" : ""}
                    />
                    {fieldErrors.event_status && <span className="form-error">{fieldErrors.event_status}</span>}
                  </div>

                  {/* Contract Type Before */}
                  <div className="form-group">
                    <label className="form-label">Contract Type Before</label>
                    <Input
                      value={formData.contract_type_before || ""}
                      onChange={(e) => handleInputChange("contract_type_before", e.target.value)}
                      placeholder="e.g. Standard"
                    />
                  </div>

                  {/* Contract Type After */}
                  <div className="form-group">
                    <label className="form-label">Contract Type After</label>
                    <Input
                      value={formData.contract_type_after || ""}
                      onChange={(e) => handleInputChange("contract_type_after", e.target.value)}
                      placeholder="e.g. Standard"
                    />
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* CARD 2: Contract & Allotment Transition */}
            <Card className="border border-border/80 shadow-sm">
              <CardHeader className="border-b border-border/50 py-5 px-6">
                <CardTitle className="text-lg">Contract & Allotment Transition</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  {/* Source Contract */}
                  <div className="form-group">
                    <label className="form-label">Source Hostel Contract</label>
                    <Select
                      value={formData.source_hostel_contract_id || ""}
                      onChange={(e) => handleInputChange("source_hostel_contract_id", e.target.value)}
                      options={contractOptions}
                      disabled={!formData.student_id}
                    />
                    {!formData.student_id && (
                      <span className="form-helper">Select student first.</span>
                    )}
                  </div>

                  {/* Target Contract */}
                  <div className="form-group">
                    <label className="form-label">Target Hostel Contract</label>
                    <Select
                      value={formData.target_hostel_contract_id || ""}
                      onChange={(e) => handleInputChange("target_hostel_contract_id", e.target.value)}
                      options={contractOptions}
                      disabled={!formData.student_id}
                    />
                    {!formData.student_id && (
                      <span className="form-helper">Select student first.</span>
                    )}
                  </div>

                  {/* Source Room Allotment */}
                  <div className="form-group">
                    <label className="form-label">Source Room Allotment</label>
                    <Select
                      value={formData.source_room_allotment_id || ""}
                      onChange={(e) => handleInputChange("source_room_allotment_id", e.target.value)}
                      options={allotmentOptions}
                      disabled={!formData.student_id}
                    />
                    {!formData.student_id && (
                      <span className="form-helper">Select student first.</span>
                    )}
                  </div>

                  {/* Target Room Allotment */}
                  <div className="form-group">
                    <label className="form-label">Target Room Allotment</label>
                    <Select
                      value={formData.target_room_allotment_id || ""}
                      onChange={(e) => handleInputChange("target_room_allotment_id", e.target.value)}
                      options={allotmentOptions}
                      disabled={!formData.student_id}
                    />
                    {!formData.student_id && (
                      <span className="form-helper">Select student first.</span>
                    )}
                  </div>

                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column: Timing & Advanced References */}
          <div className="flex flex-col gap-6">
            
            {/* CARD 3: Audit Details */}
            <Card className="border border-border/80 shadow-sm">
              <CardHeader className="border-b border-border/50 py-5 px-6">
                <CardTitle className="text-lg">Audit Details & Timing</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  {/* Triggered By */}
                  <div className="form-group sm:col-span-2">
                    <label className="form-label">Triggered By</label>
                    <Input
                      value={formData.triggered_by || ""}
                      onChange={(e) => handleInputChange("triggered_by", e.target.value)}
                      placeholder="e.g. system"
                    />
                  </div>

                  {/* Triggered On */}
                  <div className="form-group">
                    <label className="form-label">Triggered On Date/Time</label>
                    <input
                      type="datetime-local"
                      value={formData.triggered_on || ""}
                      onChange={(e) => handleInputChange("triggered_on", e.target.value)}
                      className="form-input"
                    />
                  </div>

                  {/* Effective Date */}
                  <div className="form-group">
                    <label className="form-label">Effective Date</label>
                    <input
                      type="date"
                      value={formData.effective_date || ""}
                      onChange={(e) => handleInputChange("effective_date", e.target.value)}
                      className="form-input"
                    />
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* CARD 4: Collapsible Advanced References */}
            <Card className="border border-border/80 shadow-sm">
              <button
                type="button"
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="w-full flex justify-between items-center py-5 px-6 bg-transparent border-none cursor-pointer text-left"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-semibold text-card-foreground">
                    Advanced References
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Optional settlement linkages
                  </span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  {isAdvancedOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>
              
              {isAdvancedOpen && (
                <CardContent className="px-6 pb-6 pt-5 border-t border-dashed border-border/50">
                  <div className="grid grid-cols-1 gap-5">
                    
                    {/* Settlement RAP Selection */}
                    <div className="form-group">
                      <label className="form-label">Settlement RAP Link</label>
                      <Select
                        value={formData.settlement_rap || ""}
                        onChange={(e) => handleInputChange("settlement_rap", e.target.value)}
                        options={allotmentPaymentOptions}
                        disabled={!formData.student_id}
                      />
                      {!formData.student_id && (
                        <span className="form-helper">Select student first to load payments.</span>
                      )}
                    </div>

                  </div>
                </CardContent>
              )}
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
            <span>{isSubmitting ? "Saving entry..." : "Save Event"}</span>
          </Button>
        </div>

      </form>
    </div>
  );
};
