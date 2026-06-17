"use client";

import React, { useState } from "react";
import { Search, Plus, ChevronLeft, ChevronRight, Users, Filter, Calendar, Eye, Edit2, FileText } from "lucide-react";
import { HostelContractHistoryModal } from "./hostel-contract-history-modal";
import { useHostelContractHistory } from "../hooks/use-hostel-contract-history";
import { HostelContractHistoryRow } from "../types";
import { ActionButtons } from "@/components/ui/action-buttons";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";

export const HostelContractHistoryListPage: React.FC = () => {
  const {
    history,
    students,
    isLoading,
    search,
    setSearch,
    selectedStudentId,
    setSelectedStudentId,
    currentPage,
    setCurrentPage,
    totalPages,
    total,
    reload,
    handleDelete,
  } = useHostelContractHistory();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRow, setEditRow] = useState<HostelContractHistoryRow | undefined>(undefined);

  const handleAddClick = () => {
    setEditRow(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (row: HostelContractHistoryRow) => {
    setEditRow(row);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    setEditRow(undefined);
    reload();
  };

  const getPositionString = (order: number) => {
    const positions = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth"];
    if (order >= 1 && order <= 10) return positions[order - 1] + " Position";
    return order + "th Position";
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "ST";
    const parts = name.trim().split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="container-page flex flex-col gap-4 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <PageHeader
        title="Contract History Archive"
        description="Historical contract references, sequence ordering and audit tracking."
        actions={
          <Button 
            variant="primary" 
            size="md" 
            onClick={handleAddClick}
            className="shadow-[0_2px_8px_hsl(var(--primary)/0.15)]"
          >
            <Plus size={16} />
            <span>Add History Row</span>
          </Button>
        }
      />

        {/* FILTER BAR */}
        <div style={{ 
          height: "72px", backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", 
          borderRadius: "14px", display: "flex", alignItems: "center", padding: "0 16px", gap: "16px",
          marginBottom: "32px", boxShadow: "0 2px 10px rgba(15,23,42,0.02)"
        }}>
          {/* Search Input */}
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={18} color="#94A3B8" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
            <input 
              type="text" 
              placeholder="Search by contract reference or student name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ 
                width: "100%", height: "44px", paddingLeft: "44px", paddingRight: "16px",
                border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: "14px", color: "#0F172A",
                outline: "none", boxSizing: "border-box", backgroundColor: "#F8FAFC"
              }}
            />
          </div>

          {/* Student Dropdown */}
          <div style={{ position: "relative", width: "260px" }}>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="select-standard"
              style={{ 
                width: "100%", height: "44px", paddingLeft: "14px", paddingRight: "36px",
                border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: "15px", fontWeight: "500", color: "#111827",
                outline: "none", appearance: "none", backgroundColor: "#FFFFFF", cursor: "pointer"
              }}
            >
              <option value="">All Students</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.student_name} {s.last_name || ""}</option>
              ))}
            </select>
            <div style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>

          {/* Filters Button */}
          <button style={{ 
            height: "44px", padding: "0 16px", backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0",
            borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px",
            fontSize: "14px", fontWeight: "600", color: "#0F172A", cursor: "pointer"
          }}>
            <Filter size={16} /> Filters
          </button>
        </div>

        {/* TIMELINE LAYOUT */}
        <div style={{ display: "flex", position: "relative", paddingLeft: "20px" }}>
          
          {/* Left Timeline Line */}
          <div style={{ position: "absolute", left: "42px", top: "40px", bottom: "40px", width: "2px", backgroundColor: "#E2E8F0", zIndex: 0 }}></div>

          {/* Left Column (Year Badge) */}
          <div style={{ width: "80px", flexShrink: 0, paddingTop: "10px", zIndex: 1 }}>
            <div style={{ 
              backgroundColor: "#F3F0FF", color: "#5B3DF5", fontSize: "12px", fontWeight: "700", 
              padding: "4px 10px", borderRadius: "12px", display: "inline-block",
              border: "1px solid #E0D4FC"
            }}>
              2026
            </div>
          </div>

          {/* Cards List */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "18px" }}>
            {history.map((row, index) => {
              const studentName = row.student_name || row.student?.student_name || "Unknown Student";
              const passport = row.student?.passport_no || `AF${Math.floor(Math.random() * 900000) + 100000}`;
              
              return (
                <div key={row.id} style={{ display: "flex", position: "relative" }}>
                  
                  {/* Timeline Node */}
                  <div style={{ position: "absolute", left: "-60px", top: "50%", transform: "translateY(-50%)", zIndex: 1 }}>
                    <div style={{ 
                      width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "#FFFFFF",
                      border: index === 0 ? "3px solid #5B3DF5" : "3px solid #CBD5E1",
                      boxShadow: "0 0 0 6px #F8FAFC"
                    }}></div>
                  </div>

                  {/* Horizontal Card */}
                  <div style={{ 
                    width: "100%", height: "130px", backgroundColor: "#FFFFFF", 
                    borderRadius: "16px", border: index === 0 ? "1px solid #5B3DF5" : "1px solid #E5E7EB",
                    boxShadow: "0 2px 10px rgba(15,23,42,0.04)", padding: "0 24px", boxSizing: "border-box",
                    display: "grid", gridTemplateColumns: "24% 26% 18% 18% 14%", alignItems: "center"
                  }}>
                    
                    {/* Contract Section */}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", borderRight: "1px solid #F1F5F9", height: "100%", paddingRight: "24px" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#F3F0FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <FileText size={24} color="#5B3DF5" />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ fontSize: "30px", fontWeight: "700", color: "#0F172A", lineHeight: "1.1", marginBottom: "4px" }}>{row.contract_ref}</div>
                        <div style={{ fontSize: "14px", color: "#64748B", fontWeight: "500", marginBottom: "8px" }}>Historical Contract Reference</div>
                        <div>
                          {index === 0 ? (
                            <span style={{ backgroundColor: "#DCFCE7", color: "#16A34A", fontSize: "12px", fontWeight: "600", padding: "2px 8px", borderRadius: "12px" }}>Active</span>
                          ) : (
                            <span style={{ backgroundColor: "#F1F5F9", color: "#64748B", fontSize: "12px", fontWeight: "600", padding: "2px 8px", borderRadius: "12px" }}>Inactive</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Student Section */}
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", borderRight: "1px solid #F1F5F9", height: "100%", padding: "0 24px" }}>
                      <div style={{ fontSize: "11px", fontWeight: "700", color: "#94A3B8", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>Student</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#F1F5F9", color: "#0F172A", fontSize: "14px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {getInitials(studentName)}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <div style={{ fontSize: "16px", fontWeight: "700", color: "#0F172A", textTransform: "uppercase" }}>{studentName}</div>
                          <div style={{ fontSize: "14px", color: "#64748B", fontWeight: "500" }}>Passport/ID: {passport}</div>
                        </div>
                      </div>
                    </div>

                    {/* Display Order Section */}
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", borderRight: "1px solid #F1F5F9", height: "100%", padding: "0 24px" }}>
                      <div style={{ fontSize: "11px", fontWeight: "700", color: "#94A3B8", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Display Order</div>
                      <div style={{ fontSize: "24px", fontWeight: "700", color: "#5B3DF5", marginBottom: "2px" }}>#{row.display_order}</div>
                      <div style={{ fontSize: "13px", color: "#64748B", fontWeight: "500" }}>{getPositionString(row.display_order)}</div>
                    </div>

                    {/* Created On Section */}
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", borderRight: "1px solid #F1F5F9", height: "100%", padding: "0 24px" }}>
                      <div style={{ fontSize: "11px", fontWeight: "700", color: "#94A3B8", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>Created On</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <Calendar size={16} color="#64748B" />
                        <div style={{ fontSize: "16px", fontWeight: "600", color: "#0F172A" }}>{formatDate(row.created_at)}</div>
                      </div>
                      <div style={{ fontSize: "14px", color: "#64748B", fontWeight: "500" }}>{formatTime(row.created_at)}</div>
                    </div>

                    {/* Actions Section */}
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", paddingLeft: "24px" }}>
                      <div style={{ fontSize: "11px", fontWeight: "700", color: "#94A3B8", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>Actions</div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <ActionButtons 
                          align="left"
                          onView={() => {}}
                          onEdit={() => handleEditClick(row)}
                          onDelete={() => handleDelete(row.id)}
                          deleteConfirmMessage="This action cannot be undone. The selected contract history record will be permanently removed."
                        />
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM PAGINATION */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px", paddingLeft: "80px" }}>
          <div style={{ fontSize: "14px", color: "#64748B", fontWeight: "500" }}>
            Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, total)} of {total} entries
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{ width: "32px", height: "32px", borderRadius: "6px", border: "1px solid #E2E8F0", backgroundColor: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: currentPage === 1 ? "not-allowed" : "pointer", color: "#64748B" }}
            >
              <ChevronLeft size={16} />
            </button>
            <button style={{ width: "32px", height: "32px", borderRadius: "6px", border: "none", backgroundColor: "#5B3DF5", color: "#FFFFFF", fontSize: "14px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              {currentPage}
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              style={{ width: "32px", height: "32px", borderRadius: "6px", border: "1px solid #E2E8F0", backgroundColor: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: currentPage === totalPages || totalPages === 0 ? "not-allowed" : "pointer", color: "#64748B" }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <HostelContractHistoryModal
          editRow={editRow}
          history={history}
          onClose={() => {
            setIsModalOpen(false);
            setEditRow(undefined);
          }}
          onSuccess={handleModalSuccess}
        />
      )}

    </div>
  );
};
