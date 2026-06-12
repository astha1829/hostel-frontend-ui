"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, ChevronLeft, ChevronRight, Building, Hash, Layers, Home } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useHostelFloors } from "../hooks/use-hostel-floors";
import { HostelFloorsTable } from "./hostel-floors-table";
import { CreateHostelFloorModal } from "./create-hostel-floor-modal";

export const HostelFloorsListPage: React.FC = () => {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  const {
    floors,
    hostels,
    isLoading,
    error,
    stats,
    searchTerm,
    setSearchTerm,
    selectedHostelId,
    setSelectedHostelId,
    currentPage,
    setCurrentPage,
    totalPages,
    total,
    handleDelete,
    reload,
  } = useHostelFloors();

  const handleRowClick = (id: string) => {
    // Navigate to single floor details route
    router.push(`/hostel-floors/${id}`);
  };

  const hostelFilterOptions = [
    { label: "All Hostels", value: "all" },
    ...hostels.map((h) => ({
      label: h.hostel_name,
      value: h.id,
    })),
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Header Bar */}
      <PageHeader
        title="Hostel Floors Directory"
        description="Oversee room series allocations, floor properties, and capacities across student residences."
        actions={
          <Button variant="primary" size="md" onClick={() => setIsCreateModalOpen(true)} style={{ boxShadow: "0 2px 8px hsl(var(--primary) / 0.15)" }}>
            <Plus size={16} />
            <span>Add Hostel Floor</span>
          </Button>
        }
      />

      {/* Operational Summary Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1rem",
        marginBottom: "0.25rem"
      }}>
        {/* Card 1: Total Floors */}
        <Card style={{ position: "relative", overflow: "hidden", borderLeft: "4px solid hsl(var(--primary))", transition: "var(--transition)" }} className="card">
          <CardContent style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: "2.75rem",
              height: "2.75rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "hsl(var(--primary) / 0.1)",
              color: "hsl(var(--primary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Layers size={20} />
            </div>
            <div>
              <p style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Floors</p>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginTop: "0.125rem" }}>
                {stats.isLoading ? "..." : stats.totalFloors}
              </h3>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Room Series */}
        <Card style={{ position: "relative", overflow: "hidden", borderLeft: "4px solid hsl(var(--warning))", transition: "var(--transition)" }} className="card">
          <CardContent style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: "2.75rem",
              height: "2.75rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "hsl(var(--warning) / 0.12)",
              color: "hsl(var(--warning))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Hash size={20} />
            </div>
            <div>
              <p style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Configured Series</p>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginTop: "0.125rem" }}>
                {stats.isLoading ? "..." : stats.uniqueSeries}
              </h3>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Total Rooms */}
        <Card style={{ position: "relative", overflow: "hidden", borderLeft: "4px solid hsl(var(--success))", transition: "var(--transition)" }} className="card">
          <CardContent style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: "2.75rem",
              height: "2.75rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "hsl(var(--success) / 0.15)",
              color: "hsl(var(--success))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Home size={20} />
            </div>
            <div>
              <p style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Operational Rooms</p>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginTop: "0.125rem" }}>
                {stats.isLoading ? "..." : stats.totalRooms}
              </h3>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Hostels Covered */}
        <Card style={{ position: "relative", overflow: "hidden", borderLeft: "4px solid hsl(var(--destructive))", transition: "var(--transition)" }} className="card">
          <CardContent style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: "2.75rem",
              height: "2.75rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "hsl(var(--destructive) / 0.1)",
              color: "hsl(var(--destructive))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Building size={20} />
            </div>
            <div>
              <p style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Hostels Covered</p>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginTop: "0.125rem" }}>
                {stats.isLoading ? "..." : stats.hostelsCovered}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtering Options Panel */}
      <Card style={{ border: "1px solid hsl(var(--border) / 0.85)", boxShadow: "var(--shadow-sm)" }}>
        <CardContent style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "hsl(var(--muted-foreground) / 1.3)" }}>
              Search & Filter Floors
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

              {/* Search Input */}
              <div className="relative md:col-span-8 lg:col-span-8">
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by room series prefix..."
                  style={{ paddingLeft: "2.5rem" }}
                />
                <Search
                  size={18}
                  style={{
                    position: "absolute",
                    left: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "hsl(var(--muted-foreground))",
                    pointerEvents: "none",
                  }}
                />
              </div>

              {/* Hostel Filter */}
              <div className="md:col-span-4 lg:col-span-4">
                <Select
                  value={selectedHostelId}
                  onChange={(e) => setSelectedHostelId(e.target.value)}
                  options={hostelFilterOptions}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      {error ? (
        <ErrorState
          title="Directory Retrieval Failed"
          message={error}
          onRetry={reload}
          isLoading={isLoading}
        />
      ) : isLoading ? (
        <TableSkeleton rows={6} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Table list */}
          <HostelFloorsTable floors={floors} onRowClick={handleRowClick} onDelete={handleDelete} />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.5rem 0.25rem"
            }} className="pagination-bar">
              <span style={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground))", fontWeight: 500 }}>
                Showing <strong style={{ color: "hsl(var(--foreground))" }}>{floors.length}</strong> of <strong style={{ color: "hsl(var(--foreground))" }}>{total}</strong> floor records
              </span>

              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  style={{ padding: "0.375rem 0.5rem" }}
                >
                  <ChevronLeft size={16} />
                </Button>

                <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  style={{ padding: "0.375rem 0.5rem" }}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Centered Modal Creation Form */}
      <CreateHostelFloorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={reload}
        hostels={hostels}
      />
    </div>
  );
};
