import React from "react";
import { Badge } from "@/components/ui/badge";
import { HostelStatus } from "../types";

interface HostelStatusBadgeProps {
  status?: HostelStatus;
}

export const HostelStatusBadge: React.FC<HostelStatusBadgeProps> = ({ status }) => {
  const getBadgeDetails = () => {
    switch (status?.toLowerCase()) {
      case "active":
        return { variant: "success" as const, label: "Active", dotColor: "hsl(var(--success))" };
      case "maintenance":
        return { variant: "warning" as const, label: "Maintenance", dotColor: "hsl(var(--warning))" };
      case "inactive":
        return { variant: "danger" as const, label: "Inactive", dotColor: "hsl(var(--destructive))" };
      default:
        return { variant: "secondary" as const, label: status || "Unknown", dotColor: "hsl(var(--muted-foreground))" };
    }
  };

  const { variant, label, dotColor } = getBadgeDetails();

  return (
    <Badge variant={variant} style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", padding: "0.25rem 0.5rem" }}>
      <span style={{
        display: "inline-block",
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        backgroundColor: dotColor
      }} />
      <span>{label}</span>
    </Badge>
  );
};
