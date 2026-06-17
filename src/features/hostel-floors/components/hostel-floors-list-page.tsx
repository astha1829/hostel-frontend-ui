"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, Plus, ChevronLeft, ChevronRight, Layers, Home, BedDouble, Filter 
} from "lucide-react";
import { TableSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useHostelFloors } from "../hooks/use-hostel-floors";
import { HostelFloorsTable } from "./hostel-floors-table";
import { CreateHostelFloorModal } from "./create-hostel-floor-modal";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";

export const HostelFloorsListPage: React.FC = () => {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

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
    router.push(`/hostel-floors/${id}`);
  };

  return (
    <div className="container-page flex flex-col gap-4 pb-4 bg-[#F8FAFC] font-inter animate-slide-in">
      {/* Page Header */}
      <PageHeader
        title="Hostel Floors"
        description="Oversee floor series allocations, room configurations, and bed capacities."
        actions={
          <Button 
            variant="primary" 
            size="md" 
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={16} />
            <span>Add Floor</span>
          </Button>
        }
      />

      {/* Stats Cards Grid - Premium SaaS Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Floors */}
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-[12px] p-[16px] hover:-translate-y-[2px] transition-all duration-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[14px] font-[600] text-[#64748B] tracking-tight">Total Floors</span>
            <div className="w-[32px] h-[32px] rounded-[8px] bg-[#F4F1FF] text-[#6D4CFF] flex items-center justify-center shrink-0">
              <Layers size={16} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[32px] font-[800] text-[#0F172A] leading-none tracking-tight">
              {stats?.isLoading ? "-" : (stats?.totalFloors || 0)}
            </span>
            <span className="text-[13px] font-[500] text-[#64748B]">Allocated across all hostels</span>
          </div>
        </div>

        {/* Active Rooms */}
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-[12px] p-[16px] hover:-translate-y-[2px] transition-all duration-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[14px] font-[600] text-[#64748B] tracking-tight">Generated Rooms</span>
            <div className="w-[32px] h-[32px] rounded-[8px] bg-[#DCFCE7] text-[#22C55E] flex items-center justify-center shrink-0">
              <Home size={16} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[32px] font-[800] text-[#0F172A] leading-none tracking-tight">
              {stats?.isLoading ? "-" : (stats?.totalRooms || 0)}
            </span>
            <span className="text-[13px] font-[500] text-[#64748B]">Currently configured rooms</span>
          </div>
        </div>

        {/* Bed Capacity */}
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-[12px] p-[16px] hover:-translate-y-[2px] transition-all duration-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[14px] font-[600] text-[#64748B] tracking-tight">Total Bed Capacity</span>
            <div className="w-[32px] h-[32px] rounded-[8px] bg-[#FEF3C7] text-[#F59E0B] flex items-center justify-center shrink-0">
              <BedDouble size={16} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[32px] font-[800] text-[#0F172A] leading-none tracking-tight">
              {stats?.isLoading ? "-" : (stats?.totalBeds || 0)}
            </span>
            <span className="text-[13px] font-[500] text-[#64748B]">Available bed placements</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#FFFFFF] rounded-[12px] px-4 py-3 border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by floor or series..."
            className="w-full h-[44px] pl-9 pr-4 rounded-[8px] border border-[#E2E8F0] text-[15px] font-[500] outline-none focus:border-[#6D4CFF] focus:ring-1 focus:ring-[#6D4CFF] transition-all bg-[#FFFFFF] text-[#0F172A] placeholder:text-[#94A3B8]"
          />
        </div>

        <div className="w-full md:w-[220px] shrink-0 relative">
          <select
            value={selectedHostelId}
            onChange={(e) => setSelectedHostelId(e.target.value)}
            className="w-full h-[44px] px-3 pr-8 rounded-[8px] border border-[#E2E8F0] text-[15px] font-[500] outline-none focus:border-[#6D4CFF] transition-colors bg-[#FFFFFF] text-[#0F172A] appearance-none"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px top 50%', backgroundSize: '16px auto' }}
          >
            <option value="all">All Hostels</option>
            {hostels.map(h => (
              <option key={h.id} value={h.id}>{h.hostel_name}</option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-[180px] shrink-0 relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full h-[44px] px-3 pr-8 rounded-[8px] border border-[#E2E8F0] text-[15px] font-[500] outline-none focus:border-[#6D4CFF] transition-colors bg-[#FFFFFF] text-[#0F172A] appearance-none"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px top 50%', backgroundSize: '16px auto' }}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button className="h-[44px] px-4 rounded-[8px] border border-[#E2E8F0] bg-[#FFFFFF] text-[#64748B] font-[600] text-[14px] flex items-center justify-center gap-2 hover:bg-[#F8FAFC] transition-colors">
          <Filter size={16} />
          Filters
        </button>

        <Button size="md" onClick={reload} className="px-6">
          Search
        </Button>
      </div>

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
        <div className="flex flex-col gap-4">
          <div className="bg-[#FFFFFF] rounded-[12px] shadow-sm border border-[#E2E8F0] overflow-hidden">
            <HostelFloorsTable floors={floors} onRowClick={handleRowClick} onDelete={handleDelete} />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-2 py-1">
              <span className="text-[14px] font-[500] text-[#64748B]">
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, total)} of {total} results
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 rounded-[8px] border border-[#E2E8F0] bg-[#FFFFFF] flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="w-9 h-9 rounded-[8px] bg-[#6D4CFF] flex items-center justify-center text-[#FFFFFF] font-[600] text-[14px]">
                  {currentPage}
                </div>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 rounded-[8px] border border-[#E2E8F0] bg-[#FFFFFF] flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
        <CreateHostelFloorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={reload}
        hostels={hostels}
      />
    </div>
  );
};
