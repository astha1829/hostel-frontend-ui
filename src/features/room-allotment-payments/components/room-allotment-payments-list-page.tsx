"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, ChevronLeft, ChevronRight, Users, Layers, Shield, DollarSign } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useRoomAllotmentPayments } from "../hooks/use-room-allotment-payments";
import { RoomAllotmentPaymentsTable } from "./room-allotment-payments-table";

export const RoomAllotmentPaymentsListPage: React.FC = () => {
  const router = useRouter();

  const {
    payments,
    students,
    allotments,
    isLoading,
    error,
    search,
    setSearch,
    selectedStudentId,
    setSelectedStudentId,
    selectedRoomAllotmentId,
    setSelectedRoomAllotmentId,
    selectedTransactionType,
    setSelectedTransactionType,
    selectedPaymentStatus,
    setSelectedPaymentStatus,
    currentPage,
    setCurrentPage,
    totalPages,
    total,
    sortBy,
    sortOrder,
    handleSort,
    handleDelete,
    reload,
  } = useRoomAllotmentPayments();

  const studentOptions = [
    { label: "All Students", value: "" },
    ...students.map((s) => ({
      label: `${s.student_name} ${s.last_name || ""}`.trim(),
      value: s.id,
    })),
  ];

  const allotmentOptions = [
    { label: "All Allotments", value: "" },
    ...allotments.map((a) => {
      const label = a.hostel_name 
        ? `${a.hostel_name} - Room ${a.room_no}` 
        : `Room ${a.room_no} (${a.student_name || "Unassigned"})`;
      return {
        label,
        value: a.id,
      };
    }),
  ];

  const transactionTypeOptions = [
    { label: "All Transaction Types", value: "" },
    { label: "Rent Payment", value: "Rent Payment" },
    { label: "Room Transfer", value: "Room Transfer" },
    { label: "Security Deposit", value: "Security Deposit" },
    { label: "Penalty Booking", value: "Penalty Booking" },
    { label: "Refund", value: "Refund" },
    { label: "Ad-hoc Settle", value: "Ad-hoc Settle" },
  ];

  const statusOptions = [
    { label: "All Statuses", value: "" },
    { label: "Paid", value: "Paid" },
    { label: "Pending", value: "Pending" },
    { label: "Failed", value: "Failed" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <PageHeader
        title="Room Allotment Payments"
        description="Track and administer student room allotments ledger accounts, monthly rent records, penalties, and transfer settlements."
        actions={
          <Button 
            variant="primary" 
            size="md" 
            onClick={() => router.push("/room-allotment-payments/new")} 
            className="shadow-sm shadow-primary/20"
          >
            <Plus size={16} />
            <span>Add Payment</span>
          </Button>
        }
      />

      {/* Unified Filters operational panel */}
      <Card className="mb-2 border border-border/80 bg-gradient-to-b from-card to-secondary/10 shadow-sm rounded-lg">
        <CardContent className="p-5 pt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
            {/* Search Input */}
            <div className="relative w-full">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search description, status..."
                className="pl-10 bg-card border-border/80 text-sm h-10"
              />
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10"
              />
            </div>

            {/* Student Filter */}
            <div className="relative w-full">
              <Select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                options={studentOptions}
                className="pl-10 bg-card border-border/80 text-sm h-10"
              />
              <Users
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10"
              />
            </div>

            {/* Room Allotment Filter */}
            <div className="relative w-full">
              <Select
                value={selectedRoomAllotmentId}
                onChange={(e) => setSelectedRoomAllotmentId(e.target.value)}
                options={allotmentOptions}
                className="pl-10 bg-card border-border/80 text-sm h-10"
              />
              <Layers
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10"
              />
            </div>

            {/* Transaction Type Filter */}
            <div className="relative w-full">
              <Select
                value={selectedTransactionType}
                onChange={(e) => setSelectedTransactionType(e.target.value)}
                options={transactionTypeOptions}
                className="pl-10 bg-card border-border/80 text-sm h-10"
              />
              <DollarSign
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10"
              />
            </div>

            {/* Status Filter */}
            <div className="relative w-full">
              <Select
                value={selectedPaymentStatus}
                onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                options={statusOptions}
                className="pl-10 bg-card border-border/80 text-sm h-10"
              />
              <Shield
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      {error ? (
        <ErrorState
          title="Payment Transactions Retrieval Failed"
          message={error}
          onRetry={reload}
          isLoading={isLoading}
        />
      ) : isLoading ? (
        <TableSkeleton rows={6} />
      ) : (
        <div className="flex flex-col gap-4">
          <RoomAllotmentPaymentsTable
            payments={payments}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-1 py-2">
              <span className="text-sm text-muted-foreground font-medium">
                Showing <strong className="text-foreground">{payments.length}</strong> of <strong className="text-foreground">{total}</strong> payment records
              </span>

              <div className="flex gap-2 items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-1.5"
                >
                  <ChevronLeft size={16} />
                </Button>

                <span className="text-sm font-semibold">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1.5"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
