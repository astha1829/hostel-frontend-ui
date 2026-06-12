"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, ChevronLeft, ChevronRight, Building2, Users, Shield } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useRoomAllotments } from "../hooks/use-room-allotments";
import { RoomAllotmentsTable } from "./room-allotments-table";

export const RoomAllotmentsListPage: React.FC = () => {
  const router = useRouter();

  const {
    allotments,
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
    currentPage,
    setCurrentPage,
    totalPages,
    total,
    sortBy,
    sortOrder,
    handleSort,
    handleDelete,
    reload,
  } = useRoomAllotments();

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
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
    { label: "Pending", value: "Pending" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <PageHeader
        title="Room Allotments"
        description="Allocate rooms to student contracts, manage roommate parameters, and perform transfer settlements."
        actions={
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3.5 py-2 rounded-md text-[13px] font-bold border border-primary/15">
              <span>{total} Total Records</span>
            </div>
            <Button variant="primary" size="md" onClick={() => router.push("/room-allotments/new")} className="shadow-[0_2px_8px_hsl(var(--primary)/0.15)]">
              <Plus size={16} />
              <span>Add Allotment</span>
            </Button>
          </div>
        }
      />

      {/* Unified Filters Operational Toolbar */}
      <Card className="mb-2 border-border/80 bg-gradient-to-b from-card to-secondary/10 shadow-sm rounded-lg">
        <CardContent className="p-5 pt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            {/* Search Input */}
            <div className="relative w-full">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search room, student..."
                className="pl-10 bg-card border-border/80 text-sm h-10"
              />
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10"
              />
            </div>

            {/* Hostel Selector */}
            <div className="relative w-full">
              <Select
                value={selectedHostelId}
                onChange={(e) => setSelectedHostelId(e.target.value)}
                options={hostelOptions}
                className="pl-10 bg-card border-border/80 text-sm h-10"
              />
              <Building2
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10"
              />
            </div>

            {/* Student Selector */}
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

            {/* Status Filter */}
            <div className="relative w-full">
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
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
          title="Allotments Loading Failed"
          message={error}
          onRetry={reload}
          isLoading={isLoading}
        />
      ) : isLoading ? (
        <TableSkeleton rows={6} />
      ) : (
        <div className="flex flex-col gap-4">
          <RoomAllotmentsTable
            allotments={allotments}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center py-2 px-1">
              <span className="text-sm text-muted-foreground font-medium">
                Showing <strong className="text-foreground">{allotments.length}</strong> of <strong className="text-foreground">{total}</strong> allotment records
              </span>

              <div className="flex items-center gap-2">
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
