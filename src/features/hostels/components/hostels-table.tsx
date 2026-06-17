import React from "react";
import { Edit2, Trash2, Eye, Building2, Phone, User, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { Hostel } from "../types";

interface HostelsTableProps {
  hostels: Hostel[];
  onRowClick: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HostelsTable: React.FC<HostelsTableProps> = ({ hostels, onRowClick, onDelete }) => {
  if (!hostels || hostels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-[#E2E8F0] rounded-[18px] bg-[#FFFFFF] text-center">
        <Building2 className="text-[#64748B] mb-4" size={32} />
        <h3 className="text-[16px] font-[600] text-[#0F172A]">No Hostels Found</h3>
        <p className="text-[14px] text-[#64748B] mt-1 max-w-md">
          There are no hostels matching your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[12px]">
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-[18px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-[#FFFFFF]">
              <tr className="bg-[#F8FAFC] h-[44px] border-b border-[#E2E8F0]">
                <th className="px-[16px] table-header leading-[1.4] align-middle whitespace-nowrap">Hostel Name</th>
                <th className="px-[16px] table-header leading-[1.4] align-middle whitespace-nowrap">Zone</th>
                <th className="px-[16px] table-header leading-[1.4] align-middle whitespace-nowrap text-center">Floors</th>
                <th className="px-[16px] table-header leading-[1.4] align-middle whitespace-nowrap">Manager</th>
                <th className="px-[16px] table-header leading-[1.4] align-middle whitespace-nowrap">Contact</th>
                <th className="px-[16px] table-header leading-[1.4] align-middle whitespace-nowrap">Status</th>
                <th className="px-[16px] table-header leading-[1.4] align-middle whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {hostels.map((hostel) => (
                <tr 
                  key={hostel.id} 
                  className="h-[56px] min-h-[56px] hover:bg-[#F8FAFC] transition-all duration-200 ease-in-out cursor-pointer group"
                  onClick={() => onRowClick(hostel.id)}
                >
                  <td className="px-[16px] align-middle">
                    <div className="flex items-center gap-[16px]">
                      <div className="w-[44px] h-[44px] rounded-[10px] bg-[#F3F0FF] text-[#6D4AFF] flex items-center justify-center shrink-0">
                        <Building2 size={20} />
                      </div>
                      <div className="flex flex-col gap-[4px]">
                        <span className="text-[15px] font-[500] text-[#0F172A] leading-none">
                          {hostel.hostel_name}
                        </span>
                        <span className="text-[13px] font-[500] bg-[#F4F1FF] text-[#5B3DF5] uppercase px-[6px] py-[2px] rounded-[4px] w-fit leading-none">
                          {hostel.hostel_id || `HSTL-${hostel.id.substring(0, 4)}`}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-[16px] align-middle">
                    <span className="text-[15px] font-[500] text-[#0F172A]">
                      {hostel.zone || "Zone 1"}
                    </span>
                  </td>
                  
                  <td className="px-[16px] align-middle text-center">
                    <span className="text-[15px] font-[500] text-[#0F172A]">
                      {hostel.number_of_floors || 4}
                    </span>
                  </td>

                  <td className="px-[16px] align-middle">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-[6px] text-[#0F172A] text-[15px] font-[600]">
                        <User size={14} className="text-[#64748B]" />
                        Nino
                      </div>
                      <span className="text-[13px] text-[#64748B] ml-[20px] font-[500]">Representative</span>
                    </div>
                  </td>

                  <td className="px-[16px] align-middle">
                    <div className="flex items-center gap-[6px] text-[#64748B] text-[15px] font-[500]">
                      <Phone size={14} />
                      +971501234567
                    </div>
                  </td>
                  
                  <td className="px-[16px] align-middle">
                    {hostel.status?.toLowerCase() === 'active' ? (
                      <span className="inline-flex items-center gap-[6px] px-[10px] py-[4px] bg-[#DCFCE7] text-[#16A34A] rounded-[100px] text-[13px] font-[700]">
                        <div className="w-[6px] h-[6px] rounded-full bg-[#16A34A]"></div>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-[6px] px-[10px] py-[4px] bg-[#FEE2E2] text-[#EF4444] rounded-[100px] text-[13px] font-[700]">
                        <div className="w-[6px] h-[6px] rounded-full bg-[#EF4444]"></div>
                        Inactive
                      </span>
                    )}
                  </td>
                  
                  <td className="px-[16px] align-middle text-right">
                    <div className="flex items-center justify-end gap-[8px]" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="w-[32px] h-[32px] bg-[#FFFFFF] border border-[#E2E8F0] rounded-[10px] flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] transition-all duration-200 ease-in-out"
                        onClick={() => onRowClick(hostel.id)}
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        className="w-[32px] h-[32px] bg-[#FFFFFF] border border-[#E2E8F0] rounded-[10px] flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] transition-all duration-200 ease-in-out"
                        onClick={() => onRowClick(hostel.id)}
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        className="w-[32px] h-[32px] bg-[#FFFFFF] border border-[#E2E8F0] rounded-[10px] flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] transition-all duration-200 ease-in-out"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(hostel.id);
                        }}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Container */}
      <div className="flex justify-between items-center px-[8px]">
        <div className="text-[14px] text-[#64748B]">
          Showing 1 to {hostels.length} of {hostels.length} results
        </div>
        <div className="flex items-center gap-[6px]">
          <button className="w-[34px] h-[34px] rounded-[8px] border border-[#E2E8F0] bg-[#FFFFFF] text-[#64748B] flex items-center justify-center hover:bg-[#F8FAFC] disabled:opacity-50">
            <ChevronLeft size={16} />
          </button>
          <button className="w-[34px] h-[34px] rounded-[8px] bg-[#6D4AFF] text-white font-[600] text-[14px] flex items-center justify-center">
            1
          </button>
          <button className="w-[34px] h-[34px] rounded-[8px] border border-[#E2E8F0] bg-[#FFFFFF] text-[#64748B] flex items-center justify-center hover:bg-[#F8FAFC] disabled:opacity-50">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
