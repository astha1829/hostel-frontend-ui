"use client";

import React from "react";
import { Edit2, Save, X, RefreshCw, CheckCircle2, Building2, Layers, Hash, Home, Info } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DetailFormSkeleton, TableSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useHostelFloorDetails } from "../hooks/use-hostel-floor-details";
import { HostelFloorRoomsTable } from "./hostel-floor-rooms-table";
import { RoomNumberSeriesSelect } from "./room-number-series-select";
import { showCancelConfirm } from "@/utils/swal";

interface HostelFloorDetailsPageProps {
  id: string;
}

export const HostelFloorDetailsPage: React.FC<HostelFloorDetailsPageProps> = ({ id }) => {
  const {
    floor,
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
  } = useHostelFloorDetails(id);

  // Check if form data has unsaved edits
  const isDirty = React.useMemo(() => {
    if (!floor) return false;
    return (
      formData.floor_no !== floor.floor_no ||
      formData.room_number_series !== (floor.room_number_series || "") ||
      formData.idx !== (floor.idx || 0)
    );
  }, [formData, floor]);

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
      <div className="flex flex-col gap-8">
        <DetailFormSkeleton />
        <TableSkeleton rows={4} />
      </div>
    );
  }

  // Render Error Panel
  if (error || !floor) {
    return (
      <ErrorState
        title="Failed to Retrieve Hostel Floor"
        message={error || "The requested hostel floor record could not be found."}
        onRetry={reload}
        isLoading={isLoading}
      />
    );
  }

  const roomsCount = floor.rooms?.length || 0;

  // Action Buttons for Page Header
  const headerActions = (
    <div className="flex gap-3 items-center">
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
          <Button variant="outline" size="md" onClick={reload} className="px-2" title="Reload details">
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
    <div className="flex flex-col gap-5">
      {/* Success Notification Banner */}
      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-success/15 text-success border border-success/25 rounded-md text-sm font-semibold animate-in slide-in-from-top-2 duration-300">
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <PageHeader
        title={`Floor ${floor.floor_no}`}
        description={isEditMode ? "Modifying floor configuration" : "Comprehensive floor profile and room distribution"}
        backHref="/hostel-floors"
        backText="Back to Hostel Floors"
        actions={headerActions}
        className="mb-2"
      />

      {/* Quick Stats / Summary Cards Grid */}
      {!isEditMode && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2 animate-in slide-in-from-bottom-4 duration-500">
          {/* Card 1: Associated Hostel */}
          <Card className="border-l-4 border-l-primary border-t-border/60 border-r-border/60 border-b-border/60">
            <CardContent className="p-5 pt-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                <Building2 size={18} />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Associated Hostel</p>
                <h3 className="text-lg font-bold mt-0.5">
                  {floor.hostel?.hostel_name || "Unassigned"}
                </h3>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Floor Level */}
          <Card className="border-l-4 border-l-warning border-t-border/60 border-r-border/60 border-b-border/60">
            <CardContent className="p-5 pt-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-md bg-warning/10 text-warning flex items-center justify-center">
                <Layers size={18} />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Floor Level</p>
                <h3 className="text-xl font-bold mt-0.5">
                  Floor {floor.floor_no}
                </h3>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Room Series */}
          <Card className="border-l-4 border-l-success border-t-border/60 border-r-border/60 border-b-border/60">
            <CardContent className="p-5 pt-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-md bg-success/15 text-success flex items-center justify-center">
                <Hash size={18} />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Room Series</p>
                <h3 className="text-lg font-bold mt-0.5 font-mono">
                  {floor.room_number_series ? floor.room_number_series.split(" - ")[0] : "None"}
                </h3>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Operational Rooms */}
          <Card className="border-l-4 border-l-destructive border-t-border/60 border-r-border/60 border-b-border/60">
            <CardContent className="p-5 pt-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-md bg-destructive/10 text-destructive flex items-center justify-center">
                <Home size={18} />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Operational Rooms</p>
                <h3 className="text-xl font-bold mt-0.5">
                  {roomsCount} {roomsCount === 1 ? 'Room' : 'Rooms'}
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Grid: Responsive 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Floor Profile Form */}
        <div className="flex flex-col gap-5 lg:col-span-4">
          <SectionCard
            title={isEditMode ? "Edit Specifications" : "Floor Specifications"}
            description={isEditMode ? "Update details relating to the floor level or numbering schemas." : "Floor details and location parameters."}
          >
            {isEditMode ? (
              <div className="flex flex-col gap-5">
                <div className="border border-border/80 rounded-lg p-5 bg-secondary/15 flex flex-col gap-5">
                  <div className="flex items-center gap-2 border-b border-border/80 pb-2">
                    <Layers size={16} className="text-primary" />
                    <span className="text-[13px] font-bold uppercase tracking-wider text-foreground">
                      Floor & Numbering Specifications
                    </span>
                  </div>

                  {/* Read-Only Hostel Info */}
                  <div className="p-4 bg-secondary/10 rounded-md border border-border/50">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-muted-foreground" />
                      <span className="text-sm font-semibold text-muted-foreground">
                        Associated Hostel:
                      </span>
                      <span className="text-sm font-bold text-foreground">
                        {floor.hostel?.hostel_name || "Unassigned"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      label="Floor Number *"
                      type="number"
                      min={1}
                      value={formData.floor_no !== undefined ? formData.floor_no : ""}
                      onChange={(e) => handleInputChange("floor_no", e.target.value ? Number(e.target.value) : "")}
                      error={formErrors.floor_no}
                      placeholder="e.g. 2"
                    />

                    <RoomNumberSeriesSelect
                      value={formData.room_number_series || ""}
                      onChange={(value) => handleInputChange("room_number_series", value)}
                      error={formErrors.room_number_series}
                      disabled={isSaving}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      label="Index Order"
                      type="number"
                      min={0}
                      value={formData.idx !== undefined ? formData.idx : ""}
                      onChange={(e) => handleInputChange("idx", e.target.value ? Number(e.target.value) : "")}
                      error={formErrors.idx}
                      placeholder="e.g. 1"
                    />
                    <div />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Hostel Name</span>
                    <span className="text-[17px] font-bold text-foreground">
                      {floor.hostel?.hostel_name || "-"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Hostel Code</span>
                    <span className="font-mono text-[15px] font-medium text-foreground">{floor.hostel?.hostel_id || "-"}</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Floor Number</span>
                    <span className="text-[15px] font-medium text-foreground">Floor {floor.floor_no}</span>
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Room Number Series</span>
                    <span className="font-mono text-[15px] text-foreground">
                      {floor.room_number_series ? (
                        (() => {
                          const parts = floor.room_number_series.split(" - ");
                          if (parts.length === 2) {
                            const [seriesName, roomsList] = parts;
                            const roomNumbers = roomsList.split(",").join(" • ");
                            return (
                              <div className="flex flex-col gap-1">
                                <span className="font-bold text-sm text-foreground">
                                  Series: {seriesName}
                                </span>
                                <span className="text-[13px] text-muted-foreground">
                                  Rooms: {roomNumbers}
                                </span>
                              </div>
                            );
                          }
                          return floor.room_number_series;
                        })()
                      ) : (
                        "Not Configured"
                      )}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Sort Index</span>
                    <span className="text-[15px] font-medium text-foreground">{floor.idx}</span>
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2 border-t border-border/50 pt-4 mt-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Last Updated</span>
                    <span className="text-[15px] font-medium text-muted-foreground">
                      {floor.updated_at ? new Date(floor.updated_at).toLocaleDateString() : "-"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right Column: Room Allocations Grid/Pills */}
        <div className="flex flex-col gap-5 lg:col-span-8">
          <SectionCard
            title="Room Allocations"
            description={`Complete listing of rooms assigned to Floor ${floor.floor_no}`}
          >
            <HostelFloorRoomsTable rooms={floor.rooms} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
};
