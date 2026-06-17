import React, { useState } from "react";
import { Layers, ChevronDown, ChevronRight, DoorOpen, Users, BedDouble, AlertCircle, Eye, Edit2, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { HostelFloor } from "../types";

interface HostelFloorsTableProps {
  floors: HostelFloor[];
  onRowClick: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HostelFloorsTable: React.FC<HostelFloorsTableProps> = ({ floors, onRowClick, onDelete }) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  if (!floors || floors.length === 0) {
    return (
      <EmptyState
        title="No Hostel Floors Found"
        description="Try adjusting your search criteria or create a new floor configuration."
      />
    );
  }

  const renderRoomBadges = (floor: HostelFloor) => {
    if (!floor.rooms || floor.rooms.length === 0) {
      return <span className="text-[12px] font-[500] text-[#94A3B8]">-</span>;
    }
    
    const sortedRooms = [...floor.rooms].sort((a, b) => a.room_no.localeCompare(b.room_no));
    const displayRooms = sortedRooms.slice(0, 3);
    const extraCount = sortedRooms.length - 3;

    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        {displayRooms.map((room) => (
          <div key={room.id} className="px-2 py-0.5 bg-[#F1F5F9] rounded-[4px] text-[13px] font-[500] text-[#475569] tracking-tight">
            {room.room_no}
          </div>
        ))}
        {extraCount > 0 && (
          <div className="px-2 py-0.5 bg-[#FFFFFF] border border-[#E2E8F0] border-dashed rounded-[4px] text-[13px] font-[500] text-[#64748B]">
            +{extraCount}
          </div>
        )}
      </div>
    );
  };

  const renderCapacityBar = (floor: HostelFloor) => {
    if (!floor.rooms || floor.rooms.length === 0) return <span className="text-[12px] text-[#94A3B8]">-</span>;

    const totalCapacity = floor.rooms.reduce((acc, room) => acc + (room.capacity || 0), 0);
    const activeRooms = floor.rooms.filter(r => r.status !== 'Maintenance' && r.status !== 'Inactive');
    const activeCapacity = activeRooms.reduce((acc, room) => acc + (room.capacity || 0), 0);
    
    const percentage = totalCapacity > 0 ? Math.round((activeCapacity / totalCapacity) * 100) : 0;
    
    let barColor = "bg-[#22C55E]";
    if (percentage < 50) barColor = "bg-[#EF4444]";
    else if (percentage < 80) barColor = "bg-[#F59E0B]";

    return (
      <div className="flex flex-col gap-1 w-[120px]">
        <div className="flex justify-between items-center text-[13px] font-[600]">
          <span className="text-[#0F172A]">{activeCapacity} <span className="text-[#64748B] font-[500]">/ {totalCapacity}</span></span>
          <span className={`${percentage === 100 ? 'text-[#22C55E]' : 'text-[#64748B]'}`}>{percentage}%</span>
        </div>
        <div className="w-full h-[3px] bg-[#F1F5F9] rounded-full overflow-hidden">
          <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }} />
        </div>
      </div>
    );
  };

  const getStatusDisplay = (floor: HostelFloor) => {
    const roomsCount = floor.rooms?.length || 0;
    if (roomsCount === 0) return { label: "INACTIVE", bg: "bg-[#FEF2F2]", text: "text-[#EF4444]", dot: "bg-[#EF4444]" };
    return { label: "ACTIVE", bg: "bg-[#DCFCE7]", text: "text-[#22C55E]", dot: "bg-[#22C55E]" };
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[800px] border-collapse">
        <thead className="bg-[#FFFFFF] border-b border-[#E2E8F0] sticky top-0 z-10">
          <tr className="h-[44px]">
            <th className="w-[32px] px-2 text-center"></th>
            <th className="px-3 text-left text-[13px] font-[600] text-[#475569] uppercase tracking-wider">Floor details</th>
            <th className="px-3 text-left text-[13px] font-[600] text-[#475569] uppercase tracking-wider">Hostel</th>
            <th className="px-3 text-left text-[13px] font-[600] text-[#475569] uppercase tracking-wider">Room Series</th>
            <th className="px-3 text-center text-[13px] font-[600] text-[#475569] uppercase tracking-wider">Rooms</th>
            <th className="px-3 text-left text-[13px] font-[600] text-[#475569] uppercase tracking-wider">Capacity</th>
            <th className="px-3 text-left text-[13px] font-[600] text-[#475569] uppercase tracking-wider">Status</th>
            <th className="px-3 text-right text-[13px] font-[600] text-[#475569] uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody className="bg-[#FFFFFF] divide-y divide-[#E2E8F0]/60">
          {floors.map((floor) => {
            const roomsCount = floor.rooms?.length || 0;
            const status = getStatusDisplay(floor);
            const isExpanded = expandedRows.has(floor.id);

            return (
              <React.Fragment key={floor.id}>
                <tr
                  className={`h-[48px] hover:bg-[#F8FAFC] transition-colors duration-150 cursor-pointer ${isExpanded ? 'bg-[#F8FAFC]' : ''}`}
                  onClick={(e) => toggleRow(e, floor.id)}
                >
                  {/* Expand Icon */}
                  <td className="px-2 text-center align-middle">
                    <div className="w-5 h-5 rounded flex items-center justify-center text-[#94A3B8] group-hover:text-[#0F172A]">
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </div>
                  </td>

                  {/* Floor */}
                  <td className="px-3 align-middle">
                    <div className="flex items-center gap-2">
                      <div className="w-[24px] h-[24px] rounded-[6px] bg-[#6D4CFF]/10 text-[#6D4CFF] flex items-center justify-center shrink-0">
                        <Layers size={12} strokeWidth={2.5} />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[15px] font-[600] text-[#0F172A] tracking-tight">Floor {floor.floor_no}</span>
                        <span className="text-[13px] font-[500] text-[#64748B]">#{floor.idx || floor.floor_no}</span>
                      </div>
                    </div>
                  </td>
                  
                  {/* Hostel */}
                  <td className="px-3 align-middle">
                    <span className="text-[15px] font-[600] text-[#0F172A]">
                      {floor.hostel?.hostel_name || "Unassigned"}
                    </span>
                  </td>

                  {/* Room Series Badges */}
                  <td className="px-3 align-middle">
                    {renderRoomBadges(floor)}
                  </td>

                  {/* Total Rooms */}
                  <td className="px-3 align-middle text-center">
                    <span className="text-[15px] font-[600] text-[#0F172A]">{roomsCount}</span>
                  </td>

                  {/* Bed Capacity Progress */}
                  <td className="px-3 align-middle">
                    {renderCapacityBar(floor)}
                  </td>

                  {/* Status */}
                  <td className="px-3 align-middle">
                    <span className={`inline-flex items-center gap-1.5 h-[24px] px-2.5 rounded-full text-[13px] font-[700] ${status.bg} ${status.text}`}>
                      <span className={`w-1 h-1 rounded-full ${status.dot}`}></span>
                      {status.label}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-3 align-middle text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ opacity: 1 }}>
                      <button 
                        onClick={() => onRowClick(floor.id)} 
                        className="w-7 h-7 flex items-center justify-center rounded-[6px] text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]/50 transition-colors"
                        title="View details"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        onClick={() => onRowClick(floor.id)} 
                        className="w-7 h-7 flex items-center justify-center rounded-[6px] text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]/50 transition-colors"
                        title="Edit details"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(floor.id);
                        }} 
                        className="w-7 h-7 flex items-center justify-center rounded-[6px] text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-colors ml-1"
                        title="Delete floor"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Expanded Row Content */}
                {isExpanded && (
                  <tr className="bg-[#F8FAFC]">
                    <td colSpan={8} className="p-0 border-b border-[#E2E8F0]/60">
                      <div className="px-10 py-3 animate-in slide-in-from-top-1 duration-200">
                        {roomsCount > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                            {floor.rooms?.map(room => (
                              <div key={room.id} className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-[6px] p-2 flex flex-col gap-1.5 hover:border-[#CBD5E1] transition-colors cursor-default">
                                <div className="flex justify-between items-center">
                                  <span className="text-[13px] font-[600] text-[#0F172A] tracking-tight">Room {room.room_no}</span>
                                  <span className={`text-[11px] font-[700] px-1.5 py-0.5 rounded-[4px] ${room.status === 'Maintenance' ? 'bg-[#FEF2F2] text-[#EF4444]' : 'bg-[#DCFCE7] text-[#22C55E]'}`}>
                                    {room.status || "Active"}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-[13px] font-[500] text-[#64748B]">
                                  <div className="flex items-center gap-1.5">
                                    <BedDouble size={14} />
                                    <span className="truncate max-w-[80px]">{room.room_type || "Standard"}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Users size={14} />
                                    <span>{room.capacity}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-[12px] font-[500] text-[#64748B] py-2 px-3 rounded-[6px] bg-[#F1F5F9] border border-[#E2E8F0] border-dashed w-fit">
                            <AlertCircle size={14} />
                            No rooms have been generated for this floor yet.
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
