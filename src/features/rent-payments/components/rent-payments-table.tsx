"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, Edit3, Calendar, FileText, ArrowRight, CreditCard, DollarSign } from "lucide-react";
import { TableContainer, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RentPayment } from "../types";

interface RentPaymentsTableProps {
  payments: RentPayment[];
  sortBy: string;
  sortOrder: "ASC" | "DESC";
  onSort: (field: string) => void;
  onDelete: (id: string) => void;
}

export const RentPaymentsTable: React.FC<RentPaymentsTableProps> = ({
  payments,
  sortBy,
  sortOrder,
  onSort,
  onDelete,
}) => {
  const router = useRouter();

  const getDirectionBadge = (direction?: string | null) => {
    if (direction?.toLowerCase() === "credit") {
      return <Badge variant="success">Credit</Badge>;
    }
    return <Badge variant="danger">Debit</Badge>;
  };

  const formatPrice = (price?: number | null) => {
    if (price === undefined || price === null) return "—";
    return `$${Number(price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const SortIndicator = ({ field }: { field: string }) => {
    if (sortBy !== field) return null;
    return <span className="ml-1 text-[10px]">{sortOrder === "ASC" ? "▲" : "▼"}</span>;
  };

  return (
    <TableContainer className="border border-border/80 shadow-sm rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/20">
            <TableHead className="w-[14%] font-semibold uppercase tracking-wider text-xs">Rent Payment ID</TableHead>
            <TableHead className="w-[22%] font-semibold uppercase tracking-wider text-xs">Student</TableHead>
            <TableHead 
              className="w-[10%] cursor-pointer hover:bg-secondary/40 transition-colors group font-semibold uppercase tracking-wider text-xs"
              onClick={() => onSort("against_month")}
            >
              <div className="flex items-center gap-1">
                <span>Month</span>
                <SortIndicator field="against_month" />
              </div>
            </TableHead>
            <TableHead className="w-[14%] font-semibold uppercase tracking-wider text-xs">Transaction Type</TableHead>
            <TableHead 
              className="w-[12%] cursor-pointer hover:bg-secondary/40 transition-colors group font-semibold uppercase tracking-wider text-xs"
              onClick={() => onSort("amount")}
            >
              <div className="flex items-center gap-1">
                <span>Amount</span>
                <SortIndicator field="amount" />
              </div>
            </TableHead>
            <TableHead className="w-[13%] font-semibold uppercase tracking-wider text-xs">Allotment</TableHead>
            <TableHead 
              className="w-[10%] cursor-pointer hover:bg-secondary/40 transition-colors group font-semibold uppercase tracking-wider text-xs"
              onClick={() => onSort("posting_datetime")}
            >
              <div className="flex items-center gap-1">
                <span>Posting Date</span>
                <SortIndicator field="posting_datetime" />
              </div>
            </TableHead>
            <TableHead className="w-[5%] text-center text-xs font-bold uppercase tracking-wider text-muted-foreground/80 align-middle">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-16 text-muted-foreground font-medium">
                <div className="flex flex-col items-center justify-center gap-2">
                  <CreditCard size={32} className="opacity-40 mb-2" />
                  <span>No rent payment entries found matching your filters.</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => {
              const [studentName, studentPassId] = payment.student_name
                ? payment.student_name.split("-")
                : ["Unlinked Student", ""];

              const studentInitials = studentName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase() || "ST";

              return (
                <TableRow
                  key={payment.id}
                  className="hover:bg-secondary/20 cursor-pointer transition-colors"
                  onClick={() => router.push(`/rent-payments/${payment.id}`)}
                >
                  {/* Rent Payment Code */}
                  <TableCell className="font-semibold font-mono text-[13px] text-primary">
                    <span className="hover:underline">
                      {payment.name || payment.id.substring(0, 8).toUpperCase()}
                    </span>
                  </TableCell>

                  {/* Student Avatar + Profile Info */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20 shrink-0">
                        {studentInitials}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground text-sm tracking-tight">
                          {studentName}
                        </span>
                        {studentPassId && (
                          <span className="text-xs font-mono text-muted-foreground font-medium mt-0.5">
                            {studentPassId}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Against Month */}
                  <TableCell className="font-bold text-primary">
                    {payment.against_month}
                  </TableCell>

                  {/* Transaction Type / Direction badge */}
                  <TableCell>
                    <div className="flex flex-col gap-1 items-start">
                      <span className="font-semibold text-foreground text-sm tracking-tight">
                        {payment.transaction_type}
                      </span>
                      {getDirectionBadge(payment.direction)}
                    </div>
                  </TableCell>

                  {/* Amount with Stripe-like signs and coloring */}
                  <TableCell>
                    {(() => {
                      const isCredit = payment.direction?.toLowerCase() === "credit";
                      const amountSign = isCredit ? "+" : "−";
                      const amountColor = isCredit ? "text-success" : "text-destructive";
                      return (
                        <span className={`font-extrabold text-[15px] ${amountColor} tabular-nums`}>
                          {amountSign}{formatPrice(payment.amount)}
                        </span>
                      );
                    })()}
                  </TableCell>

                  {/* Room Allotment Link */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-primary text-[13px] font-mono hover:underline truncate max-w-[120px]" title={payment.room_allotment_name || `RA-${payment.room_allotment_id.substring(0, 8).toUpperCase()}`}>
                        {payment.room_allotment_name || `RA-${payment.room_allotment_id.substring(0, 8).toUpperCase()}`}
                      </span>
                      {payment.room_allotment_payment_name && (
                        <span className="text-xs text-muted-foreground truncate max-w-[120px]" title={`Ref: ${payment.room_allotment_payment_name}`}>
                          Ref: {payment.room_allotment_payment_name}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Posting Datetime */}
                  <TableCell>
                    <div className="inline-flex items-center gap-1.5 text-foreground/85 text-sm font-medium">
                      <Calendar size={13} className="text-muted-foreground" />
                      <span>{formatDate(payment.posting_datetime)}</span>
                    </div>
                  </TableCell>

                  {/* Actions Column */}
                  <TableCell className="text-center align-middle" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1 justify-center items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/rent-payments/${payment.id}/edit`)}
                        className="p-1.5 h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Edit payment"
                      >
                        <Edit3 size={15} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(payment.id)}
                        className="p-1.5 h-8 w-8 text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 size={15} />
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
