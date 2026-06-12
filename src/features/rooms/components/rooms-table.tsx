"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Home, Users, DollarSign, QrCode } from "lucide-react";
import { TableContainer, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { HostelRoom } from "../types";

interface RoomsTableProps {
  rooms: HostelRoom[];
}

export const RoomsTable: React.FC<RoomsTableProps> = ({ rooms }) => {
  const router = useRouter();

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

  return (
    <TableContainer className="border border-border/80 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[15%]">Room Number</TableHead>
            <TableHead className="w-[25%]">Hostel Name</TableHead>
            <TableHead className="w-[15%]">Floor Level</TableHead>
            <TableHead className="w-[15%]">Capacity</TableHead>
            <TableHead className="w-[12%]">Rent Rate</TableHead>
            <TableHead className="w-[13%]">Status</TableHead>
            <TableHead className="w-[5%] text-center text-xs font-bold uppercase tracking-wider text-muted-foreground/80 align-middle">
              QR Code
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.map((room) => (
            <TableRow
              key={room.id}
              className="cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => router.push(`/rooms/${room.id}`)}
            >
              {/* Room No */}
              <TableCell className="font-semibold text-primary font-mono">
                <div className="flex items-center gap-2">
                  <Home size={14} className="text-primary" />
                  <span className="hover:underline">Room {room.room_no}</span>
                </div>
              </TableCell>

              {/* Hostel Name */}
              <TableCell className="font-medium">
                <span>{room.hostel?.hostel_name || "Unassigned"}</span>
              </TableCell>

              {/* Floor Level */}
              <TableCell>
                <span>Floor {room.floor?.floor_no || room.idx || 1}</span>
              </TableCell>

              {/* Capacity */}
              <TableCell>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <Users size={14} className="text-muted-foreground" />
                    <span className="font-semibold">{room.capacity} Beds</span>
                  </div>
                  <span className="text-xs text-muted-foreground ml-5">
                    {room.room_type || "Normal"} Room
                  </span>
                </div>
              </TableCell>

              {/* Rent */}
              <TableCell className="font-semibold">
                <div className="flex items-center gap-1">
                  <DollarSign size={14} className="text-muted-foreground" />
                  <span>{formatRent(room.rent)}</span>
                </div>
              </TableCell>

              {/* Status */}
              <TableCell>
                {getStatusBadge(room.status)}
              </TableCell>

              {/* QR Code Link */}
              <TableCell className="text-center align-middle" onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-1 justify-center items-center">
                  {room.qr_code ? (
                    <a
                      href={room.qr_code}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open room digital pass link"
                      className="inline-flex items-center justify-center text-primary rounded-sm p-1.5 cursor-pointer transition-colors hover:bg-primary/10"
                    >
                      <QrCode size={15} />
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">
                      None
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
