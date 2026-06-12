"use client";

import React from "react";
import { Edit2, Save, X, RefreshCw, CheckCircle2, Activity, Hash, Layers, Home, MapPin, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DetailFormSkeleton, TableSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useHostelDetails } from "../hooks/use-hostel-details";
import { HostelDetailsForm } from "./hostel-details-form";
import { HostelFloorsTable } from "./hostel-floors-table";
import { HostelStatusBadge } from "./hostel-status-badge";
import { showCancelConfirm } from "@/utils/swal";

interface HostelDetailsPageProps {
  id: string;
}

export const HostelDetailsPage: React.FC<HostelDetailsPageProps> = ({ id }) => {
  const {
    hostel,
    floors,
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
  } = useHostelDetails(id);

  // Compute total rooms dynamically
  const totalRooms = React.useMemo(() => {
    return floors?.reduce((acc, floor) => acc + (floor.rooms?.length || 0), 0) || 0;
  }, [floors]);

  // Compute total bed capacity dynamically from rooms capacity
  const totalCapacity = React.useMemo(() => {
    return floors?.reduce((acc, floor) => {
      return acc + (floor.rooms?.reduce((roomAcc, r) => roomAcc + (r.capacity || 0), 0) || 0);
    }, 0) || 0;
  }, [floors]);

  // Check if form data has unsaved edits
  const isDirty = React.useMemo(() => {
    if (!hostel) return false;
    return (
      formData.hostel_name !== hostel.hostel_name ||
      formData.hostel_id !== hostel.hostel_id ||
      formData.zone !== (hostel.zone || "") ||
      formData.status !== (hostel.status || "active") ||
      formData.auth_person_name !== (hostel.auth_person_name || "") ||
      formData.contact !== (hostel.contact || "") ||
      Number(formData.number_of_floors) !== (hostel.number_of_floors || 0)
    );
  }, [formData, hostel]);

  const handleCancel = async () => {
    if (isDirty) {
      const result = await showCancelConfirm();
      if (!result.isConfirmed) {
        return;
      }
    }
    toggleEditMode();
  };

  // Render Loader Skeleton
  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <DetailFormSkeleton />
        <TableSkeleton rows={4} />
      </div>
    );
  }

  // Render Error Panel
  if (error || !hostel) {
    return (
      <ErrorState
        title="Failed to Retrieve Hostel Information"
        message={error || "The requested hostel record could not be found."}
        onRetry={reload}
        isLoading={isLoading}
      />
    );
  }

  // Action Buttons for Page Header
  const headerActions = (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      {isEditMode ? (
        <>
          <Button variant="secondary" size="md" onClick={handleCancel} disabled={isSaving}>
            <X size={16} />
            <span>Cancel</span>
          </Button>
          <Button variant="primary" size="md" onClick={saveChanges} isLoading={isSaving}>
            <Save size={16} />
            <span>Save Changes</span>
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline" size="md" onClick={reload} style={{ padding: "0.5rem" }} title="Reload details">
            <RefreshCw size={16} />
          </Button>
          <Button variant="primary" size="md" onClick={toggleEditMode}>
            <Edit2 size={16} />
            <span>Edit Details</span>
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Success Notification Banner */}
      {successMessage && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "1rem 1.25rem",
          backgroundColor: "hsl(var(--success) / 0.15)",
          color: "hsl(var(--success))",
          border: "1px solid hsl(var(--success) / 0.25)",
          borderRadius: "var(--radius-md)",
          fontSize: "0.875rem",
          fontWeight: 600,
          animation: "slideInDown 0.3s ease-out"
        }}>
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <PageHeader
        title={hostel.hostel_name}
        description={isEditMode ? "Modifying operational parameters" : "Comprehensive hostel overview and status"}
        backHref="/hostels"
        backText="Back to Hostels"
        actions={headerActions}
        style={{ marginBottom: "0.5rem" }}
      />

      {/* Dashboard Overview Cards */}
      {!isEditMode && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "0.5rem"
        }} className="animate-slide-in">
          {/* Card 1: Operational Status */}
          <Card style={{ borderLeft: "4px solid hsl(var(--primary))", borderTop: "1px solid hsl(var(--border) / 0.6)", borderRight: "1px solid hsl(var(--border) / 0.6)", borderBottom: "1px solid hsl(var(--border) / 0.6)" }} className="card">
            <CardContent style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "var(--radius-md)",
                backgroundColor: "hsl(var(--primary) / 0.1)",
                color: "hsl(var(--primary))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Activity size={18} />
              </div>
              <div>
                <p style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Operational Status</p>
                <div style={{ marginTop: "0.25rem" }}>
                  <HostelStatusBadge status={hostel.status} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Registered Floors */}
          <Card style={{ borderLeft: "4px solid hsl(var(--warning))", borderTop: "1px solid hsl(var(--border) / 0.6)", borderRight: "1px solid hsl(var(--border) / 0.6)", borderBottom: "1px solid hsl(var(--border) / 0.6)" }} className="card">
            <CardContent style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "var(--radius-md)",
                backgroundColor: "hsl(var(--warning) / 0.1)",
                color: "hsl(var(--warning))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Layers size={18} />
              </div>
              <div>
                <p style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Registered Floors</p>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginTop: "0.125rem" }}>
                  {hostel.number_of_floors || 0} Floors
                </h3>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Allocated Rooms */}
          <Card style={{ borderLeft: "4px solid hsl(var(--success))", borderTop: "1px solid hsl(var(--border) / 0.6)", borderRight: "1px solid hsl(var(--border) / 0.6)", borderBottom: "1px solid hsl(var(--border) / 0.6)" }} className="card">
            <CardContent style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "var(--radius-md)",
                backgroundColor: "hsl(var(--success) / 0.15)",
                color: "hsl(var(--success))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Home size={18} />
              </div>
              <div>
                <p style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Allocated Rooms</p>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginTop: "0.125rem" }}>
                  {totalRooms} Rooms
                </h3>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Total Capacity */}
          <Card style={{ borderLeft: "4px solid hsl(var(--destructive))", borderTop: "1px solid hsl(var(--border) / 0.6)", borderRight: "1px solid hsl(var(--border) / 0.6)", borderBottom: "1px solid hsl(var(--border) / 0.6)" }} className="card">
            <CardContent style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "var(--radius-md)",
                backgroundColor: "hsl(var(--destructive) / 0.1)",
                color: "hsl(var(--destructive))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Hash size={18} />
              </div>
              <div>
                <p style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Bed Capacity</p>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginTop: "0.125rem" }}>
                  {totalCapacity} Beds
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Grid: Responsive 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Column: Hostel Metadata Info */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <SectionCard
            title={isEditMode ? "Edit Profile" : "Hostel Profile"}
            description={isEditMode ? "Update details relating to contact person, zone, or floors count." : "Primary identifiers and contact information."}
            headerActions={!isEditMode && <HostelStatusBadge status={hostel.status} />}
          >
            <HostelDetailsForm
              hostel={hostel}
              isEditMode={isEditMode}
              formData={formData}
              formErrors={formErrors}
              onInputChange={handleInputChange}
            />
          </SectionCard>
        </div>

        {/* Right Column: Floors & Rooms Breakdown */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <SectionCard
            title="Floor Allocations"
            description={`Breakdown of rooms mapped inside ${hostel.hostel_name}`}
          >
            <HostelFloorsTable floors={floors} hostel={hostel} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
};
