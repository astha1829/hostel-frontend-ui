import React from "react";
import { Layers, Home, Users } from "lucide-react";
import { HostelFloor, Hostel } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HostelFloorsTableProps {
  floors: HostelFloor[];
  hostel?: Hostel;
}

export const HostelFloorsTable: React.FC<HostelFloorsTableProps> = ({ floors, hostel }) => {
  if (!floors || floors.length === 0) {
    const floorCount = hostel?.number_of_floors || 0;
    return (
      <div
        className="empty-floor-compact"
        style={{
          padding: "2.5rem 1.5rem",
          border: "1px dashed hsl(var(--border))",
          borderRadius: "var(--radius-lg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          backgroundColor: "hsl(var(--card) / 0.5)"
        }}
      >
        <Layers size={32} style={{ color: "hsl(var(--muted-foreground))", marginBottom: "0.75rem" }} />
        <h4 style={{ fontSize: "1rem", fontWeight: 700, margin: 0, color: "hsl(var(--foreground))" }}>No Floor Allocations Mapped</h4>
        <p style={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground))", marginTop: "0.375rem", maxWidth: "24rem", lineHeight: 1.5 }}>
          {floorCount > 0
            ? `This hostel is configured for ${floorCount} floors, but no room distributions have been initialized yet.`
            : "No registered floors are currently allocated for this hostel."}
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {floors.map((floor) => {
        const rooms = floor.rooms || [];
        const numberOfRooms = rooms.length;
        const totalCapacity = rooms.reduce((sum, r) => sum + (r.capacity || 0), 0);

        return (
          <Card
            key={floor.id || floor.floor_no}
            style={{
              border: "1px solid hsl(var(--border) / 0.8)",
              boxShadow: "var(--shadow-sm)",
              transition: "var(--transition)"
            }}
            className="card"
          >
            <CardContent style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Floor Header Info */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{
                    width: "2.25rem",
                    height: "2.25rem",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "hsl(var(--primary) / 0.1)",
                    color: "hsl(var(--primary))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Layers size={16} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, margin: 0, color: "hsl(var(--foreground))" }}>
                      Floor Level {floor.floor_no}
                    </h4>
                    {floor.room_number_series && (
                      <p style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))", margin: 0 }}>
                        Series: {floor.room_number_series}
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <Badge variant="default" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                    <Home size={11} />
                    <span>{numberOfRooms} {numberOfRooms === 1 ? 'Room' : 'Rooms'}</span>
                  </Badge>
                  {totalCapacity > 0 && (
                    <Badge variant="secondary" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                      <Users size={11} />
                      <span>{totalCapacity} Beds</span>
                    </Badge>
                  )}
                </div>
              </div>

              {/* Rooms Badges Grid */}
              {numberOfRooms > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", borderTop: "1px solid hsl(var(--border) / 0.5)", paddingTop: "0.75rem" }}>
                  <span style={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "hsl(var(--muted-foreground) / 1.3)" }}>
                    Rooms Distribution
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {rooms.map((room) => {
                      const roomNo = room.room_number || (room as any).room_no || "Room";
                      return (
                        <div
                          key={room.id}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.375rem",
                            padding: "0.35rem 0.625rem",
                            backgroundColor: "hsl(var(--secondary) / 0.7)",
                            border: "1px solid hsl(var(--border) / 0.8)",
                            borderRadius: "var(--radius-sm)",
                            fontSize: "0.8125rem",
                            fontWeight: 600,
                            color: "hsl(var(--foreground))",
                            transition: "var(--transition)"
                          }}
                          className="room-pill-hover"
                          title={`Capacity: ${room.capacity || 0} Beds`}
                        >
                          <span style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            backgroundColor: "hsl(var(--primary))"
                          }} />
                          <span>{roomNo}</span>
                          {room.capacity !== undefined && (
                            <span style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))", fontWeight: 500 }}>
                              ({room.capacity}B)
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div style={{ borderTop: "1px solid hsl(var(--border) / 0.5)", paddingTop: "0.75rem", fontSize: "0.8125rem", color: "hsl(var(--muted-foreground))", fontStyle: "italic" }}>
                  No room items registered on this floor level yet.
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
