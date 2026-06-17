import React from "react";
import { Building2, MapPin, Layers, Eye, Edit3, Trash2, MoreVertical, User, Phone } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
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
        <div className="flex flex-col gap-4">
            {hostels.map((hostel) => (
                <div
                    key={hostel.id}
                    className="bg-white rounded-[16px] border border-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow relative cursor-pointer overflow-hidden flex flex-col md:flex-row p-6 pl-8 gap-6 group"
                    onClick={() => onCardClick(hostel.id)}
                >
                    {/* Left Purple Vertical Line */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>

                    {/* Icon Block */}
                    <div className="w-[84px] h-[84px] rounded-[16px] bg-primary/10 text-primary flex items-center justify-center shrink-0 self-start md:self-center">
                        <Building2 size={36} strokeWidth={1.5} />
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col justify-center min-w-0">
                        {/* Title Row */}
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-[20px] font-bold text-slate-900 leading-tight truncate">
                                {hostel.hostel_name}
                            </h3>
                            {hostel.status === "active" && (
                                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                    <span className="text-[12px] font-bold">Active</span>
                                </div>
                            )}
                        </div>

                        {/* Code Badge */}
                        <div className="mb-6">
                            <span className="inline-flex text-[12px] font-bold px-3 py-1 rounded-full bg-primary/5 text-primary">
                                {hostel.hostel_id}
                            </span>
                        </div>

                        {/* Metadata Row */}
                        <div className="flex flex-wrap items-center gap-8 lg:gap-12 text-slate-500">
                            <div className="flex items-start gap-2.5">
                                <MapPin size={18} className="mt-0.5 text-slate-400" />
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-bold text-slate-900">{hostel.zone || "Zone 1"}</span>
                                    <span className="text-[12px] font-medium text-slate-500">Zone Location</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <Layers size={18} className="mt-0.5 text-slate-400" />
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-bold text-slate-900">{hostel.number_of_floors || 0} Floors</span>
                                    <span className="text-[12px] font-medium text-slate-500">Total Floors</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <User size={18} className="mt-0.5 text-slate-400" />
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-bold text-slate-900">{hostel.auth_person_name || "N/A"}</span>
                                    <span className="text-[12px] font-medium text-slate-500">Representative</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <Phone size={18} className="mt-0.5 text-slate-400" />
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-bold text-slate-900">{hostel.contact || "N/A"}</span>
                                    <span className="text-[12px] font-medium text-slate-500">Contact Number</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side Actions & Status */}
                    <div className="flex flex-col justify-between items-end shrink-0 pl-6 border-l border-border/40">
                        {/* Buttons Row */}
                        <div className="flex items-center gap-2 mb-6">
                            <button
                                onClick={(e) => { e.stopPropagation(); onCardClick(hostel.id); }}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-[12px] bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-[13px] font-bold"
                            >
                                <Eye size={16} /> View
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onCardClick(hostel.id); }}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-[12px] bg-white border border-border text-slate-700 hover:bg-slate-50 transition-colors text-[13px] font-bold shadow-sm"
                            >
                                <Edit3 size={16} /> Edit
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(hostel.id);
                                }}
                                className="w-[40px] h-[38px] rounded-[12px] bg-white border border-border text-[#EF4444] hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors flex items-center justify-center shadow-sm"
                                title="Delete Hostel"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        {/* Operational Status */}
                        <div className="flex flex-col items-end text-right">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[13px] font-medium text-slate-500">Status</span>
                                {hostel.status === "active" && (
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                        <span className="text-[11px] font-bold">Active</span>
                                    </div>
                                )}
                                {hostel.status !== "active" && (
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                        <span className="text-[11px] font-bold capitalize">{hostel.status}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
