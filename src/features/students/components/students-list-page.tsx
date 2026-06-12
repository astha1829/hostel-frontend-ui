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
import { useStudents } from "../hooks/use-students";
import { StudentsTable } from "./students-table";

export const StudentsListPage: React.FC = () => {
  const router = useRouter();
  
  const {
    students,
    isLoading,
    error,
    search,
    setSearch,
    selectedCollege,
    setSelectedCollege,
    selectedNationality,
    setSelectedNationality,
    selectedStudentType,
    setSelectedStudentType,
    selectedKycVerified,
    setSelectedKycVerified,
    currentPage,
    setCurrentPage,
    totalPages,
    total,
    handleDelete,
    reload,
  } = useStudents();

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <PageHeader
        title="Students Directory"
        description="Manage resident student profiles, contact credentials, identity verifications, and KYC status."
        actions={
          <Button variant="primary" size="md" onClick={() => router.push("/students/new")} className="shadow-[0_2px_8px_hsl(var(--primary)/0.15)]">
            <Plus size={16} />
            <span>Add Student</span>
          </Button>
        }
      />

      {/* Filters Panel */}
      <Card className="border border-border/85 shadow-sm">
        <CardContent className="p-5 pt-5">
          <div className="flex flex-col gap-3">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
              Student Search & Filters
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Search Input */}
              <div className="relative">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, passport, email..."
                  className="pl-10"
                />
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
              </div>

              {/* College Filter */}
              <Input
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                placeholder="Filter by College..."
              />

              {/* Nationality Filter */}
              <Input
                value={selectedNationality}
                onChange={(e) => setSelectedNationality(e.target.value)}
                placeholder="Filter by Nationality..."
              />

              {/* Enrollment Type */}
              <Select
                value={selectedStudentType}
                onChange={(e) => setSelectedStudentType(e.target.value)}
                options={[
                  { label: "All Student Types", value: "" },
                  { label: "Regular", value: "Regular" },
                  { label: "International", value: "International" },
                  { label: "Scholar", value: "Scholar" },
                ]}
              />

              {/* KYC Verified */}
              <Select
                value={selectedKycVerified}
                onChange={(e) => setSelectedKycVerified(e.target.value)}
                options={[
                  { label: "All KYC Statuses", value: "all" },
                  { label: "KYC Verified Only", value: "true" },
                  { label: "Pending KYC Only", value: "false" },
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Directory List */}
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
        <div className="flex flex-col gap-4">
          <StudentsTable students={students} onDelete={handleDelete} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-1 py-2">
              <span className="text-sm text-muted-foreground font-medium">
                Showing <strong className="text-foreground">{students.length}</strong> of <strong className="text-foreground">{total}</strong> student records
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
