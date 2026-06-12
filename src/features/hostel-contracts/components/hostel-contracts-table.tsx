"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Trash2, Calendar, FileText, Edit3 } from "lucide-react";
import { TableContainer, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HostelContract } from "../types";

interface HostelContractsTableProps {
  contracts: HostelContract[];
  sortBy: string;
  sortOrder: "ASC" | "DESC";
  onSort: (field: string) => void;
  onDelete: (id: string) => void;
}

export const HostelContractsTable: React.FC<HostelContractsTableProps> = ({
  contracts,
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
      case "expired":
        return <Badge variant="danger">Expired</Badge>;
      case "break":
        return <Badge variant="warning">Break</Badge>;
      case "superseded":
        return <Badge variant="secondary">Superseded</Badge>;
      default:
        return <Badge variant="secondary">{status || "Draft"}</Badge>;
    }
  };

  const getConfirmBadge = (confirmStatus?: string) => {
    switch (confirmStatus?.toLowerCase()) {
      case "confirmed":
        return <Badge variant="success">Confirmed</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "rejected":
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{confirmStatus || "Draft"}</Badge>;
    }
  };

  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return "—";
    return `$${Number(price).toFixed(2)}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const SortIndicator = ({ field }: { field: string }) => {
    if (sortBy !== field) return null;
    return <span className="ml-1 text-xs">{sortOrder === "ASC" ? "▲" : "▼"}</span>;
  };

  return (
    <TableContainer className="border border-border/80 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/30">
            <TableHead 
              className="w-[12%] cursor-pointer text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground/80 hover:text-foreground transition-colors"
              onClick={() => onSort("contract_no")}
            >
              <div className="flex items-center gap-1">
                <span>Contract No</span>
                <SortIndicator field="contract_no" />
              </div>
            </TableHead>
            <TableHead 
              className="w-[10%] cursor-pointer text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground/80 hover:text-foreground transition-colors"
              onClick={() => onSort("contract_type")}
            >
              <div className="flex items-center gap-1">
                <span>Type</span>
                <SortIndicator field="contract_type" />
              </div>
            </TableHead>
            <TableHead className="w-[20%] text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground/80">
              Student
            </TableHead>
            <TableHead className="w-[18%] text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground/80">
              Hostel Allotment
            </TableHead>
            <TableHead 
              className="w-[10%] cursor-pointer text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground/80 hover:text-foreground transition-colors"
              onClick={() => onSort("status")}
            >
              <div className="flex items-center gap-1">
                <span>Status</span>
                <SortIndicator field="status" />
              </div>
            </TableHead>
            <TableHead 
              className="w-[12%] cursor-pointer text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground/80 hover:text-foreground transition-colors"
              onClick={() => onSort("confirm_status")}
            >
              <div className="flex items-center gap-1">
                <span>Approval</span>
                <SortIndicator field="confirm_status" />
              </div>
            </TableHead>
            <TableHead 
              className="w-[10%] cursor-pointer text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground/80 hover:text-foreground transition-colors"
              onClick={() => onSort("contract_start_date")}
            >
              <div className="flex items-center gap-1">
                <span>Timeline</span>
                <SortIndicator field="contract_start_date" />
              </div>
            </TableHead>
            <TableHead 
              className="w-[8%] cursor-pointer text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground/80 hover:text-foreground transition-colors"
              onClick={() => onSort("contract_price")}
            >
              <div className="flex items-center gap-1">
                <span>Price</span>
                <SortIndicator field="contract_price" />
              </div>
            </TableHead>
            <TableHead className="w-[5%] text-center align-middle text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground/80">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-16 px-8 text-muted-foreground">
                No active hostel contracts match your search filters.
              </TableCell>
            </TableRow>
          ) : (
            contracts.map((contract) => {
              // Split student name and Registration ID
              const [studentFullName, studentRegId] = contract.student_name
                ? contract.student_name.split("-")
                : ["Unlinked Student", ""];

              return (
                <TableRow
                  key={contract.id}
                  className="group cursor-pointer transition-colors hover:bg-muted/50"
                  onClick={() => router.push(`/hostel-contracts/${contract.id}`)}
                >
                  {/* Contract No */}
                  <TableCell className="font-bold text-primary align-middle">
                    <div className="flex items-center gap-2">
                      <FileText size={15} className="text-primary shrink-0" />
                      <span className="underline decoration-primary/30 group-hover:decoration-primary/80 transition-colors font-mono text-[13px]">{contract.contract_no}</span>
                    </div>
                  </TableCell>

                  {/* Contract Type */}
                  <TableCell className="font-medium text-foreground align-middle">
                    {contract.contract_type}
                  </TableCell>

                  {/* Student */}
                  <TableCell className="align-middle">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">
                        {studentFullName}
                      </span>
                      {studentRegId && (
                        <span className="text-xs font-mono text-muted-foreground mt-0.5">
                          {studentRegId}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Hostel */}
                  <TableCell className="align-middle">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-foreground">
                        {contract.hostel_name || "Unassigned"}
                      </span>
                      {contract.sharing && (
                        <div className="w-fit">
                          <Badge variant="secondary" className="text-[11px] px-1.5 py-0.5">
                            {contract.sharing} Sharing
                          </Badge>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="align-middle">
                    {getStatusBadge(contract.status)}
                  </TableCell>

                  {/* Confirm Status */}
                  <TableCell className="align-middle">
                    {getConfirmBadge(contract.confirm_status)}
                  </TableCell>

                  {/* Dates timeline */}
                  <TableCell className="align-middle">
                    <div className="flex items-center gap-2 text-[13px] text-foreground">
                      <Calendar size={14} className="text-muted-foreground shrink-0" />
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <span className="font-semibold">{formatDate(contract.contract_start_date)}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-semibold">{formatDate(contract.contract_end_date)}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Price Rate */}
                  <TableCell className="font-bold text-primary text-base align-middle">
                    {formatPrice(contract.contract_price)}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-center align-middle" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1 justify-center items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/hostel-contracts/${contract.id}`)}
                        className="p-1.5 text-muted-foreground hover:text-foreground"
                        title="Edit contract details"
                      >
                        <Edit3 size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(contract.id)}
                        className="p-1.5 text-destructive hover:bg-destructive/10"
                        title="Delete hostel contract"
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
