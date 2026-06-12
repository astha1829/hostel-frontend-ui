"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, ChevronLeft, ChevronRight, Building, ShieldCheck, Layers, Home, Filter } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useHostels } from "../hooks/use-hostels";
import { HostelsGrid } from "./hostels-grid";
import { CreateHostelModal } from "./create-hostel-modal";

export const HostelsListPage: React.FC = () => {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  
  const {
    hostels,
    isLoading,
    error,
    stats,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    selectedZone,
    setSelectedZone,
    currentPage,
    setCurrentPage,
    totalPages,
    total,
    handleDelete,
    reload,
  } = useHostels();

  const handleRowClick = (id: string) => {
    router.push(`/hostels/${id}`);
  };

  const statusOptions = [
    { label: "All Statuses", value: "all" },
    { label: "Active", value: "active" },
    { label: "Maintenance", value: "maintenance" },
    { label: "Inactive", value: "inactive" },
  ];

  const zoneOptions = [
    { label: "All Zones", value: "all" },
    { label: "North Wing Campus", value: "North Wing Campus" },
    { label: "South Wing Campus", value: "South Wing Campus" },
    { label: "North Campus", value: "North Campus" },
    { label: "South Campus", value: "South Campus" },
    { label: "East Campus", value: "East Campus" },
    { label: "West Campus", value: "West Campus" },
    { label: "General Zone", value: "General Zone" },
  ];

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[32px] font-bold text-foreground">Hostel Directory</h1>
          <p className="text-[15px] text-muted-foreground">Manage and oversee all hostels across the campus.</p>
        </div>
        <Button variant="primary" size="lg" className="rounded-xl px-6 py-3 font-semibold text-[15px] h-auto shadow-sm" onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          Add New Hostel
        </Button>
      </div>

      {/* Statistics Section (Single Large Container with subtle separators) */}
      <Card className="rounded-2xl border border-border shadow-sm overflow-hidden bg-card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
          {/* Stat 1 */}
          <div className="p-8 flex items-start gap-5">
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Building size={24} />
            </div>
            <div className="flex flex-col">
              <h3 className="text-[36px] font-bold text-foreground leading-none mb-1">
                {stats.isLoading ? "..." : stats.totalHostels}
              </h3>
              <p className="text-[15px] font-semibold text-foreground mb-1">Total Hostels</p>
              <p className="text-[13px] text-muted-foreground">All registered properties</p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="p-8 flex items-start gap-5">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div className="flex flex-col">
              <h3 className="text-[36px] font-bold text-foreground leading-none mb-1">
                {stats.isLoading ? "..." : stats.activeHostels}
              </h3>
              <p className="text-[15px] font-semibold text-foreground mb-1">Active Hostels</p>
              <p className="text-[13px] text-muted-foreground">Currently operational</p>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="p-8 flex items-start gap-5">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Layers size={24} />
            </div>
            <div className="flex flex-col">
              <h3 className="text-[36px] font-bold text-foreground leading-none mb-1">
                {stats.isLoading ? "..." : stats.totalFloors}
              </h3>
              <p className="text-[15px] font-semibold text-foreground mb-1">Total Floors</p>
              <p className="text-[13px] text-muted-foreground">Across all hostels</p>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="p-8 flex items-start gap-5">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <Home size={24} />
            </div>
            <div className="flex flex-col">
              <h3 className="text-[36px] font-bold text-foreground leading-none mb-1">
                {stats.isLoading ? "..." : stats.totalRooms}
              </h3>
              <p className="text-[15px] font-semibold text-foreground mb-1">Total Rooms</p>
              <p className="text-[13px] text-muted-foreground">Allocated rooms</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Filter Section */}
      <Card className="rounded-2xl border border-border shadow-sm overflow-hidden bg-card">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1 w-full relative">
              <label className="text-[13px] font-medium text-muted-foreground mb-2 block">Search Directory</label>
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by hostel name, code, zone..."
                  className="pl-12 h-[52px] rounded-xl text-[15px] border-border bg-background"
                />
              </div>
            </div>
            <div className="w-full lg:w-[240px]">
              <label className="text-[13px] font-medium text-muted-foreground mb-2 block">Campus Zone</label>
              <Select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                options={zoneOptions}
                className="h-[52px] rounded-xl text-[15px]"
              />
            </div>
            <div className="w-full lg:w-[240px]">
              <label className="text-[13px] font-medium text-muted-foreground mb-2 block">Operational Status</label>
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                options={statusOptions}
                className="h-[52px] rounded-xl text-[15px]"
              />
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <Button variant="outline" className="h-[52px] px-6 rounded-xl font-semibold text-[15px] border-border text-foreground hover:bg-secondary flex-1 lg:flex-auto">
                <Filter size={18} className="mr-2" />
                Filters
              </Button>
              <Button variant="primary" className="h-[52px] px-8 rounded-xl font-semibold text-[15px] shadow-sm flex-1 lg:flex-auto" onClick={reload}>
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hostel List */}
      <div>
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-[24px] font-semibold text-foreground">Registered Properties</h2>
          <span className="text-[15px] text-muted-foreground font-medium">Showing {hostels.length} of {total}</span>
        </div>

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
          <div className="flex flex-col gap-6">
            <HostelsGrid hostels={hostels} onCardClick={handleRowClick} onDelete={handleDelete} />

            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <span className="text-[15px] text-muted-foreground font-medium">
                  Page <strong className="text-foreground">{currentPage}</strong> of <strong className="text-foreground">{totalPages}</strong>
                </span>
                
                <div className="flex gap-2 items-center">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="rounded-xl px-4 py-2 border-border"
                  >
                    <ChevronLeft size={18} className="mr-1" />
                    Previous
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="rounded-xl px-4 py-2 border-border"
                  >
                    Next
                    <ChevronRight size={18} className="ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <CreateHostelModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={reload}
      />
    </div>
  );
};
