import React from "react";
import { Building2, Layers, Users, ShieldCheck, DollarSign, QrCode, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { HostelSelector } from "@/features/hostel-floors/components/hostel-selector";
import { FloorSelector } from "./floor-selector";
import { useRoomForm } from "../hooks/use-room-form";
import { showCancelConfirm } from "@/utils/swal";

interface RoomFormProps {
  onSuccess: () => void;
  onClose: () => void;
  initialHostelId?: string;
  initialFloorId?: string;
}

export const RoomForm: React.FC<RoomFormProps> = ({ onSuccess, onClose, initialHostelId, initialFloorId }) => {
  const {
    hostels,
    floors,
    isLoading,
    isSaving,
    error,
    errors,
    hostelId,
    handleHostelChange,
    floorId,
    setFloorId,
    roomNo,
    setRoomNo,
    capacity,
    setCapacity,
    roomType,
    setRoomType,
    rent,
    setRent,
    status,
    setStatus,
    idx,
    setIdx,
    qrCode,
    setQrCode,
    save,
  } = useRoomForm(onSuccess, initialHostelId, initialFloorId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await save();
  };

  const handleCancelClick = async () => {
    const isDirty =
      hostelId !== "" ||
      floorId !== "" ||
      roomNo !== "" ||
      capacity !== 2 ||
      roomType !== "Normal" ||
      rent !== 0 ||
      status !== "Available" ||
      idx !== 1 ||
      qrCode !== "";

    if (isDirty) {
      const result = await showCancelConfirm();
      if (!result.isConfirmed) {
        return;
      }
    }
    onClose();
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading form metadata...
      </div>
    );
  }

  const capacityOptions = [
    { label: "1 Bed", value: 1 },
    { label: "2 Beds", value: 2 },
    { label: "3 Beds", value: 3 },
    { label: "4 Beds", value: 4 },
    { label: "5 Beds", value: 5 },
  ];

  const roomTypeOptions = [
    { label: "Normal Room", value: "Normal" },
  ];

  const statusOptions = [
    { label: "Available", value: "Available" },
    { label: "Occupied", value: "Occupied" },
    { label: "Maintenance", value: "Maintenance" },
    { label: "Inactive", value: "Inactive" },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="p-3 px-4 bg-destructive/15 text-destructive border border-destructive/25 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* SECTION 1: Room Location */}
      <div className="border border-border/80 rounded-lg p-5 bg-secondary/15 flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <Building2 size={16} className="text-primary" />
          <span className="text-[13px] font-bold uppercase tracking-wider text-foreground">
            Room Location
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <HostelSelector
            value={hostelId}
            onChange={handleHostelChange}
            hostels={hostels}
            error={errors.hostel_id}
            disabled={isSaving}
          />

          <FloorSelector
            value={floorId}
            onChange={setFloorId}
            floors={floors}
            error={errors.hostel_floor_id}
            disabled={isSaving || !hostelId}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Room Number *"
            type="text"
            value={roomNo}
            onChange={(e) => setRoomNo(e.target.value)}
            error={errors.room_no}
            placeholder="e.g. 101"
            disabled={isSaving}
          />

          <Input
            label="Sort Index"
            type="number"
            min={0}
            value={idx}
            onChange={(e) => setIdx(Number(e.target.value))}
            error={errors.idx}
            placeholder="e.g. 1"
            disabled={isSaving}
          />
        </div>
      </div>

      {/* SECTION 2: Capacity & Classification */}
      <div className="border border-border/80 rounded-lg p-5 bg-secondary/15 flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <Users size={16} className="text-primary" />
          <span className="text-[13px] font-bold uppercase tracking-wider text-foreground">
            Capacity & Classification
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Room Capacity *"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            options={capacityOptions}
            error={errors.capacity}
            disabled={isSaving}
          />

          <Select
            label="Room Type *"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            options={roomTypeOptions}
            error={errors.room_type}
            disabled={isSaving}
          />

          <Select
            label="Operational Status *"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={statusOptions}
            error={errors.status}
            disabled={isSaving}
          />
        </div>
      </div>

      {/* SECTION 3: Financial & Access Specifications */}
      <div className="border border-border/80 rounded-lg p-5 bg-secondary/15 flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <DollarSign size={16} className="text-primary" />
          <span className="text-[13px] font-bold uppercase tracking-wider text-foreground">
            Financial & Access Specifications
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-1">
            <Input
              label="Rent Rate ($ / Month) *"
              type="number"
              min={0}
              step="0.01"
              value={rent}
              onChange={(e) => setRent(Number(e.target.value))}
              error={errors.rent}
              placeholder="e.g. 450.00"
              disabled={isSaving}
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="Digital Key QR Code URL"
              type="url"
              value={qrCode}
              onChange={(e) => setQrCode(e.target.value)}
              error={errors.qr_code}
              placeholder="e.g. https://api.qrserver.com/..."
              disabled={isSaving}
            />
          </div>
        </div>
      </div>

      {/* Sticky Footer actions */}
      <div className="flex justify-end gap-3 mt-2 border-t border-border pt-5 sticky bottom-0 bg-card z-10">
        <Button variant="secondary" size="md" type="button" onClick={handleCancelClick} disabled={isSaving}>
          Cancel
        </Button>
        <Button variant="primary" size="md" type="submit" isLoading={isSaving}>
          Add Room
        </Button>
      </div>
    </form>
  );
};
