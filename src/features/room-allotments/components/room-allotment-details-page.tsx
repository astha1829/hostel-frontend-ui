"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, RefreshCw, Edit2, ArrowRightLeft, Home, Building2, Layers, 
  Bed, FileText, Users, DollarSign, Calendar, ShieldCheck, Info, 
  Clock, Receipt, CheckCircle2
} from "lucide-react";
import { useRoomAllotmentDetails } from "../hooks/use-room-allotment-details";

interface RoomAllotmentDetailsPageProps {
  id: string;
}

export const RoomAllotmentDetailsPage: React.FC<RoomAllotmentDetailsPageProps> = ({ id }) => {
  const router = useRouter();
  const { allotment, isLoading, error, reload } = useRoomAllotmentDetails(id);

  if (isLoading) {
    return <div className="w-full h-screen flex items-center justify-center text-[#64748B]">Loading allotment details...</div>;
  }

  if (error || !allotment) {
    return <div className="w-full h-screen flex items-center justify-center text-[#EF4444]">{error || "Allotment not found"}</div>;
  }

  const studentName = allotment.first_name ? `${allotment.first_name} ${allotment.last_name || ""}`.trim() : (allotment.student_name ? allotment.student_name.split("-")[0] : "SHAURYA CHOVDADIA");
  const studentInitials = studentName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  const roomNo = allotment.room_no || "105";
  const passport = allotment.passport_number || "AF314338";
  const mobile = allotment.phone_number || "+91 98765 43210";
  const college = allotment.college || "SEU Georgian National University";
  const email = (allotment as any).email || "student@example.com";
  const hostelName = allotment.hostel_name || "Atmia Alphabet Girl Hostel";
  const floorNo = allotment.floor_no || "1";
  const bedName = "Bed A";
  const contractId = allotment.hostel_contract_name || "#102";
  const monthlyRent = allotment.rent || 140;

  return (
    <div className="container-page flex flex-col min-h-screen bg-[#F8F9FC] font-inter">
      
      {/* HEADER */}
      <div className="flex flex-col gap-[16px] w-full">
        <Link href="/room-allotments" className="flex items-center gap-[6px] text-[#5B3DF5] font-[600] text-[14px] hover:text-[#4a31d9] w-fit">
          <ArrowLeft size={16} />
          Back to Allotments
        </Link>
        <div className="flex justify-between items-start gap-[24px] mb-[28px] w-full">
        <div className="flex flex-col gap-[4px]">
            <h1 className="text-[44px] font-[700] text-[#111827] leading-tight tracking-tight">
              Allotment: Room {roomNo} — {studentName}
            </h1>
            <p className="page-subtitle">
              Stay allocations, roommate connections, rent histories, and ledger details.
            </p>
          </div>
          <div className="flex items-center gap-[12px] pt-[4px]">
            <button onClick={reload} className="w-[42px] h-[42px] rounded-[10px] bg-[#FFFFFF] border border-[#EAECEF] text-[#64748B] shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex items-center justify-center hover:bg-[#F8FAFC] transition-all shrink-0">
              <RefreshCw size={18} />
            </button>
            <button className="h-[42px] px-[16px] rounded-[10px] bg-[#FFFFFF] border border-[#5B3DF5] text-[#5B3DF5] font-[600] text-[14px] shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex items-center justify-center gap-[8px] hover:bg-[#F4F1FF] transition-all">
              <ArrowRightLeft size={16} />
              Transfer Room
            </button>
            <button onClick={() => router.push(`/room-allotments/${id}/edit`)} className="h-[42px] px-[16px] rounded-[10px] bg-[#5B3DF5] text-[#FFFFFF] font-[600] text-[14px] shadow-[0_4px_12px_rgba(91,61,245,0.15)] flex items-center justify-center gap-[8px] hover:bg-[#4a31d9] transition-all">
              <Edit2 size={16} />
              Edit Allotment
            </button>
          </div>
        </div>
      </div>

      {/* HERO CARD */}
      <div className="stats-card-global flex items-center justify-between w-full mt-[28px]">
        <div className="flex items-center gap-[24px]">
          <div className="w-[72px] h-[72px] rounded-[16px] bg-[#F4F1FF] text-[#5B3DF5] flex items-center justify-center shrink-0">
            <Home size={32} strokeWidth={2} />
          </div>
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center gap-[12px]">
              <span className="text-[24px] font-[700] text-[#111827]">Room {roomNo}</span>
              <span className="px-[10px] py-[4px] bg-[#DCFCE7] text-[#16A34A] status-badge rounded-full">Active</span>
            </div>
            <div className="flex items-center gap-[8px] text-[13px] font-[500] text-[#64748B]">
              <Building2 size={14} /> <span>{hostelName}</span>
              <span className="text-[#EAECEF] px-[2px]">•</span>
              <Layers size={14} /> <span>Floor {floorNo}</span>
              <span className="text-[#EAECEF] px-[2px]">•</span>
              <Bed size={14} /> <span>{bedName}</span>
              <span className="text-[#EAECEF] px-[2px]">•</span>
              <FileText size={14} /> <span>Contract {contractId}</span>
            </div>
            <div className="flex items-center gap-[6px] body-text-primary mt-[2px]">
              <span className="text-[#64748B] font-[500] text-[13px]">Resident</span>
              <Users size={16} className="text-[#5B3DF5] ml-[4px]" />
              <span className="text-[#111827]">{studentName}</span>
            </div>
          </div>
        </div>

        <div className="flex h-[72px]">
          <div className="w-[1px] h-full bg-[#EAECEF] mx-[32px]"></div>
          
          <div className="flex flex-col gap-[4px] min-w-[120px]">
            <span className="text-[13px] font-[500] text-[#64748B]">Monthly Rent</span>
            <span className="text-[28px] font-[700] text-[#5B3DF5] leading-none">${Number(monthlyRent).toFixed(2)}</span>
            <span className="body-text-secondary mt-[2px]">per month</span>
          </div>

          <div className="w-[1px] h-full bg-[#EAECEF] mx-[32px]"></div>
          
          <div className="flex flex-col gap-[8px] min-w-[140px]">
            <span className="text-[13px] font-[500] text-[#64748B]">Check-in Date</span>
            <div className="flex items-center gap-[6px] text-[#111827] font-[600] text-[14px]">
              <Calendar size={16} className="text-[#5B3DF5]" />
              <span>Jun 13, 2026</span>
            </div>
          </div>

          <div className="w-[1px] h-full bg-[#EAECEF] mx-[32px]"></div>
          
          <div className="flex flex-col gap-[8px] min-w-[140px]">
            <span className="text-[13px] font-[500] text-[#64748B]">Check-out Date</span>
            <div className="flex items-center gap-[6px] text-[#111827] font-[600] text-[14px]">
              <Calendar size={16} className="text-[#5B3DF5]" />
              <span>Jun 13, 2027</span>
            </div>
          </div>

          <div className="w-[1px] h-full bg-[#EAECEF] mx-[32px]"></div>
          
          <div className="flex flex-col gap-[8px]">
            <span className="text-[13px] font-[500] text-[#64748B]">Allotment Status</span>
            <span className="px-[12px] py-[4px] bg-[#DCFCE7] text-[#16A34A] status-badge rounded-full w-fit">Active</span>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-2 gap-[16px] mt-[20px]">
        
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-[16px]">
          
          {/* Student Profile Card */}
          <div className="w-full bg-[#FFFFFF] rounded-[16px] border border-[#EAECEF] shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-[24px] flex flex-col gap-[20px]">
            <div className="flex items-center gap-[8px] text-[#111827] font-[600] text-[20px]">
              <Users size={20} className="text-[#5B3DF5]" />
              <span>Student Profile</span>
            </div>
            
            <div className="flex items-center gap-[20px]">
              <div className="w-[64px] h-[64px] rounded-full bg-[#F4F1FF] text-[#5B3DF5] flex items-center justify-center font-[700] text-[24px] shrink-0">
                {studentInitials}
              </div>
              <div className="flex flex-col gap-[6px]">
                <div className="flex items-center gap-[12px]">
                  <span className="text-[18px] font-[700] text-[#111827]">{studentName}</span>
                  <span className="px-[10px] py-[2px] bg-[#DCFCE7] text-[#16A34A] text-[11px] font-[600] rounded-full uppercase tracking-wider">Registered Profile</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-x-[48px] gap-y-[12px] mt-[16px]">
              <div className="h-[42px] page-subtitle flex items-center gap-[12px]"><FileText size={18} className="shrink-0"/> Passport ID</div>
              <div className="h-[42px] text-[15px] font-[600] text-[#111827] flex items-center">{passport}</div>

              <div className="h-[42px] page-subtitle flex items-center gap-[12px]"><ShieldCheck size={18} className="shrink-0"/> Mobile Contact</div>
              <div className="h-[42px] text-[15px] font-[600] text-[#111827] flex items-center">{mobile}</div>

              <div className="h-[42px] page-subtitle flex items-center gap-[12px]"><Building2 size={18} className="shrink-0"/> College / University</div>
              <div className="h-[42px] text-[15px] font-[600] text-[#111827] flex items-center">{college}</div>

              <div className="h-[42px] page-subtitle flex items-center gap-[12px]"><FileText size={18} className="shrink-0"/> Email Address</div>
              <div className="h-[42px] text-[15px] font-[600] text-[#111827] flex items-center">{email}</div>

              <div className="h-[42px] page-subtitle flex items-center gap-[12px]"><Home size={18} className="shrink-0"/> Nationality</div>
              <div className="h-[42px] text-[15px] font-[600] text-[#111827] flex items-center gap-[8px]"><span>🇮🇳</span> India</div>
            </div>
          </div>

          {/* Room Assignment Details Card */}
          <div className="w-full bg-[#FFFFFF] rounded-[16px] border border-[#EAECEF] shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-[24px] flex flex-col gap-[24px]">
            <div className="flex items-center gap-[8px] text-[#111827] font-[600] text-[20px]">
              <Building2 size={20} className="text-[#5B3DF5]" />
              <span>Room Assignment Details</span>
            </div>
            
            <div className="grid grid-cols-2 gap-x-[32px] gap-y-[20px]">
              <div className="grid grid-cols-[140px_1fr] gap-y-[16px]">
                <div className="page-subtitle flex items-center gap-[8px]"><Building2 size={16}/> Hostel</div>
                <div className="body-text-primary">{hostelName}</div>

                <div className="page-subtitle flex items-center gap-[8px]"><FileText size={16}/> Room Number</div>
                <div className="body-text-primary">{roomNo}</div>

                <div className="page-subtitle flex items-center gap-[8px]"><Bed size={16}/> Bed</div>
                <div className="body-text-primary">{bedName}</div>
              </div>

              <div className="grid grid-cols-[180px_1fr] gap-y-[16px]">
                <div className="page-subtitle flex items-center gap-[8px]"><Layers size={16}/> Floor Level</div>
                <div className="body-text-primary">{floorNo}</div>

                <div className="page-subtitle flex items-center gap-[8px]"><Home size={16}/> Allotment Active State</div>
                <div className="flex"><span className="px-[10px] py-[2px] bg-[#DCFCE7] text-[#16A34A] text-[11px] font-[600] rounded-full">Active</span></div>

                <div className="page-subtitle flex items-center gap-[8px]"><DollarSign size={16}/> Monthly Rent Amount</div>
                <div className="text-[14px] font-[600] text-[#5B3DF5]">${Number(monthlyRent).toFixed(2)}</div>

                <div className="page-subtitle flex items-center gap-[8px]"><Calendar size={16}/> Break Stay Date</div>
                <div className="body-text-primary">—</div>
              </div>
            </div>

            <div className="flex flex-col gap-[8px] pt-[16px] border-t border-[#EAECEF]">
              <div className="page-subtitle flex items-center gap-[8px]"><Info size={16}/> Remarks</div>
              <div className="body-text-primary">No administrative remarks logged.</div>
            </div>
          </div>

          {/* Contract & Payment Reference */}
          <div className="w-full bg-[#FFFFFF] rounded-[16px] border border-[#EAECEF] shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-[24px] flex flex-col gap-[20px]">
            <div className="flex items-center gap-[8px] text-[#111827] font-[600] text-[20px]">
              <FileText size={20} className="text-[#5B3DF5]" />
              <span>Contract & Payment Reference</span>
            </div>
            
            <div className="grid grid-cols-3 gap-[24px]">
              <div className="flex flex-col gap-[12px]">
                <span className="text-[13px] font-[500] text-[#64748B]">Linked Lease Contract</span>
                <div className="flex items-center gap-[8px]">
                  <span className="text-[16px] font-[700] text-[#5B3DF5]">{contractId}</span>
                  <span className="px-[10px] py-[2px] bg-[#DCFCE7] text-[#16A34A] text-[11px] font-[600] rounded-full">Active</span>
                </div>
                <span className="text-[13px] font-[500] text-[#64748B]">Active Tenancy Lease</span>
              </div>
              <div className="flex flex-col gap-[12px]">
                <span className="text-[13px] font-[500] text-[#64748B]">Transaction Surcharge</span>
                <div className="flex">
                  <span className="px-[10px] py-[2px] bg-[#DCFCE7] text-[#16A34A] text-[11px] font-[600] rounded-full">Applied</span>
                </div>
              </div>
              <div className="flex flex-col gap-[12px]">
                <span className="text-[13px] font-[500] text-[#64748B]">Last Receipt Number</span>
                <span className="body-text-primary">—</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-[16px]">
          
          {/* Billing Summary Card */}
          <div className="w-full bg-[#FFFFFF] rounded-[16px] border border-[#EAECEF] shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-[24px] flex flex-col gap-[20px]">
            <div className="flex items-center gap-[8px] text-[#111827] font-[600] text-[20px]">
              <Receipt size={20} className="text-[#5B3DF5]" />
              <span>Billing Summary</span>
            </div>
            
            <div className="grid grid-cols-[1fr_240px] gap-[32px]">
              <div className="flex flex-col gap-[20px] justify-center">
                <div className="flex justify-between items-center">
                  <span className="page-subtitle">Monthly Rent</span>
                  <span className="text-[14px] font-[700] text-[#5B3DF5]">${Number(monthlyRent).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="page-subtitle">Outstanding Amount</span>
                  <span className="text-[14px] font-[700] text-[#16A34A]">$0.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="page-subtitle">Payment Status</span>
                  <span className="px-[10px] py-[2px] bg-[#DCFCE7] text-[#16A34A] text-[11px] font-[600] rounded-full">Paid</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="page-subtitle">Next Due Date</span>
                  <div className="flex items-center gap-[6px] body-text-primary">
                    <Calendar size={16} /> Jul 01, 2026
                  </div>
                </div>
              </div>

              <div className="bg-[#F4F1FF] rounded-[12px] p-[20px] flex flex-col items-center justify-center text-center gap-[12px]">
                <div className="w-[40px] h-[40px] rounded-full bg-[#FFFFFF] flex items-center justify-center shadow-sm text-[#5B3DF5]">
                  <DollarSign size={20} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col gap-[4px]">
                  <span className="body-text-secondary">Total Paid (Till Date)</span>
                  <span className="text-[28px] font-[700] text-[#5B3DF5]">${Number(monthlyRent).toFixed(2)}</span>
                </div>
                <Link href="#" className="text-[13px] font-[600] text-[#5B3DF5] hover:underline mt-[4px]">
                  View Payment History
                </Link>
              </div>
            </div>
          </div>

          {/* Activity Timeline Card */}
          <div className="w-full bg-[#FFFFFF] rounded-[16px] border border-[#EAECEF] shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-[24px] flex flex-col gap-[24px]">
            <div className="flex items-center gap-[8px] text-[#111827] font-[600] text-[20px]">
              <Clock size={20} className="text-[#5B3DF5]" />
              <span>Activity Timeline</span>
            </div>
            
            <div className="flex flex-col gap-[24px] relative">
              <div className="absolute left-[11px] top-[12px] bottom-[12px] w-[2px] bg-[#EAECEF]"></div>
              
              <div className="flex items-center gap-[16px] relative z-10">
                <div className="w-[24px] h-[24px] rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center border-[4px] border-[#FFFFFF] shrink-0">
                  <CheckCircle2 size={16} strokeWidth={3} />
                </div>
                <div className="grid grid-cols-[180px_1fr_120px_1fr] w-full text-[14px]">
                  <span className="font-[600] text-[#111827]">Allotment Created</span>
                  <span className="font-[500] text-[#64748B]">Jun 04, 2026</span>
                  <span className="font-[500] text-[#64748B]">| &nbsp;10:30 AM</span>
                  <span className="font-[500] text-[#64748B]">| &nbsp;Admin User</span>
                </div>
              </div>

              <div className="flex items-center gap-[16px] relative z-10">
                <div className="w-[24px] h-[24px] rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center border-[4px] border-[#FFFFFF] shrink-0">
                  <CheckCircle2 size={16} strokeWidth={3} />
                </div>
                <div className="grid grid-cols-[180px_1fr_120px_1fr] w-full text-[14px]">
                  <span className="font-[600] text-[#111827]">Contract Linked</span>
                  <span className="font-[500] text-[#64748B]">Jun 04, 2026</span>
                  <span className="font-[500] text-[#64748B]">| &nbsp;10:31 AM</span>
                  <span className="font-[500] text-[#64748B]">| &nbsp;Admin User</span>
                </div>
              </div>

              <div className="flex items-center gap-[16px] relative z-10">
                <div className="w-[24px] h-[24px] rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center border-[4px] border-[#FFFFFF] shrink-0">
                  <CheckCircle2 size={16} strokeWidth={3} />
                </div>
                <div className="grid grid-cols-[180px_1fr_120px_1fr] w-full text-[14px]">
                  <span className="font-[600] text-[#111827]">Room Assigned</span>
                  <span className="font-[500] text-[#64748B]">Jun 04, 2026</span>
                  <span className="font-[500] text-[#64748B]">| &nbsp;10:32 AM</span>
                  <span className="font-[500] text-[#64748B]">| &nbsp;Admin User</span>
                </div>
              </div>

              <div className="flex items-center gap-[16px] relative z-10">
                <div className="w-[24px] h-[24px] rounded-full bg-[#F4F1FF] text-[#5B3DF5] flex items-center justify-center border-[4px] border-[#FFFFFF] shrink-0">
                  <div className="w-[8px] h-[8px] rounded-full bg-[#5B3DF5]"></div>
                </div>
                <div className="grid grid-cols-[180px_1fr_120px_1fr] w-full text-[14px]">
                  <span className="font-[600] text-[#111827]">Last Updated</span>
                  <span className="font-[500] text-[#64748B]">Jun 04, 2026</span>
                  <span className="font-[500] text-[#64748B]">| &nbsp;10:45 AM</span>
                  <span className="font-[500] text-[#64748B]">| &nbsp;Admin User</span>
                </div>
              </div>

            </div>
          </div>

          {/* Audit Registry Card */}
          <div className="w-full bg-[#FFFFFF] rounded-[16px] border border-[#EAECEF] shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-[24px] flex flex-col gap-[20px]">
            <div className="flex items-center gap-[8px] text-[#111827] font-[600] text-[20px]">
              <ShieldCheck size={20} className="text-[#5B3DF5]" />
              <span>Audit Registry</span>
            </div>
            
            <div className="flex flex-col gap-[16px]">
              <div className="grid grid-cols-[180px_1fr_120px_1fr] w-full text-[14px]">
                <span className="font-[500] text-[#64748B]">Record Created</span>
                <span className="font-[500] text-[#64748B]">Jun 04, 2026</span>
                <span className="font-[500] text-[#64748B]">| &nbsp;10:30 AM</span>
                <span className="font-[500] text-[#64748B]">| &nbsp;Admin User</span>
              </div>
              <div className="grid grid-cols-[180px_1fr_120px_1fr] w-full text-[14px]">
                <span className="font-[500] text-[#64748B]">Last Modified</span>
                <span className="font-[500] text-[#64748B]">Jun 04, 2026</span>
                <span className="font-[500] text-[#64748B]">| &nbsp;10:45 AM</span>
                <span className="font-[500] text-[#64748B]">| &nbsp;Admin User</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
