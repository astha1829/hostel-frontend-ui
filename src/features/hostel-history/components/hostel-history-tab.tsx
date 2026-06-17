"use client";

import React, { useState, useEffect, useCallback } from "react";
import { History, Plus, Trash2, Calendar } from "lucide-react";
import { showDeleteConfirm, showDeleteSuccess, showDeleteError, showLoading, closeLoading } from "@/utils/swal";
import { Card, CardContent } from "@/components/ui/card";
import { TableContainer, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/loading-skeleton";
import { HostelHistoryApi } from "../api";
import { HostelHistoryRow } from "../types";
import { AddHistoryRowModal } from "./add-history-row-modal";

interface HostelHistoryTabProps {
  roomAllotmentId: string;
}

export const HostelHistoryTab: React.FC<HostelHistoryTabProps> = ({ roomAllotmentId }) => {
  const [history, setHistory] = useState<HostelHistoryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await HostelHistoryApi.getHostelHistoryByRoomAllotment(roomAllotmentId);
      // Sort by index (idx) or created_at desc
      const sorted = [...res.data].sort((a, b) => {
        if (a.idx !== null && b.idx !== null) {
          return a.idx - b.idx;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      setHistory(sorted);
    } catch (err: any) {
      setError(err.message || "Failed to load hostelstay history logs.");
    } finally {
      setIsLoading(false);
    }
  }, [roomAllotmentId]);

  useEffect(() => {
    if (roomAllotmentId) {
      loadHistory();
    }
  }, [roomAllotmentId, loadHistory]);

  const handleDelete = async (id: string) => {
    const result = await showDeleteConfirm("Are you sure you want to delete this stay history record?");
    if (!result.isConfirmed) return;
    try {
      showLoading();
      await HostelHistoryApi.deleteHostelHistory(id);
      closeLoading();
      await showDeleteSuccess();
      loadHistory();
    } catch (err: any) {
      closeLoading();
      await showDeleteError();
    }
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

  if (isLoading) {
    return <TableSkeleton rows={4} />;
  }

  return (
    <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-4 duration-500">
      <Card className="border border-border/80 shadow-sm">
        <CardContent className="p-6">
          
          <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
            <h3 className="text-lg font-bold flex items-center gap-2 m-0">
              <History size={18} className="text-primary" />
              <span>Residency Stay History</span>
            </h3>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="gap-1.5"
            >
              <Plus size={15} />
              <span>Add History Row</span>
            </Button>
          </div>

          {error && (
            <div className="px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-[13px] font-medium mb-4">
              {error}
            </div>
          )}

          {history.length === 0 ? (
            <EmptyState
              title="No Stay History Logs"
              description="Stay logs and transfer timelines will appear here on room revisions."
              actionText="Add History Row"
              onAction={() => setIsAddModalOpen(true)}
              icon={<History size={36} className="text-muted-foreground" />}
            />
          ) : (
            <TableContainer className="border border-border/70">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4 align-middle">Hostel</TableHead>
                    <TableHead className="w-1/5 align-middle">Floor & Room</TableHead>
                    <TableHead className="w-1/5 align-middle">From Date</TableHead>
                    <TableHead className="w-1/5 align-middle">Transfer Date</TableHead>
                    <TableHead className="w-[10%] align-middle">Months Elapsed</TableHead>
                    <TableHead className="w-[5%] text-center align-middle">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((row) => (
                    <TableRow key={row.id} className="table-tr">
                      <TableCell className="align-middle font-semibold">
                        {row.hostel_name || "Unassigned Hostel"}
                      </TableCell>
                      <TableCell className="align-middle font-mono">
                        {row.floor_room_no}
                      </TableCell>
                      <TableCell className="align-middle">
                        <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                          <Calendar size={13} className="shrink-0" />
                          <span className="font-medium text-foreground">{formatDate(row.from_date)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="align-middle">
                        <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                          <Calendar size={13} className="shrink-0" />
                          <span className={`${row.to_transfer_date ? "text-foreground font-medium" : "text-muted-foreground font-normal"}`}>
                            {formatDate(row.to_transfer_date)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="align-middle">
                        <Badge variant={row.months_elapsed > 0 ? "default" : "secondary"}>
                          {row.months_elapsed ?? 0} months
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center align-middle">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(row.id)}
                          className="p-1.5 rounded-sm text-destructive inline-flex items-center justify-center hover:bg-destructive/10"
                          title="Delete stay log"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

        </CardContent>
      </Card>

      {/* Add stay history row modal overlay */}
      {isAddModalOpen && (
        <AddHistoryRowModal
          roomAllotmentId={roomAllotmentId}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setIsAddModalOpen(false);
            loadHistory();
          }}
        />
      )}
    </div>
  );
};
