"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ChevronLeft, Edit3, Trash2, Calendar, FileText, ArrowRight, User, 
  Layers, ShieldCheck, HelpCircle, RefreshCw, ChevronDown, ChevronUp, Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const [isDebugOpen, setIsDebugOpen] = useState(false);

  const getStatusBadge = (status?: string | null) => {
    if (!status) return <Badge variant="secondary">—</Badge>;
    const lower = status.toLowerCase();
    if (lower === "confirmed" || lower === "approved") {
      return <Badge variant="success">{status}</Badge>;
    }
    if (lower === "completed") {
      return <Badge variant="info">{status}</Badge>;
    }
    if (lower === "pending" || lower === "pending review") {
      return <Badge variant="warning">{status}</Badge>;
    }
    if (lower === "cancelled" || lower === "rejected") {
      return <Badge variant="danger">{status}</Badge>;
    }
    return <Badge variant="default">{status}</Badge>;
  };

  const getActionBadge = (action?: string | null) => {
    if (!action) return <Badge variant="secondary">—</Badge>;
    const lower = action.toLowerCase();
    if (lower === "create") return <Badge variant="default" style={{ backgroundColor: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>Create</Badge>;
    if (lower === "transfer") return <Badge variant="default" style={{ backgroundColor: "hsl(142.1 76.2% 36.3% / 0.1)", color: "hsl(142.1 76.2% 36.3%)" }}>Transfer</Badge>;
    if (lower === "cancel") return <Badge variant="danger">Cancel</Badge>;
    return <Badge variant="secondary">{action}</Badge>;
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
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  };

  const formatDateTime = (dateTimeStr?: string | null) => {
    if (!dateTimeStr) return "—";
    const d = new Date(dateTimeStr);
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
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
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. HERO HEADER REDESIGN */}
      <div className="flex flex-col gap-2 border-b border-border/50 pb-5">
        {/* Breadcrumb / Back button */}
        <div className="flex items-center gap-2">
          <Link href="/hostel-contract-events" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ChevronLeft size={16} />
            <span>Contract Events</span>
          </Link>
        </div>

        {/* Title and Actions Row */}
        <div className="flex justify-between items-start gap-6 flex-wrap">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground m-0">
              {getActionTitle(event.action_type)}
            </h1>
            <div className="text-[15px] text-muted-foreground m-0 flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-foreground">{studentName}</span>
              <span className="text-border">•</span>
              <span className="font-mono text-[13px] bg-secondary px-1.5 py-0.5 rounded-sm">
                {event.source_hostel_contract_name || "None"}
              </span>
              <span>➔</span>
              <span className="font-mono text-[13px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm font-semibold">
                {event.target_hostel_contract_name || "None"}
              </span>
              <span className="text-border">•</span>
              <div className="inline-flex">{getStatusBadge(event.event_status)}</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 items-center">
            <Button
              variant="outline"
              size="md"
              onClick={reload}
              className="p-2 h-10 w-10"
              title="Reload details"
            >
              <RefreshCw size={16} />
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => router.push(`/hostel-contract-events/${event.id}/edit`)}
              className="gap-1.5"
            >
              <Edit3 size={16} />
              <span>Edit Event</span>
            </Button>
            <div className="relative">
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="gap-1"
              >
                <span>More Actions</span>
                <span className="text-[10px]">▼</span>
              </Button>
              {isDropdownOpen && (
                <>
                  <div 
                    onClick={() => setIsDropdownOpen(false)} 
                    className="fixed inset-0 z-40"
                  />
                  <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-md shadow-lg z-50 min-w-[160px] flex flex-col p-1">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        router.push(`/hostel-contract-events/new?duplicate=${event.id}`);
                      }}
                      className="px-4 py-2 text-left bg-transparent border-none text-sm cursor-pointer text-foreground w-full hover:bg-accent rounded-sm"
                    >
                      Duplicate Event
                    </button>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        window.print();
                      }}
                      className="px-4 py-2 text-left bg-transparent border-none text-sm cursor-pointer text-foreground w-full hover:bg-accent rounded-sm"
                    >
                      Print/Export
                    </button>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onDeleteConfirm();
                      }}
                      className="px-4 py-2 text-left bg-transparent border-none text-sm cursor-pointer text-destructive w-full hover:bg-accent rounded-sm"
                    >
                      Delete Event
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Metadata Row */}
        <div className="flex gap-5 items-center flex-wrap text-[13px] text-muted-foreground mt-2">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold">Event ID:</span>
            <span className="font-mono text-foreground font-medium">{event.id.toUpperCase()}</span>
          </div>
          <div className="w-[1px] h-3 bg-border" />
          <div className="flex items-center gap-1.5">
            <span className="font-semibold">Type:</span>
            <Badge variant="secondary" className="uppercase text-[11px] font-bold px-1.5">{event.action_type}</Badge>
          </div>
          <div className="w-[1px] h-3 bg-border" />
          <div className="flex items-center gap-1.5">
            <span className="font-semibold">Effective Date:</span>
            <span className="text-foreground font-semibold">{formatDate(event.effective_date)}</span>
          </div>
        </div>
      </div>

      {/* 2. EVENT OVERVIEW SECTION (KPI rows) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* KPI 1: Event Type */}
        <div className="p-4 bg-card border border-border/80 rounded-lg shadow-sm flex flex-col gap-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Event Type</span>
          <span className="text-xl font-bold text-foreground">{event.action_type}</span>
        </div>

        {/* KPI 2: Status */}
        <div className="p-4 bg-card border border-border/80 rounded-lg shadow-sm flex flex-col gap-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</span>
          <div className="inline-flex mt-0.5">
            {getStatusBadge(event.event_status)}
          </div>
        </div>

        {/* KPI 3: Effective Date */}
        <div className="p-4 bg-card border border-border/80 rounded-lg shadow-sm flex flex-col gap-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Effective Date</span>
          <span className="text-lg font-bold text-primary">{formatDate(event.effective_date)}</span>
        </div>

        {/* KPI 4: Created Date */}
        <div className="p-4 bg-card border border-border/80 rounded-lg shadow-sm flex flex-col gap-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Created On</span>
          <span className="text-lg font-bold text-foreground">{formatDate(event.created_at)}</span>
        </div>

        {/* KPI 5: Settlement Linked */}
        <div className="p-4 bg-card border border-border/80 rounded-lg shadow-sm flex flex-col gap-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Settlement Linked</span>
          <div className="inline-flex mt-0.5">
            {event.settlement_rap ? (
              <Badge variant="success">Yes</Badge>
            ) : (
              <Badge variant="secondary">No</Badge>
            )}
          </div>
        </div>
      </div>

      {/* 3. TRANSITION TIMELINE (MAIN FEATURE - Full Width) */}
      <Card className="border border-border/80 shadow-sm">
        <CardHeader className="border-b border-border/50 py-5 px-6">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity size={18} className="text-primary" />
            <span>Transitional Lifecycle Flow</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
            
            {/* Timeline 1: Contract Lifecycle */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                <span className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">
                  Contract Lifecycle
                </span>
                <Badge variant="secondary" className="text-[11px]">Audit Track 01</Badge>
              </div>

              {/* Vertical Step Line Container */}
              <div className="flex flex-col gap-8 relative">
                
                {/* Visual Line */}
                <div className="absolute left-[15px] top-6 bottom-6 w-0.5 bg-border/60 z-0" />

                {/* Step 1: Source Contract */}
                <div className="flex gap-4 z-10 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${event.source_hostel_contract_id ? "bg-secondary border border-border" : "bg-secondary/40 border border-dashed border-border"}`}>
                    <FileText size={16} className="text-muted-foreground" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Source Contract (Pre-Event)</span>
                    {event.source_hostel_contract_id ? (
                      <Link href={`/hostel-contracts/${event.source_hostel_contract_id}`} className="font-bold text-[15px] text-primary hover:underline">
                        {event.source_hostel_contract_name || "View Contract"}
                      </Link>
                    ) : (
                      <span className="text-[15px] font-semibold text-muted-foreground">None (New Registration)</span>
                    )}
                    {event.contract_type_before && (
                      <span className="text-xs text-muted-foreground">Type: {event.contract_type_before}</span>
                    )}
                  </div>
                </div>

                {/* Step 2: Action node */}
                <div className="flex gap-4 z-10 relative">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <RefreshCw size={16} className="text-primary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Transaction Processed</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 font-semibold">
                        {event.action_type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">by {event.triggered_by || "system"}</span>
                    </div>
                  </div>
                </div>

                {/* Step 3: Target Contract */}
                <div className="flex gap-4 z-10 relative">
                  <div className="w-8 h-8 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center shrink-0">
                    <ShieldCheck size={16} className="text-primary" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-primary uppercase">Target Contract (Post-Event)</span>
                    {event.target_hostel_contract_id ? (
                      <Link href={`/hostel-contracts/${event.target_hostel_contract_id}`} className="font-bold text-[15px] text-primary hover:underline">
                        {event.target_hostel_contract_name || "View Contract"}
                      </Link>
                    ) : (
                      <span className="text-[15px] font-semibold text-muted-foreground">None (Terminated)</span>
                    )}
                    {event.contract_type_after && (
                      <span className="text-xs text-primary">Type: {event.contract_type_after}</span>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Timeline 2: Room Lifecycle */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                <span className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">
                  Room Lifecycle
                </span>
                <Badge variant="secondary" className="text-[11px]">Audit Track 02</Badge>
              </div>

              {/* Vertical Step Line Container */}
              <div className="flex flex-col gap-8 relative">
                
                {/* Visual Line */}
                <div className="absolute left-[15px] top-6 bottom-6 w-0.5 bg-border/60 z-0" />

                {/* Step 1: Source Room */}
                <div className="flex gap-4 z-10 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${event.source_room_allotment_id ? "bg-secondary border border-border" : "bg-secondary/40 border border-dashed border-border"}`}>
                    <Layers size={16} className="text-muted-foreground" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Source Room Allotment</span>
                    {event.source_room_allotment_id ? (
                      <Link href={`/room-allotments/${event.source_room_allotment_id}`} className="font-bold text-[15px] text-primary hover:underline">
                        {event.source_room_allotment_name || "View Allotment"}
                      </Link>
                    ) : (
                      <span className="text-[15px] font-semibold text-muted-foreground">Unassigned</span>
                    )}
                  </div>
                </div>

                {/* Step 2: Allotment Action */}
                <div className="flex gap-4 z-10 relative">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <RefreshCw size={16} className="text-primary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Allotment Transition</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-primary/5 text-primary border border-primary/10 hover:bg-primary/10 font-semibold">
                        ALLOT UPDATE
                      </Badge>
                      <span className="text-xs text-muted-foreground">Effective: {formatDate(event.effective_date)}</span>
                    </div>
                  </div>
                </div>

                {/* Step 3: Target Room */}
                <div className="flex gap-4 z-10 relative">
                  <div className="w-8 h-8 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center shrink-0">
                    <Layers size={16} className="text-primary" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-primary uppercase">Target Room Allotment</span>
                    {event.target_room_allotment_id ? (
                      <Link href={`/room-allotments/${event.target_room_allotment_id}`} className="font-bold text-[15px] text-primary hover:underline">
                        {event.target_room_allotment_name || "View Allotment"}
                      </Link>
                    ) : (
                      <span className="text-[15px] font-semibold text-muted-foreground">Unassigned</span>
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* 4. STUDENT CONTEXT CARD & 5. AUDIT TRAIL SECTION (2 Column Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Student Context Card */}
        <Card className="border border-border/80 shadow-sm">
          <CardHeader className="border-b border-border/50 py-5 px-6">
            <CardTitle className="text-lg flex items-center gap-2">
              <User size={18} className="text-primary" />
              <span>Student Profile Context</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl border border-primary/20 shrink-0">
                {studentName.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() || "ST"}
              </div>
              <div className="flex flex-col">
                <Link href={`/students/${event.student_id}`} className="font-extrabold text-[17px] text-primary hover:underline">
                  {studentName}
                </Link>
                {studentPassId && (
                  <span className="text-[13px] text-muted-foreground font-mono">
                    Passport/ID: {studentPassId}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2.5 border-t border-border/40 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Resident Status</span>
                <span className="font-semibold text-success">Active Resident</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Room Allotment</span>
                <span className="font-semibold text-foreground">{event.target_room_allotment_name || "Unassigned"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Contract Count</span>
                <span className="font-semibold text-foreground">2 Contracts</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Student ID Reference</span>
                <span className="font-mono text-xs text-muted-foreground">{event.student_id}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Audit Trail Grid */}
        <Card className="border border-border/80 shadow-sm">
          <CardHeader className="border-b border-border/50 py-5 px-6">
            <CardTitle className="text-lg flex items-center gap-2">
              <Layers size={18} className="text-primary" />
              <span>Audit Parameters</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-5">
              
              <div>
                <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Created By</span>
                <span className="text-sm font-semibold text-foreground">{event.triggered_by || "system"}</span>
              </div>

              <div>
                <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Effective Date</span>
                <span className="text-sm font-semibold text-primary">{formatDate(event.effective_date)}</span>
              </div>

              <div className="col-span-2 border-t border-border/40 pt-4">
                <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Created At Timestamp</span>
                <span className="text-sm font-medium text-foreground">{formatDateTime(event.created_at)}</span>
              </div>

              <div className="col-span-2 border-t border-border/40 pt-4">
                <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Updated Timestamp</span>
                <span className="text-sm font-medium text-foreground">{formatDateTime(event.updated_at)}</span>
              </div>

              <div className="col-span-2 border-t border-border/40 pt-4">
                <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Event Source</span>
                <span className="text-sm font-semibold text-success">System Audit Ledger</span>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>

      {/* 6. SETTLEMENT REFERENCE REDESIGN (Linked Financial Records) */}
      <Card className="border border-border/80 shadow-sm">
        <CardHeader className="border-b border-border/50 py-5 px-6">
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldCheck size={18} className="text-primary" />
            <span>Linked Financial Records</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {event.settlement_rap ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center p-5 bg-card border border-border rounded-lg shadow-sm transition-colors hover:border-primary">
              
              {/* Left Column: Reference & Clickable Link */}
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Room Allotment Payment (RAP) Reference
                </span>
                <Link href={`/room-allotment-payments/${event.settlement_rap}`} className="font-bold text-[15px] text-primary hover:underline">
                  RAP-{event.settlement_rap.substring(0, 8).toUpperCase()}
                </Link>
                <span className="text-xs text-muted-foreground font-mono">
                  ID: {event.settlement_rap}
                </span>
              </div>

              {/* Middle Column: Details Description */}
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Record Description
                </span>
                <span className="text-sm font-medium text-foreground">
                  Allotment Rent & Security Deposit Settlement
                </span>
              </div>

              {/* Amount Column */}
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Settlement Amount
                </span>
                <span className="text-lg font-bold text-foreground">
                  $1,250.00
                </span>
              </div>

              {/* Status Column */}
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Status
                </span>
                <div>
                  <Badge variant="success">Paid</Badge>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-secondary/15 border border-dashed border-border rounded-md text-muted-foreground">
              <HelpCircle size={20} className="shrink-0" />
              <span className="text-sm">No linked settlement Room Allotment Payment (RAP) reference found for this event.</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 7. ADDITIONAL METADATA (Collapsible Debug Panel) */}
      <Card className="border border-border/80 shadow-sm">
        <button
          type="button"
          onClick={() => setIsDebugOpen(!isDebugOpen)}
          className="w-full flex justify-between items-center py-5 px-6 bg-transparent border-none cursor-pointer text-left"
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-[15px] font-semibold text-card-foreground">
              Additional Metadata
            </span>
            <span className="text-xs text-muted-foreground">
              Raw ledger UUIDs and diagnostic records
            </span>
          </div>
          <div className="flex items-center text-muted-foreground">
            {isDebugOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>
        
        {isDebugOpen && (
          <CardContent className="px-6 pb-6 pt-5 border-t border-dashed border-border/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 font-mono text-[13px]">
              <div>
                <span className="block text-muted-foreground font-semibold">Raw Event ID</span>
                <span className="text-foreground">{event.id}</span>
              </div>
              <div>
                <span className="block text-muted-foreground font-semibold">Raw Student ID</span>
                <span className="text-foreground">{event.student_id}</span>
              </div>
              <div>
                <span className="block text-muted-foreground font-semibold">Source Contract ID</span>
                <span className="text-foreground">{event.source_hostel_contract_id || "null"}</span>
              </div>
              <div>
                <span className="block text-muted-foreground font-semibold">Target Contract ID</span>
                <span className="text-foreground">{event.target_hostel_contract_id || "null"}</span>
              </div>
              <div>
                <span className="block text-muted-foreground font-semibold">Source Allotment ID</span>
                <span className="text-foreground">{event.source_room_allotment_id || "null"}</span>
              </div>
              <div>
                <span className="block text-muted-foreground font-semibold">Target Allotment ID</span>
                <span className="text-foreground">{event.target_room_allotment_id || "null"}</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

    </div>
  );
};
