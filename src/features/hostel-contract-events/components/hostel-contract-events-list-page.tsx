"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, ChevronLeft, ChevronRight, Users, Layers, Activity, Calendar } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useHostelContractEvents } from "../hooks/use-hostel-contract-events";
import { HostelContractEventsTable } from "./hostel-contract-events-table";

export const HostelContractEventsListPage: React.FC = () => {
  const router = useRouter();

  const {
    events,
    students,
    isLoading,
    error,
    search,
    setSearch,
    selectedStudentId,
    setSelectedStudentId,
    selectedActionType,
    setSelectedActionType,
    selectedEventStatus,
    setSelectedEventStatus,
    currentPage,
    setCurrentPage,
    totalPages,
    total,
    sortBy,
    sortOrder,
    handleSort,
    handleDelete,
    reload,
  } = useHostelContractEvents();

  const studentOptions = [
    { label: "All Students", value: "" },
    ...students.map((s) => ({
      label: `${s.student_name} ${s.last_name || ""}`.trim(),
      value: s.id,
    })),
  ];

  const actionTypeOptions = [
    { label: "All Action Types", value: "" },
    { label: "Create", value: "Create" },
    { label: "Transfer", value: "Transfer" },
    { label: "Amend", value: "Amend" },
    { label: "Extend", value: "Extend" },
    { label: "Cancel", value: "Cancel" },
  ];

  const eventStatusOptions = [
    { label: "All Statuses", value: "" },
    { label: "Confirmed", value: "Confirmed" },
    { label: "Pending", value: "Pending" },
    { label: "Pending Review", value: "Pending Review" },
    { label: "Approved", value: "Approved" },
    { label: "Completed", value: "Completed" },
    { label: "Cancelled", value: "Cancelled" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Hostel Contract Events"
        description={`Audit student contract lifecycles, track room transition allotments, and monitor payment settlements (${total || 0} total events).`}
        actions={
          <div className="flex gap-3 items-center">
            <Button 
              variant="primary" 
              size="md" 
              onClick={() => router.push("/hostel-contract-events/new")}
              className="shadow-[0_2px_8px_hsl(var(--primary)/0.15)] gap-1.5"
            >
              <Plus size={16} />
              <span>Add Event</span>
            </Button>
          </div>
        }
      />

      {/* Unified operational filters panel */}
      <Card className="mb-2 border border-border/80 bg-gradient-to-b from-card to-secondary/10 shadow-sm rounded-lg">
        <CardContent className="p-5 pt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            {/* Search Input */}
            <div className="relative w-full">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search action type, status, name..."
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

            {/* Action Type Filter */}
            <div className="relative w-full">
              <Select
                value={selectedActionType}
                onChange={(e) => setSelectedActionType(e.target.value)}
                options={actionTypeOptions}
                className="pl-10 bg-card border-border/80 text-sm h-10"
              />
              <Activity
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10"
              />
            </div>

            {/* Event Status Filter */}
            <div className="relative w-full">
              <Select
                value={selectedEventStatus}
                onChange={(e) => setSelectedEventStatus(e.target.value)}
                options={eventStatusOptions}
                className="pl-10 bg-card border-border/80 text-sm h-10"
              />
              <Layers
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
          title="Contract Events Retrieval Failed"
          message={error}
          onRetry={reload}
          isLoading={isLoading}
        />
      ) : isLoading ? (
        <TableSkeleton rows={6} />
      ) : (
        <div className="flex flex-col gap-4">
          <HostelContractEventsTable
            events={events}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center py-2 px-1">
              <span className="text-sm text-muted-foreground font-medium">
                Showing <strong className="text-foreground">{events.length}</strong> of <strong className="text-foreground">{total}</strong> event records
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
