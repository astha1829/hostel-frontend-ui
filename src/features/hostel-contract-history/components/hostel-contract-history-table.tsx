"use client";

import React from "react";
import { Trash2, Edit3, Calendar, FileText } from "lucide-react";
import { TableContainer, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ActionButtons } from "@/components/ui/action-buttons";
import { Badge } from "@/components/ui/badge";
import { HostelContractHistoryRow } from "../types";

interface HostelContractHistoryTableProps {
  history: HostelContractHistoryRow[];
  sortBy: string;
  sortOrder: "ASC" | "DESC";
  onSort: (field: string) => void;
  onEdit: (row: HostelContractHistoryRow) => void;
  onDelete: (id: string) => void;
}

export const HostelContractHistoryTable: React.FC<HostelContractHistoryTableProps> = ({
  history,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
}) => {
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
    return <span style={{ marginLeft: "0.25rem", fontSize: "0.75rem", opacity: 0.8 }}>{sortOrder === "ASC" ? "▲" : "▼"}</span>;
  };

  return (
    <TableContainer style={{ border: "1px solid hsl(var(--border) / 0.8)", boxShadow: "var(--shadow-sm)", overflow: "visible" }}>
      <Table>
        <TableHeader>
          <TableRow className="h-[44px] bg-secondary/20">
            <TableHead className="w-[15%] align-middle table-header leading-[1.4]">
              Event ID
            </TableHead>
            <TableHead className="w-[25%] align-middle table-header leading-[1.4]">
              Student
            </TableHead>
            <TableHead 
              className="w-[25%] cursor-pointer align-middle table-header leading-[1.4]"
              onClick={() => onSort("contract_ref")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <span>Contract Reference</span>
                <SortIndicator field="contract_ref" />
              </div>
            </TableHead>
            <TableHead 
              className="w-[15%] cursor-pointer align-middle table-header leading-[1.4]"
              onClick={() => onSort("display_order")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <span>Display Order</span>
                <SortIndicator field="display_order" />
              </div>
            </TableHead>
            <TableHead 
              className="w-[15%] cursor-pointer align-middle table-header leading-[1.4]"
              onClick={() => onSort("created_at")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <span>Created At</span>
                <SortIndicator field="created_at" />
              </div>
            </TableHead>
            <TableHead className="w-[5%] text-center align-middle table-header leading-[1.4]">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} style={{ textAlign: "center", padding: "4rem 2rem", color: "hsl(var(--muted-foreground))" }}>
                No hostel contract history logs found.
              </TableCell>
            </TableRow>
          ) : (
            history.map((row) => {
              const rawStudentName = row.student?.student_name || row.student_name || "";
              const [studentName, studentPassId] = rawStudentName.includes("-") 
                ? rawStudentName.split("-") 
                : [rawStudentName || "Unlinked Student", row.student?.passport_no || ""];

              const studentInitials = studentName
                .split(" ")
                .filter(Boolean)
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase() || "ST";

              return (
                <TableRow
                  key={row.id}
                  className="table-tr h-[56px] min-h-[56px]"
                  style={{ 
                    transition: "background-color 0.2s ease",
                  }}
                >
                  {/* Event No (compact ID) */}
                  <TableCell className="align-middle">
                    <span className="text-[15px] font-[500] text-[#0F172A] leading-[1.5]">
                      {row.id.substring(0, 8).toUpperCase()}
                    </span>
                  </TableCell>

                  {/* Student */}
                  <TableCell className="align-middle">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{
                        width: "2.25rem",
                        height: "2.25rem",
                        borderRadius: "50%",
                        backgroundColor: "hsl(var(--primary) / 0.08)",
                        color: "hsl(var(--primary))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "0.8125rem",
                        border: "1px solid hsl(var(--primary) / 0.15)",
                        flexShrink: 0
                      }}>
                        {studentInitials}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
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

                  {/* Contract Reference */}
                  <TableCell className="align-middle">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <FileText size={16} style={{ color: "hsl(var(--primary))", flexShrink: 0 }} />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span className="text-[15px] font-[500] text-[#0F172A] leading-[1.5]">
                          {row.contract_ref}
                        </span>
                        <span className="text-[14px] font-[400] text-[#64748B] leading-[1.5]">
                          Historical Contract Reference
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Display Order */}
                  <TableCell className="align-middle">
                    {(() => {
                      const order = row.display_order ?? 1;
                      let label = `${order} Position`;
                      if (order === 1) label = "First Position";
                      else if (order === 2) label = "Second Position";
                      else if (order === 3) label = "Third Position";
                      else label = `${order}th Position`;
                      
                      return (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                          <span className="text-[16px] font-[700] text-primary leading-[1.5]">
                            #{order}
                          </span>
                          <span className="text-[14px] font-[400] text-[#64748B] leading-[1.5]">
                            {label}
                          </span>
                        </div>
                      );
                    })()}
                  </TableCell>

                  {/* Created At */}
                  <TableCell className="align-middle">
                    <div className="flex items-center gap-1.5 text-[14px] font-[400] text-[#64748B] leading-[1.5]">
                      <Calendar size={14} style={{ flexShrink: 0 }} />
                      <span>{formatDate(row.created_at)}</span>
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-center align-middle">
                    <ActionButtons 
                      onEdit={() => onEdit(row)}
                      onDelete={() => onDelete(row.id)}
                      deleteConfirmMessage="Are you sure you want to delete this log?"
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
