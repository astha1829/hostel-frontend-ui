import React from "react";
import { Edit, Trash2, MapPin, Layers, Building } from "lucide-react";
import { Hostel } from "../types";
import { HostelStatusBadge } from "./hostel-status-badge";
import { Button } from "@/components/ui/button";

interface HostelsTableProps {
  hostels: Hostel[];
  onRowClick: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HostelsTable: React.FC<HostelsTableProps> = ({ hostels, onRowClick, onDelete }) => {
  if (!hostels || hostels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-xl bg-secondary/10 text-center">
        <Building className="text-muted-foreground mb-4" size={32} />
        <h3 className="text-[16px] font-bold text-foreground">No Hostels Found</h3>
        <p className="text-[14px] text-muted-foreground mt-1 max-w-md">
          There are no hostels matching your current filters. Adjust your search or add a new hostel to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-border rounded-xl bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/40 text-muted-foreground font-semibold border-b border-border uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-5 py-4">Hostel Details</th>
              <th className="px-5 py-4">Zone / Campus</th>
              <th className="px-5 py-4 text-center">Floors</th>
              <th className="px-5 py-4">Operational Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {hostels.map((hostel) => (
              <tr 
                key={hostel.id} 
                className="hover:bg-secondary/20 transition-colors cursor-pointer group"
                onClick={() => onRowClick(hostel.id)}
              >
                <td className="px-5 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[15px] font-bold text-foreground group-hover:text-primary transition-colors">
                      {hostel.hostel_name}
                    </span>
                    <span className="text-[12px] text-muted-foreground font-mono bg-secondary/50 px-1.5 py-0.5 rounded-sm w-max border border-border/50">
                      {hostel.hostel_id}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center text-muted-foreground font-medium">
                    <MapPin size={14} className="mr-1.5 text-primary/60" />
                    {hostel.zone || "Unassigned"}
                  </div>
                </td>
                <td className="px-5 py-4 text-center">
                  <div className="inline-flex items-center justify-center bg-secondary/50 border border-border/50 px-2 py-1 rounded-md text-[13px] font-bold text-foreground">
                    <Layers size={14} className="mr-1.5 text-primary/60" />
                    {hostel.number_of_floors || 0}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <HostelStatusBadge status={hostel.status} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0 rounded-md bg-transparent border-border/60 hover:bg-secondary"
                      onClick={() => onRowClick(hostel.id)}
                    >
                      <Edit size={14} />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0 rounded-md bg-transparent border-border/60 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(hostel.id);
                      }}
                    >
                      <Trash2 size={14} />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
