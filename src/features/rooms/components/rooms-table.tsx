"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Home, Eye, Edit2, Trash2, BedDouble, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle2, Users } from "lucide-react";
import { HostelRoom } from "../types";

interface RoomsTableProps {
  rooms: HostelRoom[];
  onDelete?: (id: string) => void;
}

export const RoomsTable: React.FC<RoomsTableProps> = ({ rooms, onDelete }) => {
  const router = useRouter();
  
  // Pagination State mock
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = rooms.length;

  const getStatusBadge = (status?: string) => {
    const s = status?.toLowerCase();
    if (s === "available" || s === "active") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 h-[24px] rounded-full bg-[#DCFCE7] text-[#22C55E] text-[13px] font-[700]">
          <span className="w-1 h-1 rounded-full bg-[#22C55E]"></span>
          <span className="capitalize">Available</span>
        </span>
      );
    }
    if (s === "occupied" || s === "full") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 h-[24px] rounded-full bg-[#EEF2FF] text-[#6D4CFF] text-[13px] font-[700]">
          <span className="w-1 h-1 rounded-full bg-[#6D4CFF]"></span>
          <span className="capitalize">Occupied</span>
        </span>
      );
    }
    if (s === "maintenance") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 h-[24px] rounded-full bg-[#FEF3C7] text-[#F59E0B] text-[13px] font-[700]">
          <span className="w-1 h-1 rounded-full bg-[#F59E0B]"></span>
          <span className="capitalize">Maintenance</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 h-[24px] rounded-full bg-[#F1F5F9] text-[#64748B] text-[13px] font-[700]">
        <span className="w-1 h-1 rounded-full bg-[#94A3B8]"></span>
        <span className="capitalize">{status || "Inactive"}</span>
      </span>
    );
  };

  const formatRent = (rent: string | number) => {
    const numericRent = typeof rent === "string" ? parseFloat(rent) : rent;
    if (isNaN(numericRent)) return "$ 0.00";
    return `$ ${numericRent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="bg-[#FFFFFF] rounded-[12px] shadow-sm border border-[#E2E8F0] overflow-hidden flex flex-col font-inter">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse">
        <thead className="bg-[#FFFFFF] border-b border-[#E2E8F0] sticky top-0 z-10">
          <tr className="h-[44px]">
            <th className="w-[32px] px-2 text-center"></th>
            <th className="px-3 text-left text-[13px] font-[600] text-[#475569] uppercase tracking-wider">Room No</th>
            <th className="px-3 text-left text-[13px] font-[600] text-[#475569] uppercase tracking-wider">Type</th>
            <th className="px-3 text-left text-[13px] font-[600] text-[#475569] uppercase tracking-wider">Hostel Assignment</th>
            <th className="px-3 text-left text-[13px] font-[600] text-[#475569] uppercase tracking-wider">Beds</th>
            <th className="px-3 text-left text-[13px] font-[600] text-[#475569] uppercase tracking-wider">Rent Rate</th>
            <th className="px-3 text-left text-[13px] font-[600] text-[#475569] uppercase tracking-wider">Status</th>
            <th className="px-3 text-right text-[13px] font-[600] text-[#475569] uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody className="bg-[#FFFFFF] divide-y divide-[#E2E8F0]/60">
          {rooms.map((room) => (
            <tr 
              key={room.id}
              className="h-[48px] hover:bg-[#F8FAFC] transition-colors duration-150 cursor-pointer group"
              onClick={() => router.push(`/rooms/${room.id}`)}
            >
              {/* Spacer */}
              <td className="px-2"></td>

              {/* ROOM NO */}
              <td className="px-3 align-middle">
                <div className="flex items-center gap-2">
                  <div className="w-[24px] h-[24px] rounded-[6px] bg-[#6D4CFF]/10 text-[#6D4CFF] flex items-center justify-center shrink-0">
                    <Home size={12} strokeWidth={2.5} />
                  </div>
                  <span className="text-[15px] font-[600] text-[#0F172A] tracking-tight">Room {room.room_no}</span>
                </div>
              </td>

              {/* TYPE */}
              <td className="px-3 align-middle">
                <div className="inline-flex items-center px-2 py-0.5 rounded-[4px] bg-[#F1F5F9] text-[#475569] text-[13px] font-[500] tracking-tight">
                  {room.room_type || "Normal"}
                </div>
              </td>

              {/* HOSTEL ASSIGNMENT */}
              <td className="px-3 align-middle">
                {room.hostel?.hostel_name ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[15px] font-[600] text-[#0F172A]">{room.hostel.hostel_name}</span>
                    <span className="text-[13px] font-[500] text-[#64748B]">
                      — Floor {room.floor?.floor_no || room.idx || 1}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[13px] font-[500] text-[#F59E0B]">
                    <AlertTriangle size={14} />
                    <span>Unassigned</span>
                  </div>
                )}
              </td>

              {/* BEDS */}
              <td className="px-3 align-middle">
                <div className="flex flex-col">
                  <span className="text-[15px] font-[600] text-[#0F172A]">{room.capacity} Beds</span>
                </div>
              </td>

              {/* RENT RATE */}
              <td className="px-3 align-middle">
                <span className="text-[15px] font-[600] text-[#0F172A]">
                  {formatRent(room.rent)}
                </span>
                <span className="text-[13px] font-[500] text-[#64748B] ml-1">/mo</span>
              </td>

              {/* STATUS */}
              <td className="px-3 align-middle">
                {getStatusBadge(room.status)}
              </td>

              {/* ACTIONS */}
              <td className="px-3 align-middle text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ opacity: 1 }}>
                  <button 
                    onClick={() => router.push(`/rooms/${room.id}`)} 
                    className="w-7 h-7 flex items-center justify-center rounded-[6px] text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]/50 transition-colors"
                    title="View details"
                  >
                    <Eye size={14} />
                  </button>
                  <button 
                    onClick={() => router.push(`/rooms/${room.id}/edit`)} 
                    className="w-7 h-7 flex items-center justify-center rounded-[6px] text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]/50 transition-colors"
                    title="Edit details"
                  >
                    <Edit2 size={14} />
                  </button>
                  {onDelete && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(room.id);
                      }} 
                      className="w-7 h-7 flex items-center justify-center rounded-[6px] text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-colors ml-1"
                      title="Delete room"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex justify-between items-center px-4 py-3 border-t border-[#E2E8F0] bg-[#FFFFFF]">
        <span className="text-[14px] font-[500] text-[#64748B]">
          Showing 1 to {totalItems} of {totalItems} room{totalItems !== 1 ? 's' : ''}
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled
            className="w-9 h-9 rounded-[8px] border border-[#E2E8F0] bg-[#FFFFFF] flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="w-9 h-9 rounded-[8px] bg-[#6D4CFF] flex items-center justify-center text-[#FFFFFF] font-[600] text-[14px]">
            1
          </div>
          <button
            disabled
            className="w-9 h-9 rounded-[8px] border border-[#E2E8F0] bg-[#FFFFFF] flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
