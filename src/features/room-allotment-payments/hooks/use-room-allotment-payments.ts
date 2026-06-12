import { useState, useEffect, useCallback } from "react";
import { RoomAllotmentPaymentsApi } from "../api";
import { RoomAllotmentPayment, StudentSummary, RoomAllotmentSummary } from "../types";
import { showDeleteConfirm, showSuccess, showError, showLoading, closeLoading } from "@/utils/swal";

export const useRoomAllotmentPayments = () => {
  const [payments, setPayments] = useState<RoomAllotmentPayment[]>([]);
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [allotments, setAllotments] = useState<RoomAllotmentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedRoomAllotmentId, setSelectedRoomAllotmentId] = useState("");
  const [selectedTransactionType, setSelectedTransactionType] = useState("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Sorting state
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [paymentsRes, studentsList, allotmentsList] = await Promise.all([
        RoomAllotmentPaymentsApi.getRoomAllotmentPayments({
          page: currentPage,
          limit: 10,
          search: search || undefined,
          student_id: selectedStudentId || undefined,
          room_allotment_id: selectedRoomAllotmentId || undefined,
          transaction_type: selectedTransactionType || undefined,
          payment_status: selectedPaymentStatus || undefined,
          sortBy,
          sortOrder,
        }),
        RoomAllotmentPaymentsApi.getStudents().catch(() => []),
        RoomAllotmentPaymentsApi.getRoomAllotments().catch(() => []),
      ]);

      setPayments(paymentsRes.data);
      setTotal(paymentsRes.meta.total);
      setTotalPages(paymentsRes.meta.totalPages);
      setStudents(studentsList);
      setAllotments(allotmentsList);
    } catch (err: any) {
      setError(err.message || "Failed to load room allotment payments.");
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    search,
    selectedStudentId,
    selectedRoomAllotmentId,
    selectedTransactionType,
    selectedPaymentStatus,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedStudentId, selectedRoomAllotmentId, selectedTransactionType, selectedPaymentStatus]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortBy(field);
      setSortOrder("ASC");
    }
  };

  const handleDelete = async (id: string) => {
    const result = await showDeleteConfirm("Are you sure you want to delete this room allotment payment?");
    if (!result.isConfirmed) {
      return;
    }
    showLoading("Deleting...", "Please wait");
    try {
      await RoomAllotmentPaymentsApi.deleteRoomAllotmentPayment(id);
      closeLoading();
      await showSuccess("Deleted Successfully", "Record has been removed successfully.");
      await loadData();
    } catch (err: any) {
      closeLoading();
      showError("Delete Failed", err.message || "Failed to delete room allotment payment.");
    }
  };

  return {
    payments,
    students,
    allotments,
    isLoading,
    error,
    search,
    setSearch,
    selectedStudentId,
    setSelectedStudentId,
    selectedRoomAllotmentId,
    setSelectedRoomAllotmentId,
    selectedTransactionType,
    setSelectedTransactionType,
    selectedPaymentStatus,
    setSelectedPaymentStatus,
    currentPage,
    setCurrentPage,
    totalPages,
    total,
    sortBy,
    sortOrder,
    handleSort,
    handleDelete,
    reload: loadData,
  };
};
