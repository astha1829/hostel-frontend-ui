"use client";

import React from "react";
import { Trash2, Edit3, Calendar, FileText } from "lucide-react";
import { TableContainer, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
          <TableRow>
            <TableHead style={{ width: "15%", verticalAlign: "middle" }}>
              Event ID
            </TableHead>
            <TableHead style={{ width: "25%", verticalAlign: "middle" }}>
              Student
            </TableHead>
            <TableHead 
              style={{ width: "25%", cursor: "pointer", verticalAlign: "middle" }}
              onClick={() => onSort("contract_ref")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <span>Contract Reference</span>
                <SortIndicator field="contract_ref" />
              </div>
            </TableHead>
            <TableHead 
              style={{ width: "15%", cursor: "pointer", verticalAlign: "middle" }}
              onClick={() => onSort("display_order")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <span>Display Order</span>
                <SortIndicator field="display_order" />
              </div>
            </TableHead>
            <TableHead 
              style={{ width: "15%", cursor: "pointer", verticalAlign: "middle" }}
              onClick={() => onSort("created_at")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <span>Created At</span>
                <SortIndicator field="created_at" />
              </div>
            </TableHead>
            <TableHead 
              style={{ 
                width: "5%", 
                textAlign: "center", 
                fontSize: "0.75rem", 
                fontWeight: 700, 
                textTransform: "uppercase", 
                letterSpacing: "0.06em", 
                color: "hsl(var(--muted-foreground) / 1.3)",
                verticalAlign: "middle"
              }}
            >
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
                  className="table-tr"
                  style={{ 
                    transition: "background-color 0.2s ease",
                  }}
                >
                  {/* Event No (compact ID) */}
                  <TableCell className="table-td table-td-mono" style={{ verticalAlign: "middle", fontWeight: 600 }}>
                    {row.id.substring(0, 8).toUpperCase()}
                  </TableCell>

                  {/* Student */}
                  <TableCell className="table-td" style={{ verticalAlign: "middle" }}>
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
                        <span style={{ fontWeight: 600, color: "hsl(var(--foreground))", lineHeight: 1.2 }}>
                          {studentName}
                        </span>
                        {studentPassId && (
                          <span style={{ 
                            fontSize: "0.75rem", 
                            fontFamily: "var(--font-mono, monospace)", 
                            color: "hsl(var(--muted-foreground))", 
                            marginTop: "0.1875rem",
                            fontWeight: 500,
                            lineHeight: 1
                          }}>
                            {studentPassId}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Contract Reference */}
                  <TableCell className="table-td" style={{ verticalAlign: "middle" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <FileText size={16} style={{ color: "hsl(var(--primary))", flexShrink: 0 }} />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ 
                          fontWeight: 700, 
                          fontFamily: "var(--font-mono, monospace)", 
                          fontSize: "0.875rem",
                          color: "hsl(var(--foreground))"
                        }}>
                          {row.contract_ref}
                        </span>
                        <span style={{ fontSize: "0.7125rem", color: "hsl(var(--muted-foreground))", fontWeight: 500 }}>
                          Historical Contract Reference
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Display Order */}
                  <TableCell className="table-td" style={{ verticalAlign: "middle" }}>
                    {(() => {
                      const order = row.display_order ?? 1;
                      let label = `${order} Position`;
                      if (order === 1) label = "First Position";
                      else if (order === 2) label = "Second Position";
                      else if (order === 3) label = "Third Position";
                      else label = `${order}th Position`;
                      
                      return (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                          <span style={{ fontFamily: "var(--font-mono, monospace)", fontWeight: 700, fontSize: "0.875rem", color: "hsl(var(--primary))" }}>
                            #{order}
                          </span>
                          <span style={{ fontSize: "0.6875rem", color: "hsl(var(--muted-foreground))", fontWeight: 500 }}>
                            {label}
                          </span>
                        </div>
                      );
                    })()}
                  </TableCell>

                  {/* Created At */}
                  <TableCell className="table-td" style={{ verticalAlign: "middle" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "hsl(var(--muted-foreground))", fontSize: "0.8125rem" }}>
                      <Calendar size={14} style={{ flexShrink: 0 }} />
                      <span>{formatDate(row.created_at)}</span>
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="table-td" style={{ textAlign: "center", verticalAlign: "middle" }}>
                    <div style={{ display: "flex", gap: "0.25rem", justifyContent: "center", alignItems: "center" }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(row)}
                        style={{ padding: "0.375rem", borderRadius: "var(--radius-sm)", color: "hsl(var(--muted-foreground) / 1.3)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                        title="Edit log"
                      >
                        <Edit3 size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(row.id)}
                        style={{ padding: "0.375rem", borderRadius: "var(--radius-sm)", color: "hsl(var(--destructive))", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                        title="Delete log"
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
