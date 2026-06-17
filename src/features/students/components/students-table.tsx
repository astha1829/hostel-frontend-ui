"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Trash2, Mail, Edit3, Eye, MoreVertical, Phone, CheckCircle2 } from "lucide-react";
import { Student } from "../types";
import { ActionButtons } from "@/components/ui/action-buttons";

interface StudentsTableProps {
  students: Student[];
  onDelete: (id: string) => void;
}

export const StudentsTable: React.FC<StudentsTableProps> = ({ students, onDelete }) => {
  const router = useRouter();

  if (!students || students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16">
        <h3 className="text-[#0F172A] font-[700] text-lg">No Students Found</h3>
        <p className="text-[#64748B] font-[500] mt-1">No student profiles match your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="sticky top-0 z-10 bg-[#FFFFFF]">
          <tr className="bg-[#FAFBFC] border-b border-[#EEF2F7] h-[44px]">
            <th className="px-[24px] table-header leading-[1.4] align-middle whitespace-nowrap">STUDENT</th>
            <th className="px-[24px] table-header leading-[1.4] align-middle whitespace-nowrap">REGISTRATION ID</th>
            <th className="px-[24px] table-header leading-[1.4] align-middle whitespace-nowrap">COLLEGE & COURSE</th>
            <th className="px-[24px] table-header leading-[1.4] align-middle whitespace-nowrap">NATIONALITY</th>
            <th className="px-[24px] table-header leading-[1.4] align-middle whitespace-nowrap">ENROLLMENT</th>
            <th className="px-[24px] table-header leading-[1.4] align-middle whitespace-nowrap">KYC STATUS</th>
            <th className="px-[24px] table-header leading-[1.4] align-middle whitespace-nowrap text-center">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr 
              key={student.id} 
              className={`group hover:bg-[#F8FAFC] transition-all duration-200 ease-in-out h-[56px] min-h-[56px] ${index !== students.length - 1 ? 'border-b border-[#EEF2F7]' : ''}`}
            >
              <td className="px-[24px] align-middle">
                <div className="flex items-center gap-[16px]">
                  <div className="w-[48px] h-[44px] rounded-full bg-[#EEF2F7] overflow-hidden shrink-0 flex items-center justify-center">
                    {/* Placeholder for avatar since none is provided by backend natively */}
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.student_name + ' ' + (student.last_name || ''))}&background=F4F1FF&color=5B3DF5`} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col gap-[2px]">
                    <span className="text-[15px] font-[500] text-[#0F172A] leading-[1.5] cursor-pointer hover:underline hover:text-[#5B3DF5]" onClick={() => router.push(`/students/${student.id}`)}>
                      {student.student_name} {student.last_name || ""}
                    </span>
                    <div className="flex flex-col gap-[2px]">
                      <div className="flex items-center gap-[6px] text-[14px] font-[400] text-[#64748B] leading-[1.5]">
                        <Mail size={12} />
                        {student.student_email || "student@example.com"}
                      </div>
                      <div className="flex items-center gap-[6px] text-[14px] font-[400] text-[#64748B] leading-[1.5]">
                        <Phone size={12} />
                        {student.contact || "+995 555 12 3456"}
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              
                <td className="px-[24px] align-middle">
                  <span className="text-[15px] font-[500] text-[#0F172A] leading-[1.5]">
                    {student.student_registration_id || student.id.substring(0, 8).toUpperCase()}
                  </span>
                </td>

                <td className="px-[24px] align-middle">
                  <div className="flex flex-col gap-[4px]">
                    <span className="text-[15px] font-[500] text-[#0F172A] leading-[1.5]">
                      {student.college || "SEU Georgian National University"}
                    </span>
                    <span className="text-[14px] font-[400] text-[#64748B] leading-[1.5]">
                      {student.course || "MD - Doctor of Medicine"}
                    </span>
                  </div>
                </td>

                <td className="px-[24px] align-middle">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-[500] text-[#0F172A] leading-[1.5]">
                      {student.nationality === "India" ? "🇮🇳 India" : student.nationality}
                    </span>
                  </div>
                </td>

              <td className="px-[24px] align-middle">
                <div className="inline-flex items-center justify-center h-[26px] px-[12px] rounded-full bg-[#F1F5F9] text-[#475569] text-[13px] font-[700]">
                  {student.student_type || "Regular"}
                </div>
              </td>

              <td className="px-[24px] align-middle">
                {student.kyc_verified ? (
                  <div className="inline-flex items-center justify-center h-[26px] px-[12px] rounded-full bg-[#DCFCE7] text-[#16A34A] text-[13px] font-[700] gap-[4px]">
                    <CheckCircle2 size={14} strokeWidth={2.5} />
                    KYC Verified
                  </div>
                ) : (
                  <div className="inline-flex items-center justify-center h-[26px] px-[12px] rounded-full bg-[#FFEDD5] text-[#EA580C] text-[13px] font-[700]">
                    Pending KYC
                  </div>
                )}
              </td>

                <td className="px-[24px] align-middle" onClick={(e) => e.stopPropagation()}>
                <ActionButtons 
                  onView={() => router.push(`/students/${student.id}`)}
                  onEdit={() => router.push(`/students/${student.id}/edit`)}
                  onDelete={() => onDelete(student.id)}
                  deleteConfirmMessage="Are you sure you want to delete this student?"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
