"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CreditCard, History, RefreshCw, CheckCircle2, ChevronLeft, ChevronRight, ArrowRight, Calendar, Receipt } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TableContainer, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/loading-skeleton";
import { WalletApi } from "../api";
import { StudentWalletBalance, StudentWalletTransaction, RoomTransferSettleResult } from "../types";
import { TransferSettlementModal } from "./transfer-settlement-modal";

interface StudentWalletTabProps {
  studentId: string;
  student: {
    student_name: string;
    last_name?: string;
  };
}

export const StudentWalletTab: React.FC<StudentWalletTabProps> = ({ studentId, student }) => {
  const [wallet, setWallet] = useState<StudentWalletBalance | null>(null);
  const [transactions, setTransactions] = useState<StudentWalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Modals / Settlement state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [settlementResult, setSettlementResult] = useState<RoomTransferSettleResult | null>(null);

  const studentName = `${student.student_name} ${student.last_name || ""}`.trim();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [walletRes, txRes] = await Promise.all([
        WalletApi.getStudentWalletBalance(studentId).catch(() => null),
        WalletApi.getStudentWalletTransactions(studentId, { page: currentPage, limit: 5 }),
      ]);

      setWallet(walletRes);
      setTransactions(txRes.data);
      setTotal(txRes.meta.total);
      setTotalPages(txRes.meta.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to load student wallet credentials.");
    } finally {
      setIsLoading(false);
    }
  }, [studentId, currentPage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSettlementSuccess = (result: RoomTransferSettleResult) => {
    setIsModalOpen(false);
    setSettlementResult(result);
    loadData();
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  if (isLoading && transactions.length === 0) {
    return <TableSkeleton rows={4} />;
  }

  return (
    <div className="container-page flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Wallet Balance Summary Card */}
      <Card className="p-6 border border-border/80 shadow-sm bg-gradient-to-br from-secondary/5 to-secondary/20">
        <div className="flex items-center justify-between flex-wrap gap-5">
          <div className="flex flex-col">
            <span className="form-label">
              Student Wallet Balance
            </span>
            <span className="text-4xl font-black text-primary mt-1 tracking-tight">
              {wallet ? formatPrice(wallet.balance) : "$0.00"}
            </span>
          </div>

          <div className="flex gap-3 items-center">
            <Button variant="outline" size="md" onClick={loadData} className="p-2" title="Reload balance">
              <RefreshCw size={16} />
            </Button>
            <Button 
              variant="primary" 
              size="md" 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 shadow-sm shadow-primary/15"
            >
              <CreditCard size={16} />
              <span>Transfer Settlement</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Settlement Success Invoice Card */}
      {settlementResult && (
        <Card className="border border-success/25 shadow-md bg-gradient-to-b from-success/5 to-success/5 rounded-lg animate-in slide-in-from-bottom-2 duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-success" />
                <h4 className="m-0 text-[17px] font-extrabold text-success">
                  Transfer Settlement Completed Successfully
                </h4>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSettlementResult(null)} className="text-[13px]">
                Dismiss
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 text-sm">
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground font-medium">Old Allotment Paid:</span>
                <span className="font-bold">{formatPrice(settlementResult.old_total_paid)}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground font-medium">Stay Consumed Rent:</span>
                <span className="font-bold">{formatPrice(settlementResult.old_consumed_amount)}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground font-medium">Wallet Credit Added:</span>
                <span className="font-extrabold text-success">+{formatPrice(settlementResult.wallet_credit_added)}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground font-medium">Target Allotment Required:</span>
                <span className="font-bold">{formatPrice(settlementResult.new_required_amount)}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground font-medium">Wallet Credit Applied:</span>
                <span className="font-extrabold text-primary">-{formatPrice(settlementResult.wallet_credit_applied)}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground font-medium">Remaining Payable:</span>
                <span className="font-black">{formatPrice(settlementResult.remaining_payable)}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground font-medium">New Wallet Balance:</span>
                <span className="font-black text-primary">{formatPrice(settlementResult.wallet_balance_after)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wallet Ledger card */}
      <Card className="border-border/80 shadow-sm">
        <CardContent className="p-6">
          
          <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
            <h3 className="text-lg font-extrabold flex items-center gap-2 m-0">
              <History size={18} className="text-primary" />
              <span>Wallet Transactions Ledger</span>
            </h3>
            <span className="text-[13px] text-muted-foreground font-semibold">
              {total} Total Records
            </span>
          </div>

          {error && (
            <div className="px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-[13px] font-medium mb-5">
              {error}
            </div>
          )}

          {transactions.length === 0 ? (
            <EmptyState
              title="No Transactions Logged"
              description="Financial postings from pro-rata adjustments and transfer refunds will display here."
              actionText="Execute Transfer Settlement"
              onAction={() => setIsModalOpen(true)}
              icon={<History size={36} className="text-muted-foreground" />}
            />
          ) : (
            <div className="flex flex-col gap-4">
              <TableContainer className="border border-border/70 overflow-visible">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/5 align-middle">Posting Date</TableHead>
                      <TableHead className="w-1/4 align-middle">Action Type</TableHead>
                      <TableHead className="w-[15%] align-middle">Flow Direction</TableHead>
                      <TableHead className="w-[15%] align-middle">Amount</TableHead>
                      <TableHead className="w-[15%] align-middle">Remaining Balance</TableHead>
                      <TableHead className="w-[10%] align-middle">Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx.id} className="table-tr">
                        <TableCell className="table-td align-middle">
                          <div className="flex items-center gap-1.5 text-muted-foreground text-[13px]">
                            <Calendar size={13} className="shrink-0" />
                            <span className="text-foreground font-medium">{formatDate(tx.created_at)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="table-td align-middle font-semibold">
                          {tx.transaction_type.replace(/_/g, ' ').toUpperCase()}
                        </TableCell>
                        <TableCell className="table-td align-middle">
                          <Badge variant={tx.direction === "credit" ? "success" : "danger"} className="uppercase text-[11px]">
                            {tx.direction}
                          </Badge>
                        </TableCell>
                        <TableCell className={`table-td align-middle font-extrabold ${tx.direction === "credit" ? "text-success" : "text-destructive"}`}>
                          {tx.direction === "credit" ? "+" : "-"}{formatPrice(tx.amount)}
                        </TableCell>
                        <TableCell className="table-td align-middle font-bold">
                          {formatPrice(tx.balance_after)}
                        </TableCell>
                        <TableCell className="table-td align-middle text-muted-foreground text-[13px]">
                          {tx.remarks || "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination footer */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center px-1 py-2">
                  <span className="text-[13px] text-muted-foreground font-medium">
                    Showing <strong className="text-foreground">{transactions.length}</strong> of <strong className="text-foreground">{total}</strong> ledger items
                  </span>

                  <div className="flex gap-2 items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-2 py-1.5"
                    >
                      <ChevronLeft size={16} />
                    </Button>

                    <span className="text-[13px] font-semibold">
                      Page {currentPage} of {totalPages}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-2 py-1.5"
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

        </CardContent>
      </Card>

      {/* Transfer settlement modal dialog wizard */}
      {isModalOpen && (
        <TransferSettlementModal
          studentId={studentId}
          studentName={studentName}
          currentWalletBalance={wallet ? wallet.balance : 0}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSettlementSuccess}
        />
      )}
    </div>
  );
};
