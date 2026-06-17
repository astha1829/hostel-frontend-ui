"use client";
import React from "react";
import Link from "next/link";
import {
  Edit2, Save, X, RefreshCw, CheckCircle2, Building2,
  Users, FileText, Calendar, DollarSign, ShieldCheck, Tag, Info, ArrowLeft,
  ArrowRight, Clock, AlertCircle, Sparkles, Receipt
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DetailFormSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useHostelContractDetails } from "../hooks/use-hostel-contract-details";

interface HostelContractDetailsPageProps {
  id: string;
  initialEditMode?: boolean;
}

export const HostelContractDetailsPage: React.FC<HostelContractDetailsPageProps> = ({ id, initialEditMode = false }) => {
  const {
    contract,
    hostels,
    students,
    events,
    isLoading,
    isSaving,
    error,
    isEditMode,
    formData,
    formErrors,
    successMessage,
    toggleEditMode,
    handleInputChange,
    saveChanges,
    reload,
  } = useHostelContractDetails(id, initialEditMode);

  if (isLoading) {
    return <DetailFormSkeleton />;
  }

  if (error || !contract) {
    return (
      <ErrorState
        title="Failed to Retrieve Contract Details"
        message={error || "The requested contract record could not be found."}
        onRetry={reload}
        isLoading={isLoading}
      />
    );
  }

  const getStatusBadge = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "expired":
        return <Badge variant="danger">Expired</Badge>;
      case "break":
        return <Badge variant="warning">Break</Badge>;
      case "superseded":
        return <Badge variant="secondary">Superseded</Badge>;
      default:
        return <Badge variant="secondary">{status || "Draft"}</Badge>;
    }
  };

  const getConfirmBadge = (confirmStatus?: string) => {
    switch (confirmStatus?.toLowerCase()) {
      case "confirmed":
        return <Badge variant="success">Confirmed</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "rejected":
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{confirmStatus || "Draft"}</Badge>;
    }
  };

  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return "$0.00";
    return `$${Number(price).toFixed(2)}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Header Actions
  const headerActions = (
    <div className="flex items-center gap-3">
      {isEditMode ? (
        <>
          <Button variant="secondary" size="md" onClick={toggleEditMode} disabled={isSaving}>
            <X size={16} />
            <span>Cancel</span>
          </Button>
          <Button className="btn-top-action">
            <Save size={16} />
            <span>Save Contract</span>
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline" size="md" onClick={reload} className="p-2" title="Reload details">
            <RefreshCw size={16} />
          </Button>
          <Button className="btn-top-action">
            <Edit2 size={16} />
            <span>Edit Contract</span>
          </Button>
        </>
      )}
    </div>
  );

  const hostelOptions = hostels.map((h) => ({
    label: h.hostel_name,
    value: h.id,
  }));

  const studentOptions = students.map((s) => ({
    label: `${s.student_name} ${s.last_name || ""}`.trim(),
    value: s.id,
  }));

  return (
    <div className="container-page flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Success Banner */}
      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-success/15 text-success border border-success/25 rounded-md text-sm font-semibold animate-in slide-in-from-top-2 duration-300">
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Header */}
      <PageHeader
        title={`Contract: ${contract.contract_no}`}
        description={isEditMode ? "Modifying residential lease parameters and billing records." : "Hostel tenancy contract agreements, financials, and approvals."}
        backHref="/hostel-contracts"
        backText="Back to Contracts"
        actions={headerActions}
        className="mb-1"
      />

      {/* Profile Summary Header Card */}
      {!isEditMode && (
        <Card className="p-8 bg-gradient-to-b from-card to-secondary/15 border-border rounded-lg flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute -top-[50px] -right-[50px] w-[200px] h-[200px] bg-primary/5 blur-[40px] rounded-full pointer-events-none" />

          <div className="flex flex-wrap gap-6 items-center z-[1]">
            <div className="w-[72px] h-[72px] rounded-md bg-primary/10 text-primary flex items-center justify-center shadow-sm">
              <FileText size={32} />
            </div>

            <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-[22px] font-extrabold tracking-[-0.02em] text-foreground m-0">
                  No. {contract.contract_no}
                </h2>
                {getStatusBadge(contract.status)}
                {getConfirmBadge(contract.confirm_status)}
              </div>

              <p className="text-sm text-muted-foreground m-0 font-semibold flex items-center gap-2">
                <Building2 size={14} className="text-primary" />
                <span>{contract.hostel_name || "Unassigned Hostel"}</span>
                <span className="text-border">•</span>
                <Users size={14} className="text-primary" />
                <span>{contract.student_name || "Unlinked Student"}</span>
              </p>
            </div>
          </div>

          <div className="h-px bg-border/60" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 z-[1]">
            <div className="flex flex-col gap-1">
              <span className="form-label">Contract Value</span>
              <span className="text-lg font-extrabold text-primary">{formatPrice(contract.contract_price)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="form-label">Duration Plan</span>
              <span className="body-text-primary">{contract.standard_duration_months || "—"} Months</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="form-label">Sharing Class</span>
              <span className="body-text-primary">{contract.sharing || "Single"} Room</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="form-label">Category Type</span>
              <span className="body-text-primary">{contract.contract_type}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Edit Mode Forms */}
      {isEditMode ? (
        <div className="flex flex-col gap-6">
          
          <SectionCard title="Contract Basics" description="Identify the contract code, standard durations, and validity states.">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
              <Input
                label="Contract Number *"
                value={formData.contract_no || ""}
                onChange={(e) => handleInputChange("contract_no", e.target.value)}
                error={formErrors.contract_no}
                disabled={isSaving}
              />
              <Input
                label="Contract Type *"
                value={formData.contract_type || ""}
                onChange={(e) => handleInputChange("contract_type", e.target.value)}
                error={formErrors.contract_type}
                disabled={isSaving}
              />
              <Input
                label="Standard Duration (Months)"
                type="number"
                value={formData.standard_duration_months ?? ""}
                onChange={(e) => handleInputChange("standard_duration_months", e.target.value)}
                disabled={isSaving}
              />
              <Select
                label="Contract Status *"
                value={formData.status || ""}
                onChange={(e) => handleInputChange("status", e.target.value)}
                error={formErrors.status}
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Expired", value: "Expired" },
                  { label: "Break", value: "Break" },
                  { label: "Superseded", value: "Superseded" },
                ]}
                disabled={isSaving}
              />
              <Select
                label="Confirmation Approval Status"
                value={formData.confirm_status || ""}
                onChange={(e) => handleInputChange("confirm_status", e.target.value)}
                options={[
                  { label: "Confirmed", value: "Confirmed" },
                  { label: "Pending", value: "Pending" },
                  { label: "Rejected", value: "Rejected" },
                ]}
                disabled={isSaving}
              />
            </div>
          </SectionCard>

          <SectionCard title="Student & Hostel Associations" description="Link contract parameters to hostels and registered students.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Select
                label="Assigned Hostel *"
                value={formData.hostel_id || ""}
                onChange={(e) => handleInputChange("hostel_id", e.target.value)}
                error={formErrors.hostel_id}
                options={hostelOptions}
                disabled={isSaving}
              />
              <Select
                label="Registered Student *"
                value={formData.student_id || ""}
                onChange={(e) => handleInputChange("student_id", e.target.value)}
                error={formErrors.student_id}
                options={studentOptions}
                disabled={isSaving}
              />
            </div>
          </SectionCard>

          <SectionCard title="Timeline Schedule" description="Record lease calendar dates and expected resident arrival times.">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Input
                label="Contract Start Date *"
                type="date"
                value={formData.contract_start_date || ""}
                onChange={(e) => handleInputChange("contract_start_date", e.target.value)}
                error={formErrors.contract_start_date}
                disabled={isSaving}
              />
              <Input
                label="Contract End Date"
                type="date"
                value={formData.contract_end_date || ""}
                onChange={(e) => handleInputChange("contract_end_date", e.target.value)}
                error={formErrors.contract_end_date}
                disabled={isSaving}
              />
              <Input
                label="Expected Arrival Date"
                type="date"
                value={formData.arrival_date || ""}
                onChange={(e) => handleInputChange("arrival_date", e.target.value)}
                disabled={isSaving}
              />
            </div>
          </SectionCard>

          <SectionCard title="Financials & Room Sharing Terms" description="Define roommate sharing settings, price records, and submission flags.">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
              <Select
                label="Sharing Mode"
                value={formData.sharing || ""}
                onChange={(e) => handleInputChange("sharing", e.target.value)}
                options={[
                  { label: "Single Room", value: "Single" },
                  { label: "Double Room Sharing", value: "Double" },
                  { label: "Triple Room Sharing", value: "Triple" },
                  { label: "Quadruple Room Sharing", value: "Quadruple" },
                ]}
                disabled={isSaving}
              />
              <Input
                label="Contract Price ($) *"
                type="number"
                value={formData.contract_price ?? ""}
                onChange={(e) => handleInputChange("contract_price", e.target.value)}
                disabled={isSaving}
              />
              <div className="flex items-center gap-2 h-[42px] px-2">
                <input
                  type="checkbox"
                  id="is_submitted"
                  checked={!!formData.is_submitted}
                  onChange={(e) => handleInputChange("is_submitted", e.target.checked)}
                  disabled={isSaving}
                  className="w-4 h-4 rounded border-border cursor-pointer accent-primary"
                />
                <label htmlFor="is_submitted" className="text-sm font-bold cursor-pointer text-foreground">Flag as Submitted</label>
              </div>
            </div>
          </SectionCard>

        </div>
      ) : (
        // VIEW MODE
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Left Column (3fr) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Contract terms card */}
            <SectionCard title="Contract Specifications" description="Overview of standard lease parameters, sharing conditions, and billing rates.">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div className="flex flex-col gap-1 border-b border-border/50 pb-2">
                  <span className="form-label">Contract Number</span>
                  <span className="text-[15px] font-mono font-bold text-primary">{contract.contract_no}</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-border/50 pb-2">
                  <span className="form-label">Category Type</span>
                  <span className="body-text-primary">{contract.contract_type}</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-border/50 pb-2">
                  <span className="form-label">Standard Duration</span>
                  <span className="body-text-primary">{contract.standard_duration_months ? `${contract.standard_duration_months} Months` : "—"}</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-border/50 pb-2">
                  <span className="form-label">Sharing Class Allotment</span>
                  <span className="body-text-primary">{contract.sharing ? `${contract.sharing} Room` : "Single"}</span>
                </div>
              </div>
            </SectionCard>

            {/* Associated entities details */}
            <SectionCard title="Associated Entities" description="Linked records of the resident student and target residence.">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Hostel relation */}
                <div className="p-5 bg-secondary/10 border border-border/60 rounded-md flex flex-col gap-3">
                  <span className="form-label">Hostel Residence</span>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-sm bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Building2 size={16} />
                    </div>
                    <div className="flex flex-col">
                      <Link href={`/hostels/${contract.hostel_id}`} className="text-[15px] font-bold text-primary hover:underline underline-offset-4">
                        {contract.hostel_name || "Unassigned Hostel"}
                      </Link>
                      <span className="text-xs font-mono text-muted-foreground mt-0.5">ID: {contract.hostel_id.substring(0, 8)}...</span>
                    </div>
                  </div>
                </div>

                {/* Student relation */}
                <div className="p-5 bg-secondary/10 border border-border/60 rounded-md flex flex-col gap-3">
                  <span className="form-label">Resident Student</span>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-sm bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Users size={16} />
                    </div>
                    <div className="flex flex-col">
                      <Link href={`/students/${contract.student_id}`} className="text-[15px] font-bold text-primary hover:underline underline-offset-4">
                        {contract.student_name ? contract.student_name.split("-")[0] : "Unlinked Student"}
                      </Link>
                      <span className="text-xs font-mono text-muted-foreground mt-0.5">ID: {contract.student_id.substring(0, 8)}...</span>
                    </div>
                  </div>
                </div>

              </div>
            </SectionCard>

            {/* Dates timeline visualization */}
            <SectionCard title="Timeline Schedule" description="Visual breakdown of contract dates, expected arrival, and lease duration.">
              <div className="flex flex-col gap-5 p-5 bg-secondary/10 border border-border/60 rounded-md">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  
                  {/* Node 1: Expected Arrival */}
                  <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
                    <span className="form-label">Expected Arrival</span>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={15} className="text-primary" />
                      <span className="text-sm font-semibold text-foreground">
                        {formatDate(contract.arrival_date)}
                      </span>
                    </div>
                  </div>

                  {/* Arrow 1 */}
                  <div className="flex items-center text-muted-foreground/60">
                    <ArrowRight size={16} />
                  </div>

                  {/* Node 2: Start Lease */}
                  <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
                    <span className="form-label">Start Date</span>
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={15} className="text-success" />
                      <span className="text-sm font-semibold text-foreground">
                        {formatDate(contract.contract_start_date)}
                      </span>
                    </div>
                  </div>

                  {/* Arrow 2 */}
                  <div className="flex items-center text-muted-foreground/60">
                    <ArrowRight size={16} />
                  </div>

                  {/* Node 3: End Lease */}
                  <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
                    <span className="form-label">End Date</span>
                    <div className="flex items-center gap-1.5">
                      <AlertCircle size={15} className="text-destructive" />
                      <span className="text-sm font-semibold text-foreground">
                        {formatDate(contract.contract_end_date)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-border/50" />

                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-muted-foreground">Lease Active Duration</span>
                  <Badge variant="secondary" className="text-[13px] px-2 py-1 font-bold">
                    {contract.standard_duration_months || "—"} Months Plan
                  </Badge>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Right Column (2fr) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Financials & Sharing Card */}
            <SectionCard title="Financials & Room Sharing" description="Defined roommate sharing classes and billing rates.">
              <div className="flex flex-col gap-5">
                
                {/* Price Rate Highlight */}
                <div className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-md flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="form-label">Contract Price Rate</span>
                    <span className="text-[28px] font-extrabold text-primary mt-1 tracking-[-0.02em]">
                      {formatPrice(contract.contract_price)}
                    </span>
                  </div>
                  <Receipt size={28} className="text-primary opacity-80" />
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-border/50">
                  <span className="text-[13px] font-semibold text-muted-foreground">Sharing Mode</span>
                  <Badge variant="secondary" className="text-[13px]">
                    {contract.sharing ? `${contract.sharing} Sharing` : "Single Room"}
                  </Badge>
                </div>
              </div>
            </SectionCard>

            {/* Status & Approvals */}
            <SectionCard title="Status & Approvals" description="Legal verification and submission checkpoints.">
              <div className="flex flex-col gap-4">
                
                <div className="flex justify-between items-center pb-2 border-b border-border/50">
                  <span className="text-[13px] font-semibold text-muted-foreground">Lease Active State</span>
                  {getStatusBadge(contract.status)}
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-border/50">
                  <span className="text-[13px] font-semibold text-muted-foreground">Confirmation Status</span>
                  {getConfirmBadge(contract.confirm_status)}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-semibold text-muted-foreground">Auditor Submission</span>
                  {contract.is_submitted ? (
                    <Badge variant="success">Submitted</Badge>
                  ) : (
                    <Badge variant="secondary">Draft Mode</Badge>
                  )}
                </div>

              </div>
            </SectionCard>

            {/* Amendment Chain Events Timeline */}
            <SectionCard title="Amendment History" description="Chronological record of lease events.">
              {events.length === 0 ? (
                <div className="text-center p-6 text-muted-foreground">
                  <Clock size={22} className="mx-auto mb-2 text-muted-foreground/60" />
                  <span className="text-[13px] italic">No amendment events recorded</span>
                </div>
              ) : (
                <div className="flex flex-col gap-5 relative pl-5 mt-2">
                  {/* Timeline line */}
                  <div className="absolute left-[3px] top-2 bottom-2 w-0.5 bg-border/60" />
                  {events.map((event) => (
                    <div key={event.id} className="flex flex-col gap-1 relative">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[22px] top-1.5 w-2 h-2 rounded-full bg-primary border-2 border-card" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-foreground">
                          {event.action_type}
                        </span>
                        <Badge variant={event.event_status.toLowerCase() === "processed" || event.event_status.toLowerCase() === "confirmed" ? "success" : "warning"} className="text-[11px] px-1.5 py-0.5">
                          {event.event_status}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>By: {event.triggered_by || "System"}</span>
                        <span>{formatDate(event.triggered_on || event.created_at)}</span>
                      </div>
                      {(event.contract_type_before || event.contract_type_after) && (
                        <div className="text-xs bg-secondary/15 px-2 py-1 rounded-sm mt-0.5 w-fit">
                          {event.contract_type_before || "None"} → {event.contract_type_after || "None"}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            {/* Audit details */}
            <SectionCard title="Audit Registry" description="Log details for record registry times.">
              <div className="flex flex-col gap-3 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Record Created:</span>
                  <span className="font-semibold text-foreground">{formatDate(contract.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Modified:</span>
                  <span className="font-semibold text-foreground">{formatDate(contract.updated_at)}</span>
                </div>
              </div>
            </SectionCard>
          </div>

        </div>
      )}

    </div>
  );
};
