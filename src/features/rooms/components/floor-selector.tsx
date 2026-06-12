import React from "react";
import { Select } from "@/components/ui/select";
import { HostelFloor } from "../../hostel-floors/types";

interface FloorSelectorProps {
  value: string;
  onChange: (floorId: string) => void;
  floors: HostelFloor[];
  error?: string;
  disabled?: boolean;
}

export const FloorSelector: React.FC<FloorSelectorProps> = ({
  value,
  onChange,
  floors,
  error,
  disabled = false,
}) => {
  const options = [
    { label: "Select associated floor level...", value: "" },
    ...floors.map((f) => ({
      label: `Floor ${f.floor_no} (${f.room_number_series || "No Series"})`,
      value: f.id,
    })),
  ];

  return (
    <Select
      label="Associated Floor Level *"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      options={options}
      error={error}
      disabled={disabled}
      id="floor-selector-select"
    />
  );
};
