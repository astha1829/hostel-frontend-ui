"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, ChevronLeft, ChevronRight, Users, Layers, Shield, DollarSign, Calendar } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useRentPayments } from "../hooks/use-rent-payments";
import { RentPaymentsTable } from "./rent-payments-table";

export const RentPaymentsListPage: React.FC = () => {
  const router = useRouter();

  const {
    payments,
    students,
    isLoading,
    error,
    search,
    setSearch,
    selectedStudentId,
    setSelectedStudentId,
    selectedTransactionType,
    setSelectedTransactionType,
    selectedDirection,
    setSelectedDirection,
    selectedMonth,
    setSelectedMonth,
    currentPage,
    setCurrentPage,
    totalPages,
    total,
    sortBy,
    sortOrder,
    handleSort,
    handleDelete,
    reload,
  } = useRentPayments();

  const studentOptions = [
    { label: "All Students", value: "" },
    ...students.map((s) => ({
      label: `${s.student_name} ${s.last_name || ""}`.trim(),
      value: s.id,
    })),
  ];

  const directionOptions = [
    { label: "All Directions", value: "" },
    { label: "Credit (+)", value: "credit" },
    { label: "Debit (-)", value: "debit" },
  ];

  const transactionTypeOptions = [
    { label: "All Transaction Types", value: "" },
    { label: "Rent Payment", value: "Rent Payment" },
    { label: "Security Deposit", value: "Security Deposit" },
    { label: "Late Fee Penalty", value: "Late Fee Penalty" },
    { label: "Refund Adjustment", value: "Refund Adjustment" },
  ];

  return (
    <div className="container-page flex flex-col gap-4 animate-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <PageHeader
        title="Rent Payments"
        description={`Administer and audit individual monthly student rent ledger entries, credit allocations, and debit adjustments (${total} total records).`}
        actions={
          <Button 
            variant="primary" 
            size="md" 
            onClick={() => router.push("/rent-payments/new")}
            className="shadow-[0_2px_8px_hsl(var(--primary)/0.15)]"
          >
            <Plus size={16} />
            <span>Add Rent Payment</span>
          </Button>
        }
      />

      {/* Unified operational filters panel */}
      <Card className="mb-2 border-border/80 bg-gradient-to-b from-card to-secondary/10 shadow-sm rounded-lg">
        <CardContent className="p-5 pt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
            {/* Search Input */}
            <div className="relative w-full">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search description, name..."
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
                className="bg-card border-border/80 h-[44px]"
              />
            </div>

            {/* Transaction Type Filter */}
            <div className="relative w-full">
              <Select
                value={selectedTransactionType}
                onChange={(e) => setSelectedTransactionType(e.target.value)}
                options={transactionTypeOptions}
                className="bg-card border-border/80 h-[44px]"
              />
            </div>

            {/* Direction Filter */}
            <div className="relative w-full">
              <Select
                value={selectedDirection}
                onChange={(e) => setSelectedDirection(e.target.value)}
                options={directionOptions}
                className="bg-card border-border/80 h-[44px]"
              />
            </div>

            {/* Month Filter */}
            <div className="relative w-full">
              <Input
                type="text"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                placeholder="Month (YYYY-MM)..."
                className="pl-10 bg-card border-border/80 text-sm h-10"
              />
              <Calendar
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
          title="Ledger Entries Retrieval Failed"
          message={error}
          onRetry={reload}
          isLoading={isLoading}
        />
      ) : isLoading ? (
        <TableSkeleton rows={6} />
      ) : (
        <div className="flex flex-col gap-4 mt-[18px]">
          <RentPaymentsTable
            payments={payments}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center py-2 px-1">
              <span className="text-sm text-muted-foreground font-medium">
                Showing <strong className="text-foreground">{payments.length}</strong> of <strong className="text-foreground">{total}</strong> ledger records
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
