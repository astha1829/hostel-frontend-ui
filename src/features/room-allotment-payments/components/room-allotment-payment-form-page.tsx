"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, X, Calendar, DollarSign, ListFilter, Plus, Info } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/loading-skeleton";
import { useRoomAllotmentPaymentForm } from "../hooks/use-room-allotment-payment-form";
import { TableContainer, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { showCancelConfirm } from "@/utils/swal";

interface RoomAllotmentPaymentFormPageProps {
  id?: string;
}

export const RoomAllotmentPaymentFormPage: React.FC<RoomAllotmentPaymentFormPageProps> = ({ id }) => {
  const router = useRouter();

  const handleSuccess = (paymentId: string) => {
    router.push(`/room-allotment-payments/${paymentId}`);
  };

  const handleCancel = () => {
    if (id) {
      router.push(`/room-allotment-payments/${id}`);
    } else {
      router.push("/room-allotment-payments");
    }
  };

  const {
    formData,
    students,
    allotments,
    contractEvents,
    availableRentPayments,
    isLoadingMetadata,
    isLoadingDetails,
    isSubmitting,
    fieldErrors,
    apiError,
    handleStudentChange,
    handleRoomAllotmentChange,
    handleInputChange,
    handleToggleMonth,
    handleMonthPenaltyChange,
    handleSubmit,
  } = useRoomAllotmentPaymentForm({
    id,
    onSuccess: handleSuccess,
    onCancel: handleCancel,
  });

  const handleCancelClick = async () => {
    const isDirty = formData.student_id !== "" || formData.room_allotment_id !== "" || formData.summary_json !== "";
    if (isDirty) {
      const result = await showCancelConfirm();
      if (!result.isConfirmed) return;
    }
    handleCancel();
  };

  if (isLoadingDetails) {
    return (
      <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full">
        <PageHeader
          title={id ? "Edit Payment Record" : "New Payment Record"}
          description="Fetching payment parameters from ledger..."
        />
        <TableSkeleton rows={8} />
      </div>
    );
  }

  const studentOptions = [
    { label: "Select Student...", value: "" },
    ...students.map((s) => ({
      label: `${s.student_name} ${s.last_name || ""}`.trim(),
      value: s.id,
    })),
  ];

  const allotmentOptions = [
    { label: "Select Room Allotment...", value: "" },
    ...allotments.map((a) => ({
      label: a.hostel_name 
        ? `${a.hostel_name} - Room ${a.room_no}` 
        : `Room ${a.room_no} (${a.student_name || "Allotment"})`,
      value: a.id,
    })),
  ];

  const contractEventOptions = [
    { label: "Select Associated Event (Optional)...", value: "" },
    ...contractEvents.map((e) => ({
      label: e.event_no ? `${e.event_no} - ${e.action_type}` : `Event-${e.id.substring(0, 8)} (${e.action_type})`,
      value: e.id,
    })),
  ];

  const transactionTypeOptions = [
    { label: "Rent Payment", value: "Rent Payment" },
    { label: "Room Transfer", value: "Room Transfer" },
    { label: "Security Deposit", value: "Security Deposit" },
    { label: "Penalty Booking", value: "Penalty Booking" },
    { label: "Refund", value: "Refund" },
    { label: "Ad-hoc Settle", value: "Ad-hoc Settle" },
  ];

  const statusOptions = [
    { label: "Pending", value: "Pending" },
    { label: "Paid", value: "Paid" },
    { label: "Failed", value: "Failed" },
  ];

  const cardClass = "border border-gray-200 bg-card rounded-[16px] shadow-sm";
  const cardHeaderClass = "border-b border-gray-200 p-6";
  const cardTitleClass = "text-[20px] font-semibold text-foreground";
  const cardContentClass = "p-6 pt-6";
  const labelClass = "block text-[12px] uppercase tracking-wide font-semibold text-muted-foreground mb-1.5";
  const helperClass = "block text-[12px] text-gray-500 mt-1.5";

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500 max-w-[1400px] mx-auto w-full">
      <PageHeader
        title={id ? "Edit Room Allotment Payment" : "New Room Allotment Payment"}
        description={id ? "Modify financial ledger details or link references." : "Register a new room allotment payment, link billing months, and book penalties."}
        backHref={id ? `/room-allotment-payments/${id}` : "/room-allotment-payments"}
        backText={id ? "Payment Details" : "Room Allotment Payments"}
      />

      {apiError && (
        <div className="px-5 py-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm font-medium">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-12">
        
        {/* CARD 1: Payment Information */}
        <Card className={cardClass}>
          <CardHeader className={cardHeaderClass}>
            <CardTitle className={cardTitleClass}>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className={cardContentClass}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              
              {/* Student Selection */}
              <div>
                <label className={labelClass}>Student *</label>
                <Select
                  value={formData.student_id}
                  onChange={(e) => handleStudentChange(e.target.value)}
                  options={studentOptions}
                  disabled={isLoadingMetadata || !!id}
                  className={`text-[14px] h-10 ${fieldErrors.student_id ? "border-destructive" : "border-gray-200"}`}
                />
                {fieldErrors.student_id && <span className="text-[12px] text-destructive mt-1.5 block">{fieldErrors.student_id}</span>}
              </div>

              {/* Room Allotment Selection */}
              <div>
                <label className={labelClass}>Room Allotment *</label>
                <Select
                  value={formData.room_allotment_id}
                  onChange={(e) => handleRoomAllotmentChange(e.target.value)}
                  options={allotmentOptions}
                  disabled={!formData.student_id || !!id}
                  className={`text-[14px] h-10 ${fieldErrors.room_allotment_id ? "border-destructive" : "border-gray-200"}`}
                />
                {!formData.student_id && (
                  <span className={helperClass}>Select a student first to see room allotments.</span>
                )}
                {fieldErrors.room_allotment_id && <span className="text-[12px] text-destructive mt-1.5 block">{fieldErrors.room_allotment_id}</span>}
              </div>

              {/* Transaction Type */}
              <div>
                <label className={labelClass}>Transaction Type *</label>
                <Select
                  value={formData.transaction_type}
                  onChange={(e) => handleInputChange("transaction_type", e.target.value)}
                  options={transactionTypeOptions}
                  className={`text-[14px] h-10 ${fieldErrors.transaction_type ? "border-destructive" : "border-gray-200"}`}
                />
                {fieldErrors.transaction_type && <span className="text-[12px] text-destructive mt-1.5 block">{fieldErrors.transaction_type}</span>}
              </div>

              {/* Payment Status */}
              <div>
                <label className={labelClass}>Payment Status *</label>
                <Select
                  value={formData.payment_status}
                  onChange={(e) => handleInputChange("payment_status", e.target.value)}
                  options={statusOptions}
                  className="text-[14px] h-10 border-gray-200"
                />
              </div>

              {/* Posting Datetime */}
              <div>
                <label className={labelClass}>Posting Date/Time</label>
                <Input
                  type="datetime-local"
                  value={formData.posting_datetime || ""}
                  onChange={(e) => handleInputChange("posting_datetime", e.target.value)}
                  className="text-[14px] h-10 border-gray-200"
                />
                <span className={helperClass}>Defaults to the current time if left empty.</span>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* CARD 2: Linked Rent Payments (Billing Months) */}
        {formData.student_id && formData.room_allotment_id && (
          <Card className={cardClass}>
            <CardHeader className={cardHeaderClass}>
              <CardTitle className={cardTitleClass}>Link Billing Months</CardTitle>
            </CardHeader>
            <CardContent className={cardContentClass}>
              {availableRentPayments.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[120px] max-h-[140px] text-center border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                  <Info size={24} className="text-gray-400 mb-2 mx-auto" />
                  <p className="font-medium text-[14px] text-gray-700 m-0">No unlinked rent payments found for this allotment.</p>
                  <p className="text-[12px] text-gray-500 mt-1 m-0">All rent records are either linked to other payments, or none have been logged.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-muted-foreground m-0">
                    Select the monthly rent logs below to link them with this ledger transaction. 
                    Rent and penalty portions will be auto-calculated.
                  </p>
                  
                  <TableContainer className="border border-gray-200 rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-secondary/20 hover:bg-secondary/20 border-b border-gray-200">
                          <TableHead className="w-[8%] font-semibold text-[13px]">Link</TableHead>
                          <TableHead className="w-[30%] font-semibold text-[13px]">Reference Details</TableHead>
                          <TableHead className="w-[20%] font-semibold text-[13px]">Month</TableHead>
                          <TableHead className="w-[20%] font-semibold text-[13px]">Rent Amount</TableHead>
                          <TableHead className="w-[22%] font-semibold text-[13px]">Penalty Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {availableRentPayments.map((rp) => {
                          const isLinked = (formData.months || []).some((m) => m.rent_payment_id === rp.id);
                          const linkedMonth = (formData.months || []).find((m) => m.rent_payment_id === rp.id);
                          const currentPenalty = linkedMonth ? (linkedMonth.penalty_amount || 0) : 0;

                          return (
                            <TableRow key={rp.id} className={isLinked ? "bg-primary/5" : "border-b border-gray-100 last:border-0"}>
                              {/* Checkbox cell */}
                              <TableCell>
                                <input
                                  type="checkbox"
                                  checked={isLinked}
                                  onChange={() => handleToggleMonth(rp)}
                                  className="w-4 h-4 rounded border-gray-300 text-primary cursor-pointer focus:ring-primary"
                                />
                              </TableCell>
                              
                              {/* Reference Details */}
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-[14px]">{rp.name}</span>
                                  <span className="text-[12px] font-mono text-muted-foreground mt-0.5">
                                    ID: {rp.id.substring(0, 8)}...
                                  </span>
                                </div>
                              </TableCell>

                              {/* Month Label */}
                              <TableCell className="font-medium text-[14px]">
                                {rp.against_month}
                              </TableCell>

                              {/* Rent Amount */}
                              <TableCell className="font-bold text-[14px]">
                                ${Number(rp.amount).toFixed(2)}
                              </TableCell>

                              {/* Penalty input */}
                              <TableCell>
                                <div className="relative max-w-[120px]">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-muted-foreground font-medium">
                                    $
                                  </span>
                                  <Input
                                    type="number"
                                    disabled={!isLinked}
                                    value={isLinked ? currentPenalty : ""}
                                    onChange={(e) => handleMonthPenaltyChange(rp.id, parseFloat(e.target.value) || 0)}
                                    placeholder="0.00"
                                    className="h-9 pl-7 text-[14px] border-gray-200 bg-white"
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* CARD 3: Amount Breakdown */}
        <Card className={cardClass}>
          <CardHeader className={cardHeaderClass}>
            <CardTitle className={cardTitleClass}>Amount Breakdown</CardTitle>
          </CardHeader>
          <CardContent className={cardContentClass}>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-end">
              
              {/* Rent Portion */}
              <div>
                <label className={labelClass}>Rent Amount ($)</label>
                <Input
                  type="number"
                  value={formData.rent_amount ?? ""}
                  onChange={(e) => handleInputChange("rent_amount", e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="text-[14px] h-10 border-gray-200"
                />
                <span className={helperClass}>Portion of the payment designated as rent.</span>
              </div>

              {/* Penalty Portion */}
              <div>
                <label className={labelClass}>Penalty Amount ($)</label>
                <Input
                  type="number"
                  value={formData.penalty_amount ?? ""}
                  onChange={(e) => handleInputChange("penalty_amount", e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="text-[14px] h-10 border-gray-200"
                />
                <span className={helperClass}>Portion of the payment designated as penalties.</span>
              </div>

              {/* Transaction Charge */}
              <div>
                <label className={labelClass}>Additional Charges ($)</label>
                <Input
                  type="number"
                  value={formData.transaction_charge ?? ""}
                  onChange={(e) => handleInputChange("transaction_charge", e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="text-[14px] h-10 border-gray-200"
                />
                <span className={helperClass}>Surcharges or administrative fees.</span>
              </div>

              {/* Stressed Total Amount */}
              <div>
                <label className={`${labelClass} !text-foreground !font-bold`}>Total Amount ($)</label>
                <Input
                  type="number"
                  value={formData.total_amount ?? ""}
                  readOnly
                  placeholder="0.00"
                  step="0.01"
                  className={`h-[44px] font-bold text-lg cursor-not-allowed opacity-90 bg-secondary/15 ${fieldErrors.total_amount ? "border-destructive" : "border-gray-300"}`}
                />
                {fieldErrors.total_amount && <span className="text-[12px] text-destructive mt-1.5 block">{fieldErrors.total_amount}</span>}
              </div>

            </div>
          </CardContent>
        </Card>

        {/* CARD 4: Additional Information */}
        <Card className={cardClass}>
          <CardHeader className={cardHeaderClass}>
            <CardTitle className={cardTitleClass}>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className={cardContentClass}>
            <div className="grid grid-cols-1 gap-5">
              
              {formData.transaction_type === "Room Transfer" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Target Room Allotment */}
                  <div>
                    <label className={labelClass}>Target Room Allotment</label>
                    <Input
                      value={formData.target_room_allotment || ""}
                      onChange={(e) => handleInputChange("target_room_allotment", e.target.value)}
                      placeholder="e.g. Room 102 (or Room Allotment Code)"
                      className="text-[14px] h-10 border-gray-200"
                    />
                    <span className={helperClass}>Used primarily for room transfer settlements to note destinations.</span>
                  </div>

                  {/* Contract Event */}
                  <div>
                    <label className={labelClass}>Associated Contract Event</label>
                    <Select
                      value={formData.contract_event_id}
                      onChange={(e) => handleInputChange("contract_event_id", e.target.value)}
                      options={contractEventOptions}
                      disabled={!formData.student_id}
                      className="text-[14px] h-10 border-gray-200"
                    />
                    {!formData.student_id && (
                      <span className={helperClass}>Select a student first to load contract events.</span>
                    )}
                  </div>
                </div>
              )}

              {/* Internal Notes textarea */}
              <div className="w-full">
                <label className={labelClass}>Internal Notes</label>
                <textarea
                  value={formData.summary_json || ""}
                  onChange={(e) => handleInputChange("summary_json", e.target.value)}
                  placeholder="Provide any internal notes or remarks about this payment..."
                  className={`flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-[14px] shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${fieldErrors.summary_json ? "border-destructive focus-visible:ring-destructive" : "border-gray-200"}`}
                  rows={4}
                />
                {fieldErrors.summary_json ? (
                  <span className="text-[12px] text-destructive mt-1.5 block">{fieldErrors.summary_json}</span>
                ) : (
                  <span className={helperClass}>Provide any internal notes or remarks for administrative reference.</span>
                )}
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleCancelClick}
            disabled={isSubmitting}
            className="gap-1.5 h-10 px-5 rounded-lg border-gray-300 hover:bg-gray-50"
          >
            <X size={16} />
            <span className="font-semibold text-[14px]">Cancel</span>
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting}
            className="gap-1.5 h-10 px-5 rounded-lg shadow-sm"
          >
            <Save size={16} />
            <span className="font-semibold text-[14px]">{isSubmitting ? "Saving record..." : "Save Payment Record"}</span>
          </Button>
        </div>

      </form>
    </div>
  );
};
