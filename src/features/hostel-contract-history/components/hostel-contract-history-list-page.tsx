"use client";

import React, { useState } from "react";
import { Search, Plus, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useHostelContractHistory } from "../hooks/use-hostel-contract-history";
import { HostelContractHistoryTable } from "./hostel-contract-history-table";
import { HostelContractHistoryModal } from "./hostel-contract-history-modal";
import { HostelContractHistoryRow } from "../types";

export const HostelContractHistoryListPage: React.FC = () => {
  const {
    history,
    students,
    isLoading,
    error,
    search,
    setSearch,
    selectedStudentId,
    setSelectedStudentId,
    currentPage,
    setCurrentPage,
    totalPages,
    total,
    sortBy,
    sortOrder,
    handleSort,
    handleDelete,
    reload,
  } = useHostelContractHistory();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRow, setEditRow] = useState<HostelContractHistoryRow | undefined>(undefined);

  const studentOptions = [
    { label: "All Students", value: "" },
    ...students.map((s) => ({
      label: `${s.student_name} ${s.last_name || ""}`.trim(),
      value: s.id,
    })),
  ];

  const uniqueStudentsCount = history.length ? new Set(history.map(h => h.student_id)).size : 0;

  const getLatestEntryDate = () => {
    if (!history || history.length === 0) return "—";
    const dates = history.map(h => new Date(h.created_at).getTime());
    const maxDate = new Date(Math.max(...dates));
    return maxDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit"
    });
  };

  const handleAddClick = () => {
    setEditRow(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (row: HostelContractHistoryRow) => {
    setEditRow(row);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    setEditRow(undefined);
    reload();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} className="animate-slide-in">
      {/* Page Header */}
      <PageHeader
        title="Hostel Contract History"
        description="Archive and track historical student contract references and sequence document listings."
        actions={
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <Button 
              variant="primary" 
              size="md" 
              onClick={handleAddClick}
              style={{ boxShadow: "0 2px 8px hsl(var(--primary) / 0.15)" }}
            >
              <Plus size={16} />
              <span>Add History Row</span>
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1rem"
      }}>
        {/* Total History Records */}
        <Card style={{ border: "1px solid hsl(var(--border) / 0.8)", boxShadow: "var(--shadow-sm)" }}>
          <CardContent style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total History Records</span>
            <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "hsl(var(--primary))" }}>{total}</span>
          </CardContent>
        </Card>

        {/* Unique Students Covered */}
        <Card style={{ border: "1px solid hsl(var(--border) / 0.8)", boxShadow: "var(--shadow-sm)" }}>
          <CardContent style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.05em" }}>Unique Students Covered</span>
            <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "hsl(var(--foreground))" }}>{uniqueStudentsCount}</span>
          </CardContent>
        </Card>

        {/* Latest History Entry Date */}
        <Card style={{ border: "1px solid hsl(var(--border) / 0.8)", boxShadow: "var(--shadow-sm)" }}>
          <CardContent style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.05em" }}>Latest History Entry</span>
            <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "hsl(var(--foreground))" }}>{getLatestEntryDate()}</span>
          </CardContent>
        </Card>
      </div>

      {/* Filters Panel */}
      <Card style={{ 
        marginBottom: "0.5rem", 
        border: "1px solid hsl(var(--border) / 0.8)",
        background: "linear-gradient(180deg, hsl(var(--card)) 0%, hsl(var(--secondary) / 0.1) 100%)",
        boxShadow: "var(--shadow-sm)",
        borderRadius: "var(--radius-lg)"
      }}>
        <CardContent style={{ padding: "1.25rem" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
            alignItems: "center"
          }}>
            {/* Search Input */}
            <div style={{ position: "relative", width: "100%" }}>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search contract reference..."
                style={{ 
                  paddingLeft: "2.5rem",
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border) / 0.8)",
                  fontSize: "0.875rem",
                  height: "2.5rem"
                }}
              />
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "0.875rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "hsl(var(--muted-foreground))",
                  pointerEvents: "none",
                  zIndex: 10
                }}
              />
            </div>

            {/* Student Filter */}
            <div style={{ position: "relative", width: "100%" }}>
              <Select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                options={studentOptions}
                style={{
                  paddingLeft: "2.5rem",
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border) / 0.8)",
                  fontSize: "0.875rem",
                  height: "2.5rem"
                }}
              />
              <Users
                size={16}
                style={{
                  position: "absolute",
                  left: "0.875rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "hsl(var(--muted-foreground))",
                  pointerEvents: "none",
                  zIndex: 10
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      {error ? (
        <ErrorState
          title="Contract History Retrieval Failed"
          message={error}
          onRetry={reload}
          isLoading={isLoading}
        />
      ) : isLoading ? (
        <TableSkeleton rows={6} />
      ) : total === 0 ? (
        <Card style={{
          padding: "4rem 2rem",
          textAlign: "center",
          border: "1px dashed hsl(var(--border))",
          backgroundColor: "hsl(var(--secondary) / 0.05)",
          borderRadius: "var(--radius-lg)"
        }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", justifyContent: "center" }}>
            <div style={{
              width: "4rem",
              height: "4rem",
              borderRadius: "50%",
              backgroundColor: "hsl(var(--primary) / 0.08)",
              color: "hsl(var(--primary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Users size={32} />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>No Contract History Records Found</h3>
            <p style={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground))", maxWidth: "400px", margin: 0 }}>
              Archive previous contracts and maintain student contract timelines to audit histories.
            </p>
            <Button variant="primary" size="md" onClick={handleAddClick} style={{ marginTop: "0.5rem" }}>
              <Plus size={16} />
              <span>Add First History Record</span>
            </Button>
          </div>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <HostelContractHistoryTable
            history={history}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.5rem 0.25rem"
            }} className="pagination-bar">
              <span style={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground))", fontWeight: 500 }}>
                Showing <strong style={{ color: "hsl(var(--foreground))" }}>{history.length}</strong> of <strong style={{ color: "hsl(var(--foreground))" }}>{total}</strong> log entries
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <HostelContractHistoryModal
          editRow={editRow}
          history={history}
          onClose={() => {
            setIsModalOpen(false);
            setEditRow(undefined);
          }}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
};
