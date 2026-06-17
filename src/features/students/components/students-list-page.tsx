"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, ChevronLeft, ChevronRight, Users, ShieldCheck, Clock, Globe, RefreshCw } from "lucide-react";
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

  // Compute metrics from data
  const totalStudentsCount = total || students.length;
  const kycVerifiedCount = students.filter(s => s.kyc_verified).length;
  const pendingKycCount = students.filter(s => !s.kyc_verified).length;
  const internationalCount = students.filter(s => s.student_type?.toLowerCase() === 'international').length;

  return (
    <div className="container-page flex flex-col min-h-screen bg-[#F8F9FC] font-inter">
      
      {/* Header Section */}
      <div className="flex justify-between items-start gap-[16px] mb-[28px] w-full">
        <div className="flex flex-col">
          <h1 className="page-title">
            Students Directory
          </h1>
          <p className="page-subtitle">
            Manage resident student profiles, contact credentials, identity verifications, and KYC status.
          </p>
        </div>
        <button 
          onClick={() => router.push("/students/new")}
          className="btn-top-action"
        >
          <Plus size={16} strokeWidth={2.5} />
          Add Student
        </button>
      </div>

      {/* Metrics Section */}
      {!isLoading && (
        <div className="stats-card-global flex items-center hover:shadow-md hover:-translate-y-[2px] transition-all duration-200 ease-in-out w-full mt-[12px] h-[82px] px-[22px] py-[18px] bg-white rounded-[18px] border border-[#EAECEF] shadow-sm">
          {/* Metric 1 */}
          <div className="flex-1 flex items-center gap-[16px]">
            <div className="w-[44px] h-[44px] rounded-full bg-[#F4F1FF] text-[#5B3DF5] flex items-center justify-center shrink-0">
              <Users size={22} strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-[500] text-[#64748B] leading-tight">Total Students</span>
              <span className="text-[34px] font-[700] text-[#111827] leading-none mt-1">{totalStudentsCount}</span>
            </div>
          </div>
          
          <div className="w-[1px] h-full bg-[#EEF2F7]"></div>

          {/* Metric 2 */}
          <div className="flex-1 flex items-center gap-[16px] pl-[24px]">
            <div className="w-[44px] h-[44px] rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
              <ShieldCheck size={22} strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-[500] text-[#64748B] leading-tight">KYC Verified</span>
              <span className="text-[34px] font-[700] text-[#111827] leading-none mt-1">{kycVerifiedCount}</span>
            </div>
          </div>

          <div className="w-[1px] h-full bg-[#EEF2F7]"></div>

          {/* Metric 3 */}
          <div className="flex-1 flex items-center gap-[16px] pl-[24px]">
            <div className="w-[44px] h-[44px] rounded-full bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center shrink-0">
              <Clock size={22} strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-[500] text-[#64748B] leading-tight">Pending KYC</span>
              <span className="text-[34px] font-[700] text-[#111827] leading-none mt-1">{pendingKycCount}</span>
            </div>
          </div>

          <div className="w-[1px] h-full bg-[#EEF2F7]"></div>

          {/* Metric 4 */}
          <div className="flex-1 flex items-center gap-[16px] pl-[24px]">
            <div className="w-[44px] h-[44px] rounded-full bg-[#E0E7FF] text-[#4F46E5] flex items-center justify-center shrink-0">
              <Globe size={22} strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-[500] text-[#64748B] leading-tight">International</span>
              <span className="text-[34px] font-[700] text-[#111827] leading-none mt-1">{internationalCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter Section */}
      <div className="w-full h-[76px] bg-[#FFFFFF] rounded-[18px] border border-[#EEF2F7] flex items-center px-[16px] gap-[12px] shadow-sm mt-[20px] flex-nowrap overflow-x-auto lg:overflow-visible">
        <div className="relative min-w-[150px] flex-1 shrink">
          <Search size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search name, passport, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[44px] pl-[44px] pr-[12px] rounded-[10px] border border-[#EAECEF] text-[14px] font-[500] text-[#0F172A] focus:outline-none focus:border-[#5B3DF5] placeholder:text-[#94A3B8] placeholder:font-[400]"
          />
        </div>

        <div className="relative min-w-[160px] shrink-0">
          <select
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
            className="select-standard w-full h-[44px] pl-[14px] pr-[36px] rounded-[10px] border border-[#EAECEF] text-[15px] font-medium text-gray-900 bg-white appearance-none focus:outline-none focus:border-[#5B3DF5] cursor-pointer truncate max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
          >
            <option value="">All Colleges</option>
            <option value="SEU Georgian National University">SEU Georgian National University</option>
            <option value="Ilia State University">Ilia State University</option>
          </select>
          <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>

        <div className="relative min-w-[180px] shrink-0">
          <select
            value={selectedNationality}
            onChange={(e) => setSelectedNationality(e.target.value)}
            className="select-standard w-full h-[44px] pl-[14px] pr-[36px] rounded-[10px] border border-[#EAECEF] text-[15px] font-medium text-gray-900 bg-white appearance-none focus:outline-none focus:border-[#5B3DF5] cursor-pointer truncate max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
          >
            <option value="">All Nationalities</option>
            <option value="India">India</option>
            <option value="International">International</option>
          </select>
          <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>

        <div className="relative min-w-[170px] shrink-0">
          <select
            value={selectedStudentType}
            onChange={(e) => setSelectedStudentType(e.target.value)}
            className="select-standard w-full h-[44px] pl-[14px] pr-[36px] rounded-[10px] border border-[#EAECEF] text-[15px] font-medium text-gray-900 bg-white appearance-none focus:outline-none focus:border-[#5B3DF5] cursor-pointer truncate max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
          >
            <option value="">All Student Types</option>
            <option value="Regular">Regular</option>
            <option value="International">International</option>
            <option value="Scholar">Scholar</option>
          </select>
          <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>

        <div className="relative min-w-[170px] shrink-0">
          <select
            value={selectedKycVerified}
            onChange={(e) => setSelectedKycVerified(e.target.value)}
            className="select-standard w-full h-[44px] pl-[14px] pr-[36px] rounded-[10px] border border-[#EAECEF] text-[15px] font-medium text-gray-900 bg-white appearance-none focus:outline-none focus:border-[#5B3DF5] cursor-pointer truncate max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
          >
            <option value="all">All KYC Statuses</option>
            <option value="true">KYC Verified Only</option>
            <option value="false">Pending KYC Only</option>
          </select>
          <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>

        <button 
          onClick={() => {
            setSearch("");
            setSelectedCollege("");
            setSelectedNationality("");
            setSelectedStudentType("");
            setSelectedKycVerified("all");
          }}
          className="h-[44px] px-[16px] rounded-[10px] border border-[#EAECEF] bg-[#FFFFFF] text-[#0F172A] font-[600] text-[13px] flex items-center justify-center gap-2 hover:bg-[#F8FAFC] transition-colors shrink-0"
        >
          <RefreshCw size={14} />
          Reset Filters
        </button>

        <button className="btn-top-action shrink-0 h-[44px]">
          <Search size={14} strokeWidth={2.5} className="mr-2" />
          Search
        </button>
      </div>

      {/* Main Directory List */}
      {error ? (
        <ErrorState
          title="Directory Retrieval Failed"
          message={error}
          onRetry={reload}
          isLoading={isLoading}
        />
      ) : isLoading ? (
        <div className="bg-white rounded-[14px] p-6 border border-[#EEF2F7]">
          <TableSkeleton rows={6} />
        </div>
      ) : (
        <div className="table-wrapper-global flex flex-col w-full mt-[22px]">
          <StudentsTable students={students} onDelete={handleDelete} />

          {/* Pagination Footer */}
          <div className="h-[72px] flex justify-between items-center px-[24px] border-t border-[#EEF2F7] bg-white">
            <span className="text-[13px] text-[#64748B] font-[500]">
              Showing 1 to {students.length} of {total} student
            </span>
            
            <div className="flex gap-[8px] items-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-[36px] h-[36px] rounded-[8px] bg-white border border-[#EAECEF] flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} strokeWidth={2.5} />
              </button>
              
              <div className="btn-top-action">
                {currentPage}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-[36px] h-[36px] rounded-[8px] bg-white border border-[#EAECEF] flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
