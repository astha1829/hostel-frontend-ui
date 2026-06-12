  "use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Edit2, Save, X, RefreshCw, CheckCircle2, Building2,
  Users, FileText, Calendar, DollarSign, ShieldCheck, Tag, Info, ArrowLeft,
  ArrowRight, Clock, AlertCircle, Sparkles, Receipt, Layers, History, CreditCard, ChevronDown, HelpCircle, Home
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DetailFormSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useRoomAllotmentDetails } from "../hooks/use-room-allotment-details";
import { RoomAllotmentsApi } from "../api";
import { RoomAllotment, RoomTransferSettlePayload } from "../types";

interface RoomAllotmentDetailsPageProps {
  id: string;
}

export const RoomAllotmentDetailsPage: React.FC<RoomAllotmentDetailsPageProps> = ({ id }) => {
  const [activeTab, setActiveTab] = useState<string>("details");

  // Room Transfer Modal state
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [studentAllotments, setStudentAllotments] = useState<RoomAllotment[]>([]);
  const [targetAllotmentId, setTargetAllotmentId] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().substring(0, 10));
  const [calculationMode, setCalculationMode] = useState<"full_month_round" | "daily_prorata">("full_month_round");
  const [transferRemarks, setTransferRemarks] = useState("");
  
  // Advanced overrides in transfer modal
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [monthsUsedOld, setMonthsUsedOld] = useState<string>("");
  const [monthsRemaining, setMonthsRemaining] = useState<string>("");
  const [oldMonthlyRent, setOldMonthlyRent] = useState<string>("");
  const [oldTotalPaid, setOldTotalPaid] = useState<string>("");
  const [newMonthlyRent, setNewMonthlyRent] = useState<string>("");

  const {
    allotment,
    hostels,
    students,
    contracts,
    payments,
    history,
    wallet,
    walletTransactions,
    isLoading,
    isSaving,
    error,
    isEditMode,
    formData,
    formErrors,
    successMessage,
    toggleEditMode,
    handleInputChange,
    handleHostelChange,
    handleFloorChange,
    handleStudentChange,
    saveChanges,
    handleRoomTransfer,
    reload,
    floors,
    rooms,
    isLoadingOptions,
  } = useRoomAllotmentDetails(id);

  // Load other student allotments for transfer modal
  useEffect(() => {
    if (isTransferModalOpen && allotment) {
      RoomAllotmentsApi.getRoomAllotments({ student_id: allotment.student_id })
        .then((res) => {
          // Filter out current allotment and select only non-Active ones (Pending/Draft)
          const options = res.data.filter((a) => a.id !== allotment.id);
          setStudentAllotments(options);
          if (options.length > 0) {
            setTargetAllotmentId(options[0].id);
          }
        })
        .catch((err) => console.error("Failed to load student allotments", err));
    }
  }, [isTransferModalOpen, allotment]);

  if (isLoading) {
    return <DetailFormSkeleton />;
  }

  if (error || !allotment) {
    return (
      <ErrorState
        title="Failed to Retrieve Allotment Details"
        message={error || "The requested room allotment record could not be found."}
        onRetry={reload}
        isLoading={isLoading}
      />
    );
  }

  const getStatusBadge = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status || "Draft"}</Badge>;
    }
  };

  const formatPrice = (price?: number | null) => {
    if (price === undefined || price === null) return "$0.00";
    return `$${Number(price).toFixed(2)}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Header Actions
  const headerActions = (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      {isEditMode ? (
        <>
          <Button variant="secondary" size="md" onClick={toggleEditMode} disabled={isSaving}>
            <X size={16} />
            <span>Cancel</span>
          </Button>
          <Button variant="primary" size="md" onClick={saveChanges} isLoading={isSaving}>
            <Save size={16} />
            <span>Save Allotment</span>
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline" size="md" onClick={reload} style={{ padding: "0.5rem" }} title="Reload details">
            <RefreshCw size={16} />
          </Button>
          <Button variant="primary" size="md" onClick={toggleEditMode}>
            <Edit2 size={16} />
            <span>Edit Allotment</span>
          </Button>
        </>
      )}
    </div>
  );

  const hostelOptions = (hostels || []).map((h) => ({
    label: h.hostel_name,
    value: h.id,
  }));

  const studentOptions = (students || []).map((s) => ({
    label: `${s.student_name} ${s.last_name || ""}`.trim(),
    value: s.id,
  }));

  const contractOptions = (contracts || []).map((c) => ({
    label: c.contract_no,
    value: c.id,
  }));

  const floorOptions = (floors || []).map((f) => ({
    label: `Floor ${f.floor_no}`,
    value: String(f.floor_no),
  }));

  const roomOptions = (rooms || []).map((r) => ({
    label: `Room ${r.room_no} (Cap: ${r.capacity})`,
    value: r.room_no,
  }));

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAllotmentId) {
      alert("Please select a target room allotment.");
      return;
    }

    const payload: RoomTransferSettlePayload = {
      student_id: allotment.student_id,
      source_room_allotment_id: allotment.id,
      target_room_allotment_id: targetAllotmentId,
      effective_date: effectiveDate,
      calculation_mode: calculationMode,
      remarks: transferRemarks || undefined,
      months_used_old: monthsUsedOld ? Number(monthsUsedOld) : undefined,
      months_remaining: monthsRemaining ? Number(monthsRemaining) : undefined,
      old_monthly_rent: oldMonthlyRent ? Number(oldMonthlyRent) : undefined,
      old_total_paid: oldTotalPaid ? Number(oldTotalPaid) : undefined,
      new_monthly_rent: newMonthlyRent ? Number(newMonthlyRent) : undefined,
    };

    const success = await handleRoomTransfer(payload);
    if (success) {
      setIsTransferModalOpen(false);
      // Reset transfer inputs
      setTransferRemarks("");
      setMonthsUsedOld("");
      setMonthsRemaining("");
      setOldMonthlyRent("");
      setOldTotalPaid("");
      setNewMonthlyRent("");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} className="animate-slide-in">
      {/* Success Banner */}
      {successMessage && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "1rem 1.25rem",
          backgroundColor: "hsl(var(--success) / 0.15)",
          color: "hsl(var(--success))",
          border: "1px solid hsl(var(--success) / 0.25)",
          borderRadius: "var(--radius-md)",
          fontSize: "0.875rem",
          fontWeight: 600,
          animation: "slideInDown 0.3s ease-out"
        }}>
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Header */}
      <PageHeader
        title={`Allotment: Room ${allotment.room_no}`}
        description={isEditMode ? "Modifying residential stay allocations and billing values." : "Stay allocations, roommate connections, rent histories, and ledger details."}
        backHref="/room-allotments"
        backText="Back to Allotments"
        actions={headerActions}
        style={{ marginBottom: "0.25rem" }}
      />

      {/* Dynamic Profile Summary Header Card */}
      {!isEditMode && (
        <Card style={{ 
          padding: "2rem", 
          background: "linear-gradient(180deg, hsl(var(--card)) 0%, hsl(var(--secondary) / 0.15) 100%)",
          borderColor: "hsl(var(--border))",
          borderRadius: "var(--radius-lg)",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "200px",
            height: "200px",
            background: "hsl(var(--primary) / 0.03)",
            filter: "blur(40px)",
            borderRadius: "50%",
            pointerEvents: "none"
          }} />

          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap", zIndex: 1 }}>
            <div style={{
              width: "4.5rem",
              height: "4.5rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "hsl(var(--primary) / 0.08)",
              color: "hsl(var(--primary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "var(--shadow-sm)"
            }}>
              <Home size={32} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", flex: 1, minWidth: "200px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                <h2 style={{ fontSize: "1.375rem", fontWeight: 800, letterSpacing: "-0.02em", color: "hsl(var(--foreground))", margin: 0 }}>
                  Room {allotment.room_no}
                </h2>
                {getStatusBadge(allotment.status)}
              </div>

              <p style={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground))", margin: 0, fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Building2 size={14} style={{ color: "hsl(var(--primary))" }} />
                <span>{allotment.hostel_name || "Unassigned Hostel"}</span>
                <span style={{ color: "hsl(var(--border))" }}>•</span>
                <Layers size={14} style={{ color: "hsl(var(--primary))" }} />
                <span>Floor {allotment.floor_no}</span>
                <span style={{ color: "hsl(var(--border))" }}>•</span>
                <Users size={14} style={{ color: "hsl(var(--primary))" }} />
                <span>{allotment.student_name ? allotment.student_name.split("-")[0] : "Unlinked Student"}</span>
              </p>
            </div>
          </div>

          <div style={{ height: "1px", backgroundColor: "hsl(var(--border) / 0.6)" }} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.25rem", zIndex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.05em" }}>Monthly rent</span>
              <span style={{ fontSize: "1.125rem", fontWeight: 750, color: "hsl(var(--primary))" }}>{formatPrice(allotment.rent)}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.05em" }}>Linked Lease Contract</span>
              <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: "hsl(var(--foreground))" }}>{allotment.hostel_contract_name || "No Contract Linked"}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.05em" }}>Allotted College</span>
              <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: "hsl(var(--foreground))" }}>{allotment.college || "—"}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.05em" }}>Transaction Surcharge</span>
              <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: "hsl(var(--foreground))" }}>{allotment.add_transaction_charge ? "Applied" : "None"}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Top Tabs */}
      {!isEditMode && (
        <div style={{
          display: "flex",
          borderBottom: "1px solid hsl(var(--border))",
          gap: "1.5rem",
          marginBottom: "0.5rem"
        }}>
          {[
            { id: "details", label: "Details", icon: <Home size={15} /> },
            { id: "rent", label: "Rent Details", icon: <Receipt size={15} /> },
            { id: "history", label: "Hostel History", icon: <History size={15} /> },
            { id: "wallet", label: "Student Advance Settlement", icon: <CreditCard size={15} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "0.75rem 0.25rem",
                fontSize: "0.9375rem",
                fontWeight: 600,
                backgroundColor: "transparent",
                border: "none",
                borderBottom: activeTab === tab.id ? "2px solid hsl(var(--primary))" : "2px solid transparent",
                color: activeTab === tab.id ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem"
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* View Mode Contents */}
      {!isEditMode && activeTab === "details" && (
        <div className="room-details-grid animate-slide-in">
          
          {/* Left Column (3fr) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* Student Snapshot Card */}
            <SectionCard title="Student Snapshot" description="Resident demographic details, contacts, and identification references.">
              <div style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "1.25rem",
                padding: "1.25rem",
                backgroundColor: "hsl(var(--secondary) / 0.15)",
                border: "1px solid hsl(var(--border) / 0.6)",
                borderRadius: "var(--radius-md)",
                marginBottom: "1rem"
              }}>
                <div style={{
                  width: "3.5rem",
                  height: "3.5rem",
                  borderRadius: "50%",
                  backgroundColor: "hsl(var(--primary) / 0.08)",
                  color: "hsl(var(--primary))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  border: "1px solid hsl(var(--primary) / 0.15)",
                  flexShrink: 0
                }}>
                  {(allotment.first_name ? `${allotment.first_name} ${allotment.last_name || ""}` : (allotment.student_name ? allotment.student_name.split("-")[0] : "ST"))
                    .trim()
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()}
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "hsl(var(--muted-foreground) / 1.25)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Resident Student</span>
                  <Link href={`/students/${allotment.student_id}`} style={{ fontSize: "1.125rem", fontWeight: 800, color: "hsl(var(--primary))", textDecoration: "underline" }}>
                    {allotment.first_name ? `${allotment.first_name} ${allotment.last_name || ""}`.trim() : (allotment.student_name ? allotment.student_name.split("-")[0] : "Unlinked Student")}
                  </Link>
                  <span style={{ fontSize: "0.8125rem", color: "hsl(var(--muted-foreground) / 1.25)", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                    <span>Registered Profile</span>
                  </span>
                </div>
              </div>

              <div className="spec-grid">
                <div className="spec-item">
                  <span className="spec-label">First Name</span>
                  <span className="spec-value">{allotment.first_name || "—"}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Last Name</span>
                  <span className="spec-value">{allotment.last_name || "—"}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Mobile Contact Number</span>
                  <span className="spec-value">{allotment.phone_number || "—"}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Passport Identification</span>
                  <span className="spec-value-mono">{allotment.passport_number || "—"}</span>
                </div>
                <div className="spec-item" style={{ gridColumn: "span 2" }}>
                  <span className="spec-label">College / Institution</span>
                  <span className="spec-value">{allotment.college || "—"}</span>
                </div>
              </div>
            </SectionCard>

            {/* Room Assignment Details Card */}
            <SectionCard title="Room Assignment Details" description="Overview of residence allocations, physical layouts, and pricing profiles.">
              <div className="spec-grid">
                <div className="spec-item">
                  <span className="spec-label">Hostel Residence</span>
                  <span className="spec-value" style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontWeight: 650 }}>
                    <Building2 size={14} style={{ color: "hsl(var(--primary))" }} />
                    <span>{allotment.hostel_name || "Unassigned Hostel"}</span>
                  </span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Room Number Code</span>
                  <span className="spec-value-mono" style={{ fontWeight: 800, color: "hsl(var(--primary))", fontSize: "0.9375rem" }}>
                    Room {allotment.room_no}
                  </span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Floor Level Number</span>
                  <span className="spec-value">Floor {allotment.floor_no}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Allotment Active State</span>
                  <span className="spec-value">
                    <Badge variant={allotment.status?.toLowerCase() === "active" ? "success" : "secondary"}>
                      {allotment.status}
                    </Badge>
                  </span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Monthly Rent Amount</span>
                  <span className="spec-value" style={{ color: "hsl(var(--primary))", fontWeight: 800 }}>
                    {formatPrice(allotment.rent)}
                  </span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Break Stay Date</span>
                  <span className="spec-value" style={{ color: "hsl(var(--muted-foreground) / 1.25)" }}>—</span>
                </div>
                <div className="spec-item" style={{ gridColumn: "span 2" }}>
                  <span className="spec-label">Remarks & Auditing Log</span>
                  <span className="spec-value" style={{ color: "hsl(var(--foreground) / 0.85)" }}>
                    {allotment.remarks || "No administrative remarks logged."}
                  </span>
                </div>
              </div>
            </SectionCard>

            {/* Contract & Payment Reference Card */}
            <SectionCard title="Contract & Payment Reference" description="Linked lease parameters, transactions, and surcharge configurations.">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
                
                {/* Linked Contract */}
                <div style={{
                  padding: "1.25rem",
                  backgroundColor: "hsl(var(--secondary) / 0.1)",
                  border: "1px solid hsl(var(--border) / 0.6)",
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem"
                }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "hsl(var(--muted-foreground) / 1.25)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Linked Lease Agreement</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.25rem" }}>
                    <div style={{
                      width: "2.25rem",
                      height: "2.25rem",
                      borderRadius: "var(--radius-sm)",
                      backgroundColor: "hsl(var(--primary) / 0.08)",
                      color: "hsl(var(--primary))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <FileText size={16} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Link href={`/hostel-contracts/${allotment.hostel_contract_id}`} style={{ fontSize: "0.9375rem", fontWeight: 700, color: "hsl(var(--primary))", textDecoration: "underline" }}>
                        {allotment.hostel_contract_name || "View Contract Details"}
                      </Link>
                      <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", color: "hsl(var(--muted-foreground) / 1.25)", marginTop: "0.125rem" }}>
                        Active Tenancy Lease
                      </span>
                    </div>
                  </div>
                </div>

                {/* Surcharges & Last Payment */}
                <div style={{
                  padding: "1.25rem",
                  backgroundColor: "hsl(var(--secondary) / 0.1)",
                  border: "1px solid hsl(var(--border) / 0.6)",
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "hsl(var(--muted-foreground) / 1.25)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Transaction Surcharge</span>
                    <Badge variant={allotment.add_transaction_charge ? "success" : "secondary"} style={{ fontSize: "0.6875rem" }}>
                      {allotment.add_transaction_charge ? "Applied" : "None"}
                    </Badge>
                  </div>
                  <div style={{ height: "1px", backgroundColor: "hsl(var(--border) / 0.5)", margin: "0.25rem 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "hsl(var(--muted-foreground) / 1.25)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Last Receipt Number</span>
                    <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "hsl(var(--foreground))" }}>
                      {allotment.last_payment_receipt_number || "—"}
                    </span>
                  </div>
                </div>

              </div>
            </SectionCard>

          </div>

          {/* Right Column (2fr) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* Connections & Room Transfer Card */}
            <SectionCard title="Room Transfer & Operations" description="Settle stay credits and allocate the student to a new room.">
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <p style={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground) / 1.25)", margin: 0, lineHeight: 1.5 }}>
                  Use this action to terminate the current room allotment, calculate pro-rata credit balances, deposit refunds to student advance settlement wallet, and migrate to a target pending room allotment.
                </p>
                <Button 
                  variant="primary" 
                  size="md" 
                  onClick={() => setIsTransferModalOpen(true)}
                  style={{ 
                    width: "100%", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    gap: "0.5rem",
                    boxShadow: "0 2px 6px hsl(var(--primary) / 0.12)"
                  }}
                  disabled={allotment.status !== "Active"}
                >
                  <ArrowRight size={16} />
                  <span>Execute Room Transfer</span>
                </Button>
              </div>
            </SectionCard>

            {/* Financial Highlights */}
            <SectionCard title="Billing Summary" description="Allocated rent billing rate.">
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{
                  padding: "1.25rem",
                  background: "linear-gradient(135deg, hsl(var(--primary) / 0.08) 0%, hsl(var(--primary) / 0.02) 100%)",
                  border: "1px solid hsl(var(--primary) / 0.15)",
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "hsl(var(--muted-foreground) / 1.25)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Calculated Monthly Rent</span>
                    <span style={{ fontSize: "1.75rem", fontWeight: 800, color: "hsl(var(--primary))", marginTop: "0.25rem", letterSpacing: "-0.02em" }}>
                      {formatPrice(allotment.rent)}
                    </span>
                  </div>
                  <Receipt size={28} style={{ color: "hsl(var(--primary))", opacity: 0.8 }} />
                </div>
              </div>
            </SectionCard>

            {/* Audit Logs */}
            <SectionCard title="Audit Registry" description="Log details for record registry times.">
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8125rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "hsl(var(--muted-foreground) / 1.25)" }}>Record Created:</span>
                  <span style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>{formatDate(allotment.created_at)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "hsl(var(--muted-foreground) / 1.25)" }}>Last Modified:</span>
                  <span style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>{formatDate(allotment.updated_at)}</span>
                </div>
              </div>
            </SectionCard>

          </div>
        </div>
      )}

      {/* Edit Mode Forms */}
      {isEditMode && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          <SectionCard title="Contract Basics" description="Choose status, transaction rules, and notes.">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
              <Select
                label="Allotment Status *"
                value={formData.status || ""}
                onChange={(e) => handleInputChange("status", e.target.value)}
                error={formErrors.status}
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                  { label: "Pending", value: "Pending" },
                ]}
                disabled={isSaving}
              />
              <Input
                label="Monthly Rent ($)"
                type="number"
                value={formData.rent ?? ""}
                onChange={(e) => handleInputChange("rent", e.target.value)}
                error={formErrors.rent}
                disabled={isSaving}
              />
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", height: "100%", paddingTop: "1.75rem" }}>
                <input
                  type="checkbox"
                  id="add_transaction_charge"
                  checked={!!formData.add_transaction_charge}
                  onChange={(e) => handleInputChange("add_transaction_charge", e.target.checked)}
                  disabled={isSaving}
                  style={{ width: "18px", height: "18px", accentColor: "hsl(var(--primary))", cursor: "pointer" }}
                />
                <label htmlFor="add_transaction_charge" style={{ fontSize: "0.875rem", fontWeight: 700, cursor: "pointer" }}>Add Transaction Charge</label>
              </div>
              <Input
                label="Remarks"
                value={formData.remarks || ""}
                onChange={(e) => handleInputChange("remarks", e.target.value)}
                disabled={isSaving}
                style={{ gridColumn: "span 2" }}
              />
            </div>
          </SectionCard>

          <SectionCard title="Student & Contract Connections" description="Link stay parameters to resident contracts.">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
              <Select
                label="Allotted Student *"
                value={formData.student_id || ""}
                onChange={(e) => handleStudentChange(e.target.value)}
                error={formErrors.student_id}
                options={studentOptions}
                disabled={isSaving || isLoadingOptions}
              />
              <Select
                label="Lease Contract *"
                value={formData.hostel_contract_id || ""}
                onChange={(e) => handleInputChange("hostel_contract_id", e.target.value)}
                error={formErrors.hostel_contract_id}
                options={contractOptions}
                disabled={isSaving || isLoadingOptions}
              />
            </div>
          </SectionCard>

          <SectionCard title="Hostel Location Allocation" description="Define hostel, floor level, and target room number.">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
              <Select
                label="Target Hostel *"
                value={formData.hostel_id || ""}
                onChange={(e) => handleHostelChange(e.target.value)}
                error={formErrors.hostel_id}
                options={hostelOptions}
                disabled={isSaving || isLoadingOptions}
              />
              <Select
                label="Floor Level *"
                value={String(formData.floor_no || "")}
                onChange={(e) => handleFloorChange(e.target.value)}
                error={formErrors.floor_no}
                options={floorOptions}
                disabled={isSaving || isLoadingOptions}
              />
              <Select
                label="Room Number Code *"
                value={formData.room_no || ""}
                onChange={(e) => handleInputChange("room_no", e.target.value)}
                error={formErrors.room_no}
                options={roomOptions}
                disabled={isSaving || isLoadingOptions}
              />
            </div>
          </SectionCard>

        </div>
      )}

      {/* Rent Details Tab */}
      {!isEditMode && activeTab === "rent" && (
        <Card className="animate-slide-in" style={{ border: "1px solid hsl(var(--border) / 0.8)", boxShadow: "var(--shadow-sm)" }}>
          <CardContent style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Receipt size={18} style={{ color: "hsl(var(--primary))" }} />
              <span>Rent Ledger Statements</span>
            </h3>

            {payments.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem 1.5rem", color: "hsl(var(--muted-foreground))" }}>
                <Receipt size={32} style={{ margin: "0 auto 0.75rem", opacity: 0.6 }} />
                <h4 style={{ fontSize: "1rem", fontWeight: 650, margin: 0 }}>No Rent Payments Recorded</h4>
                <p style={{ fontSize: "0.8125rem", marginTop: "0.25rem" }}>All rent transactions for this allotment will be listed here.</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid hsl(var(--border))", color: "hsl(var(--muted-foreground))", textAlign: "left" }}>
                      <th style={{ padding: "0.75rem 0.5rem", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Posting Date</th>
                      <th style={{ padding: "0.75rem 0.5rem", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Type</th>
                      <th style={{ padding: "0.75rem 0.5rem", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Amount</th>
                      <th style={{ padding: "0.75rem 0.5rem", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Status</th>
                      <th style={{ padding: "0.75rem 0.5rem", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Summary / Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id} style={{ borderBottom: "1px solid hsl(var(--border) / 0.5)" }}>
                        <td style={{ padding: "0.75rem 0.5rem", fontWeight: 600 }}>{formatDate(p.posting_datetime)}</td>
                        <td style={{ padding: "0.75rem 0.5rem" }}>{p.transaction_type}</td>
                        <td style={{ padding: "0.75rem 0.5rem", fontWeight: 700, color: "hsl(var(--primary))" }}>{formatPrice(p.total_amount)}</td>
                        <td style={{ padding: "0.75rem 0.5rem" }}>
                          <Badge variant={p.payment_status.toLowerCase() === "completed" || p.payment_status.toLowerCase() === "paid" ? "success" : "warning"}>
                            {p.payment_status}
                          </Badge>
                        </td>
                        <td style={{ padding: "0.75rem 0.5rem", color: "hsl(var(--muted-foreground))", fontSize: "0.8125rem" }}>{p.summary_json || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Hostel History Tab */}
      {!isEditMode && activeTab === "history" && (
        <Card className="animate-slide-in" style={{ border: "1px solid hsl(var(--border) / 0.8)", boxShadow: "var(--shadow-sm)" }}>
          <CardContent style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <History size={18} style={{ color: "hsl(var(--primary))" }} />
              <span>Residency Stay History</span>
            </h3>

            {history.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem 1.5rem", color: "hsl(var(--muted-foreground))" }}>
                <History size={32} style={{ margin: "0 auto 0.75rem", opacity: 0.6 }} />
                <h4 style={{ fontSize: "1rem", fontWeight: 650, margin: 0 }}>No Stay History Logs Found</h4>
                <p style={{ fontSize: "0.8125rem", marginTop: "0.25rem" }}>Stay logs and transfer timelines will appear here on room revisions.</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid hsl(var(--border))", color: "hsl(var(--muted-foreground))", textAlign: "left" }}>
                      <th style={{ padding: "0.75rem 0.5rem", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Check-in Date</th>
                      <th style={{ padding: "0.75rem 0.5rem", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Transfer Date</th>
                      <th style={{ padding: "0.75rem 0.5rem", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Target Hostel</th>
                      <th style={{ padding: "0.75rem 0.5rem", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Log Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h) => (
                      <tr key={h.id} style={{ borderBottom: "1px solid hsl(var(--border) / 0.5)" }}>
                        <td style={{ padding: "0.75rem 0.5rem", fontWeight: 600 }}>{formatDate(h.from_date)}</td>
                        <td style={{ padding: "0.75rem 0.5rem" }}>{formatDate(h.to_transfer_date)}</td>
                        <td style={{ padding: "0.75rem 0.5rem", fontWeight: 500 }}>{h.hostel_name || allotment.hostel_name}</td>
                        <td style={{ padding: "0.75rem 0.5rem", color: "hsl(var(--muted-foreground))", fontSize: "0.8125rem" }}>{formatDate(h.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Student Advance Settlement Tab */}
      {!isEditMode && activeTab === "wallet" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} className="animate-slide-in">
          
          {/* Wallet Balance highlight */}
          <Card style={{ 
            padding: "1.5rem", 
            border: "1px solid hsl(var(--border) / 0.8)", 
            boxShadow: "var(--shadow-sm)",
            background: "linear-gradient(135deg, hsl(var(--secondary) / 0.05) 0%, hsl(var(--secondary) / 0.2) 100%)"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.05em" }}>Student Advance Balance</span>
                <span style={{ fontSize: "2rem", fontWeight: 850, color: "hsl(var(--primary))", marginTop: "0.25rem", letterSpacing: "-0.02em" }}>
                  {wallet ? formatPrice(wallet.balance) : "$0.00"}
                </span>
              </div>
              <div style={{
                width: "3rem",
                height: "3rem",
                borderRadius: "50%",
                backgroundColor: "hsl(var(--primary) / 0.08)",
                color: "hsl(var(--primary))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <CreditCard size={20} />
              </div>
            </div>
          </Card>

          {/* Wallet Ledger */}
          <Card style={{ border: "1px solid hsl(var(--border) / 0.8)", boxShadow: "var(--shadow-sm)" }}>
            <CardContent style={{ padding: "1.5rem" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1.25rem" }}>Advance Settlement Transactions</h3>

              {walletTransactions.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem 1.5rem", color: "hsl(var(--muted-foreground))" }}>
                  <CreditCard size={32} style={{ margin: "0 auto 0.75rem", opacity: 0.6 }} />
                  <h4 style={{ fontSize: "1rem", fontWeight: 650, margin: 0 }}>No Wallet Ledger Transactions</h4>
                  <p style={{ fontSize: "0.8125rem", marginTop: "0.25rem" }}>Credits and debits applied from room transfer settlements will log here.</p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid hsl(var(--border))", color: "hsl(var(--muted-foreground))", textAlign: "left" }}>
                        <th style={{ padding: "0.75rem 0.5rem", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Posting Date</th>
                        <th style={{ padding: "0.75rem 0.5rem", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Action Type</th>
                        <th style={{ padding: "0.75rem 0.5rem", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Flow Direction</th>
                        <th style={{ padding: "0.75rem 0.5rem", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Amount</th>
                        <th style={{ padding: "0.75rem 0.5rem", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Remaining Balance</th>
                        <th style={{ padding: "0.75rem 0.5rem", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {walletTransactions.map((tx) => (
                        <tr key={tx.id} style={{ borderBottom: "1px solid hsl(var(--border) / 0.5)" }}>
                          <td style={{ padding: "0.75rem 0.5rem" }}>{formatDate(tx.created_at)}</td>
                          <td style={{ padding: "0.75rem 0.5rem", fontWeight: 600 }}>{tx.transaction_type.replace(/_/g, ' ')}</td>
                          <td style={{ padding: "0.75rem 0.5rem" }}>
                            <Badge variant={tx.direction === "credit" ? "success" : "danger"} style={{ textTransform: "uppercase", fontSize: "0.6875rem" }}>
                              {tx.direction}
                            </Badge>
                          </td>
                          <td style={{ 
                            padding: "0.75rem 0.5rem", 
                            fontWeight: 750, 
                            color: tx.direction === "credit" ? "hsl(var(--success))" : "hsl(var(--destructive))"
                          }}>
                            {tx.direction === "credit" ? "+" : "-"}{formatPrice(tx.amount)}
                          </td>
                          <td style={{ padding: "0.75rem 0.5rem", fontWeight: 600 }}>{formatPrice(tx.balance_after)}</td>
                          <td style={{ padding: "0.75rem 0.5rem", color: "hsl(var(--muted-foreground))", fontSize: "0.8125rem" }}>{tx.remarks || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Room Transfer Settle Modal Overlay */}
      {isTransferModalOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
          padding: "1.5rem",
          animation: "fadeIn 0.2s ease-out"
        }} onClick={() => setIsTransferModalOpen(false)}>
          <Card style={{
            width: "100%",
            maxWidth: "600px",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius-lg)",
            animation: "scaleIn 0.2s ease-out"
          }} onClick={(e) => e.stopPropagation()}>
            
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1.25rem 1.5rem",
              borderBottom: "1px solid hsl(var(--border))"
            }}>
              <div>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 750, color: "hsl(var(--foreground))", margin: 0 }}>Room Transfer Settlement</h3>
                <span style={{ fontSize: "0.8125rem", color: "hsl(var(--muted-foreground))" }}>
                  Settle stay credits and transfer student to a new room allotment.
                </span>
              </div>
              <button 
                onClick={() => setIsTransferModalOpen(false)}
                style={{ background: "none", border: "none", color: "hsl(var(--muted-foreground))", cursor: "pointer", padding: "0.25rem" }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleTransferSubmit}>
              <CardContent style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                
                {/* Target Room Allotment select */}
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "hsl(var(--foreground))", marginBottom: "0.5rem" }}>
                    Target Room Allotment *
                  </label>
                  {studentAllotments.length === 0 ? (
                    <div style={{
                      padding: "0.75rem 1rem",
                      backgroundColor: "hsl(var(--secondary) / 0.15)",
                      border: "1px dashed hsl(var(--border))",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.8125rem",
                      color: "hsl(var(--muted-foreground))",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}>
                      <AlertCircle size={15} />
                      <span>No other allotments found. You must create the target allotment in "Pending" or "Draft" state first.</span>
                    </div>
                  ) : (
                    <Select
                      value={targetAllotmentId}
                      onChange={(e) => setTargetAllotmentId(e.target.value)}
                      options={studentAllotments.map((a) => ({
                        label: `Room ${a.room_no} (${a.hostel_name || "Hostel"}) - ${a.status}`,
                        value: a.id
                      }))}
                      style={{ fontSize: "0.875rem" }}
                    />
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  {/* Effective Date */}
                  <Input
                    label="Effective Date *"
                    type="date"
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                    style={{ fontSize: "0.875rem" }}
                    required
                  />

                  {/* Calculation Mode */}
                  <Select
                    label="Calculation Mode"
                    value={calculationMode}
                    onChange={(e) => setCalculationMode(e.target.value as any)}
                    options={[
                      { label: "Full Month Round Up", value: "full_month_round" },
                      { label: "Daily Pro-rata", value: "daily_prorata" },
                    ]}
                    style={{ fontSize: "0.875rem" }}
                  />
                </div>

                {/* Collapsible Advanced calculation overrides */}
                <div style={{ border: "1px solid hsl(var(--border) / 0.6)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      backgroundColor: "hsl(var(--secondary) / 0.15)",
                      border: "none",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      fontSize: "0.8125rem",
                      fontWeight: 700,
                      color: "hsl(var(--foreground))"
                    }}
                  >
                    <span>Advanced Calculation Overrides (Optional)</span>
                    <ChevronDown size={14} style={{ transform: showAdvanced ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                  </button>
                  {showAdvanced && (
                    <div style={{ padding: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", borderTop: "1px solid hsl(var(--border) / 0.6)" }}>
                      <Input
                        label="Months Used (Old Allotment)"
                        type="number"
                        placeholder="e.g. 3.5"
                        value={monthsUsedOld}
                        onChange={(e) => setMonthsUsedOld(e.target.value)}
                        style={{ fontSize: "0.8125rem" }}
                      />
                      <Input
                        label="Months Remaining (New Allotment)"
                        type="number"
                        placeholder="e.g. 8.5"
                        value={monthsRemaining}
                        onChange={(e) => setMonthsRemaining(e.target.value)}
                        style={{ fontSize: "0.8125rem" }}
                      />
                      <Input
                        label="Old Monthly Rent ($)"
                        type="number"
                        placeholder="e.g. 500"
                        value={oldMonthlyRent}
                        onChange={(e) => setOldMonthlyRent(e.target.value)}
                        style={{ fontSize: "0.8125rem" }}
                      />
                      <Input
                        label="Old Total Paid Amount ($)"
                        type="number"
                        placeholder="e.g. 1500"
                        value={oldTotalPaid}
                        onChange={(e) => setOldTotalPaid(e.target.value)}
                        style={{ fontSize: "0.8125rem" }}
                      />
                      <Input
                        label="New Monthly Rent ($)"
                        type="number"
                        placeholder="e.g. 600"
                        value={newMonthlyRent}
                        onChange={(e) => setNewMonthlyRent(e.target.value)}
                        style={{ fontSize: "0.8125rem" }}
                      />
                    </div>
                  )}
                </div>

                {/* Remarks */}
                <Input
                  label="Remarks"
                  placeholder="Transfer justification notes..."
                  value={transferRemarks}
                  onChange={(e) => setTransferRemarks(e.target.value)}
                  style={{ fontSize: "0.875rem" }}
                />

              </CardContent>

              <div style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.75rem",
                padding: "1rem 1.5rem",
                borderTop: "1px solid hsl(var(--border))"
              }}>
                <Button variant="secondary" size="md" type="button" onClick={() => setIsTransferModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="md" type="submit" disabled={!targetAllotmentId}>
                  Settle Transfer
                </Button>
              </div>
            </form>

          </Card>
        </div>
      )}

    </div>
  );
};
