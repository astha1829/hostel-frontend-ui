"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Trash2, Edit3, Calendar, ArrowRight } from "lucide-react";
import { TableContainer, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ActionButtons } from "@/components/ui/action-buttons";
import { HostelContractEvent } from "../types";

interface HostelContractEventsTableProps {
  events: HostelContractEvent[];
  sortBy: string;
  sortOrder: "ASC" | "DESC";
  onSort: (field: string) => void;
  onDelete: (id: string) => void;
}

export const HostelContractEventsTable: React.FC<HostelContractEventsTableProps> = ({
  events,
  sortBy,
  sortOrder,
  onSort,
  onDelete,
}) => {
  const router = useRouter();

  const getStatusBadge = (status?: string | null) => {
    if (!status) return <Badge variant="secondary">—</Badge>;
    const lower = status.toLowerCase();
    if (lower === "confirmed" || lower === "approved") {
      return <Badge variant="success">{status}</Badge>;
    }
    if (lower === "completed") {
      return <Badge variant="info">{status}</Badge>;
    }
    if (lower === "pending" || lower === "pending review") {
      return <Badge variant="warning">{status}</Badge>;
    }
    if (lower === "cancelled" || lower === "rejected") {
      return <Badge variant="danger">{status}</Badge>;
    }
    return <Badge variant="default">{status}</Badge>;
  };

  const getActionBadge = (action?: string | null) => {
    if (!action) return <Badge variant="secondary">—</Badge>;
    const lower = action.toLowerCase();
    if (lower === "create") {
      return (
        <Badge 
          variant="default" 
          className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 font-semibold"
        >
          Create
        </Badge>
      );
    }
    if (lower === "transfer") {
      return (
        <Badge 
          variant="default" 
          className="bg-success/10 text-success border-success/20 hover:bg-success/20 font-semibold"
        >
          Transfer
        </Badge>
      );
    }
    if (lower === "cancel") return <Badge variant="danger">Cancel</Badge>;
    return <Badge variant="secondary">{action}</Badge>;
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const SortIndicator = ({ field }: { field: string }) => {
    if (sortBy !== field) return null;
    return <span className="ml-1 text-[10px] opacity-80">{sortOrder === "ASC" ? "▲" : "▼"}</span>;
  };

  return (
    <TableContainer className="border border-border/80 shadow-sm overflow-visible rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/20 h-[44px]">
            <TableHead className="w-[12%] align-middle table-header leading-[1.4]">
              Event ID
            </TableHead>
            <TableHead className="w-[20%] align-middle table-header leading-[1.4]">
              Student
            </TableHead>
            <TableHead 
              className="w-[10%] cursor-pointer align-middle hover:bg-secondary/40 transition-colors group table-header leading-[1.4]"
              onClick={() => onSort("action_type")}
            >
              <div className="flex items-center gap-1">
                <span>Action</span>
                <SortIndicator field="action_type" />
              </div>
            </TableHead>
            <TableHead 
              className="w-[10%] cursor-pointer align-middle hover:bg-secondary/40 transition-colors group table-header leading-[1.4]"
              onClick={() => onSort("event_status")}
            >
              <div className="flex items-center gap-1">
                <span>Status</span>
                <SortIndicator field="event_status" />
              </div>
            </TableHead>
            <TableHead className="w-[18%] align-middle table-header leading-[1.4]">
              Contract Transition
            </TableHead>
            <TableHead className="w-[18%] align-middle table-header leading-[1.4]">
              Allotment Transition
            </TableHead>
            <TableHead 
              className="w-[8%] cursor-pointer align-middle hover:bg-secondary/40 transition-colors group table-header leading-[1.4]"
              onClick={() => onSort("effective_date")}
            >
              <div className="flex items-center gap-1">
                <span>Effective Date</span>
                <SortIndicator field="effective_date" />
              </div>
            </TableHead>
            <TableHead className="w-[6%] text-center align-middle table-header leading-[1.4]">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-16 text-muted-foreground font-medium">
                No hostel contract events found matching your filters.
              </TableCell>
            </TableRow>
          ) : (
            events.map((event) => {
              const [studentName, studentPassId] = event.student_name
                ? event.student_name.split("-")
                : ["Unlinked Student", ""];

              const studentInitials = studentName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase() || "EV";

              const hasContractTransition = event.source_hostel_contract_name || event.target_hostel_contract_name;
              const hasAllotmentTransition = event.source_room_allotment_name || event.target_room_allotment_name;

              return (
                <TableRow
                  key={event.id}
                  className="h-[56px] min-h-[56px] cursor-pointer hover:bg-secondary/20 transition-colors"
                  onClick={() => router.push(`/hostel-contract-events/${event.id}`)}
                >
                  {/* Event Identifier / Number */}
                  <TableCell className="align-middle">
                    <span className="text-[15px] font-[500] text-[#0F172A] hover:underline leading-[1.5]">
                      {event.id.substring(0, 8).toUpperCase()}
                    </span>
                  </TableCell>

                  {/* Student profile summary */}
                  <TableCell className="align-middle">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[13px] border border-primary/15 shrink-0">
                        {studentInitials}
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="text-[15px] font-[500] text-[#0F172A] leading-[1.5]">
                          {studentName}
                        </span>
                        {studentPassId && (
                          <span className="text-[14px] font-[400] text-[#64748B] mt-0.5 leading-[1.5]">
                            {studentPassId}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Action Type */}
                  <TableCell className="align-middle">
                    <div className="inline-flex">
                      {getActionBadge(event.action_type)}
                    </div>
                  </TableCell>

                  {/* Event Status */}
                  <TableCell className="align-middle">
                    <div className="inline-flex">
                      {getStatusBadge(event.event_status)}
                    </div>
                  </TableCell>

                  {/* Contract Transition */}
                  <TableCell className="align-middle">
                    {hasContractTransition ? (
                      <div className="flex items-center gap-2 text-[15px] font-[500] text-[#0F172A] leading-[1.5] flex-nowrap">
                        <span className={`font-[500] py-1 px-2 rounded-sm border whitespace-nowrap ${event.source_hostel_contract_name ? "text-foreground bg-secondary border-border" : "text-[#64748B] bg-secondary border-border"}`}>
                          {event.source_hostel_contract_name || "None"}
                        </span>
                        <ArrowRight size={14} className="text-[#64748B] shrink-0" />
                        <span className={`font-[700] py-1 px-2 rounded-sm border whitespace-nowrap ${event.target_hostel_contract_name ? "text-primary bg-primary/5 border-primary/15" : "text-primary bg-primary/5 border-primary/15"}`}>
                          {event.target_hostel_contract_name || "None"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[#64748B] text-[15px] font-[500] leading-[1.5]">—</span>
                    )}
                  </TableCell>

                  {/* Allotment Transition */}
                  <TableCell className="align-middle">
                    {hasAllotmentTransition ? (
                      <div className="flex items-center gap-2 text-[15px] font-[500] text-[#0F172A] leading-[1.5] flex-nowrap">
                        <span className={`font-[500] py-1 px-2 rounded-sm border whitespace-nowrap ${event.source_room_allotment_name ? "text-foreground bg-secondary border-border" : "text-[#64748B] bg-secondary border-border"}`}>
                          {event.source_room_allotment_name || "None"}
                        </span>
                        <ArrowRight size={14} className="text-[#64748B] shrink-0" />
                        <span className={`font-[700] py-1 px-2 rounded-sm border whitespace-nowrap ${event.target_room_allotment_name ? "text-primary bg-primary/5 border-primary/15" : "text-primary bg-primary/5 border-primary/15"}`}>
                          {event.target_room_allotment_name || "None"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[#64748B] text-[15px] font-[500] leading-[1.5]">—</span>
                    )}
                  </TableCell>

                  {/* Effective Date */}
                  <TableCell className="align-middle">
                    <div className="flex items-center gap-1.5 text-[14px] font-[400] text-[#64748B] leading-[1.5]">
                      <Calendar size={14} className="shrink-0" />
                      <span>{formatDate(event.effective_date)}</span>
                    </div>
                  </TableCell>

                  {/* Actions Column */}
                  <TableCell className="text-center align-middle" onClick={(e) => e.stopPropagation()}>
                    <ActionButtons 
                      onEdit={() => router.push(`/hostel-contract-events/${event.id}/edit`)}
                      onDelete={() => onDelete(event.id)}
                      deleteConfirmMessage="Are you sure you want to delete this event?"
                    />
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
