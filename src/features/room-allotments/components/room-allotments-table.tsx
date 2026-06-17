"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Trash2, Edit2, Eye, Building2, MapPin, Bed, FileText, Calendar, Layers } from "lucide-react";
import { RoomAllotment } from "../types";
import { ActionButtons } from "@/components/ui/action-buttons";

interface RoomAllotmentsTableProps {
  allotments: RoomAllotment[];
  sortBy: string;
  sortOrder: "ASC" | "DESC";
  onSort: (field: string) => void;
  onDelete: (id: string) => void;
}

export const RoomAllotmentsTable: React.FC<RoomAllotmentsTableProps> = ({
  allotments,
  sortBy,
  sortOrder,
  onSort,
  onDelete,
}) => {
  const router = useRouter();

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="sticky top-0 z-10 bg-[#FFFFFF]">
          <tr className="h-[44px] border-b border-[#EAECEF] bg-[#FFFFFF]">
            <th className="px-[24px] table-header leading-[1.4] align-middle whitespace-nowrap">Student</th>
            <th className="px-[16px] table-header leading-[1.4] align-middle whitespace-nowrap">Hostel & Location</th>
            <th className="px-[16px] table-header leading-[1.4] align-middle whitespace-nowrap">Room / Bed</th>
            <th className="px-[16px] table-header leading-[1.4] align-middle whitespace-nowrap">Hostel Contract</th>
            <th className="px-[16px] table-header leading-[1.4] align-middle whitespace-nowrap">Check-In / Check-Out</th>
            <th className="px-[16px] table-header leading-[1.4] align-middle whitespace-nowrap">Monthly Rent</th>
            <th className="px-[16px] table-header leading-[1.4] align-middle whitespace-nowrap">Status</th>
            <th className="px-[24px] table-header leading-[1.4] align-middle whitespace-nowrap text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {allotments.length === 0 ? (
            <tr>
              <td colSpan={8} className="h-[140px] text-center text-[#64748B] text-[14px]">
                No active room allotments match your search filters.
              </td>
            </tr>
          ) : (
            allotments.map((allotment) => {
              const [studentName, studentPassId] = allotment.student_name ? allotment.student_name.split("-") : ["Unlinked Student", "AF314338"];
              const passport = studentPassId || "AF314338";
              
              const studentInitials = studentName.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() || "ST";

              const isActive = allotment.status?.toLowerCase() !== "inactive";

              return (
                <tr key={allotment.id} className="h-[140px] border-b border-[#EAECEF] bg-[#FFFFFF] hover:bg-[#F8FAFC] transition-all duration-200 ease-in-out cursor-pointer group" onClick={() => router.push(`/room-allotments/${allotment.id}`)}>
                  
                  {/* STUDENT */}
                  <td className="px-[24px] align-middle">
                    <div className="flex items-center gap-[16px]">
                      <div className="w-[48px] h-[44px] rounded-full bg-[#F4F1FF] text-[#5B3DF5] flex items-center justify-center font-[700] text-[16px] shrink-0">
                        {studentInitials}
                      </div>
                      <div className="flex flex-col gap-[4px]">
                        <span className="text-[15px] font-[500] text-[#0F172A] leading-[1.5] uppercase">{studentName}</span>
                        <span className="text-[14px] font-[400] text-[#64748B] leading-[1.5]">Passport: {passport}</span>
                        <div className="flex items-center gap-[6px] mt-[2px]">
                          <span className="text-[14px]">🇮🇳</span>
                          <span className="text-[14px] font-[400] text-[#64748B]">India</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* HOSTEL & LOCATION */}
                  <td className="px-[16px] align-middle">
                    <div className="flex gap-[12px]">
                      <div className="w-[32px] h-[32px] rounded-[8px] bg-[#F1F5F9] text-[#64748B] flex items-center justify-center shrink-0 mt-[2px]">
                        <Building2 size={16} />
                      </div>
                      <div className="flex flex-col gap-[4px]">
                        <span className="text-[15px] font-[500] text-[#0F172A] leading-[1.5]">{allotment.hostel_name || "Atmia Alphabet Girl Hostel"}</span>
                        <span className="text-[14px] font-[400] text-[#64748B] leading-[1.5]">{allotment.college || "SEU Georgian National University"}</span>
                        <div className="flex items-center gap-[6px] mt-[2px] text-[#64748B]">
                          <MapPin size={14} />
                          <span className="text-[13px] font-[500]">Block A</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* ROOM / BED */}
                  <td className="px-[16px] align-middle">
                    <div className="flex flex-col gap-[8px] items-start">
                      <div className="px-[8px] py-[4px] rounded-[6px] bg-[#F4F1FF] text-[#5B3DF5] text-[13px] font-[700]">
                        Room {allotment.room_no || "105"}
                      </div>
                      <div className="flex items-center gap-[8px] text-[#64748B]">
                        <Bed size={14} />
                        <span className="text-[13px] font-[500] text-[#0F172A]">Bed A</span>
                      </div>
                      <div className="flex items-center gap-[8px] text-[#64748B]">
                        <Layers size={14} />
                        <span className="text-[13px] font-[500] text-[#0F172A]">Floor {allotment.floor_no || "1"}</span>
                      </div>
                      <div className="px-[8px] py-[2px] rounded-[4px] bg-[#F1F5F9] text-[#64748B] text-[12px] font-[500] mt-[2px]">
                        Capacity: 4
                      </div>
                    </div>
                  </td>

                  {/* HOSTEL CONTRACT */}
                  <td className="px-[16px] align-middle">
                    <div className="flex flex-col gap-[8px]">
                      <div className="flex items-center gap-[6px] text-[#5B3DF5]">
                        <FileText size={16} />
                        <span className="text-[15px] font-[500] text-[#0F172A] leading-[1.5] underline cursor-pointer hover:text-[#4a31d9]">
                          {allotment.hostel_contract_name || "102"}
                        </span>
                      </div>
                      <span className="text-[14px] font-[400] text-[#64748B] leading-[1.5]">Regular Contract</span>
                      <span className="text-[14px] font-[400] text-[#64748B] leading-[1.5]">12 Months</span>
                    </div>
                  </td>

                  {/* CHECK-IN / CHECK-OUT */}
                  <td className="px-[16px] align-middle">
                    <div className="flex flex-col gap-[12px]">
                      <div className="flex items-start gap-[8px]">
                        <Calendar size={16} className="text-[#64748B] mt-[2px]" />
                        <div className="flex flex-col">
                          <span className="text-[15px] font-[500] text-[#0F172A] leading-[1.5]">Jun 13, 2026</span>
                          <span className="text-[14px] font-[400] text-[#64748B] leading-[1.5]">Check-in</span>
                        </div>
                      </div>
                      <div className="w-full h-[1px] bg-[#EAECEF]"></div>
                      <div className="flex items-start gap-[8px]">
                        <Calendar size={16} className="text-[#64748B] mt-[2px]" />
                        <div className="flex flex-col">
                          <span className="text-[15px] font-[500] text-[#0F172A] leading-[1.5]">Jun 13, 2027</span>
                          <span className="text-[14px] font-[400] text-[#64748B] leading-[1.5]">Check-out</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* MONTHLY RENT */}
                  <td className="px-[16px] align-middle">
                    <div className="flex flex-col gap-[4px]">
                      <span className="text-[15px] font-[500] text-[#0F172A] leading-[1.5]">
                        ${Number(allotment.rent || 140).toFixed(2)}
                      </span>
                      <span className="text-[14px] font-[400] text-[#64748B] leading-[1.5]">
                        Monthly Rent
                      </span>
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="px-[16px] align-middle">
                    <div className={`inline-flex items-center gap-[6px] px-[12px] py-[4px] rounded-full text-[13px] font-[700] ${isActive ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
                      <div className={`w-[6px] h-[6px] rounded-full ${isActive ? 'bg-[#16A34A]' : 'bg-[#64748B]'}`}></div>
                      {isActive ? "Active" : "Inactive"}
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-[24px] align-middle" onClick={(e) => e.stopPropagation()}>
                    <ActionButtons 
                      onView={() => router.push(`/room-allotments/${allotment.id}`)}
                      onEdit={() => router.push(`/room-allotments/${allotment.id}/edit`)}
                      onDelete={() => onDelete(allotment.id)}
                      deleteConfirmMessage="Are you sure you want to delete this room allotment?"
                    />
                  </td>

                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
