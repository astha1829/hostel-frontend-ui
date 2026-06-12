"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Edit3, Trash2, Calendar, FileText, ArrowRight, User, HelpCircle, Layers, RefreshCw, ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableContainer, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { DetailFormSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useRoomAllotmentPaymentDetails } from "../hooks/use-room-allotment-payment-details";

interface RoomAllotmentPaymentDetailsPageProps {
  id: string;
}

export const RoomAllotmentPaymentDetailsPage: React.FC<RoomAllotmentPaymentDetailsPageProps> = ({ id }) => {
  const router = useRouter();
  const { payment, isLoading, error, handleDelete, reload } = useRoomAllotmentPaymentDetails(id);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [hoveredOption, setHoveredOption] = React.useState<string | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getStatusBadge = (status?: string | null) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "completed":
      case "success":
        return <Badge variant="success">Paid</Badge>;
      case "pending":
      case "unpaid":
        return <Badge variant="warning">Pending</Badge>;
      case "failed":
      case "cancelled":
        return <Badge variant="danger">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status || "Draft"}</Badge>;
    }
  };

  const formatPrice = (price?: number | null) => {
    if (price === undefined || price === null) return "—";
    return `$${Number(price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
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
      router.push("/room-allotment-payments");
    }
  };

  if (error) {
    return (
      <ErrorState
        title="Details Load Failed"
        message={error}
        onRetry={() => router.push("/room-allotment-payments")}
        isLoading={isLoading}
      />
    );
  }

  if (isLoading || !payment) {
    return <DetailFormSkeleton />;
  }

  const [studentName, studentPassId] = payment.student_name
    ? payment.student_name.split("-")
    : ["Unlinked Student", ""];

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Page Header Actions / Back Nav */}
      <PageHeader
        title={payment.room_allotment_name || "Payment Record"}
        description={`Transaction ledger details for student ${studentName}`}
        backHref="/room-allotment-payments"
        backText="Room Allotment Payments"
        actions={
          <div className="flex gap-3 items-center relative" ref={dropdownRef}>
            <Button
              variant="outline"
              size="md"
              onClick={reload}
              className="p-2"
              title="Reload details"
            >
              <RefreshCw size={16} />
            </Button>
            
            <Button
              variant="primary"
              size="md"
              onClick={() => router.push(`/room-allotment-payments/${payment.id}/edit`)}
              className="gap-1.5"
            >
              <Edit3 size={16} />
              <span>Edit Payment</span>
            </Button>

            <div className="relative">
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="gap-1.5"
              >
                <span>More Actions</span>
                <ChevronDown size={14} />
              </Button>
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border/80 rounded-md shadow-md z-50 flex flex-col p-1">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push(`/room-allotment-payments/new?duplicate=${payment.id}`);
                    }}
                    onMouseEnter={() => setHoveredOption("duplicate")}
                    onMouseLeave={() => setHoveredOption(null)}
                    className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left border-none cursor-pointer text-foreground rounded-sm transition-colors duration-100 ${hoveredOption === "duplicate" ? "bg-secondary/30" : "bg-transparent"}`}
                  >
                    Duplicate Payment
                  </button>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      window.print();
                    }}
                    onMouseEnter={() => setHoveredOption("print")}
                    onMouseLeave={() => setHoveredOption(null)}
                    className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left border-none cursor-pointer text-foreground rounded-sm transition-colors duration-100 ${hoveredOption === "print" ? "bg-secondary/30" : "bg-transparent"}`}
                  >
                    Print / Export
                  </button>
                  <hr className="my-1 border-border/40" />
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onDeleteConfirm();
                    }}
                    onMouseEnter={() => setHoveredOption("delete")}
                    onMouseLeave={() => setHoveredOption(null)}
                    className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left border-none cursor-pointer text-destructive rounded-sm transition-colors duration-100 ${hoveredOption === "delete" ? "bg-destructive/10" : "bg-transparent"}`}
                  >
                    Delete Record
                  </button>
                </div>
              )}
            </div>
          </div>
        }
      />

      {/* Quick Summary Header block */}
      <div className="flex flex-col gap-3 bg-card border border-border/80 rounded-lg py-5 px-6 shadow-sm">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono font-bold text-primary">
                PAYMENT ID: {payment.id.toUpperCase()}
              </span>
              {getStatusBadge(payment.payment_status)}
            </div>
          </div>
        </div>
        
        <hr className="my-1 border-border/40" />
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
          <div>
            <span className="block text-xs text-muted-foreground uppercase font-semibold">Amount</span>
            <span className="text-lg font-bold text-foreground">{formatPrice(payment.total_amount)}</span>
          </div>
          <div>
            <span className="block text-xs text-muted-foreground uppercase font-semibold">Payment Type</span>
            <span className="text-[15px] font-semibold">{payment.transaction_type}</span>
          </div>
          <div>
            <span className="block text-xs text-muted-foreground uppercase font-semibold">Payment Date</span>
            <span className="text-[15px] font-semibold">{formatDate(payment.posting_datetime || payment.created_at)}</span>
          </div>
          <div>
            <span className="block text-xs text-muted-foreground uppercase font-semibold">Student</span>
            <span className="text-[15px] font-semibold">{studentName}</span>
          </div>
          <div>
            <span className="block text-xs text-muted-foreground uppercase font-semibold">Allotment</span>
            <span className="text-[15px] font-semibold">{payment.room_allotment_name || "—"}</span>
          </div>
        </div>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Financial details & linked months */}
        <div className="flex flex-col gap-6">
          
          {/* Financial Breakdown (Description List Layout) */}
          <Card className="border-border/80 shadow-sm">
            <CardHeader className="border-b border-border/50 p-5">
              <CardTitle className="text-lg">Financial Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-5">
              <dl className="grid grid-cols-2 gap-5 m-0">
                <div>
                  <dt className="text-xs font-semibold text-muted-foreground uppercase">Rent Portion</dt>
                  <dd className="text-lg font-semibold mt-1">{formatPrice(payment.rent_amount)}</dd>
                </div>
                
                <div>
                  <dt className="text-xs font-semibold text-muted-foreground uppercase">Penalty Portion</dt>
                  <dd className={`text-lg font-semibold mt-1 ${payment.penalty_amount && payment.penalty_amount > 0 ? "text-destructive" : ""}`}>
                    {formatPrice(payment.penalty_amount)}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold text-muted-foreground uppercase">Additional Charges</dt>
                  <dd className="text-lg font-semibold mt-1">{formatPrice(payment.transaction_charge)}</dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold text-primary uppercase">Total Paid Amount</dt>
                  <dd className="text-xl font-bold mt-1 text-primary">{formatPrice(payment.total_amount)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Linked Billing Months (Compact Table / Inline Text) */}
          <Card className="border-border/80 shadow-sm">
            <CardHeader className="border-b border-border/50 p-5">
              <CardTitle className="text-lg">Linked Billing Months</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-5">
              {payment.months.length === 0 ? (
                <p className="m-0 text-sm text-muted-foreground">
                  No linked rent records.
                </p>
              ) : (
                <TableContainer className="border border-border/60">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/20">
                        <TableHead className="font-semibold text-[13px]">Rent Reference ID</TableHead>
                        <TableHead className="font-semibold text-[13px]">Month</TableHead>
                        <TableHead className="font-semibold text-[13px]">Rent Portion</TableHead>
                        <TableHead className="font-semibold text-[13px]">Penalty Portion</TableHead>
                        <TableHead className="font-semibold text-[13px]">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payment.months.map((m, idx) => {
                        const rent = m.rent_amount || 0;
                        const penalty = m.penalty_amount || 0;
                        const subtotal = rent + penalty;
                        return (
                          <TableRow key={idx}>
                            <TableCell className="table-td-mono text-[13px]">
                              {m.rent_payment_id ? m.rent_payment_id.substring(0, 8).toUpperCase() : "Direct Entry"}
                            </TableCell>
                            <TableCell className="table-td font-semibold">
                              {m.month_label}
                            </TableCell>
                            <TableCell className="table-td">{formatPrice(rent)}</TableCell>
                            <TableCell className={`table-td ${penalty > 0 ? "text-destructive" : ""}`}>
                              {formatPrice(penalty)}
                            </TableCell>
                            <TableCell className="table-td font-bold text-primary">
                              {formatPrice(subtotal)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Profile details & Transfer Context */}
        <div className="flex flex-col gap-6">
          
          {/* Administrative Profile Details (Flat list) */}
          <Card className="border-border/80 shadow-sm">
            <CardHeader className="border-b border-border/50 p-5">
              <CardTitle className="text-lg">Administrative & Student Profile</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-5 flex flex-col gap-5">
              
              <div className="flex flex-col gap-3.5">
                <div className="flex justify-between items-center pb-2 border-b border-border/40">
                  <span className="text-sm text-muted-foreground">Student Name</span>
                  <Link 
                    href={`/students/${payment.student_id}`}
                    className="font-semibold text-sm text-primary hover:underline"
                  >
                    {studentName}
                  </Link>
                </div>

                {studentPassId && (
                  <div className="flex justify-between items-center pb-2 border-b border-border/40">
                    <span className="text-sm text-muted-foreground">Passport Number</span>
                    <span className="text-sm font-mono font-medium">
                      {studentPassId}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pb-2 border-b border-border/40">
                  <span className="text-sm text-muted-foreground">Room Allotment</span>
                  <Link 
                    href={`/room-allotments/${payment.room_allotment_id}`}
                    className="font-semibold text-sm text-primary hover:underline"
                  >
                    {payment.room_allotment_name || "View Allotment"}
                  </Link>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-border/40">
                  <span className="text-sm text-muted-foreground">Payment Status</span>
                  <span>{getStatusBadge(payment.payment_status)}</span>
                </div>
              </div>

              {/* Parse & render Internal Notes */}
              {(() => {
                let notesText = "";
                if (payment.summary_json) {
                  if (typeof payment.summary_json === "object" && payment.summary_json !== null) {
                    notesText = payment.summary_json.notes || JSON.stringify(payment.summary_json);
                  } else {
                    notesText = String(payment.summary_json);
                  }
                }
                
                if (!notesText) return null;
                
                return (
                  <div className="mt-2">
                    <span className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                      Internal Notes
                    </span>
                    <div className="bg-secondary/30 border border-border/60 rounded-md p-3.5 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                      {notesText}
                    </div>
                  </div>
                );
              })()}

            </CardContent>
          </Card>

          {/* Conditional Transfer & Settlement Context */}
          {(payment.target_room_allotment || payment.contract_event_id) && (
            <Card className="border-border/80 shadow-sm">
              <CardHeader className="border-b border-border/50 p-5">
                <CardTitle className="text-lg">Transfer & Settlement Context</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-5 flex flex-col gap-4">
                
                {payment.target_room_allotment && (
                  <div className="p-4 bg-primary/5 border border-primary/10 rounded-md flex flex-col gap-3">
                    <span className="text-xs font-bold text-primary uppercase tracking-wide">
                      Room Transfer Settlement
                    </span>
                    
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Source Allotment</span>
                        <span className="text-[15px] font-bold">
                          {payment.room_allotment_name || "Old Allotment"}
                        </span>
                      </div>
                      
                      <ArrowRight size={18} className="text-primary" />
                      
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-muted-foreground">Target Allotment</span>
                        <span className="text-[15px] font-bold text-primary">
                          {payment.target_room_allotment}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {payment.contract_event_id && (
                  <div className="mt-2">
                    <span className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                      Associated Contract Event
                    </span>
                    
                    <div className="px-4 py-3 bg-secondary/40 border border-border/60 rounded-md flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-muted-foreground" />
                        <span className="text-sm font-semibold">
                          {payment.contract_event_name || `Event-${payment.contract_event_id.substring(0, 8)}`}
                        </span>
                      </div>
                      
                      <Link 
                        href={`/hostel-contracts/events/${payment.contract_event_id}`}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        View Event
                      </Link>
                    </div>
                  </div>
                )}

              </CardContent>
            </Card>
          )}

        </div>
        
      </div>
    </div>
  );
};
