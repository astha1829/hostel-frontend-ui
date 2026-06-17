"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Upload, Plus, Users, CheckCircle2, XCircle, Building2, Bed, DollarSign, Search, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { useRoomAllotments } from "../hooks/use-room-allotments";
import { RoomAllotmentsTable } from "./room-allotments-table";

export const RoomAllotmentsListPage: React.FC = () => {
  const router = useRouter();

  const {
    allotments,
    hostels,
    students,
    isLoading,
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
  } = useRoomAllotments();

  return (
    <div className="container-page flex flex-col min-h-screen bg-[#F8F9FC] font-inter">
      
      {/* HEADER */}
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col gap-[4px]">
          <h1 className="text-[48px] font-[700] text-[#111827] leading-tight tracking-tight">
            Room Allotments
          </h1>
          <p className="page-subtitle">
            Allocate rooms to student contracts, manage roommate parameters, and perform transfer settlements.
          </p>
        </div>
        <div className="flex items-center gap-[12px]">
          <button className="h-[44px] px-[16px] rounded-[10px] bg-[#FFFFFF] border border-[#EAECEF] text-[#111827] font-[600] text-[14px] shadow-sm flex items-center justify-center gap-[8px] hover:bg-[#F8FAFC] transition-all">
            <Upload size={16} strokeWidth={2.5} />
            Export
          </button>
          <button 
            onClick={() => router.push("/room-allotments/new")}
            className="h-[44px] px-[16px] rounded-[10px] bg-[#5B3DF5] text-[#FFFFFF] font-[600] text-[14px] shadow-[0_4px_12px_rgba(91,61,245,0.15)] flex items-center justify-center gap-[8px] hover:bg-[#4a31d9] transition-all"
          >
            <Plus size={16} strokeWidth={2.5} />
            Add Allotment
          </button>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="w-full h-[100px] bg-[#FFFFFF] rounded-[16px] border border-[#EAECEF] shadow-sm flex items-center px-[32px]">
        
        {/* Stat 1 */}
        <div className="flex-1 flex items-center gap-[16px]">
          <div className="w-[48px] h-full rounded-full bg-[#F4F1FF] text-[#5B3DF5] flex items-center justify-center shrink-0">
            <Users size={20} strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-[500] text-[#64748B] mb-[2px]">Total Allocations</span>
            <span className="text-[22px] font-[700] text-[#111827] leading-none">{total || 2}</span>
          </div>
        </div>

        <div className="w-[1px] h-[50px] bg-[#EAECEF] mx-[24px]"></div>

        {/* Stat 2 */}
        <div className="flex-1 flex items-center gap-[16px]">
          <div className="w-[48px] h-full rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-[500] text-[#64748B] mb-[2px]">Active</span>
            <span className="text-[22px] font-[700] text-[#111827] leading-none">1</span>
          </div>
        </div>

        <div className="w-[1px] h-[50px] bg-[#EAECEF] mx-[24px]"></div>

        {/* Stat 3 */}
        <div className="flex-1 flex items-center gap-[16px]">
          <div className="w-[48px] h-full rounded-full bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center shrink-0">
            <XCircle size={20} strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-[500] text-[#64748B] mb-[2px]">Inactive</span>
            <span className="text-[22px] font-[700] text-[#111827] leading-none">1</span>
          </div>
        </div>

        <div className="w-[1px] h-[50px] bg-[#EAECEF] mx-[24px]"></div>

        {/* Stat 4 */}
        <div className="flex-[1.5] flex items-center gap-[16px]">
          <div className="w-[48px] h-full rounded-full bg-[#E0E7FF] text-[#4F46E5] flex items-center justify-center shrink-0">
            <Building2 size={20} strokeWidth={2} />
          </div>
          <div className="flex flex-col w-full pr-[16px]">
            <span className="text-[13px] font-[500] text-[#111827] mb-[2px]">Occupancy</span>
            <span className="text-[22px] font-[700] text-[#111827] leading-none mb-[8px]">50%</span>
            <div className="w-full h-[4px] rounded-full bg-[#F1F5F9] overflow-hidden">
              <div className="h-full bg-[#5B3DF5] rounded-full w-[50%]"></div>
            </div>
          </div>
        </div>

        <div className="w-[1px] h-[50px] bg-[#EAECEF] mx-[24px]"></div>

        {/* Stat 5 */}
        <div className="flex-1 flex items-center gap-[16px]">
          <div className="w-[48px] h-full rounded-full bg-[#FFEDD5] text-[#F97316] flex items-center justify-center shrink-0">
            <Bed size={20} strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-[500] text-[#111827] mb-[2px]">Available Beds</span>
            <span className="text-[22px] font-[700] text-[#111827] leading-none">2</span>
          </div>
        </div>

        <div className="w-[1px] h-[50px] bg-[#EAECEF] mx-[24px]"></div>

        {/* Stat 6 */}
        <div className="flex-1 flex items-center gap-[16px]">
          <div className="w-[48px] h-full rounded-full bg-[#F4F1FF] text-[#5B3DF5] flex items-center justify-center shrink-0">
            <DollarSign size={20} strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-[500] text-[#111827] mb-[2px]">Total Monthly Rent</span>
            <span className="text-[22px] font-[700] text-[#111827] leading-none">$300.00</span>
          </div>
        </div>

      </div>

      {/* FILTER BAR */}
      <div className="w-full h-[84px] bg-[#FFFFFF] rounded-[16px] border border-[#EAECEF] shadow-sm px-[20px] flex items-center gap-[16px]">
        <div className="relative flex-[2]">
          <Search size={16} className="absolute left-[16px] top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search student, room, contract..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[44px] pl-[44px] pr-[16px] rounded-[10px] border border-[#EAECEF] bg-[#FFFFFF] body-text-primary placeholder-[#94A3B8] focus:outline-none focus:border-[#5B3DF5]"
          />
        </div>
        
        <div className="relative flex-1">
          <select 
            value={selectedHostelId}
            onChange={(e) => setSelectedHostelId(e.target.value)}
            className="select-standard w-full h-[44px] pl-[14px] pr-[36px] rounded-[10px] border border-[#EAECEF] bg-[#FFFFFF] appearance-none focus:outline-none focus:border-[#5B3DF5] truncate max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
          >
            <option value="">All Hostels</option>
            {hostels.map(h => <option key={h.id} value={h.id}>{h.hostel_name}</option>)}
          </select>
          <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>

        <div className="relative flex-1">
          <select 
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="select-standard w-full h-[44px] pl-[14px] pr-[36px] rounded-[10px] border border-[#EAECEF] bg-[#FFFFFF] appearance-none focus:outline-none focus:border-[#5B3DF5] truncate max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
          >
            <option value="">All Students</option>
            {students.map(s => <option key={s.id} value={s.id}>{`${s.student_name} ${s.last_name || ""}`.trim()}</option>)}
          </select>
          <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>

        <div className="relative flex-1">
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="select-standard w-full h-[44px] pl-[14px] pr-[36px] rounded-[10px] border border-[#EAECEF] bg-[#FFFFFF] appearance-none focus:outline-none focus:border-[#5B3DF5] truncate max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>
          <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>

        <button 
          onClick={() => { setSearch(""); setSelectedHostelId(""); setSelectedStudentId(""); setSelectedStatus(""); }}
          className="h-[44px] px-[20px] rounded-[10px] bg-[#FFFFFF] border border-[#EAECEF] text-[#111827] font-[600] text-[14px] shadow-sm flex items-center justify-center gap-[8px] hover:bg-[#F8FAFC] transition-all shrink-0"
        >
          <RotateCcw size={16} strokeWidth={2.5} />
          Reset
        </button>
      </div>

      {/* TABLE */}
      <div className="w-full bg-[#FFFFFF] rounded-[16px] border border-[#EAECEF] shadow-sm overflow-hidden flex flex-col">
        {!isLoading && (
          <RoomAllotmentsTable 
            allotments={allotments} 
            sortBy={sortBy} 
            sortOrder={sortOrder} 
            onSort={handleSort} 
            onDelete={handleDelete} 
          />
        )}
        
        {/* PAGINATION */}
        <div className="w-full h-[68px] px-[24px] border-t border-[#EAECEF] flex items-center justify-between">
          <span className="page-subtitle">
            Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, total)} of {total} records
          </span>
          <div className="flex items-center gap-[8px]">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-[36px] h-[36px] rounded-[8px] border border-[#EAECEF] flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            <button className="w-[36px] h-[36px] rounded-[8px] bg-[#5B3DF5] text-[#FFFFFF] font-[600] text-[14px] flex items-center justify-center">
              {currentPage}
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-[36px] h-[36px] rounded-[8px] border border-[#EAECEF] flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
