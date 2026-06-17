"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Calendar, FileText } from "lucide-react";
import { ActionButtons } from "@/components/ui/action-buttons";
import { HostelContract } from "../types";

interface HostelContractsTableProps {
  contracts: HostelContract[];
  sortBy: string;
  sortOrder: "ASC" | "DESC";
  onSort: (field: string) => void;
  onDelete: (id: string) => void;
}

export const HostelContractsTable: React.FC<HostelContractsTableProps> = ({
  contracts,
  sortBy,
  sortOrder,
  onSort,
  onDelete,
}) => {
  const router = useRouter();

  if (!contracts || contracts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16">
        <h3 className="text-[#111827] font-[700] text-[18px]">No Contracts Found</h3>
        <p className="text-[#64748B] font-[500] mt-1 text-[14px]">No active hostel contracts match your search filters.</p>
      </div>
    );
  }

  const getStatusBadge = (status?: string) => {
    const s = status?.toLowerCase();
    if (s === "active") {
      return (
        <div className="inline-flex items-center justify-center h-[26px] px-[12px] rounded-full bg-[#DCFCE7] text-[#16A34A] text-[13px] font-[700]">
          Active
        </div>
      );
    }
    if (s === "expired") {
      return (
        <div className="inline-flex items-center justify-center h-[26px] px-[12px] rounded-full bg-[#FEE2E2] text-[#EF4444] text-[13px] font-[700]">
          Expired
        </div>
      );
    }
    return (
      <div className="inline-flex items-center justify-center h-[26px] px-[12px] rounded-full bg-[#F1F5F9] text-[#64748B] text-[13px] font-[700] capitalize">
        {status || "Draft"}
      </div>
    );
  };

  const getConfirmBadge = (confirmStatus?: string) => {
    const s = confirmStatus?.toLowerCase();
    if (s === "confirmed") {
      return (
        <div className="inline-flex items-center justify-center h-[26px] px-[12px] rounded-full bg-[#DCFCE7] text-[#16A34A] text-[13px] font-[700]">
          Confirmed
        </div>
      );
    }
    if (s === "pending") {
      return (
        <div className="inline-flex items-center justify-center h-[26px] px-[12px] rounded-full bg-[#FFEDD5] text-[#EA580C] text-[13px] font-[700]">
          Pending Approval
        </div>
      );
    }
    return (
      <div className="inline-flex items-center justify-center h-[26px] px-[12px] rounded-full bg-[#F1F5F9] text-[#64748B] text-[13px] font-[700] capitalize">
        {confirmStatus || "Draft"}
      </div>
    );
  };

  const formatPrice = (price?: number | string) => {
    if (price === undefined || price === null) return "—";
    return `$${Number(price).toFixed(2)}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const calculateDays = (start?: string, end?: string) => {
    if (!start || !end) return "N/A";
    const diffTime = Math.abs(new Date(end).getTime() - new Date(start).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} Day${diffDays !== 1 ? 's' : ''}`;
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[1200px]">
        <thead className="sticky top-0 z-10 bg-[#FFFFFF]">
          <tr className="bg-[#FFFFFF] border-b border-[#EAECEF]">
            <th className="h-[44px] px-[20px] table-header leading-[1.4] align-middle whitespace-nowrap">CONTRACT NO</th>
            <th className="h-[44px] px-[20px] table-header leading-[1.4] align-middle whitespace-nowrap">TYPE</th>
            <th className="h-[44px] px-[20px] table-header leading-[1.4] align-middle whitespace-nowrap">STUDENT</th>
            <th className="h-[44px] px-[20px] table-header leading-[1.4] align-middle whitespace-nowrap">HOSTEL & ALLOTMENT</th>
            <th className="h-[44px] px-[20px] table-header leading-[1.4] align-middle whitespace-nowrap">STATUS</th>
            <th className="h-[44px] px-[20px] table-header leading-[1.4] align-middle whitespace-nowrap">APPROVAL</th>
            <th className="h-[44px] px-[20px] table-header leading-[1.4] align-middle whitespace-nowrap">DURATION</th>
            <th className="h-[44px] px-[20px] table-header leading-[1.4] align-middle whitespace-nowrap">AMOUNT</th>
            <th className="h-[44px] px-[20px] table-header leading-[1.4] align-middle whitespace-nowrap text-right">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract, index) => {
            const [studentFullName, studentRegId] = contract.student_name
              ? contract.student_name.split("-")
              : ["Unlinked Student", ""];

            return (
              <tr 
                key={contract.id} 
                className={`group hover:bg-[#F8FAFC] transition-all duration-200 ease-in-out h-[56px] min-h-[56px] ${index !== contracts.length - 1 ? 'border-b border-[#EAECEF]' : ''}`}
              >
                <td className="px-[20px] align-middle">
                  <div 
                    className="flex items-center gap-[8px] cursor-pointer group-hover:text-[#4a31d9]"
                    onClick={() => router.push(`/hostel-contracts/${contract.id}`)}
                  >
                    <FileText size={16} className="text-[#5B3DF5]" strokeWidth={2} />
                    <span className="text-[15px] font-[500] text-[#0F172A] hover:underline underline-offset-2">
                      {contract.contract_no}
                    </span>
                  </div>
                </td>

                <td className="px-[20px] align-middle">
                  <span className="text-[15px] font-[500] text-[#0F172A] leading-[1.5]">
                    {contract.contract_type}
                  </span>
                </td>

                <td className="px-[20px] align-middle">
                  <div className="flex flex-col gap-[2px]">
                    <span className="text-[15px] font-[500] text-[#0F172A] tracking-tight">
                      {studentFullName}
                    </span>
                    <span className="text-[14px] font-[400] text-[#64748B]">
                      Reg: {studentRegId || contract.student_id?.substring(0, 10).toUpperCase()}
                    </span>
                  </div>
                </td>

                <td className="px-[20px] align-middle">
                  <div className="flex flex-col gap-[4px] items-start">
                    <span className="text-[15px] font-[500] text-[#0F172A]">
                      {contract.hostel_name || "Unassigned"}
                    </span>
                    {contract.sharing && (
                      <div className="inline-flex items-center justify-center h-[22px] px-[8px] rounded-full bg-[#F1F5F9] text-[#475569] text-[13px] font-[700]">
                        {contract.sharing} Sharing
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-[20px] align-middle">
                  {getStatusBadge(contract.status)}
                </td>

                <td className="px-[20px] align-middle">
                  {getConfirmBadge(contract.confirm_status)}
                </td>

                <td className="px-[20px] align-middle">
                  <div className="flex flex-col gap-[4px]">
                    <div className="flex items-center gap-[6px] text-[#0F172A] text-[15px] font-[500] leading-[1.5]">
                      <Calendar size={14} className="text-[#64748B]" />
                      {calculateDays(contract.contract_start_date, contract.contract_end_date)}
                    </div>
                    <span className="text-[14px] font-[400] text-[#64748B] ml-[20px]">
                      {formatDate(contract.contract_start_date)} - {formatDate(contract.contract_end_date)}
                    </span>
                  </div>
                </td>

                <td className="px-[20px] align-middle">
                  <span className="text-[15px] font-[500] text-[#0F172A]">
                    {formatPrice(contract.contract_price)}
                  </span>
                </td>

                <td className="px-[20px] align-middle" onClick={(e) => e.stopPropagation()}>
                  <ActionButtons
                    align="right"
                    onView={() => router.push(`/hostel-contracts/${contract.id}`)}
                    onEdit={() => router.push(`/hostel-contracts/${contract.id}/edit`)}
                    onDelete={() => onDelete(contract.id)}
                    deleteConfirmMessage="Are you sure you want to delete this hostel contract?"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
