import React from "react";
import { Building2, MapPin, Layers, Home, Eye, Edit3, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { HostelStatusBadge } from "./hostel-status-badge";
import { Hostel } from "../types";

interface HostelsGridProps {
    hostels: Hostel[];
    onCardClick: (id: string) => void;
    onDelete: (id: string) => void;
}

export const HostelsGrid: React.FC<HostelsGridProps> = ({ hostels, onCardClick, onDelete }) => {
    if (!hostels || hostels.length === 0) {
        return (
            <EmptyState
                title="No Hostels Found"
                description="Try adjusting your search criteria or operational status filters."
            />
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {hostels.map((hostel) => (
                <div
                    key={hostel.id}
                    className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow relative group cursor-pointer"
                    onClick={() => onCardClick(hostel.id)}
                >
                    {/* Top Actions Row (visible on hover) */}
                    <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={(e) => { e.stopPropagation(); onCardClick(hostel.id); }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                            title="View Details"
                        >
                            <Eye size={16} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onCardClick(hostel.id); }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                            title="Edit Hostel"
                        >
                            <Edit3 size={16} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(hostel.id); }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"
                            title="Delete Hostel"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-5">
                        {/* Header: Icon & Title */}
                        <div className="flex items-start gap-4 pr-24">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <Building2 size={24} />
                            </div>
                            <div className="flex flex-col pt-1">
                                <h3 className="text-[22px] font-semibold text-foreground leading-tight mb-1 truncate">
                                    {hostel.hostel_name}
                                </h3>
                                <span className="text-[13px] font-medium px-2.5 py-0.5 rounded-md bg-secondary text-muted-foreground border border-border w-max">
                                    {hostel.hostel_id}
                                </span>
                            </div>
                        </div>

                        {/* Metadata Row */}
                        <div className="grid grid-cols-2 gap-y-4 gap-x-2 p-4 bg-[#F8FAFC] rounded-xl border border-border/60">
                            <div className="flex items-center gap-2 text-foreground/80">
                                <MapPin size={16} className="text-muted-foreground/80" />
                                <span className="text-[14px] font-medium truncate">{hostel.zone || "No Zone"}</span>
                            </div>

                            <div className="flex items-center gap-2 text-foreground/80">
                                <Layers size={16} className="text-muted-foreground/80" />
                                <span className="text-[14px] font-medium">{hostel.number_of_floors || 0} Floors</span>
                            </div>

                            {/* Status Badge spans full row at bottom of metadata if needed, but we'll put it separately */}
                        </div>

                        {/* Status Footer */}
                        <div className="flex items-center justify-between pt-1">
                            <span className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wider">Status</span>
                            <HostelStatusBadge status={hostel.status} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
