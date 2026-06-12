"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Trash2, Calendar, FileText, Home, UserCheck, Layers, Building2, Edit3 } from "lucide-react";
import { TableContainer, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RoomAllotment } from "../types";

interface RoomAllotmentsTableProps {
  allotments: RoomAllotment[];
  sortBy: string;
  sortOrder: "ASC" | "DESC";
  onSort: (field: string) => void;
  onDelete: (id: string) => void;
}

export const RoomAllotmentsTable: React.FC<RoomAllotmentsTableProps> = ({
  allotments,
  sortBy,
  sortOrder,
  onSort,
  onDelete,
}) => {
  const router = useRouter();

  const getStatusBadge = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status || "Draft"}</Badge>;
    }
  };

  const formatPrice = (price?: number | null) => {
    if (price === undefined || price === null) return "—";
    return `$${Number(price).toFixed(2)}`;
  };

  const SortIndicator = ({ field }: { field: string }) => {
    if (sortBy !== field) return null;
    return <span className="ml-1 text-xs">{sortOrder === "ASC" ? "▲" : "▼"}</span>;
  };

  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[26%]">
              Student
            </TableHead>
            <TableHead className="w-[20%]">
              Hostel & Location
            </TableHead>
            <TableHead 
              className="w-[12%] cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onSort("room_no")}
            >
              <div className="flex items-center gap-1">
                <span>Room / Floor</span>
                <SortIndicator field="room_no" />
              </div>
            </TableHead>
            <TableHead className="w-[16%]">
              Hostel Contract
            </TableHead>
            <TableHead 
              className="w-[12%] cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onSort("rent")}
            >
              <div className="flex items-center gap-1">
                <span>Monthly Rent</span>
                <SortIndicator field="rent" />
              </div>
            </TableHead>
            <TableHead 
              className="w-[10%] cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onSort("status")}
            >
              <div className="flex items-center gap-1">
                <span>Status</span>
                <SortIndicator field="status" />
              </div>
            </TableHead>
            <TableHead className="w-[4%] text-center text-xs font-bold uppercase tracking-widest text-muted-foreground/80 align-middle">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allotments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-16 px-8 text-muted-foreground">
                No active room allotments match your search filters.
              </TableCell>
            </TableRow>
          ) : (
            allotments.map((allotment) => {
              // Parse student name and ID/passport info
              const [studentName, studentPassId] = allotment.student_name
                ? allotment.student_name.split("-")
                : ["Unlinked Student", ""];

              // Compute initials for student avatar representation
              const studentInitials = studentName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase() || "ST";

              return (
                <TableRow
                  key={allotment.id}
                  className="group cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => router.push(`/room-allotments/${allotment.id}`)}
                >
                  {/* Student Cell with initials avatar bubble */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[13px] border border-primary/15 shrink-0">
                        {studentInitials}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {studentName}
                        </span>
                        {studentPassId && (
                          <span className="text-xs font-mono text-muted-foreground mt-0.5 font-medium">
                            Passport: {studentPassId}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Hostel Location with custom building layout */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-sm bg-secondary text-muted-foreground flex items-center justify-center shrink-0">
                        <Building2 size={13} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {allotment.hostel_name || "Unassigned"}
                        </span>
                        {allotment.college && (
                          <span className="text-xs text-muted-foreground mt-0.5 font-medium">
                            {allotment.college}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Room / Floor with custom primary badge layout */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-primary inline-flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-sm text-[13px] w-fit border border-primary/15">
                        Room {allotment.room_no}
                      </span>
                      <span className="text-xs text-muted-foreground inline-flex items-center gap-1 pl-0.5 font-medium">
                        <Layers size={11} className="text-muted-foreground" />
                        <span>Floor {allotment.floor_no}</span>
                      </span>
                    </div>
                  </TableCell>

                  {/* Hostel Contract with mono file badge layout */}
                  <TableCell>
                    <Badge variant="secondary" className="font-mono font-semibold text-xs px-2 py-1 rounded-sm border-border bg-secondary/50 inline-flex items-center gap-1.5 text-foreground">
                      <FileText size={12} className="text-muted-foreground" />
                      <span>{allotment.hostel_contract_name || "No Contract Link"}</span>
                    </Badge>
                  </TableCell>

                  {/* Rent Price formatted elegantly */}
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-primary">
                        {formatPrice(allotment.rent)}
                      </span>
                      <span className="text-[11px] text-muted-foreground uppercase font-medium tracking-[0.05em] mt-0.5">
                        per month
                      </span>
                    </div>
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell>
                    {getStatusBadge(allotment.status)}
                  </TableCell>

                  {/* Actions Column with custom button integration */}
                  <TableCell className="text-center align-middle" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1 justify-center items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/room-allotments/${allotment.id}`)}
                        className="p-1.5 rounded-sm text-muted-foreground/80 hover:text-foreground inline-flex items-center justify-center"
                        title="Edit allotment details"
                      >
                        <Edit3 size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(allotment.id)}
                        className="p-1.5 rounded-sm text-destructive hover:text-destructive hover:bg-destructive/10 inline-flex items-center justify-center transition-all duration-200"
                        title="Delete room allotment record"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
