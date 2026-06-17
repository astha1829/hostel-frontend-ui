import { useState, useEffect, useCallback } from "react";
import { RentPaymentsApi } from "../api";
import { RentPayment, StudentSummary } from "../types";
import { showDeleteConfirm, showDeleteSuccess, showDeleteError, showLoading, closeLoading } from "@/utils/swal";

export const useRentPayments = () => {
  const [payments, setPayments] = useState<RentPayment[]>([]);
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [search, setSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedTransactionType, setSelectedTransactionType] = useState("");
  const [selectedDirection, setSelectedDirection] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Sorting State
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [paymentsRes, studentList] = await Promise.all([
        RentPaymentsApi.getRentPayments({
          page: currentPage,
          limit: 10,
          search: search.trim() || undefined,
          student_id: selectedStudentId || undefined,
          transaction_type: selectedTransactionType || undefined,
          direction: selectedDirection || undefined,
          against_month: selectedMonth || undefined,
          sortBy,
          sortOrder,
        }),
        RentPaymentsApi.getStudents().catch(() => []),
      ]);

      setPayments(paymentsRes.data);
      setTotal(paymentsRes.meta.total);
      setTotalPages(paymentsRes.meta.totalPages);
      setStudents(studentList);
    } catch (err: any) {
      setError(err.message || "Failed to retrieve rent payments ledger.");
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    search,
    selectedStudentId,
    selectedTransactionType,
    selectedDirection,
    selectedMonth,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset page to 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedStudentId, selectedTransactionType, selectedDirection, selectedMonth]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortBy(field);
      setSortOrder("ASC");
    }
  };

  const handleDelete = async (id: string) => {
    const result = await showDeleteConfirm("Are you sure you want to delete this rent payment entry?");
    if (!result.isConfirmed) {
      return;
    }
    showLoading("Deleting...", "Please wait");
    try {
      await RentPaymentsApi.deleteRentPayment(id);
      closeLoading();
      await showDeleteSuccess();
      await loadData();
    } catch (err: any) {
      closeLoading();
      await showDeleteError();
    }
  };

  return {
    payments,
    students,
    isLoading,
    error,
    search,
    setSearch,
    selectedStudentId,
    setSelectedStudentId,
    selectedTransactionType,
    setSelectedTransactionType,
    selectedDirection,
    setSelectedDirection,
    selectedMonth,
    setSelectedMonth,
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
