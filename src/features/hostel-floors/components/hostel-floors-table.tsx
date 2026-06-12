import React from "react";
import { ChevronRight, Layers, Building2, Hash, Trash2, Edit3 } from "lucide-react";
import { TableContainer, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { HostelFloor } from "../types";

interface HostelFloorsTableProps {
  floors: HostelFloor[];
  onRowClick: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HostelFloorsTable: React.FC<HostelFloorsTableProps> = ({ floors, onRowClick, onDelete }) => {
  if (!floors || floors.length === 0) {
    return (
      <EmptyState
        title="No Hostel Floors Mapped"
        description="Try adjusting your search criteria or hostel filters, or create a new floor."
      />
    );
  }

  const renderRoomSeries = (seriesStr?: string) => {
    if (!seriesStr) return <span className="text-muted-foreground">None Configured</span>;
    const parts = seriesStr.split(" - ");
    if (parts.length === 2) {
      const [seriesName, roomsList] = parts;
      const roomNumbers = roomsList.split(",").join(" • ");
      return (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-[13px] text-foreground">
            Series: {seriesName}
          </span>
          <span className="text-xs text-muted-foreground">
            {roomNumbers}
          </span>
        </div>
      );
    }
    return <span>{seriesStr}</span>;
  };

  return (
    <TableContainer className="border border-border/80 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/5 h-11">Floor</TableHead>
            <TableHead className="w-[30%]">Hostel</TableHead>
            <TableHead className="w-1/4">Room Number Series</TableHead>
            <TableHead className="w-[15%]">Total Rooms</TableHead>
            <TableHead className="w-[10%] text-center text-xs font-bold uppercase tracking-wider text-muted-foreground/80 align-middle">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {floors.map((floor) => {
            const roomsCount = floor.rooms?.length || 0;
            return (
              <TableRow
                key={floor.id}
                className="cursor-pointer transition-colors hover:bg-muted/50"
                onClick={() => onRowClick(floor.id)}
              >
                <TableCell className="font-semibold text-primary">
                  <div className="flex items-center gap-2">
                    <Layers size={14} className="text-primary" />
                    <span className="hover:underline">Floor {floor.floor_no}</span>
                  </div>
                </TableCell>
                
                <TableCell className="font-medium">
                  <div className="flex items-center gap-1.5 text-foreground/85">
                    <Building2 size={14} className="text-muted-foreground" />
                    <span>{floor.hostel?.hostel_name || "Unassigned Hostel"}</span>
                  </div>
                </TableCell>

                <TableCell className="font-mono text-sm">
                  {renderRoomSeries(floor.room_number_series)}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2 text-foreground/85">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${roomsCount > 0 ? 'bg-success' : 'bg-muted-foreground/50'}`} />
                    <span>{roomsCount} {roomsCount === 1 ? 'Room' : 'Rooms'}</span>
                  </div>
                </TableCell>

                <TableCell className="text-center align-middle" onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-1 justify-center items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRowClick(floor.id)}
                      className="p-1.5 h-auto text-muted-foreground hover:text-foreground"
                      title="View & edit details"
                    >
                      <Edit3 size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(floor.id)}
                      className="p-1.5 h-auto text-destructive hover:text-destructive hover:bg-destructive/10"
                      title="Delete floor"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
