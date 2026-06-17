"use client";

import React from "react";
import { Edit2, Save, X, RefreshCw, CheckCircle2, Building2, Layers, Home, Users, DollarSign, QrCode, Tag, Hash, Info, Calendar, Copy, Check } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DetailFormSkeleton, TableSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useRoomDetails } from "../hooks/use-room-details";
import { showCancelConfirm } from "@/utils/swal";

import { useRouter } from "next/navigation";

interface RoomDetailsPageProps {
  id: string;
  initialEditMode?: boolean;
}

export const RoomDetailsPage: React.FC<RoomDetailsPageProps> = ({ id, initialEditMode = false }) => {
  const router = useRouter();
  const {
    room,
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
  } = useRoomDetails(id, initialEditMode);

  const [copied, setCopied] = React.useState(false);

  // Check if form data has unsaved edits
  const isDirty = React.useMemo(() => {
    if (!room) return false;
    return (
      formData.room_no !== room.room_no ||
      formData.capacity !== room.capacity ||
      formData.room_type !== room.room_type ||
      formData.rent !== Number(room.rent) ||
      formData.status !== room.status ||
      formData.idx !== room.idx ||
      (formData.qr_code || "") !== (room.qr_code || "")
    );
  }, [formData, room]);

  const handleCancel = async () => {
    if (isDirty) {
      const result = await showCancelConfirm();
      if (!result.isConfirmed) {
        return;
      }
    }
    toggleEditMode();
  };

  const handleCopy = () => {
    if (!room) return;
    const text = `Room Details:
- Room Number: ${room.room_no}
- Hostel: ${room.hostel?.hostel_name || "Unassigned"}
- Floor Level: Floor ${room.floor?.floor_no || 1}
- Beds Capacity: ${room.capacity} Beds
- Monthly Rent: ${formatRent(room.rent)}
- Status: ${room.status}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <DetailFormSkeleton />
        <TableSkeleton rows={4} />
      </div>
    );
  }

  if (error || !room) {
    const isNotFound = error?.toLowerCase().includes("404") || error?.toLowerCase().includes("not found");
    if (isNotFound || !room) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-border rounded-xl bg-card max-w-lg mx-auto my-8 shadow-sm">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 mb-5 text-muted-foreground">
            <Info size={36} />
          </div>
          <h3 className="text-xl font-bold text-foreground">Room Not Found</h3>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">The requested room record does not exist.</p>
          <Button
            variant="primary"
            size="md"
            onClick={() => router.push('/rooms')}
            className="mt-6 flex items-center gap-2"
          >
            <span>Back to Rooms</span>
          </Button>
        </div>
      );
    }

    return (
      <ErrorState
        title="Failed to Retrieve Room Details"
        message={error || "The requested room record could not be found."}
        onRetry={reload}
        isLoading={isLoading}
      />
    );
  }

  const getStatusBadge = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "available":
        return <Badge variant="success">Available</Badge>;
      case "occupied":
      case "full":
        return <Badge variant="default">Occupied</Badge>;
      case "maintenance":
        return <Badge variant="warning">Maintenance</Badge>;
      case "inactive":
        return <Badge variant="danger">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status || "Unknown"}</Badge>;
    }
  };

  const formatRent = (rent: string | number) => {
    const numericRent = typeof rent === "string" ? parseFloat(rent) : rent;
    if (isNaN(numericRent)) return "$0.00";
    return `$${numericRent.toFixed(2)}`;
  };

  // Header Actions
  const headerActions = (
    <div className="flex gap-3 items-center">
      {isEditMode ? (
        <>
          <Button variant="secondary" size="md" onClick={handleCancel} disabled={isSaving}>
            <X size={16} />
            <span>Cancel</span>
          </Button>
          <Button className="btn-top-action">
            <Save size={16} />
            <span>Save Changes</span>
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline" size="md" onClick={reload} className="px-2" title="Reload details">
            <RefreshCw size={16} />
          </Button>
          <Button className="btn-top-action">
            <Edit2 size={16} />
            <span>Edit Details</span>
          </Button>
        </>
      )}
    </div>
  );

  const capacityOptions = [
    { label: "1 Bed", value: 1 },
    { label: "2 Beds", value: 2 },
    { label: "3 Beds", value: 3 },
    { label: "4 Beds", value: 4 },
    { label: "5 Beds", value: 5 },
  ];

  const roomTypeOptions = [
    { label: "Normal", value: "Normal" },
  ];

  const statusOptions = [
    { label: "Available", value: "Available" },
    { label: "Occupied", value: "Occupied" },
    { label: "Maintenance", value: "Maintenance" },
    { label: "Inactive", value: "Inactive" },
  ];

  // Resolve QR code URL (use custom QR or auto generate using api.qrserver.com pointing to current room id)
  const qrCodeSource = room.qr_code || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(id)}`;

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto">
      {/* Success Banner */}
      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-success/15 text-success border border-success/25 rounded-md text-sm font-semibold animate-in slide-in-from-top-2 duration-300">
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Header */}
      <PageHeader
        title={`Room ${room.room_no}`}
        description={isEditMode ? "Modifying room operational details" : "Comprehensive room specification and digital access key"}
        backHref="/rooms"
        backText="Back to Rooms"
        actions={headerActions}
        className="mb-2"
      />

      {/* Quick Stats / Summary Cards Grid */}
      {!isEditMode && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2 animate-in slide-in-from-bottom-4 duration-500">
          {/* Card 1: Associated Hostel */}
          <Card className="border-l-4 border-l-primary border-t-border/60 border-r-border/60 border-b-border/60 shadow-sm">
            <CardContent className="p-4 pt-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Building2 size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Hostel</span>
                <span className="text-[17px] font-bold leading-tight">{room.hostel?.hostel_name || "Unassigned"}</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Floor Level */}
          <Card className="border-l-4 border-l-warning border-t-border/60 border-r-border/60 border-b-border/60 shadow-sm">
            <CardContent className="p-4 pt-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-warning/10 text-warning flex items-center justify-center shrink-0">
                <Layers size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Floor Level</span>
                <span className="text-xl font-bold leading-tight">Floor {room.floor?.floor_no || 1}</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Capacity */}
          <Card className="border-l-4 border-l-success border-t-border/60 border-r-border/60 border-b-border/60 shadow-sm">
            <CardContent className="p-4 pt-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-success/15 text-success flex items-center justify-center shrink-0">
                <Users size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Capacity</span>
                <span className="text-xl font-bold leading-tight">{room.capacity} Beds</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Monthly Rent */}
          <Card className="border-l-4 border-l-destructive border-t-border/60 border-r-border/60 border-b-border/60 shadow-sm">
            <CardContent className="p-4 pt-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                <DollarSign size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Monthly Rent</span>
                <span className="text-xl font-bold leading-tight text-destructive">{formatRent(room.rent)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Grid: Responsive 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch animate-in slide-in-from-bottom-4 duration-500">

        {/* Left Column: Specifications Card */}
        <div className="lg:col-span-8 flex flex-col gap-4 h-full">
          <SectionCard
            title={isEditMode ? "Edit Specifications" : "Room Specifications"}
            description={isEditMode ? "Update pricing, room number, capacity, and status details." : "Standard room parameters and pricing details."}
            className="h-full"
          >
            {isEditMode ? (
              <div className="flex flex-col gap-5">
                {/* Read-Only Hostel/Floor Context */}
                <div className="flex flex-wrap gap-6 p-4 bg-secondary/10 border border-border/60 rounded-md text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-muted-foreground" />
                    <span className="text-muted-foreground font-semibold">Associated Hostel:</span>
                    <strong className="text-foreground font-bold">{room.hostel?.hostel_name || "Unassigned"}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers size={16} className="text-muted-foreground" />
                    <span className="text-muted-foreground font-semibold">Associated Floor:</span>
                    <strong className="text-foreground font-bold">Floor {room.floor?.floor_no || 1}</strong>
                  </div>
                </div>

                {/* Section 1: Specifications Group */}
                <div className="border border-border/80 rounded-lg p-5 bg-secondary/15 flex flex-col gap-4">
                  <div className="flex items-center gap-2 border-b border-border/80 pb-2">
                    <Building2 size={16} className="text-primary" />
                    <span className="text-[13px] font-bold uppercase tracking-wider text-foreground">
                      Room Location & Identification
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      label="Room Number *"
                      type="text"
                      value={formData.room_no || ""}
                      onChange={(e) => handleInputChange("room_no", e.target.value)}
                      error={formErrors.room_no}
                      disabled={isSaving}
                    />

                    <Input
                      label="Sort Index"
                      type="number"
                      min={0}
                      value={formData.idx === undefined ? "" : formData.idx}
                      onChange={(e) => handleInputChange("idx", Number(e.target.value))}
                      disabled={isSaving}
                    />
                  </div>
                </div>

                {/* Section 2: Capacity, Classification & Finance Group */}
                <div className="border border-border/80 rounded-lg p-5 bg-secondary/15 flex flex-col gap-4">
                  <div className="flex items-center gap-2 border-b border-border/80 pb-2">
                    <Users size={16} className="text-primary" />
                    <span className="text-[13px] font-bold uppercase tracking-wider text-foreground">
                      Capacity, Classification & Finance
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <Select
                      label="Capacity *"
                      value={formData.capacity}
                      onChange={(e) => handleInputChange("capacity", Number(e.target.value))}
                      options={capacityOptions}
                      error={formErrors.capacity}
                      disabled={isSaving}
                    />

                    <Select
                      label="Room Type *"
                      value={formData.room_type}
                      onChange={(e) => handleInputChange("room_type", e.target.value)}
                      options={roomTypeOptions}
                      error={formErrors.room_type}
                      disabled={isSaving}
                    />

                    <Select
                      label="Operational Status *"
                      value={formData.status}
                      onChange={(e) => handleInputChange("status", e.target.value)}
                      options={statusOptions}
                      error={formErrors.status}
                      disabled={isSaving}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                    <Input
                      label="Rent Rate ($ / Month) *"
                      type="number"
                      min={0}
                      step="0.01"
                      value={formData.rent === undefined ? "" : formData.rent}
                      onChange={(e) => handleInputChange("rent", Number(e.target.value))}
                      error={formErrors.rent}
                      disabled={isSaving}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-5 mt-2">
                    <Input
                      label="Digital Key QR Code URL"
                      type="url"
                      value={formData.qr_code || ""}
                      onChange={(e) => handleInputChange("qr_code", e.target.value)}
                      placeholder="e.g. https://example.com/qr.png"
                      disabled={isSaving}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Associated Hostel</span>
                  <span className="body-text-primary">
                    {room.hostel?.hostel_name || "-"}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Hostel Code</span>
                  <span className="font-mono text-[14px] font-medium text-foreground">{room.hostel?.hostel_id || "-"}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Floor Level</span>
                  <span className="text-[14px] font-medium text-foreground">Floor {room.floor?.floor_no || 1}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Room Type</span>
                  <span className="text-[14px] font-medium text-foreground">{room.room_type || "Normal"}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Beds Capacity</span>
                  <span className="text-[14px] font-medium text-foreground">{room.capacity} Beds</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Monthly Rent</span>
                  <span className="text-[14px] font-bold text-primary">
                    {formatRent(room.rent)}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Room Status</span>
                  <span className="mt-0.5">
                    {getStatusBadge(room.status)}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Sort Index</span>
                  <span className="text-[14px] font-medium text-foreground">{room.idx}</span>
                </div>

                <div className="flex flex-col gap-1 sm:col-span-2 pt-2 mt-1 border-t border-border/40">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Last Updated</span>
                  <span className="text-[13px] font-medium text-muted-foreground">
                    {room.updated_at ? new Date(room.updated_at).toLocaleString() : "-"}
                  </span>
                </div>
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right Column: Visual Digital Key / QR Pass Card */}
        <div className="flex flex-col gap-4 lg:col-span-4 h-full">
          <SectionCard
            title="Digital Access Key"
            description="Operational security QR code and room registration key card."
            className="h-full"
          >
            <div className="flex flex-col gap-3 items-center justify-center h-full">

              {/* Premium Room Key Card Graphic */}
              <div className="w-full max-w-[420px] bg-gradient-to-br from-primary to-primary/75 rounded-[12px] p-5 text-white shadow-[0_10px_25px_-5px_hsl(var(--primary)/0.35),var(--shadow-md)] flex flex-col justify-between h-[180px] relative overflow-hidden border border-white/10 shrink-0">

                {/* Decorative translucent vector shapes */}
                <div className="absolute -right-5 -top-5 w-[140px] h-[140px] rounded-full bg-white/10 pointer-events-none" />
                <div className="absolute -left-10 -bottom-10 w-[180px] h-[180px] rounded-full bg-white/5 pointer-events-none" />

                {/* Key Card Header */}
                <div className="flex justify-between items-start z-10">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.08em] opacity-85 m-0">
                      ATMIA Keypass
                    </h4>
                    <p className="text-[13px] font-medium opacity-95 mt-0.5 mb-0 truncate max-w-[200px]">
                      {room.hostel?.hostel_name || "Hostel Resident"}
                    </p>
                  </div>
                  <Home size={18} className="opacity-90" />
                </div>

                {/* Key Card Middle */}
                <div className="flex justify-between items-center z-10 my-1">
                  <div>
                    <div className="text-[1.75rem] font-extrabold tracking-tight leading-none">
                      Room {room.room_no}
                    </div>
                    <div className="text-[12px] font-medium opacity-85 mt-1">
                      Floor {room.floor?.floor_no || 1} • {room.capacity} Beds
                    </div>
                  </div>

                  {/* Premium Gold Microchip Graphic */}
                  <div className="w-[36px] h-[28px] bg-[linear-gradient(135deg,#e6b800_0%,#ffd700_45%,#fff5cc_70%,#d4af37_100%)] rounded-[4px] relative border border-black/15 overflow-hidden flex flex-wrap p-[1px] shadow-[0_2px_4px_rgba(0,0,0,0.1)] shrink-0">
                    <div className="w-1/2 h-1/2 border-r border-b border-black/15" />
                    <div className="w-1/2 h-1/2 border-b border-black/15" />
                    <div className="w-1/2 h-1/2 border-r border-black/15" />
                    <div className="w-1/2 h-1/2" />
                  </div>
                </div>

                {/* Key Card Footer */}
                <div className="flex justify-between items-center border-t border-white/15 pt-2 z-10">
                  <span className="text-[10px] font-semibold uppercase tracking-wider opacity-90">
                    Status: {room.status}
                  </span>
                  <span className="text-[10px] opacity-80 font-mono">
                    ID: {room.id.substring(0, 8).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Refined QR Code Action Details */}
              <div className="w-full flex flex-col gap-3 mt-1 items-center">
                <div className="bg-white p-1.5 rounded-md border border-border shadow-sm shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrCodeSource}
                    alt="Room QR Code"
                    className="w-[100px] h-[100px] block"
                  />
                </div>

                {/* Actions Row */}
                <div className="flex flex-col gap-2 w-full max-w-[240px]">
                  <Button variant="outline" size="sm" onClick={handleCopy} className="flex gap-2 items-center w-full justify-center">
                    {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                    <span>{copied ? "Copied!" : "Copy Details"}</span>
                  </Button>
                </div>
              </div>

            </div>
          </SectionCard>
        </div>

      </div>
    </div>
  );
};
