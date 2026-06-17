"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Building, ShieldCheck, Layers, Grid, List, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useHostels } from "../hooks/use-hostels";
import { HostelsTable } from "./hostels-table";
import { CreateHostelModal } from "./create-hostel-modal";
import { TableSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";

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
  ];

  return (
    <div className="container-page flex flex-col gap-3 pb-4 animate-in slide-in-from-bottom-4 duration-500 font-inter">
      
      {/* Page Header */}
      <PageHeader
        title="Hostel Management"
        description="Manage hostel inventory, floors, occupancy and administrators."
        actions={
          <Button 
            variant="primary" 
            size="md" 
            onClick={() => setIsCreateModalOpen(true)}
            className="shadow-[0_2px_8px_hsl(var(--primary)/0.15)]"
          >
            <Plus size={16} />
            <span>Add New Hostel</span>
          </Button>
        }
      />

      {/* Statistics Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[12px] mb-[4px]">
        {/* Total Hostels */}
        <div className="h-[68px] rounded-[12px] bg-[#FFFFFF] border border-[#E5E7EB] p-[12px] px-[16px] flex items-center gap-[12px] hover:shadow-sm hover:-translate-y-[2px] transition-all duration-200 ease-in-out">
          <div className="w-[40px] h-[40px] rounded-[10px] bg-[#F4F1FF] text-[#6D4AFF] flex items-center justify-center shrink-0">
            <Building size={18} />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-baseline gap-[8px]">
              <span className="text-[24px] font-[700] text-[#0F172A] leading-none">
                {stats?.isLoading ? "..." : (stats?.totalHostels || 0)}
              </span>
              <span className="text-[13px] font-[500] text-[#64748B]">Total Hostels</span>
            </div>
          </div>
        </div>

        {/* Active Hostels */}
        <div className="h-[68px] rounded-[12px] bg-[#FFFFFF] border border-[#E5E7EB] p-[12px] px-[16px] flex items-center gap-[12px] hover:shadow-sm hover:-translate-y-[2px] transition-all duration-200 ease-in-out">
          <div className="w-[40px] h-[40px] rounded-[10px] bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
            <ShieldCheck size={18} />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-baseline gap-[8px]">
              <span className="text-[24px] font-[700] text-[#0F172A] leading-none">
                {stats?.isLoading ? "..." : (stats?.activeHostels || 0)}
              </span>
              <span className="text-[13px] font-[500] text-[#64748B]">Active</span>
            </div>
          </div>
        </div>

        {/* Registered Floors */}
        <div className="h-[68px] rounded-[12px] bg-[#FFFFFF] border border-[#E5E7EB] p-[12px] px-[16px] flex items-center gap-[12px] hover:shadow-sm hover:-translate-y-[2px] transition-all duration-200 ease-in-out">
          <div className="w-[40px] h-[40px] rounded-[10px] bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center shrink-0">
            <Layers size={18} />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-baseline gap-[8px]">
              <span className="text-[24px] font-[700] text-[#0F172A] leading-none">
                {stats?.isLoading ? "..." : (stats?.totalFloors || 0)}
              </span>
              <span className="text-[13px] font-[500] text-[#64748B]">Floors</span>
            </div>
          </div>
        </div>


      </div>

      {/* Search & Filters Row */}
      <div className="bg-[#FFFFFF] rounded-[12px] px-[16px] py-[12px] border border-[#E5E7EB] flex items-center gap-[12px] mb-[8px]">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-[16px] top-1/2 -translate-y-1/2 text-[#64748B]" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by hostel name, code, zone..."
            className="pl-[40px] h-[44px] rounded-[8px] text-[14px] font-[500] bg-[#FFFFFF] border-[#E5E7EB] w-full"
          />
        </div>
        
        <div className="w-[180px]">
          <Select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            options={zoneOptions}
            className="h-[44px] rounded-[8px] text-[14px] font-[500] border-[#E5E7EB]"
          />
        </div>

        <div className="w-[180px]">
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={statusOptions}
            className="h-[44px] rounded-[8px] text-[14px] font-[500] border-[#E5E7EB]"
          />
        </div>

        <button 
          onClick={reload}
          className="h-[44px] px-[16px] rounded-[8px] border border-[#E5E7EB] bg-[#FFFFFF] text-[#64748B] font-[500] text-[13px] flex items-center gap-[8px] hover:bg-[#F8FAFC] transition-colors"
        >
          <RefreshCw size={14} />
          Reset
        </button>

        <button className="h-[44px] px-[20px] rounded-[8px] bg-[#6D4AFF] text-white font-[500] text-[13px] hover:bg-[#5B34F5] transition-colors shadow-sm">
          Search
        </button>
      </div>

      {/* All Hostels Section Title */}
      <div className="flex justify-between items-center mb-[8px]">
        <div className="flex items-center gap-[12px]">
          <h2 className="text-[20px] font-[700] text-[#0F172A]">All Hostels</h2>
          <span className="px-[12px] py-[4px] bg-[#F4F1FF] text-[#6D4AFF] text-[12px] font-[600] rounded-[100px]">
            {hostels.length} Hostel{hostels.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-[4px] bg-[#FFFFFF] border border-[#E5E7EB] p-[4px] rounded-[12px]">
          <button className="w-[36px] h-[36px] rounded-[10px] bg-[#F4F1FF] text-[#6D4AFF] flex items-center justify-center">
            <List size={18} />
          </button>
          <button className="w-[36px] h-[36px] rounded-[10px] text-[#64748B] hover:bg-[#F8FAFC] flex items-center justify-center transition-colors">
            <Grid size={18} />
          </button>
        </div>
      </div>

      {/* Data Table */}
      {error ? (
        <ErrorState
          title="Directory Retrieval Failed"
          message={error}
          onRetry={reload}
          isLoading={isLoading}
        />
      ) : isLoading ? (
        <TableSkeleton rows={3} />
      ) : (
        <HostelsTable hostels={hostels} onRowClick={handleRowClick} onDelete={handleDelete} />
      )}

      <CreateHostelModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={reload}
      />
    </div>
  );
};
