"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, Edit3, Calendar, FileText, ArrowRight, CreditCard, DollarSign } from "lucide-react";
import { TableContainer, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ActionButtons } from "@/components/ui/action-buttons";
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
          <TableRow className="bg-secondary/20 h-[44px]">
            <TableHead className="w-[14%] table-header leading-[1.4] align-middle">Rent Payment ID</TableHead>
            <TableHead className="w-[22%] table-header leading-[1.4] align-middle">Student</TableHead>
            <TableHead 
              className="w-[10%] cursor-pointer hover:bg-secondary/40 transition-colors group table-header leading-[1.4] align-middle"
              onClick={() => onSort("against_month")}
            >
              <div className="flex items-center gap-1">
                <span>Month</span>
                <SortIndicator field="against_month" />
              </div>
            </TableHead>
            <TableHead className="w-[14%] table-header leading-[1.4] align-middle">Transaction Type</TableHead>
            <TableHead 
              className="w-[12%] cursor-pointer hover:bg-secondary/40 transition-colors group table-header leading-[1.4] align-middle"
              onClick={() => onSort("amount")}
            >
              <div className="flex items-center gap-1">
                <span>Amount</span>
                <SortIndicator field="amount" />
              </div>
            </TableHead>
            <TableHead className="w-[13%] table-header leading-[1.4] align-middle">Allotment</TableHead>
            <TableHead 
              className="w-[10%] cursor-pointer hover:bg-secondary/40 transition-colors group table-header leading-[1.4] align-middle"
              onClick={() => onSort("posting_datetime")}
            >
              <div className="flex items-center gap-1">
                <span>Posting Date</span>
                <SortIndicator field="posting_datetime" />
              </div>
            </TableHead>
            <TableHead className="w-[5%] text-center table-header leading-[1.4] align-middle">
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
                  className="hover:bg-secondary/20 cursor-pointer transition-colors h-[56px] min-h-[56px]"
                  onClick={() => router.push(`/rent-payments/${payment.id}`)}
                >
                  {/* Rent Payment Code */}
                  <TableCell className="align-middle text-[15px] font-[500] text-[#0F172A] leading-[1.5]">
                    <span className="hover:underline">
                      {payment.name || payment.id.substring(0, 8).toUpperCase()}
                    </span>
                  </TableCell>

                  {/* Student Avatar + Profile Info */}
                  <TableCell className="align-middle">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20 shrink-0">
                        {studentInitials}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[15px] font-[500] text-[#0F172A] leading-[1.5]">
                          {studentName}
                        </span>
                        {studentPassId && (
                          <span className="text-[14px] font-[400] text-[#64748B] leading-[1.5]">
                            {studentPassId}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Against Month */}
                  <TableCell className="align-middle text-[15px] font-[500] text-[#0F172A] leading-[1.5]">
                    {payment.against_month}
                  </TableCell>

                  {/* Transaction Type / Direction badge */}
                  <TableCell className="align-middle">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="text-[15px] font-[500] text-[#0F172A] leading-[1.5]">
                        {payment.transaction_type}
                      </span>
                      {getDirectionBadge(payment.direction)}
                    </div>
                  </TableCell>

                  {/* Amount with Stripe-like signs and coloring */}
                  <TableCell className="align-middle">
                    {(() => {
                      const isCredit = payment.direction?.toLowerCase() === "credit";
                      const amountSign = isCredit ? "+" : "−";
                      const amountColor = isCredit ? "text-success" : "text-destructive";
                      return (
                        <span className={`text-[16px] font-[700] ${amountColor} tabular-nums leading-[1.5]`}>
                          {amountSign}{formatPrice(payment.amount)}
                        </span>
                      );
                    })()}
                  </TableCell>

                  {/* Room Allotment Link */}
                  <TableCell className="align-middle">
                    <div className="flex flex-col gap-1">
                      <span className="text-[15px] font-[500] text-[#0F172A] hover:underline truncate max-w-[120px] leading-[1.5]" title={payment.room_allotment_name || `RA-${payment.room_allotment_id.substring(0, 8).toUpperCase()}`}>
                        {payment.room_allotment_name || `RA-${payment.room_allotment_id.substring(0, 8).toUpperCase()}`}
                      </span>
                      {payment.room_allotment_payment_name && (
                        <span className="text-[14px] font-[400] text-[#64748B] truncate max-w-[120px] leading-[1.5]" title={`Ref: ${payment.room_allotment_payment_name}`}>
                          Ref: {payment.room_allotment_payment_name}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Posting Datetime */}
                  <TableCell className="align-middle">
                    <div className="inline-flex items-center gap-1.5 text-[14px] font-[400] text-[#64748B] leading-[1.5]">
                      <Calendar size={13} className="text-[#64748B]" />
                      <span>{formatDate(payment.posting_datetime)}</span>
                    </div>
                  </TableCell>

                  {/* Actions Column */}
                  <TableCell className="text-center align-middle" onClick={(e) => e.stopPropagation()}>
                    <ActionButtons 
                      onView={() => router.push(`/rent-payments/${payment.id}`)}
                      onEdit={() => router.push(`/rent-payments/${payment.id}/edit`)}
                      onDelete={() => onDelete(payment.id)}
                      deleteConfirmMessage="Are you sure you want to delete this rent payment?"
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
