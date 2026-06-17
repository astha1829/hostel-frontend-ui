"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ChevronLeft, Edit3, Trash2, Calendar, FileText, ArrowRight, User, 
  Layers, ShieldCheck, HelpCircle, RefreshCw, ChevronDown, ChevronUp, Activity, Home, CheckCircle2, ArrowRightLeft
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DetailFormSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useHostelContractEventDetails } from "../hooks/use-hostel-contract-event-details";

interface HostelContractEventDetailsPageProps {
  id: string;
}

export const HostelContractEventDetailsPage: React.FC<HostelContractEventDetailsPageProps> = ({ id }) => {
  const router = useRouter();
  const { event, isLoading, error, handleDelete, reload } = useHostelContractEventDetails(id);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getStatusBadge = (status?: string | null) => {
    if (!status) return null;
    const lower = status.toLowerCase();
    const color = lower === "completed" || lower === "confirmed" ? "#16A34A" : "#D97706";
    const bg = lower === "completed" || lower === "confirmed" ? "#DCFCE7" : "#FEF3C7";
    return (
      <div style={{ 
        backgroundColor: bg, color: color, padding: "4px 12px", borderRadius: "16px", 
        fontSize: "12px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px" 
      }}>
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: color }}></div>
        {status}
      </div>
    );
  };

  const getActionTitle = (action?: string | null) => {
    if (!action) return "Contract Event";
    const lower = action.toLowerCase();
    if (lower === "create") return "Contract Creation Event";
    if (lower === "transfer") return "Room Transfer Event";
    if (lower === "amend") return "Contract Amendment Event";
    if (lower === "extend") return "Contract Extension Event";
    if (lower === "cancel") return "Contract Cancellation Event";
    return `${action} Event`;
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });
  };

  const formatDateTime = (dateTimeStr?: string | null) => {
    if (!dateTimeStr) return "—";
    const d = new Date(dateTimeStr);
    return d.toLocaleString("en-US", {
      year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit",
    });
  };

  const onDeleteConfirm = async () => {
    const success = await handleDelete();
    if (success) {
      router.push("/hostel-contract-events");
    }
  };

  if (error) {
    return (
      <ErrorState
        title="Event Retrieval Failed"
        message={error}
        onRetry={() => router.push("/hostel-contract-events")}
        isLoading={isLoading}
      />
    );
  }

  if (isLoading || !event) {
    return <DetailFormSkeleton />;
  }

  const [studentName, studentPassId] = event.student_name
    ? event.student_name.split("-")
    : ["Unlinked Student", ""];

  return (
    <div style={{ backgroundColor: "#F7F8FC", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ width: "100%", padding: "24px", boxSizing: "border-box" }}>
        
        {/* HEADER AREA */}
        <div style={{ marginBottom: "16px" }}>
          <Link href="/hostel-contract-events" style={{ color: "#64748B", fontSize: "14px", fontWeight: "500", display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none", marginBottom: "12px" }}>
            <ChevronLeft size={16} /> Back to Contract Events
          </Link>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <h1 style={{ fontSize: "40px", fontWeight: "800", color: "#0F172A", margin: "0", letterSpacing: "-1px" }}>
                {getActionTitle(event.action_type)}
              </h1>
              {getStatusBadge(event.event_status)}
            </div>
            
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={reload} style={{ height: "42px", borderRadius: "8px", border: "1px solid #E5E7EB", backgroundColor: "#FFFFFF", padding: "0 16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <RefreshCw size={16} color="#64748B" />
              </button>
              <button onClick={() => router.push(`/hostel-contract-events/${event.id}/edit`)} style={{ height: "42px", borderRadius: "8px", border: "none", backgroundColor: "#5B3DF5", color: "#FFFFFF", fontWeight: "600", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", padding: "0 20px", cursor: "pointer" }}>
                <Edit3 size={16} /> Edit Event
              </button>
              <div style={{ position: "relative" }}>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} style={{ height: "42px", borderRadius: "8px", border: "1px solid #E5E7EB", backgroundColor: "#FFFFFF", color: "#0F172A", fontWeight: "600", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", padding: "0 16px", cursor: "pointer" }}>
                  More Actions <span style={{ fontSize: "10px" }}>▼</span>
                </button>
                {isDropdownOpen && (
                  <div style={{ position: "absolute", top: "46px", right: "0", backgroundColor: "#FFF", border: "1px solid #E5E7EB", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 50, minWidth: "160px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    <div style={{ padding: "10px 16px", cursor: "pointer", fontSize: "14px", color: "#0F172A" }} onClick={() => { setIsDropdownOpen(false); router.push(`/hostel-contract-events/new?duplicate=${event.id}`); }}>Duplicate Event</div>
                    <div style={{ padding: "10px 16px", cursor: "pointer", fontSize: "14px", color: "#0F172A" }} onClick={() => { setIsDropdownOpen(false); window.print(); }}>Print/Export</div>
                    <div style={{ padding: "10px 16px", cursor: "pointer", fontSize: "14px", color: "#EF4444", borderTop: "1px solid #F1F5F9" }} onClick={() => { setIsDropdownOpen(false); onDeleteConfirm(); }}>Delete Event</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "24px", alignItems: "center", marginTop: "16px", padding: "12px 0", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB" }}>
            <div style={{ fontSize: "13px", color: "#64748B" }}>Event ID <span style={{ color: "#0F172A", fontWeight: "600", marginLeft: "6px", fontFamily: "monospace" }}>{event.id.toUpperCase()}</span></div>
            <div style={{ width: "1px", height: "16px", backgroundColor: "#E5E7EB" }}></div>
            <div style={{ fontSize: "13px", color: "#64748B" }}>Type <span style={{ color: "#5B3DF5", backgroundColor: "#F3F0FF", padding: "2px 8px", borderRadius: "12px", fontWeight: "700", marginLeft: "6px", fontSize: "11px" }}>{event.action_type.toUpperCase()}</span></div>
            <div style={{ width: "1px", height: "16px", backgroundColor: "#E5E7EB" }}></div>
            <div style={{ fontSize: "13px", color: "#64748B", display: "flex", alignItems: "center", gap: "6px" }}>Effective Date <Calendar size={14}/> <span style={{ color: "#0F172A", fontWeight: "600" }}>{formatDate(event.effective_date)}</span></div>
            <div style={{ width: "1px", height: "16px", backgroundColor: "#E5E7EB" }}></div>
            <div style={{ fontSize: "13px", color: "#64748B", display: "flex", alignItems: "center", gap: "6px" }}>Created On <Calendar size={14}/> <span style={{ color: "#0F172A", fontWeight: "600" }}>{formatDate(event.created_at)}</span></div>
          </div>
        </div>

        {/* TOP GRID (58% / 42%) */}
        <div style={{ display: "grid", gridTemplateColumns: "58% 42%", gap: "16px", marginBottom: "16px" }}>
          
          {/* Transfer Timeline */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E5E7EB", padding: "20px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0F172A", margin: "0 0 20px 0" }}>Transfer Timeline</h2>
            
            <div style={{ display: "flex", flexDirection: "column", position: "relative", paddingLeft: "16px" }}>
              <div style={{ position: "absolute", left: "34px", top: "16px", bottom: "16px", width: "2px", backgroundColor: "#F1F5F9", zIndex: 0 }}></div>
              
              <div style={{ display: "flex", gap: "16px", position: "relative", zIndex: 1, marginBottom: "20px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#F3F0FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 0 0 4px #FFFFFF" }}>
                  <FileText size={16} color="#5B3DF5" />
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", marginBottom: "2px" }}>Source Contract</div>
                  <div style={{ fontSize: "13px", color: "#64748B" }}>{event.source_hostel_contract_name ? `Contract ${event.source_hostel_contract_name}` : "None"}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", position: "relative", zIndex: 1, marginBottom: "20px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#F3F0FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 0 0 4px #FFFFFF" }}>
                  <Home size={16} color="#5B3DF5" />
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", marginBottom: "2px" }}>Source Room Allotment</div>
                  <div style={{ fontSize: "13px", color: "#64748B" }}>{event.source_room_allotment_name || "None"}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", position: "relative", zIndex: 1, marginBottom: "20px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 0 0 4px #FFFFFF" }}>
                  <ArrowRightLeft size={16} color="#16A34A" />
                </div>
                <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", marginBottom: "2px" }}>Transfer Processed</div>
                    <div style={{ fontSize: "13px", color: "#64748B" }}>Transfer completed by {event.triggered_by || "System Settle"}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {getStatusBadge(event.event_status)}
                    <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>{formatDate(event.effective_date)}</div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", position: "relative", zIndex: 1, marginBottom: "20px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#F3F0FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 0 0 4px #FFFFFF" }}>
                  <FileText size={16} color="#5B3DF5" />
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", marginBottom: "2px" }}>Target Contract</div>
                  <div style={{ fontSize: "13px", color: "#64748B" }}>{event.target_hostel_contract_name ? `Contract ${event.target_hostel_contract_name}` : "None"}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", position: "relative", zIndex: 1 }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#F3F0FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 0 0 4px #FFFFFF" }}>
                  <Home size={16} color="#5B3DF5" />
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", marginBottom: "2px" }}>Target Room Allotment</div>
                  <div style={{ fontSize: "13px", color: "#64748B" }}>{event.target_room_allotment_name || "None"}</div>
                </div>
              </div>
            </div>

          </div>

          {/* Event Summary */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E5E7EB", padding: "20px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0F172A", margin: "0 0 20px 0" }}>Event Summary</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "16px", borderBottom: "1px solid #F1F5F9" }}>
                <span style={{ fontSize: "13px", color: "#0F172A", fontWeight: "500" }}>Status</span>
                {getStatusBadge(event.event_status)}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "16px", borderBottom: "1px solid #F1F5F9" }}>
                <span style={{ fontSize: "13px", color: "#0F172A", fontWeight: "500" }}>Event Type</span>
                <span style={{ fontSize: "13px", color: "#0F172A" }}>{event.action_type}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "16px", borderBottom: "1px solid #F1F5F9" }}>
                <span style={{ fontSize: "13px", color: "#0F172A", fontWeight: "500" }}>Settlement Linked</span>
                <span style={{ fontSize: "13px", color: event.settlement_rap ? "#16A34A" : "#64748B", fontWeight: "600" }}>
                  {event.settlement_rap ? "Yes" : "No"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "16px", borderBottom: "1px solid #F1F5F9" }}>
                <span style={{ fontSize: "13px", color: "#0F172A", fontWeight: "500" }}>Action Performed By</span>
                <span style={{ fontSize: "13px", color: "#0F172A" }}>{event.triggered_by || "System Settle"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "16px", borderBottom: "1px solid #F1F5F9" }}>
                <span style={{ fontSize: "13px", color: "#0F172A", fontWeight: "500" }}>Audit Source</span>
                <span style={{ fontSize: "13px", color: "#0F172A" }}>System Audit Ledger</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM GRID (repeat 3) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", alignItems: "stretch" }}>
          
          {/* Student Information */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E5E7EB", padding: "20px", display: "flex", flexDirection: "column" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <User size={16} color="#64748B"/> Student Information
            </h3>
            
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "#F3F0FF", color: "#5B3DF5", fontSize: "18px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {studentName.split(" ").map(n => n[0]).join("").substring(0,2).toUpperCase() || "ST"}
              </div>
              <div>
                <div style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A", marginBottom: "4px" }}>{studentName}</div>
                <div style={{ fontSize: "13px", color: "#64748B" }}>Passport/ID: {studentPassId || "SR"}</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginTop: "auto" }}>
              <div>
                <div style={{ fontSize: "12px", color: "#64748B", marginBottom: "4px" }}>Resident Status</div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#16A34A" }}>Active Resident</div>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#64748B", marginBottom: "4px" }}>Current Room</div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#0F172A" }}>{event.target_room_allotment_name || "None"}</div>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#64748B", marginBottom: "4px" }}>Student ID Ref</div>
                <div style={{ fontSize: "12px", color: "#0F172A", fontFamily: "monospace" }}>{event.student_id.substring(0, 13)}...</div>
              </div>
            </div>
          </div>

          {/* Settlement Summary */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E5E7EB", padding: "20px", display: "flex", flexDirection: "column" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <FileText size={16} color="#64748B"/> Settlement Summary
            </h3>
            
            {event.settlement_rap ? (
              <>
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ fontSize: "12px", color: "#64748B", marginBottom: "4px" }}>Linked Financial Record</div>
                  <Link href={`/room-allotment-payments/${event.settlement_rap}`} style={{ fontSize: "18px", fontWeight: "700", color: "#5B3DF5", textDecoration: "none", marginBottom: "4px", display: "block" }}>
                    RAP-{event.settlement_rap.substring(0,8).toUpperCase()}
                  </Link>
                  <div style={{ fontSize: "13px", color: "#64748B" }}>Allotment Rent & Security Deposit Settlement</div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                  <div>
                    <div style={{ fontSize: "12px", color: "#64748B", marginBottom: "4px" }}>Settlement Amount</div>
                    <div style={{ fontSize: "20px", fontWeight: "700", color: "#0F172A" }}>$1,250.00</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#64748B", marginBottom: "4px", textAlign: "right" }}>Status</div>
                    <div style={{ backgroundColor: "#DCFCE7", color: "#16A34A", padding: "4px 12px", borderRadius: "16px", fontSize: "12px", fontWeight: "600", display: "inline-block" }}>Paid</div>
                  </div>
                </div>
                
                <button onClick={() => router.push(`/room-allotment-payments/${event.settlement_rap}`)} style={{ marginTop: "16px", width: "120px", height: "36px", borderRadius: "8px", border: "1px solid #5B3DF5", backgroundColor: "#FFFFFF", color: "#5B3DF5", fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", cursor: "pointer" }}>
                  View Payment <ArrowRight size={14}/>
                </button>
              </>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748B", fontSize: "14px", marginTop: "20px" }}>
                <HelpCircle size={18} /> No settlement linked to this event.
              </div>
            )}
          </div>

          {/* System Information */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E5E7EB", padding: "20px", display: "flex", flexDirection: "column" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <ShieldCheck size={16} color="#64748B"/> System Information
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1, justifyContent: "center" }}>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "16px", borderBottom: "1px solid #F1F5F9" }}>
                <span style={{ fontSize: "13px", color: "#64748B" }}>Created By</span>
                <span style={{ fontSize: "13px", color: "#0F172A", fontWeight: "500" }}>{event.triggered_by || "System Settle"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "16px", borderBottom: "1px solid #F1F5F9" }}>
                <span style={{ fontSize: "13px", color: "#64748B" }}>Created At</span>
                <span style={{ fontSize: "13px", color: "#0F172A", fontWeight: "500" }}>{formatDateTime(event.created_at)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "16px", borderBottom: "1px solid #F1F5F9" }}>
                <span style={{ fontSize: "13px", color: "#64748B" }}>Last Updated</span>
                <span style={{ fontSize: "13px", color: "#0F172A", fontWeight: "500" }}>{formatDateTime(event.updated_at)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px" }}>
                <span style={{ fontSize: "13px", color: "#64748B" }}>Source System</span>
                <span style={{ fontSize: "13px", color: "#0F172A", fontWeight: "500" }}>System Audit Ledger</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
