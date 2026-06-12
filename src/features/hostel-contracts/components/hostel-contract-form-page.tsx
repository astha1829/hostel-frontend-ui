"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Save, X, FileText, Building2, Calendar, Receipt } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useHostelContractForm } from "../hooks/use-hostel-contract-form";
import { showCancelConfirm } from "@/utils/swal";

export const HostelContractFormPage: React.FC = () => {
  const router = useRouter();

  const handleSuccess = (contractId: string) => {
    router.push(`/hostel-contracts/${contractId}`);
  };

  const handleCancel = () => {
    router.push("/hostel-contracts");
  };

  const {
    formData,
    hostels,
    students,
    isLoadingOptions,
    fieldErrors,
    apiError,
    isSubmitting,
    handleInputChange,
    handleSubmit,
  } = useHostelContractForm({ onSuccess: handleSuccess, onCancel: handleCancel });

  const handleCancelClick = async () => {
    const isDirty =
      formData.contract_no !== "" ||
      formData.contract_type !== "Regular" ||
      formData.standard_duration_months !== 12 ||
      formData.status !== "Active" ||
      formData.sharing !== "Single" ||
      formData.contract_price !== 500;

    if (isDirty) {
      const result = await showCancelConfirm();
      if (!result.isConfirmed) return;
    }
    handleCancel();
  };

  const hostelOptions = hostels.map((h) => ({
    label: h.hostel_name,
    value: h.id,
  }));

  const studentOptions = students.map((s) => ({
    label: `${s.student_name} ${s.last_name || ""}`.trim(),
    value: s.id,
  }));

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <PageHeader
        title="Add Contract"
        description="Register a new lease contract, select resident student, select target hostel, set pricing details."
        backHref="/hostel-contracts"
        backText="Back to Contracts"
        actions={
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="md" type="button" onClick={handleCancelClick} disabled={isSubmitting}>
              <X size={16} />
              <span>Cancel</span>
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={isSubmitting}>
              <Save size={16} />
              <span>Save Contract</span>
            </Button>
          </div>
        }
      />

      {/* Error Callout */}
      {apiError && (
        <div className="flex flex-col gap-1 p-4 bg-destructive/15 text-destructive border border-destructive/25 rounded-md text-sm font-semibold">
          <span>Contract Registration Failed:</span>
          <p className="m-0 font-medium opacity-90">{apiError}</p>
        </div>
      )}

      {/* Form sections */}
      <div className="flex flex-col gap-6">
        
        {/* Section 1: Lease Identity */}
        <SectionCard title="Contract Basics" description="Identify the contract code, standard durations, and validity states.">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            <Input
              label="Contract Number *"
              placeholder="e.g. CON-10045"
              value={formData.contract_no}
              onChange={(e) => handleInputChange("contract_no", e.target.value)}
              error={fieldErrors.contract_no}
              disabled={isSubmitting}
            />
            <Input
              label="Contract Type *"
              placeholder="e.g. Regular, Scholar"
              value={formData.contract_type}
              onChange={(e) => handleInputChange("contract_type", e.target.value)}
              error={fieldErrors.contract_type}
              disabled={isSubmitting}
            />
            <Input
              label="Standard Duration (Months)"
              type="number"
              placeholder="e.g. 12"
              value={formData.standard_duration_months ?? ""}
              onChange={(e) => handleInputChange("standard_duration_months", e.target.value)}
              disabled={isSubmitting}
            />
            <Select
              label="Contract Status *"
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              error={fieldErrors.status}
              options={[
                { label: "Active", value: "Active" },
                { label: "Expired", value: "Expired" },
                { label: "Break", value: "Break" },
                { label: "Superseded", value: "Superseded" },
              ]}
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>
        </SectionCard>

        {/* Section 2: Associations */}
        <SectionCard title="Student & Hostel Associations" description="Link contract parameters to hostels and registered students.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Select
              label="Assigned Hostel *"
              value={formData.hostel_id}
              onChange={(e) => handleInputChange("hostel_id", e.target.value)}
              error={fieldErrors.hostel_id}
              options={hostelOptions}
              disabled={isSubmitting || isLoadingOptions}
            />
            <Select
              label="Registered Student *"
              value={formData.student_id}
              onChange={(e) => handleInputChange("student_id", e.target.value)}
              error={fieldErrors.student_id}
              options={studentOptions}
              disabled={isSubmitting || isLoadingOptions}
            />
          </div>
        </SectionCard>

        {/* Section 3: Schedule */}
        <SectionCard title="Timeline Schedule" description="Record lease calendar dates and expected resident arrival times.">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Input
              label="Contract Start Date *"
              type="date"
              value={formData.contract_start_date}
              onChange={(e) => handleInputChange("contract_start_date", e.target.value)}
              error={fieldErrors.contract_start_date}
              disabled={isSubmitting}
            />
            <Input
              label="Contract End Date"
              type="date"
              value={formData.contract_end_date || ""}
              onChange={(e) => handleInputChange("contract_end_date", e.target.value)}
              error={fieldErrors.contract_end_date}
              disabled={isSubmitting}
            />
            <Input
              label="Expected Arrival Date"
              type="date"
              value={formData.arrival_date || ""}
              onChange={(e) => handleInputChange("arrival_date", e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </SectionCard>

        {/* Section 4: Financials */}
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
              disabled={isSubmitting}
            />
            <Input
              label="Contract Price ($) *"
              type="number"
              placeholder="e.g. 500"
              value={formData.contract_price ?? ""}
              onChange={(e) => handleInputChange("contract_price", e.target.value)}
              disabled={isSubmitting}
            />
            <div className="flex items-center gap-2 h-[42px] px-2">
              <input
                type="checkbox"
                id="is_submitted"
                checked={!!formData.is_submitted}
                onChange={(e) => handleInputChange("is_submitted", e.target.checked)}
                disabled={isSubmitting}
                className="w-4 h-4 rounded border-border cursor-pointer accent-primary"
              />
              <label htmlFor="is_submitted" className="text-sm font-bold cursor-pointer text-foreground">Flag as Submitted</label>
            </div>
          </div>
        </SectionCard>
      </div>
    </form>
  );
};
