"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  Layers, 
  Activity, 
  Calendar, 
  ArrowRightLeft, 
  FileText, 
  CheckCircle2, 
  Clock, 
  RotateCcw,
  Eye,
  Edit2,
  Trash2,
  User
} from "lucide-react";
import { useHostelContractEvents } from "../hooks/use-hostel-contract-events";
import { showCancelConfirm } from "@/utils/swal";
import { ActionButtons } from "@/components/ui/action-buttons";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";

export const HostelContractEventsListPage: React.FC = () => {
  const router = useRouter();

  const {
    events,
    students,
    isLoading,
    error,
    search,
    setSearch,
    selectedStudentId,
    setSelectedStudentId,
    selectedActionType,
    setSelectedActionType,
    selectedEventStatus,
    setSelectedEventStatus,
    currentPage,
    setCurrentPage,
    totalPages,
    total,
    handleDelete,
  } = useHostelContractEvents();

  const handleReset = () => {
    setSearch("");
    setSelectedStudentId("");
    setSelectedActionType("");
    setSelectedEventStatus("");
  };

  const studentOptions = [
    { label: "All Students", value: "" },
    ...students.map((s) => ({
      label: `${s.student_name} ${s.last_name || ""}`.trim(),
      value: s.id,
    })),
  ];

  const actionTypeOptions = [
    { label: "All Action Types", value: "" },
    { label: "Create", value: "Create" },
    { label: "Transfer", value: "Transfer" },
    { label: "Amend", value: "Amend" },
    { label: "Extend", value: "Extend" },
    { label: "Cancel", value: "Cancel" },
  ];

  const eventStatusOptions = [
    { label: "All Statuses", value: "" },
    { label: "Confirmed", value: "Confirmed" },
    { label: "Pending", value: "Pending" },
    { label: "Pending Review", value: "Pending Review" },
    { label: "Approved", value: "Approved" },
    { label: "Completed", value: "Completed" },
    { label: "Cancelled", value: "Cancelled" },
  ];

  // Derive Statistics
  const stats = useMemo(() => {
    let transfers = 0;
    let creations = 0;
    let completed = 0;
    let upcoming = 0;

    events.forEach(ev => {
      if (ev.action_type === "Transfer") transfers++;
      if (ev.action_type === "Create") creations++;
      if (ev.event_status === "Completed" || ev.event_status === "Confirmed") completed++;
      if (ev.event_status === "Pending" || ev.event_status === "Scheduled") upcoming++;
    });

    return { total: total || events.length, transfers, creations, completed, upcoming };
  }, [events, total]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return { date: "-", time: "-" };
    try {
      const d = new Date(dateStr);
      const date = d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
      const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      return { date, time };
    } catch {
      return { date: dateStr, time: "" };
    }
  };

  return (
    <div className="container-page flex flex-col gap-4 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <PageHeader
        title="Hostel Contract Events"
        description="Audit student contract lifecycles, track room transitions, and monitor payment settlements."
        actions={
          <Button 
            variant="primary" 
            size="md" 
            onClick={() => router.push("/hostel-contract-events/new")}
            className="shadow-[0_2px_8px_hsl(var(--primary)/0.15)]"
          >
            <Plus size={16} />
            <span>Add Event</span>
          </Button>
        }
      />

        {/* STATISTICS BAR */}
        <div style={{ 
          backgroundColor: "#FFFFFF", 
          borderRadius: "16px", 
          boxShadow: "0 2px 12px rgba(15,23,42,0.05)",
          border: "1px solid #E5E7EB",
          height: "96px",
          display: "flex",
          alignItems: "center",
          marginBottom: "24px",
          overflow: "hidden"
        }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "16px", padding: "0 24px", borderRight: "1px solid #E5E7EB", height: "56px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#F3F0FF", color: "#5B3DF5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Calendar size={24} />
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#64748B", marginBottom: "2px" }}>Total Events</div>
              <div style={{ fontSize: "32px", fontWeight: "700", color: "#111827", lineHeight: "1" }}>{stats.total}</div>
              <div style={{ fontSize: "13px", color: "#64748B", marginTop: "4px" }}>All time</div>
            </div>
          </div>

          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "16px", padding: "0 24px", borderRight: "1px solid #E5E7EB", height: "56px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#DCFCE7", color: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ArrowRightLeft size={24} />
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#64748B", marginBottom: "2px" }}>Transfers</div>
              <div style={{ fontSize: "32px", fontWeight: "700", color: "#111827", lineHeight: "1" }}>{stats.transfers}</div>
              <div style={{ fontSize: "13px", color: "#64748B", marginTop: "4px" }}>Room transfers</div>
            </div>
          </div>

          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "16px", padding: "0 24px", borderRight: "1px solid #E5E7EB", height: "56px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#E0F2FE", color: "#0284C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileText size={24} />
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#64748B", marginBottom: "2px" }}>Contracts Created</div>
              <div style={{ fontSize: "32px", fontWeight: "700", color: "#111827", lineHeight: "1" }}>{stats.creations}</div>
              <div style={{ fontSize: "13px", color: "#64748B", marginTop: "4px" }}>New agreements</div>
            </div>
          </div>

          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "16px", padding: "0 24px", borderRight: "1px solid #E5E7EB", height: "56px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#DCFCE7", color: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#64748B", marginBottom: "2px" }}>Completed</div>
              <div style={{ fontSize: "32px", fontWeight: "700", color: "#111827", lineHeight: "1" }}>{stats.completed}</div>
              <div style={{ fontSize: "13px", color: "#64748B", marginTop: "4px" }}>Successful events</div>
            </div>
          </div>

          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "16px", padding: "0 24px", height: "56px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#FFEDD5", color: "#EA580C", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Clock size={24} />
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#64748B", marginBottom: "2px" }}>Upcoming</div>
              <div style={{ fontSize: "32px", fontWeight: "700", color: "#111827", lineHeight: "1" }}>{stats.upcoming}</div>
              <div style={{ fontSize: "13px", color: "#64748B", marginTop: "4px" }}>Scheduled events</div>
            </div>
          </div>
        </div>

        {/* FILTER BAR */}
        <div style={{ 
          backgroundColor: "#FFFFFF", 
          borderRadius: "16px", 
          border: "1px solid #E5E7EB",
          padding: "16px",
          display: "flex",
          gap: "16px",
          marginBottom: "32px"
        }}>
          <div style={{ position: "relative", flex: 2 }}>
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by action, student, room, contract..."
              style={{ width: "100%", height: "44px", borderRadius: "8px", border: "1px solid #E5E7EB", padding: "0 16px 0 40px", fontSize: "14px", outline: "none", color: "#111827" }}
            />
            <Search size={18} color="#94A3B8" style={{ position: "absolute", left: "12px", top: "13px" }} />
          </div>

          <div style={{ position: "relative", flex: 1 }}>
            <select 
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="select-standard"
              style={{ width: "100%", height: "44px", borderRadius: "8px", border: "1px solid #E5E7EB", padding: "0 36px 0 14px", fontSize: "15px", fontWeight: "500", color: "#111827", outline: "none", appearance: "none", backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%2364748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>')`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", cursor: "pointer" }}
            >
              {studentOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          <div style={{ position: "relative", flex: 1 }}>
            <select 
              value={selectedActionType}
              onChange={(e) => setSelectedActionType(e.target.value)}
              className="select-standard"
              style={{ width: "100%", height: "44px", borderRadius: "8px", border: "1px solid #E5E7EB", padding: "0 36px 0 14px", fontSize: "15px", fontWeight: "500", color: "#111827", outline: "none", appearance: "none", backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%2364748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>')`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", cursor: "pointer" }}
            >
              {actionTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          <div style={{ position: "relative", flex: 1 }}>
            <select 
              value={selectedEventStatus}
              onChange={(e) => setSelectedEventStatus(e.target.value)}
              className="select-standard"
              style={{ width: "100%", height: "44px", borderRadius: "8px", border: "1px solid #E5E7EB", padding: "0 36px 0 14px", fontSize: "15px", fontWeight: "500", color: "#111827", outline: "none", appearance: "none", backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%2364748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>')`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", cursor: "pointer" }}
            >
              {eventStatusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          <button 
            onClick={handleReset}
            style={{ flex: "0 0 auto", height: "44px", padding: "0 20px", borderRadius: "8px", border: "1px solid #E5E7EB", backgroundColor: "#FFFFFF", color: "#111827", fontSize: "14px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>

        {/* TIMELINE SECTION */}
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Loading events...</div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "40px", color: "red" }}>{error}</div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#64748B" }}>No events found.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
            {events.map((event, index) => {
              const { date, time } = formatDate(event.triggered_on || event.created_at);
              const isTransfer = event.action_type === "Transfer";
              const isCreate = event.action_type === "Create";
              const iconBg = isTransfer ? "#DCFCE7" : isCreate ? "#F3F0FF" : "#F1F5F9";
              const iconColor = isTransfer ? "#16A34A" : isCreate ? "#5B3DF5" : "#64748B";
              const IconComp = isTransfer ? ArrowRightLeft : isCreate ? FileText : Activity;

              // Timeline line height handler
              const isLast = index === events.length - 1;

              return (
                <div key={event.id} style={{ display: "flex", height: "120px", position: "relative" }}>
                  
                  {/* Left Date Column */}
                  <div style={{ width: "120px", flexShrink: 0, textAlign: "right", paddingRight: "30px", paddingTop: "30px" }}>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: "#111827", marginBottom: "4px" }}>{date}</div>
                    <div style={{ fontSize: "13px", color: "#64748B" }}>{time}</div>
                  </div>

                  {/* Vertical Line & Node */}
                  <div style={{ position: "relative", width: "40px", flexShrink: 0, display: "flex", justifyContent: "center" }}>
                    {!isLast && (
                      <div style={{ position: "absolute", top: "40px", bottom: "-40px", width: "1px", backgroundColor: "#E2E8F0", zIndex: 0 }}></div>
                    )}
                    <div style={{ 
                      width: "36px", 
                      height: "36px", 
                      borderRadius: "50%", 
                      backgroundColor: iconBg, 
                      color: iconColor, 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      zIndex: 1,
                      marginTop: "22px",
                      boxShadow: "0 0 0 6px #F7F8FC"
                    }}>
                      <IconComp size={18} />
                    </div>
                  </div>

                  {/* Right Content Card */}
                  <div style={{ flex: 1, paddingLeft: "30px", paddingBottom: "20px" }}>
                    <div style={{ 
                      backgroundColor: "#FFFFFF", 
                      borderRadius: "14px", 
                      border: "1px solid #E5E7EB",
                      height: "100px",
                      boxShadow: "0 2px 12px rgba(15,23,42,0.03)",
                      display: "grid",
                      gridTemplateColumns: "1.8fr 1.5fr 1.5fr 140px 140px",
                      alignItems: "center",
                      padding: "0 24px"
                    }}>
                      
                      {/* Column 1: Event Type & Student */}
                      <div style={{ paddingRight: "24px", borderRight: "1px solid #F1F5F9", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <div style={{ fontSize: "20px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>
                          {event.action_type === "Create" ? "Contract Created" : 
                           event.action_type === "Transfer" ? "Room Transfer" : 
                           event.action_type}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <User size={14} color="#94A3B8" />
                          <span style={{ fontSize: "14px", fontWeight: "500", color: "#64748B", textTransform: "uppercase" }}>{event.student_name || "SHAURYA CHOVADIA"}</span>
                          <span style={{ fontSize: "11px", fontWeight: "700", color: "#5B3DF5", backgroundColor: "#F3F0FF", padding: "2px 6px", borderRadius: "4px" }}>SR</span>
                        </div>
                      </div>

                      {/* Column 2: Details / Source Transition */}
                      <div style={{ padding: "0 24px", borderRight: "1px solid #F1F5F9", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        {isTransfer ? (
                          <>
                            <div style={{ fontSize: "13px", color: "#94A3B8", marginBottom: "10px" }}>Contract Transition</div>
                            <div style={{ fontSize: "14px", fontWeight: "600", color: "#111827", display: "flex", alignItems: "center", gap: "8px" }}>
                              <span style={{ color: "#5B3DF5" }}>{event.source_hostel_contract_name || "-"}</span> 
                              <span style={{ color: "#CBD5E1" }}>→</span> 
                              <span style={{ color: "#5B3DF5" }}>{event.target_hostel_contract_name || "-"}</span>
                            </div>
                          </>
                        ) : isCreate ? (
                          <>
                            <div style={{ fontSize: "13px", color: "#94A3B8", marginBottom: "10px" }}>Details</div>
                            <div style={{ fontSize: "14px", fontWeight: "500", color: "#111827" }}>
                              {event.target_hostel_contract_name && event.target_room_allotment_name 
                                ? "Initial contract agreement" 
                                : "New lease agreement created"}
                            </div>
                          </>
                        ) : (
                          <>
                            <div style={{ fontSize: "13px", color: "#94A3B8", marginBottom: "10px" }}>Details</div>
                            <div style={{ fontSize: "14px", fontWeight: "500", color: "#111827" }}>
                              {event.action_type} operation performed
                            </div>
                          </>
                        )}
                      </div>

                      {/* Column 3: Secondary Details / Target Transition */}
                      <div style={{ padding: "0 24px", borderRight: "1px solid #F1F5F9", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        {isTransfer ? (
                          <>
                            <div style={{ fontSize: "13px", color: "#94A3B8", marginBottom: "10px" }}>Room Transition</div>
                            <div style={{ fontSize: "14px", fontWeight: "600", color: "#111827", display: "flex", alignItems: "center", gap: "8px" }}>
                              <span>{event.source_room_allotment_name || "-"}</span> 
                              <span style={{ color: "#CBD5E1" }}>→</span> 
                              <span>{event.target_room_allotment_name || "-"}</span>
                            </div>
                          </>
                        ) : isCreate ? (
                          <>
                            {event.target_hostel_contract_name ? (
                              <>
                                <div style={{ fontSize: "13px", color: "#94A3B8", marginBottom: "10px" }}>Contract Reference</div>
                                <div style={{ fontSize: "14px", fontWeight: "600", color: "#5B3DF5" }}>
                                  Contract {event.target_hostel_contract_name}
                                </div>
                              </>
                            ) : (
                              <div style={{ fontSize: "14px", color: "#64748B" }}>-</div>
                            )}
                          </>
                        ) : (
                          <div style={{ fontSize: "14px", color: "#64748B" }}>-</div>
                        )}
                      </div>

                      {/* Column 4: Status */}
                      <div style={{ padding: "0 24px", borderRight: "1px solid #F1F5F9", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ 
                          backgroundColor: event.event_status === "Completed" || event.event_status === "Confirmed" ? "#DCFCE7" : "#FEF3C7", 
                          color: event.event_status === "Completed" || event.event_status === "Confirmed" ? "#16A34A" : "#D97706",
                          padding: "6px 14px",
                          borderRadius: "16px",
                          fontSize: "13px",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          whiteSpace: "nowrap"
                        }}>
                          <div style={{ 
                            width: "6px", 
                            height: "6px", 
                            borderRadius: "50%", 
                            backgroundColor: event.event_status === "Completed" || event.event_status === "Confirmed" ? "#16A34A" : "#D97706" 
                          }}></div>
                          {event.event_status}
                        </div>
                      </div>

                      {/* Column 5: Actions */}
                      <div style={{ paddingLeft: "24px", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                        <ActionButtons 
                          align="right"
                          onView={() => router.push(`/hostel-contract-events/${event.id}`)}
                          onEdit={() => router.push(`/hostel-contract-events/${event.id}/edit`)}
                          onDelete={() => handleDelete(event.id)}
                          deleteConfirmMessage="Are you sure you want to delete this event?"
                        />
                      </div>

                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* BOTTOM PAGINATION */}
        {events.length > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
            <div style={{ fontSize: "14px", color: "#64748B" }}>
              Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, total)} of {total} events
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ width: "36px", height: "36px", borderRadius: "8px", border: "1px solid #E5E7EB", backgroundColor: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: currentPage === 1 ? "not-allowed" : "pointer", color: currentPage === 1 ? "#CBD5E1" : "#64748B" }}
              >
                <ChevronLeft size={16} />
              </button>
              <div style={{ height: "36px", padding: "0 16px", borderRadius: "8px", backgroundColor: "#5B3DF5", color: "#FFFFFF", fontSize: "14px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {currentPage}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{ width: "36px", height: "36px", borderRadius: "8px", border: "1px solid #E5E7EB", backgroundColor: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: currentPage === totalPages ? "not-allowed" : "pointer", color: currentPage === totalPages ? "#CBD5E1" : "#64748B" }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

    </div>
  );
};
