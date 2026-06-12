"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Trash2, Mail, Edit3 } from "lucide-react";
import { TableContainer, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Student } from "../types";

interface StudentsTableProps {
  students: Student[];
  onDelete: (id: string) => void;
}

export const StudentsTable: React.FC<StudentsTableProps> = ({ students, onDelete }) => {
  const router = useRouter();

  const getKycBadge = (verified: boolean) => {
    return verified ? (
      <Badge variant="success">KYC Verified</Badge>
    ) : (
      <Badge variant="danger">Pending KYC</Badge>
    );
  };

  const getStudentTypeBadge = (type?: string) => {
    switch (type?.toLowerCase()) {
      case "international":
        return <Badge variant="warning">International</Badge>;
      case "scholar":
        return <Badge variant="info">Scholar</Badge>;
      default:
        return <Badge variant="secondary">{type || "Regular"}</Badge>;
    }
  };

  if (!students || students.length === 0) {
    return (
      <EmptyState
        title="No Students Found"
        description="No student profiles match your search criteria. Try adjusting your filter parameters."
      />
    );
  }

  return (
    <TableContainer style={{ border: "1px solid hsl(var(--border) / 0.8)", boxShadow: "var(--shadow-sm)" }}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: "15%" }}>Registration ID</TableHead>
            <TableHead style={{ width: "25%" }}>Full Name</TableHead>
            <TableHead style={{ width: "20%" }}>College & Course</TableHead>
            <TableHead style={{ width: "15%" }}>Nationality</TableHead>
            <TableHead style={{ width: "15%" }}>Enrollment</TableHead>
            <TableHead style={{ width: "10%" }}>KYC Status</TableHead>
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
          {students.map((student) => (
            <TableRow
              key={student.id}
              className="table-tr"
              onClick={() => router.push(`/students/${student.id}`)}
              style={{ cursor: "pointer", transition: "var(--transition)" }}
            >
              {/* Registration ID */}
              <TableCell className="table-td table-td-mono" style={{ fontWeight: 600 }}>
                <span>{student.student_registration_id || student.id.substring(0, 8).toUpperCase()}</span>
              </TableCell>

              {/* Name & Contact Info */}
              <TableCell className="table-td">
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span className="hover-underline" style={{ fontWeight: 600, color: "hsl(var(--primary))" }}>
                    {student.student_name} {student.last_name || ""}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))", marginTop: "0.125rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Mail size={10} /> {student.student_email || "N/A"}
                  </span>
                </div>
              </TableCell>

              {/* College / Course */}
              <TableCell className="table-td">
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontWeight: 500 }}>{student.college}</span>
                  <span style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))", marginTop: "0.125rem" }}>
                    {student.course || "General"}
                  </span>
                </div>
              </TableCell>

              {/* Nationality */}
              <TableCell className="table-td">
                <span>{student.nationality}</span>
              </TableCell>

              {/* Enrollment Type */}
              <TableCell className="table-td">
                {getStudentTypeBadge(student.student_type)}
              </TableCell>

              {/* KYC Badge */}
              <TableCell className="table-td">
                {getKycBadge(student.kyc_verified)}
              </TableCell>

              {/* Delete button */}
              <TableCell className="table-td" style={{ textAlign: "center", verticalAlign: "middle" }} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: "flex", gap: "0.25rem", justifyContent: "center", alignItems: "center" }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/students/${student.id}`)}
                    style={{ padding: "0.375rem", borderRadius: "var(--radius-sm)", color: "hsl(var(--muted-foreground))", display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "var(--transition)" }}
                    className="btn-ghost-edit"
                    title="View & edit details"
                  >
                    <Edit3 size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(student.id)}
                    style={{
                      color: "hsl(var(--destructive))",
                      padding: "0.375rem",
                      borderRadius: "var(--radius-sm)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "var(--transition)",
                    }}
                    className="btn-ghost-delete"
                    title="Delete student profile"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
