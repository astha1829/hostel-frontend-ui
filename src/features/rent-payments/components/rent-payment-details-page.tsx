"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Edit3, Trash2, Calendar, FileText, ArrowRight, User, HelpCircle, Layers, CreditCard, RefreshCw, ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DetailFormSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useRentPaymentDetails } from "../hooks/use-rent-payment-details";

interface RentPaymentDetailsPageProps {
  id: string;
}

export const RentPaymentDetailsPage: React.FC<RentPaymentDetailsPageProps> = ({ id }) => {
  const router = useRouter();
  const { payment, isLoading, error, handleDelete, reload } = useRentPaymentDetails(id);
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

  const getDirectionBadge = (direction?: string | null) => {
    if (direction?.toLowerCase() === "credit") {
      return <Badge variant="success">Credit</Badge>;
    }
    return <Badge variant="danger">Debit</Badge>;
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
      router.push("/rent-payments");
    }
  };

  if (error) {
    return (
      <ErrorState
        title="Ledger Retrieval Failed"
        message={error}
        onRetry={() => router.push("/rent-payments")}
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

  const isCredit = payment.direction?.toLowerCase() === "credit";
  const amountSign = isCredit ? "+" : "−";
  const amountColor = isCredit ? "hsl(142.1 76.2% 36.3%)" : "hsl(var(--destructive))";

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Page Header Actions / Back Nav */}
      <PageHeader
        title={payment.name ? `Rent Payment: ${payment.name}` : "Rent Payment Details"}
        description={`Rent payment ledger record for student ${studentName}`}
        backHref="/rent-payments"
        backText="Rent Payments"
        actions={
          <div className="flex gap-3 items-center relative" ref={dropdownRef}>
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
              onClick={() => router.push(`/rent-payments/${payment.id}/edit`)}
              className="gap-1.5"
            >
              <Edit3 size={16} />
              <span>Edit Entry</span>
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
                <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border/80 rounded-md shadow-md z-50 flex flex-col p-1 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push(`/rent-payments/new?duplicate=${payment.id}`);
                    }}
                    onMouseEnter={() => setHoveredOption("duplicate")}
                    onMouseLeave={() => setHoveredOption(null)}
                    className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left border-none cursor-pointer text-foreground rounded-sm transition-colors ${hoveredOption === "duplicate" ? "bg-secondary/50" : "bg-transparent"}`}
                  >
                    Duplicate Entry
                  </button>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      window.print();
                    }}
                    onMouseEnter={() => setHoveredOption("print")}
                    onMouseLeave={() => setHoveredOption(null)}
                    className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left border-none cursor-pointer text-foreground rounded-sm transition-colors ${hoveredOption === "print" ? "bg-secondary/50" : "bg-transparent"}`}
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
                    className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left border-none cursor-pointer text-destructive rounded-sm transition-colors ${hoveredOption === "delete" ? "bg-destructive/10" : "bg-transparent"}`}
                  >
                    Delete Entry
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
                LEDGER ENTRY: {payment.name || payment.id.toUpperCase()}
              </span>
              {getDirectionBadge(payment.direction)}
            </div>
          </div>
        </div>
        
        <hr className="my-1 border-border/40" />
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          <div>
            <span className="block text-xs text-muted-foreground uppercase font-semibold mb-1">Amount</span>
            <span className={`text-[1.15rem] font-bold ${amountColor}`}>
              {amountSign}{formatPrice(payment.amount)}
            </span>
          </div>
          <div>
            <span className="block text-xs text-muted-foreground uppercase font-semibold mb-1">Month</span>
            <span className="text-[15px] font-semibold text-primary">{payment.against_month}</span>
          </div>
          <div>
            <span className="block text-xs text-muted-foreground uppercase font-semibold mb-1">Posting Date</span>
            <span className="text-[15px] font-semibold text-foreground">{formatDate(payment.posting_datetime)}</span>
          </div>
          <div>
            <span className="block text-xs text-muted-foreground uppercase font-semibold mb-1">Student</span>
            <span className="text-[15px] font-semibold text-foreground truncate block" title={studentName}>{studentName}</span>
          </div>
          <div>
            <span className="block text-xs text-muted-foreground uppercase font-semibold mb-1">Allotment</span>
            <span className="text-[15px] font-semibold text-foreground truncate block" title={payment.room_allotment_name || ""}>{payment.room_allotment_name || "—"}</span>
          </div>
        </div>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Financial details & metadata links */}
        <div className="flex flex-col gap-6">
          
          {/* Financial Parameters Description List */}
          <Card className="border-border/80 shadow-sm">
            <CardHeader className="border-b border-border/50 py-5 px-6">
              <CardTitle className="text-lg">Ledger Allocation Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5 m-0">
                <div>
                  <dt className="text-xs font-semibold text-muted-foreground uppercase">Transaction Amount</dt>
                  <dd className={`text-[1.15rem] font-bold mt-1 ${amountColor}`}>
                    {amountSign}{formatPrice(payment.amount)}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-xs font-semibold text-muted-foreground uppercase">Flow Direction</dt>
                  <dd className="text-base font-semibold mt-1 text-foreground">
                    {payment.direction?.toUpperCase() || "—"}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold text-muted-foreground uppercase">Allocated Month</dt>
                  <dd className="text-base font-semibold mt-1 text-primary">{payment.against_month}</dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold text-muted-foreground uppercase">Transaction Type</dt>
                  <dd className="text-base font-semibold mt-1 text-foreground">{payment.transaction_type}</dd>
                </div>

                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold text-muted-foreground uppercase">Posting Timestamp</dt>
                  <dd className="text-[15px] font-medium mt-1 text-foreground">{formatDate(payment.posting_datetime)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Reference Metadata Links */}
          <Card className="border-border/80 shadow-sm">
            <CardHeader className="border-b border-border/50 py-5 px-6">
              <CardTitle className="text-lg">Reference Metadata</CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col gap-4">
              <div>
                <span className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Ledger Entry Key</span>
                <span className="text-sm font-mono font-medium text-foreground">
                  {payment.entry_key || "—"}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border/40">
                <div>
                  <span className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Ref Doctype</span>
                  <span className="text-sm font-semibold text-foreground">{payment.reference_doctype || "—"}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Ref Name</span>
                  <span className="text-sm font-semibold text-foreground">{payment.reference_name || "—"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Profile details & remarks */}
        <div className="flex flex-col gap-6">
          
          {/* Administrative Student Profile flat list */}
          <Card className="border-border/80 shadow-sm">
            <CardHeader className="border-b border-border/50 py-5 px-6">
              <CardTitle className="text-lg">Ledger Relationships</CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col gap-5">
              
              <div className="flex flex-col gap-3.5">
                
                {/* Student */}
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
                    <span className="text-sm text-muted-foreground">Passport / ID</span>
                    <span className="text-sm font-mono font-medium text-foreground">
                      {studentPassId}
                    </span>
                  </div>
                )}

                {/* Hostel Contract */}
                <div className="flex justify-between items-center pb-2 border-b border-border/40">
                  <span className="text-sm text-muted-foreground">Hostel Contract</span>
                  {payment.hostel_contract_id ? (
                    <Link 
                      href={`/hostel-contracts/${payment.hostel_contract_id}`}
                      className="font-semibold text-sm text-primary hover:underline"
                    >
                      {payment.hostel_contract_name || "Contract Details"}
                    </Link>
                  ) : (
                    <span className="text-sm text-muted-foreground">No Linked Contract</span>
                  )}
                </div>

                {/* Room Allotment */}
                <div className="flex justify-between items-center pb-2 border-b border-border/40">
                  <span className="text-sm text-muted-foreground">Room Allotment</span>
                  <Link 
                    href={`/room-allotments/${payment.room_allotment_id}`}
                    className="font-semibold text-sm text-primary hover:underline"
                  >
                    {payment.room_allotment_name || "View Allotment"}
                  </Link>
                </div>

                {/* Room Allotment Payment */}
                {payment.room_allotment_payment_id && (
                  <div className="flex justify-between items-center pb-2 border-b border-border/40">
                    <span className="text-sm text-muted-foreground">Room Allotment Payment</span>
                    <Link 
                      href={`/room-allotment-payments/${payment.room_allotment_payment_id}`}
                      className="font-semibold text-sm text-primary hover:underline"
                    >
                      {payment.room_allotment_payment_name || "RAP ledger reference"}
                    </Link>
                  </div>
                )}

                {/* Contract Event */}
                {payment.hostel_contract_event_id && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Contract Event</span>
                    <Link 
                      href={`/hostel-contracts/events/${payment.hostel_contract_event_id}`}
                      className="font-semibold text-sm text-primary hover:underline"
                    >
                      {payment.hostel_contract_event_name || "Event log details"}
                    </Link>
                  </div>
                )}
              </div>

            </CardContent>
          </Card>

          {/* Audit Remarks Notes Card */}
          <Card className="border-border/80 shadow-sm">
            <CardHeader className="border-b border-border/50 py-5 px-6">
              <CardTitle className="text-lg">Remarks / Auditing Comments</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {payment.remarks ? (
                <div className="bg-secondary/30 border border-border/60 rounded-md p-3.5 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {payment.remarks}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">No audit remarks recorded.</span>
              )}
            </CardContent>
          </Card>

        </div>
        
      </div>
    </div>
  );
};
