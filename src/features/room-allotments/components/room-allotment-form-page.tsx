"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Save, X, Home, Users, Layers, Receipt } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useRoomAllotmentForm } from "../hooks/use-room-allotment-form";

export interface RoomAllotmentFormPageProps {
  id?: string;
}

export const RoomAllotmentFormPage: React.FC<RoomAllotmentFormPageProps> = ({ id }) => {
  const router = useRouter();

  const handleSuccess = (allotmentId: string) => {
    router.push(`/room-allotments/${allotmentId}`);
  };

  const handleCancel = () => {
    router.push("/room-allotments");
  };

  const {
    formData,
    hostels,
    students,
    contracts,
    floors,
    rooms,
    isLoadingOptions,
    fieldErrors,
    apiError,
    isSubmitting,
    handleInputChange,
    handleHostelChange,
    handleFloorChange,
    handleStudentChange,
    handleSubmit,
  } = useRoomAllotmentForm({ id, onSuccess: handleSuccess, onCancel: handleCancel });

  const hostelOptions = (hostels || []).map((h) => ({
    label: h.hostel_name,
    value: h.id,
  }));

  const studentOptions = (students || []).map((s) => ({
    label: `${s.student_name} ${s.last_name || ""}`.trim(),
    value: s.id,
  }));

  const contractOptions = (contracts || []).map((c) => ({
    label: c.contract_no,
    value: c.id,
  }));

  const floorOptions = (floors || []).map((f) => ({
    label: `Floor ${f.floor_no}`,
    value: String(f.floor_no),
  }));

  const roomOptions = (rooms || []).map((r) => ({
    label: `Room ${r.room_no} (Cap: ${r.capacity})`,
    value: r.room_no,
  }));

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} className="animate-slide-in">
      {/* Header */}
      <PageHeader
        title={id ? "Edit Allotment" : "Add Allotment"}
        description={id ? "Modify student room allocation and billing parameters." : "Allocate a student to a room floor level, set billing rent, and link stay contracts."}
        backHref="/room-allotments"
        backText="Back to Allotments"
        actions={
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <Button variant="secondary" size="md" type="button" onClick={handleCancel} disabled={isSubmitting}>
              <X size={16} />
              <span>Cancel</span>
            </Button>
            <Button className="btn-top-action">
              <Save size={16} />
              <span>{id ? "Update Allotment" : "Save Allotment"}</span>
            </Button>
          </div>
        }
      />

      {/* Error Callout */}
      {apiError && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          padding: "1rem 1.25rem",
          backgroundColor: "hsl(var(--destructive) / 0.15)",
          color: "hsl(var(--destructive))",
          border: "1px solid hsl(var(--destructive) / 0.25)",
          borderRadius: "var(--radius-md)",
          fontSize: "0.875rem",
          fontWeight: 600,
        }}>
          <span>Allotment Creation Failed:</span>
          <p style={{ margin: 0, fontWeight: 500, opacity: 0.9 }}>{apiError}</p>
        </div>
      )}

      {/* Form sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* Section 1: Basics */}
        <SectionCard title="Contract Basics" description="Identify the stay status, monthly rent billing rate, and surcharges.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
            <Select
              label="Allotment Status *"
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              error={fieldErrors.status}
              options={[
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
                { label: "Pending", value: "Pending" },
              ]}
              disabled={isSubmitting}
            />
            <Input
              label="Monthly Rent ($) *"
              type="number"
              placeholder="e.g. 500"
              value={formData.rent ?? ""}
              onChange={(e) => handleInputChange("rent", e.target.value)}
              error={fieldErrors.rent}
              disabled={isSubmitting}
            />
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", height: "100%", paddingTop: "1.75rem" }}>
              <input
                type="checkbox"
                id="add_transaction_charge"
                checked={!!formData.add_transaction_charge}
                onChange={(e) => handleInputChange("add_transaction_charge", e.target.checked)}
                disabled={isSubmitting}
                style={{ width: "18px", height: "18px", accentColor: "hsl(var(--primary))", cursor: "pointer" }}
              />
              <label htmlFor="add_transaction_charge" style={{ fontSize: "0.875rem", fontWeight: 700, cursor: "pointer", color: "hsl(var(--foreground))" }}>Add Transaction Charge</label>
            </div>
            <Input
              label="Remarks"
              placeholder="Add stay comments..."
              value={formData.remarks || ""}
              onChange={(e) => handleInputChange("remarks", e.target.value)}
              disabled={isSubmitting}
              style={{ gridColumn: "span 2" }}
            />
          </div>
        </SectionCard>

        {/* Section 2: Student & Contract Connections */}
        <SectionCard title="Student & Contract Connections" description="Link stay parameters to resident contracts.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
            <Select
              label="Allotted Student *"
              value={formData.student_id}
              onChange={(e) => handleStudentChange(e.target.value)}
              error={fieldErrors.student_id}
              options={studentOptions}
              disabled={isSubmitting || isLoadingOptions}
            />
            <Select
              label="Lease Contract *"
              value={formData.hostel_contract_id}
              onChange={(e) => handleInputChange("hostel_contract_id", e.target.value)}
              error={fieldErrors.hostel_contract_id}
              options={contractOptions}
              disabled={isSubmitting || isLoadingOptions}
            />
          </div>
        </SectionCard>

        {/* Section 3: Hostel Location */}
        <SectionCard title="Hostel Location Allocation" description="Define hostel, floor level, and target room number.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
            <Select
              label="Target Hostel *"
              value={formData.hostel_id}
              onChange={(e) => handleHostelChange(e.target.value)}
              error={fieldErrors.hostel_id}
              options={hostelOptions}
              disabled={isSubmitting || isLoadingOptions}
            />
            <Select
              label="Floor Level *"
              value={String(formData.floor_no || "")}
              onChange={(e) => handleFloorChange(e.target.value)}
              error={fieldErrors.floor_no}
              options={floorOptions}
              disabled={isSubmitting || isLoadingOptions}
            />
            <Select
              label="Room Number Code *"
              value={formData.room_no}
              onChange={(e) => handleInputChange("room_no", e.target.value)}
              error={fieldErrors.room_no}
              options={roomOptions}
              disabled={isSubmitting || isLoadingOptions}
            />
          </div>
        </SectionCard>

      </div>
    </form>
  );
};
