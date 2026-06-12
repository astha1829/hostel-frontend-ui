"use client";

import React, { useState } from "react";
import { Plus, Search, Home, CheckCircle2, Users, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { TableSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useRooms } from "../hooks/use-rooms";
import { RoomsTable } from "./rooms-table";
import { HostelSelector } from "@/features/hostel-floors/components/hostel-selector";
import { FloorSelector } from "./floor-selector";
import { CreateRoomModal } from "./create-room-modal";

export const RoomsListPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const {
    rooms,
    allRoomsRaw,
    hostels,
    floors,
    isLoading,
    error,
    search,
    setSearch,
    selectedHostelId,
    setSelectedHostelId,
    selectedFloorId,
    setSelectedFloorId,
    selectedStatus,
    setSelectedStatus,
    reload,
  } = useRooms();

  // Compute stat metrics
  const stats = React.useMemo(() => {
    const total = allRoomsRaw.length;
    const available = allRoomsRaw.filter(r => r.status?.toLowerCase() === "available" || r.status?.toLowerCase() === "active").length;
    const occupied = allRoomsRaw.filter(r => r.status?.toLowerCase() === "occupied" || r.status?.toLowerCase() === "full").length;
    const maintenance = allRoomsRaw.filter(r => r.status?.toLowerCase() === "maintenance").length;
    return { total, available, occupied, maintenance };
  }, [allRoomsRaw]);

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Rooms"
        message={error}
        onRetry={reload}
        isLoading={isLoading}
      />
    );
  }

  const statusOptions = [
    { label: "All Statuses", value: "" },
    { label: "Available", value: "available" },
    { label: "Occupied", value: "occupied" },
    { label: "Maintenance", value: "maintenance" },
    { label: "Inactive", value: "inactive" },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <PageHeader
        title="Rooms Directory"
        description="Oversee bed allocation, type configurations, and digital key cards."
        actions={
          <Button variant="primary" size="md" onClick={() => setIsCreateModalOpen(true)} className="shadow-[0_2px_8px_hsl(var(--primary)/0.15)]">
            <Plus size={16} />
            <span>Add Room</span>
          </Button>
        }
      />

      {/* Summary Cards Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-1 animate-in slide-in-from-bottom-4 duration-500">
          {/* Card 1: Total Rooms */}
          <Card className="border-l-4 border-l-primary border-t-border/60 border-r-border/60 border-b-border/60">
            <CardContent className="p-5 pt-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                <Home size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Rooms</p>
                <h3 className="text-2xl font-bold mt-0.5">{stats.total}</h3>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Available Rooms */}
          <Card className="border-l-4 border-l-success border-t-border/60 border-r-border/60 border-b-border/60">
            <CardContent className="p-5 pt-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-md bg-success/15 text-success flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Available</p>
                <h3 className="text-2xl font-bold mt-0.5">{stats.available}</h3>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Occupied Rooms */}
          <Card className="border-l-4 border-l-primary/70 border-t-border/60 border-r-border/60 border-b-border/60">
            <CardContent className="p-5 pt-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                <Users size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Occupied</p>
                <h3 className="text-2xl font-bold mt-0.5">{stats.occupied}</h3>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Maintenance Rooms */}
          <Card className="border-l-4 border-l-warning border-t-border/60 border-r-border/60 border-b-border/60">
            <CardContent className="p-5 pt-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-md bg-warning/10 text-warning flex items-center justify-center">
                <AlertTriangle size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Maintenance</p>
                <h3 className="text-2xl font-bold mt-0.5">{stats.maintenance}</h3>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtering Options Panel */}
      <Card className="border border-border/80 shadow-sm">
        <CardContent className="p-5 pt-5">
          <div className="flex flex-col gap-3">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
              Room Search & Filters
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              
              {/* Search Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Search Rooms
                </label>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Room no, type..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full py-2 pl-9 pr-3 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <HostelSelector
                value={selectedHostelId}
                onChange={setSelectedHostelId}
                hostels={hostels}
              />

              <FloorSelector
                value={selectedFloorId}
                onChange={setSelectedFloorId}
                floors={floors}
                disabled={!selectedHostelId}
              />

              <Select
                label="Operational Status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                options={statusOptions}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : rooms.length === 0 ? (
        <div className="empty-floor-compact py-16 px-8">
          <Home size={40} className="text-muted-foreground opacity-60" />
          <h3 className="empty-floor-compact-title">No Rooms Found</h3>
          <p className="empty-floor-compact-desc">
            No room records matched the selected query filters. Try adjusting your parameters.
          </p>
        </div>
      ) : (
        <RoomsTable rooms={rooms} />
      )}

      {/* Centered Modal Creation Form */}
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          reload();
        }}
      />
    </div>
  );
};
