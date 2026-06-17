import React from "react";
import { BedDouble, Home } from "lucide-react";
import { HostelFloor, Hostel } from "../types";

interface HostelFloorsTableProps {
  floors: HostelFloor[];
  hostel: Hostel;
}

export const HostelFloorsTable: React.FC<HostelFloorsTableProps> = ({ floors, hostel }) => {
  if (!floors || floors.length === 0) {
    return (
      <div className="text-center p-8 text-slate-500 font-medium">
        <p>No floor allocations found for this hostel.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {floors.map((floor, index) => {
        const floorNumber = index + 1;
        const rooms = floor.rooms || [];
        const totalRooms = rooms.length;
        const totalBeds = rooms.reduce((acc, room) => acc + (room.capacity || 0), 0);

        return (
          <div key={floor.id} className="rounded-[12px] border border-border/80 overflow-hidden bg-white shadow-sm">
            {/* Floor Header */}
            <div className="p-3 flex items-center justify-between border-b border-border/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[8px] bg-primary/10 text-primary flex items-center justify-center font-[700] text-[15px]">
                  {floorNumber}
                </div>
                <h3 className="text-[16px] font-[700] text-slate-900 leading-[1.5]">
                  Floor {floor.floor_no}
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/5 text-primary text-[13px] font-[700]">
                  <Home size={14} />
                  {totalRooms} Room{totalRooms !== 1 && 's'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[13px] font-[700]">
                  <BedDouble size={14} />
                  {totalBeds} Bed{totalBeds !== 1 && 's'}
                </span>
              </div>
            </div>

            {/* Rooms Distribution */}
            <div className="p-3 bg-slate-50/50">
              <h4 className="table-header leading-[1.4] mb-2">
                Rooms Distribution
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {rooms.length > 0 ? (
                  rooms.map((room) => (
                    <div 
                      key={room.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-white border border-border/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <span className="text-[15px] font-[700] text-slate-900 leading-[1.5]">{room.room_number}</span>
                      <span className="text-[14px] font-[400] text-[#64748B] leading-[1.5]">({room.capacity} Beds)</span>
                    </div>
                  ))
                ) : (
                  <span className="text-[12px] text-slate-400 italic">No rooms mapped to this floor.</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
