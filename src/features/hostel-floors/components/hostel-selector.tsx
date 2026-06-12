import React from "react";
import { Select } from "@/components/ui/select";
import { Hostel } from "../../hostels/types";

interface HostelSelectorProps {
  value: string;
  onChange: (hostelId: string) => void;
  hostels: Hostel[];
  error?: string;
  disabled?: boolean;
}

export const HostelSelector: React.FC<HostelSelectorProps> = ({
  value,
  onChange,
  hostels,
  error,
  disabled = false,
}) => {
  const options = [
    { label: "Select associated hostel...", value: "" },
    ...hostels.map((h) => ({
      label: `${h.hostel_name} (${h.hostel_id})`,
      value: h.id,
    })),
  ];

  return (
    <Select
      label="Associated Hostel *"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      options={options}
      error={error}
      disabled={disabled}
      id="hostel-selector-select"
    />
  );
};
