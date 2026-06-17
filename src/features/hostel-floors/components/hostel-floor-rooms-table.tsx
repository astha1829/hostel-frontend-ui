import React from "react";
import { QrCode, Home, Users, Tag } from "lucide-react";
import { HostelRoom } from "../types";

interface HostelFloorRoomsTableProps {
  rooms?: HostelRoom[];
  onAddRoom?: () => void;
}

export const HostelFloorRoomsTable: React.FC<HostelFloorRoomsTableProps> = ({ rooms, onAddRoom }) => {
  if (!rooms || rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-[64px]">
        <div className="w-[160px] h-[160px] flex items-center justify-center mb-[24px] relative">
          {/* Abstract House SVG Illustration */}
          <svg width="180" height="140" viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M90 20C75 20 65 35 65 50C65 50 50 55 50 70C50 85 65 90 65 90L115 90C115 90 130 85 130 70C130 55 115 50 115 50C115 35 105 20 90 20Z" fill="#F8FAFC" />
            <path d="M40 70C30 70 20 80 20 90C20 100 30 110 40 110L140 110C150 110 160 100 160 90C160 80 150 70 140 70" fill="#F1F5F9" opacity="0.6"/>
            <circle cx="90" cy="75" r="55" fill="#F8FAFC" />
            <circle cx="90" cy="75" r="45" fill="#F1F5F9" opacity="0.8" />
            <path d="M65 80L90 55L115 80V105H65V80Z" stroke="#D8B4FE" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M80 105V85H100V105" stroke="#D8B4FE" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M55 80L90 45L125 80" stroke="#D8B4FE" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
        <h3 className="text-[24px] font-bold text-[#0F172A] mb-[8px]">No Rooms Registered</h3>
        <p className="text-[16px] font-medium text-[#64748B] mb-[24px]">This floor does not contain any rooms.</p>
        <button onClick={onAddRoom} className="flex items-center justify-center h-[44px] px-[24px] rounded-[12px] bg-[#5B3DF5] text-white font-semibold text-[14px] shadow-[0_4px_12px_rgba(91,61,245,.2)] hover:bg-[#F8FAFC] hover:text-[#5B3DF5] border border-transparent hover:border-[#5B3DF5] transition-all duration-200 ease-in-out">
          <span className="mr-2 text-[18px] leading-none">+</span>
          Add First Room
        </button>
      </div>
    );
  }

  const formatRent = (rent: string | number) => {
    const numericRent = typeof rent === "string" ? parseFloat(rent) : rent;
    if (isNaN(numericRent)) return "$0.00";
    return `$${numericRent.toFixed(2)}`;
  };

  return (
    <div className="flex flex-col gap-2 animate-slide-in">
      {rooms.map((room) => {
        const statusDotColor = (() => {
          switch (room.status?.toLowerCase()) {
            case "active":
            case "available":
              return "hsl(var(--success))";
            case "occupied":
            case "full":
              return "hsl(var(--primary))";
            case "maintenance":
              return "hsl(var(--warning))";
            case "inactive":
              return "hsl(var(--destructive))";
            default:
              return "hsl(var(--muted-foreground))";
          }
        })();

        return (
          <div
            key={room.id}
            className="flex items-center justify-between px-4 h-[56px] min-h-[56px] bg-[#FFFFFF] border border-[#EAECEF] rounded-[8px] hover:border-[#5B3DF5]/30 transition-colors shadow-[0_1px_2px_rgba(0,0,0,.02)]"
          >
            <div className="flex items-center gap-4 md:gap-8">
              <div className="flex items-center gap-2 min-w-[80px]">
                <Home size={16} className="text-[#5B3DF5]" />
                <span className="text-[15px] font-[500] text-[#0F172A] leading-[1.5]">
                  {room.room_no}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-[14px] font-[400] text-[#64748B] leading-[1.5]">
                <div className="flex items-center gap-1.5">
                  <Users size={14} className="opacity-70" />
                  <span>{room.capacity} {room.capacity === 1 ? "Bed" : "Beds"}</span>
                </div>
                <div className="w-[1px] h-3 bg-[#EAECEF]"></div>
                <div className="flex items-center gap-1.5">
                  <Tag size={14} className="opacity-70" />
                  <span className="truncate max-w-[100px]">
                    {room.room_type || "Standard"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <span className="text-[15px] font-[500] text-[#0F172A] w-[70px] text-right leading-[1.5]">
                {formatRent(room.rent)}
              </span>
              
              <div className="w-[1px] h-3 bg-[#EAECEF]"></div>
              
              <div className="flex items-center gap-1.5 min-w-[80px]">
                <span style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: statusDotColor
                }} />
                <span className="text-[13px] font-[700] text-[#64748B] capitalize">
                  {room.status}
                </span>
              </div>

              {room.qr_code && (
                <a
                  href={room.qr_code}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open room allocation QR Link"
                  className="flex items-center justify-center w-7 h-7 rounded bg-[#5B3DF5]/10 text-[#5B3DF5] hover:bg-[#5B3DF5]/20 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <QrCode size={14} />
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
