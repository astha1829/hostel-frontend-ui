import React from "react";
import { Select } from "@/components/ui/select";
import { ROOM_NUMBER_SERIES_OPTIONS } from "../types";

interface RoomNumberSeriesSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export const RoomNumberSeriesSelect: React.FC<RoomNumberSeriesSelectProps> = ({
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const options = [
    { label: "Select room number series...", value: "" },
    ...ROOM_NUMBER_SERIES_OPTIONS,
  ];

  return (
    <Select
      label="Room Number Series *"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      options={options}
      error={error}
      disabled={disabled}
      id="room-number-series-select"
    />
  );
};
