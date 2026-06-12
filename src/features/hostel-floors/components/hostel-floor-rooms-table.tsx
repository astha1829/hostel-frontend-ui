import React from "react";
import { QrCode, Home, Users, Tag } from "lucide-react";
import { HostelRoom } from "../types";

interface HostelFloorRoomsTableProps {
  rooms?: HostelRoom[];
}

export const HostelFloorRoomsTable: React.FC<HostelFloorRoomsTableProps> = ({ rooms }) => {
  if (!rooms || rooms.length === 0) {
    return (
      <div className="empty-floor-compact animate-slide-in">
        <Home size={32} style={{ color: "hsl(var(--muted-foreground))", opacity: 0.6 }} />
        <h3 className="empty-floor-compact-title">No Rooms Registered</h3>
        <p className="empty-floor-compact-desc">
          There are currently no rooms mapped to this floor level.
        </p>
      </div>
    );
  }

  const formatRent = (rent: string | number) => {
    const numericRent = typeof rent === "string" ? parseFloat(rent) : rent;
    if (isNaN(numericRent)) return "$0.00";
    return `$${numericRent.toFixed(2)}`;
  };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
      gap: "0.75rem",
    }} className="animate-slide-in">
      {rooms.map((room) => {
        const statusDotColor = (() => {
          switch (room.status?.toLowerCase()) {
            case "active":
            case "available":
              return "hsl(var(--success))";
            case "occupied":
            case "full":
              return "hsl(var(--primary))";
            case "maintenance":
              return "hsl(var(--warning))";
            case "inactive":
              return "hsl(var(--destructive))";
            default:
              return "hsl(var(--muted-foreground))";
          }
        })();

        return (
          <div
            key={room.id}
            className="room-pill-hover"
            style={{
              border: "1px solid hsl(var(--border) / 0.8)",
              borderRadius: "var(--radius-md)",
              padding: "0.875rem",
              backgroundColor: "hsl(var(--card))",
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
              position: "relative",
              transition: "var(--transition)",
              boxShadow: "var(--shadow-sm)"
            }}
          >
            {/* Top row: Room Number and QR code */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <Home size={14} style={{ color: "hsl(var(--primary))" }} />
                <span style={{ fontWeight: 700, fontSize: "0.9375rem", letterSpacing: "-0.01em", color: "hsl(var(--foreground))" }}>
                  {room.room_no}
                </span>
              </div>
              {room.qr_code && (
                <a
                  href={room.qr_code}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open room allocation QR Link"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "hsl(var(--primary))",
                    backgroundColor: "hsl(var(--primary) / 0.08)",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.25rem",
                    transition: "var(--transition)"
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <QrCode size={12} />
                </a>
              )}
            </div>

            {/* Middle info: Beds and Type */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem", fontSize: "0.75rem", color: "hsl(var(--muted-foreground))" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <Users size={12} style={{ opacity: 0.8 }} />
                <span>{room.capacity} {room.capacity === 1 ? "Bed" : "Beds"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <Tag size={11} style={{ opacity: 0.8 }} />
                <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                  {room.room_type || "Standard"}
                </span>
              </div>
            </div>

            {/* Footer: Rent and Status dot */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "0.25rem",
              borderTop: "1px solid hsl(var(--border) / 0.5)",
              paddingTop: "0.375rem"
            }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "hsl(var(--foreground))" }}>
                {formatRent(room.rent)}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <span style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: statusDotColor
                }} />
                <span style={{ fontSize: "0.75rem", textTransform: "capitalize", fontWeight: 500, color: "hsl(var(--muted-foreground))" }}>
                  {room.status}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
