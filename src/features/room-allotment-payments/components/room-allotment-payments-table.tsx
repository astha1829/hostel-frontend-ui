"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Trash2, Edit3 } from "lucide-react";
import { TableContainer, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RoomAllotmentPayment } from "../types";

interface RoomAllotmentPaymentsTableProps {
  payments: RoomAllotmentPayment[];
  sortBy: string;
  sortOrder: "ASC" | "DESC";
  onSort: (field: string) => void;
  onDelete: (id: string) => void;
}

export const RoomAllotmentPaymentsTable: React.FC<RoomAllotmentPaymentsTableProps> = ({
  payments,
  sortBy,
  sortOrder,
  onSort,
  onDelete,
}) => {
  const router = useRouter();

  const getStatusBadge = (status?: string | null) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "completed":
      case "success":
        return <Badge variant="success">Paid</Badge>;
      case "pending":
      case "unpaid":
        return <Badge variant="warning">Pending</Badge>;
      case "failed":
      case "cancelled":
        return <Badge variant="danger">Failed</Badge>;
      case "refunded":
        return <Badge variant="info">Refunded</Badge>;
      default:
        return <Badge variant="secondary">{status || "Draft"}</Badge>;
    }
  };

  const getTransactionTypeBadge = (type?: string | null) => {
    switch (type) {
      case "Rent Payment":
        return <Badge variant="info">Rent Payment</Badge>;
      case "Room Transfer":
        return <Badge variant="secondary">Room Transfer</Badge>;
      case "Security Deposit":
        return <Badge variant="success">Security Deposit</Badge>;
      case "Penalty Booking":
        return <Badge variant="danger">Penalty Booking</Badge>;
      case "Refund":
        return <Badge variant="warning">Refund</Badge>;
      default:
        return <Badge variant="secondary">{type || "General"}</Badge>;
    }
  };

  const getPaymentMethod = (payment: RoomAllotmentPayment) => {
    if (payment.summary_json && typeof payment.summary_json === "object") {
      if (payment.summary_json.payment_method) return payment.summary_json.payment_method;
      if (payment.summary_json.paymentMethod) return payment.summary_json.paymentMethod;
    }
    // Safe business default logic
    if (payment.transaction_type === "Refund") return "Bank Transfer";
    if (payment.transaction_type === "Room Transfer") return "Internal Settle";
    return "Credit Card";
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
    });
  };

  const SortIndicator = ({ field }: { field: string }) => {
    if (sortBy !== field) return null;
    return <span className="ml-1 text-[10px]">{sortOrder === "ASC" ? "▲" : "▼"}</span>;
  };

  return (
    <TableContainer className="border border-border/80 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[10%]">Payment ID</TableHead>
            <TableHead className="w-[18%]">Student</TableHead>
            <TableHead className="w-[12%]">Room Allotment</TableHead>
            <TableHead className="w-[12%]">Transaction Type</TableHead>
            <TableHead 
              className="w-[12%] cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onSort("total_amount")}
            >
              <div className="flex items-center gap-1">
                <span>Amount</span>
                <SortIndicator field="total_amount" />
              </div>
            </TableHead>
            <TableHead className="w-[10%]">Status</TableHead>
            <TableHead 
              className="w-[13%] cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onSort("posting_datetime")}
            >
              <div className="flex items-center gap-1">
                <span>Payment Date</span>
                <SortIndicator field="posting_datetime" />
              </div>
            </TableHead>
            <TableHead className="w-[10%]">Payment Method</TableHead>
            <TableHead className="w-[3%] text-center text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground/80 align-middle">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-16 text-muted-foreground">
                No room allotment payments found matching your filters.
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => {
              const [studentName] = payment.student_name
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
                  className="table-tr cursor-pointer hover:bg-muted/30 transition-colors duration-150"
                  onClick={() => router.push(`/room-allotment-payments/${payment.id}`)}
                >
                  {/* Payment ID (Monospace substring) */}
                  <TableCell className="table-td table-td-mono font-semibold">
                    <span className="hover-underline text-primary">
                      {payment.id.substring(0, 8).toUpperCase()}
                    </span>
                  </TableCell>

                  {/* Student */}
                  <TableCell className="table-td">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/10 shrink-0">
                        {studentInitials}
                      </div>
                      <span className="font-semibold text-foreground">
                        {studentName}
                      </span>
                    </div>
                  </TableCell>

                  {/* Room Allotment */}
                  <TableCell className="table-td table-td-mono font-medium">
                    {payment.room_allotment_name || `RA-${payment.room_allotment_id.substring(0, 8).toUpperCase()}`}
                  </TableCell>

                  {/* Transaction Type Badge */}
                  <TableCell className="table-td">
                    {getTransactionTypeBadge(payment.transaction_type)}
                  </TableCell>

                  {/* Amount with Transaction Type underneath */}
                  <TableCell className="table-td">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">
                        {formatPrice(payment.total_amount)}
                      </span>
                      <span className="text-xs text-muted-foreground mt-0.5">
                        {payment.transaction_type}
                      </span>
                    </div>
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell className="table-td">
                    {getStatusBadge(payment.payment_status)}
                  </TableCell>

                  {/* Payment Date */}
                  <TableCell className="table-td">
                    <span className="text-sm font-medium text-foreground/85">
                      {formatDate(payment.posting_datetime || payment.created_at)}
                    </span>
                  </TableCell>

                  {/* Payment Method */}
                  <TableCell className="table-td">
                    <span className="text-sm font-medium text-foreground/85">
                      {getPaymentMethod(payment)}
                    </span>
                  </TableCell>

                  {/* Actions Column */}
                  <TableCell className="table-td text-center align-middle" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1 justify-center items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/room-allotment-payments/${payment.id}/edit`)}
                        className="p-1.5 rounded-sm text-muted-foreground inline-flex items-center justify-center transition-colors hover:text-foreground hover:bg-muted"
                        title="Edit payment"
                      >
                        <Edit3 size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(payment.id)}
                        className="p-1.5 rounded-sm text-destructive inline-flex items-center justify-center transition-colors hover:bg-destructive/10"
                        title="Delete payment"
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
