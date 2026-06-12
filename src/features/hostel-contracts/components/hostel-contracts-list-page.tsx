"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useHostelContracts } from "../hooks/use-hostel-contracts";
import { HostelContractsTable } from "./hostel-contracts-table";

export const HostelContractsListPage: React.FC = () => {
  const router = useRouter();

  const {
    contracts,
    hostels,
    students,
    isLoading,
    error,
    search,
    setSearch,
    selectedHostelId,
    setSelectedHostelId,
    selectedStudentId,
    setSelectedStudentId,
    selectedStatus,
    setSelectedStatus,
    selectedConfirmStatus,
    setSelectedConfirmStatus,
    currentPage,
    setCurrentPage,
    totalPages,
    total,
    sortBy,
    sortOrder,
    handleSort,
    handleDelete,
    reload,
  } = useHostelContracts();

  const hostelOptions = [
    { label: "All Hostels", value: "" },
    ...hostels.map((h) => ({
      label: h.hostel_name,
      value: h.id,
    })),
  ];

  const studentOptions = [
    { label: "All Students", value: "" },
    ...students.map((s) => ({
      label: `${s.student_name} ${s.last_name || ""}`.trim(),
      value: s.id,
    })),
  ];

  const statusOptions = [
    { label: "All Statuses", value: "" },
    { label: "Active Only", value: "Active" },
    { label: "Expired Only", value: "Expired" },
    { label: "Break Only", value: "Break" },
    { label: "Superseded Only", value: "Superseded" },
  ];

  const confirmStatusOptions = [
    { label: "All Confirm Statuses", value: "" },
    { label: "Confirmed Only", value: "Confirmed" },
    { label: "Pending Only", value: "Pending" },
    { label: "Rejected Only", value: "Rejected" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <PageHeader
        title="Hostel Contracts"
        description="Lease contract registry, payment rates, room sharing parameters, and auditor approval checks."
        actions={
          <Button variant="primary" size="md" onClick={() => router.push("/hostel-contracts/new")} className="shadow-[0_2px_8px_hsl(var(--primary)/0.15)]">
            <Plus size={16} />
            <span>Add Contract</span>
          </Button>
        }
      />

      {/* Filters Control Center */}
      <Card className="mb-2 border-border/70 shadow-sm">
        <CardContent className="p-4 md:p-5 pt-4 md:pt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 items-center">
            {/* Search Input */}
            <div className="relative w-full">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search contract number or type..."
                className="pl-10 bg-card border-border/80 text-sm"
              />
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
            </div>

            {/* Hostel Selector */}
            <Select
              value={selectedHostelId}
              onChange={(e) => setSelectedHostelId(e.target.value)}
              options={hostelOptions}
              className="bg-card border-border/80 text-sm"
            />

            {/* Student Selector */}
            <Select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              options={studentOptions}
              className="bg-card border-border/80 text-sm"
            />

            {/* Status Filter */}
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              options={statusOptions}
              className="bg-card border-border/80 text-sm"
            />

            {/* Confirm Status Filter */}
            <Select
              value={selectedConfirmStatus}
              onChange={(e) => setSelectedConfirmStatus(e.target.value)}
              options={confirmStatusOptions}
              className="bg-card border-border/80 text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      {error ? (
        <ErrorState
          title="Contracts Loading Failed"
          message={error}
          onRetry={reload}
          isLoading={isLoading}
        />
      ) : isLoading ? (
        <TableSkeleton rows={6} />
      ) : (
        <div className="flex flex-col gap-4">
          <HostelContractsTable
            contracts={contracts}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center py-2 px-1">
              <span className="text-sm text-muted-foreground font-medium">
                Showing <strong className="text-foreground">{contracts.length}</strong> of <strong className="text-foreground">{total}</strong> contract records
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
