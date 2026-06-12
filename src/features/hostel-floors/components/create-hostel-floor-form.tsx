import React from "react";
import { Building2, Layers, Info, Hash, Play } from "lucide-react";
import { HostelSelector } from "./hostel-selector";
import { RoomNumberSeriesSelect } from "./room-number-series-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useHostelFloorForm } from "../hooks/use-hostel-floor-form";
import { Hostel } from "../../hostels/types";
import { Badge } from "@/components/ui/badge";
import { showCancelConfirm } from "@/utils/swal";

interface CreateHostelFloorFormProps {
  hostels: Hostel[];
  onSuccess: () => void;
  onClose: () => void;
}

export const CreateHostelFloorForm: React.FC<CreateHostelFloorFormProps> = ({
  hostels,
  onSuccess,
  onClose,
}) => {
  const {
    formData,
    selectedHostel,
    existingFloors,
    isLoadingFloors,
    fieldErrors,
    apiError,
    isSubmitting,
    handleHostelSelect,
    handleInputChange,
    handleReset,
    handleSubmit,
  } = useHostelFloorForm({ hostels, onSuccess, onClose });

  const handleCancel = async () => {
    const isDirty =
      formData.hostel_id !== "" ||
      formData.floor_no !== 1 ||
      (formData.room_number_series !== undefined && formData.room_number_series !== "") ||
      formData.idx !== 0;

    if (isDirty) {
      const result = await showCancelConfirm();
      if (!result.isConfirmed) {
        return;
      }
    }
    handleReset();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {apiError && (
        <div style={{
          padding: "0.625rem 0.875rem",
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

      {/* SECTION 1: Hostel Selector (Full Width Row) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <HostelSelector
          value={formData.hostel_id}
          onChange={handleHostelSelect}
          hostels={hostels}
          error={fieldErrors.hostel_id}
          disabled={isSubmitting}
        />
      </div>

      {/* SECTION 2: Unified Selected Hostel Context Card */}
      {selectedHostel && (
        <div style={{
          padding: "1rem 1.25rem",
          backgroundColor: "hsl(var(--secondary) / 0.12)",
          border: "1px solid hsl(var(--border) / 0.6)",
          borderRadius: "var(--radius-md)",
          display: "flex",
          flexDirection: "column",
          gap: "0.875rem",
          animation: "fadeIn 0.2s ease-in"
        }}>
          {/* Header Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "hsl(var(--foreground))" }}>
              {selectedHostel.hostel_name}
            </span>
            <Badge variant="default" style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>
              Code: {selectedHostel.hostel_id}
            </Badge>
          </div>

          {/* Details Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
            fontSize: "0.8125rem"
          }}>
            <div style={{ display: "flex", gap: "0.375rem" }}>
              <span style={{ color: "hsl(var(--muted-foreground) / 1.3)", fontWeight: 500 }}>Zone:</span>
              <span style={{ fontWeight: 600 }}>{selectedHostel.zone || "Not Assigned"}</span>
            </div>
            <div style={{ display: "flex", gap: "0.375rem", justifyContent: "flex-end" }}>
              <span style={{ color: "hsl(var(--muted-foreground) / 1.3)", fontWeight: 500 }}>Max Capacity:</span>
              <span style={{ fontWeight: 600 }}>{selectedHostel.number_of_floors || 0} Floors Limit</span>
            </div>
          </div>

          {/* Subtle Horizontal Divider */}
          <div style={{ borderTop: "1px solid hsl(var(--border) / 0.5)" }} />

          {/* Registered Floors Row */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.8125rem"
          }}>
            <span style={{ fontWeight: 700, color: "hsl(var(--muted-foreground) / 1.3)", textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "0.03em" }}>
              Registered Floors:
            </span>
            {isLoadingFloors ? (
              <span style={{ color: "hsl(var(--muted-foreground))", fontSize: "0.75rem" }}>Loading allocations...</span>
            ) : existingFloors.length > 0 ? (
              <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
                {existingFloors.map((f) => (
                  <Badge key={f.id} variant="secondary" style={{ padding: "0.0625rem 0.375rem", fontSize: "0.7rem", fontWeight: 600 }}>
                    Floor {f.floor_no}
                  </Badge>
                ))}
              </div>
            ) : (
              <span style={{ color: "hsl(var(--muted-foreground))", fontStyle: "italic", fontSize: "0.75rem" }}>
                No registered floors. Proposing Floor 1.
              </span>
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: Floor Configuration Section (SaaS Card Group) */}
      <div style={{
        border: "1px solid hsl(var(--border) / 0.8)",
        borderRadius: "var(--radius-lg)",
        padding: "1.25rem",
        backgroundColor: "hsl(var(--secondary) / 0.15)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        opacity: selectedHostel ? 1 : 0.5,
        pointerEvents: selectedHostel ? "auto" : "none",
        transition: "all 0.25s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", borderBottom: "1px solid hsl(var(--border) / 0.8)", paddingBottom: "0.5rem" }}>
          <Layers size={16} color="hsl(var(--primary))" />
          <span style={{ fontSize: "0.8125rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "hsl(var(--foreground))" }}>
            Floor Level & Room Series Configuration
          </span>
        </div>

        {/* Row 1: Floor Number + Series Selection */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.25rem"
        }} className="form-modal-grid">

          {/* Floor Number */}
          <Input
            label="Floor Number *"
            type="number"
            min={1}
            value={formData.floor_no}
            onChange={(e) => handleInputChange("floor_no", e.target.value ? Number(e.target.value) : "")}
            error={fieldErrors.floor_no}
            placeholder="e.g. 1"
            disabled={!selectedHostel || isSubmitting}
            helperText={
              selectedHostel?.number_of_floors
                ? `Allowed range: 1 to ${selectedHostel.number_of_floors} floors`
                : undefined
            }
          />

          {/* Room Number Series Selector */}
          <RoomNumberSeriesSelect
            value={formData.room_number_series || ""}
            onChange={(value) => handleInputChange("room_number_series", value)}
            error={fieldErrors.room_number_series}
            disabled={!selectedHostel || isSubmitting}
          />
        </div>

        {/* Row 2: Index Order + Spacer */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.25rem"
        }} className="form-modal-grid">
          <Input
            label="Index Order"
            type="number"
            min={0}
            value={formData.idx}
            onChange={(e) => handleInputChange("idx", e.target.value ? Number(e.target.value) : "")}
            error={fieldErrors.idx}
            placeholder="e.g. 0"
            disabled={!selectedHostel || isSubmitting}
          />
          <div /> {/* Grid spacer to keep input taking exactly 50% width */}
        </div>
      </div>

      {/* Form Footer Action Buttons (Sticky) */}
      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "0.75rem",
        marginTop: "0.5rem",
        borderTop: "1px solid hsl(var(--border))",
        paddingTop: "1.25rem",
        position: "sticky",
        bottom: 0,
        backgroundColor: "hsl(var(--card))",
        zIndex: 10
      }}>
        <Button variant="secondary" type="button" onClick={handleCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" isLoading={isSubmitting} disabled={!selectedHostel}>
          Add Hostel Floor
        </Button>
      </div>
    </form>
  );
};
