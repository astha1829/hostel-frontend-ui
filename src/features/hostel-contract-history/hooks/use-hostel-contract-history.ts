import { useState, useEffect, useCallback } from "react";
import { HostelContractHistoryApi } from "../api";
import { HostelContractHistoryRow, StudentSummary } from "../types";
import { showDeleteConfirm, showSuccess, showError, showLoading, closeLoading } from "@/utils/swal";

export const useHostelContractHistory = () => {
  const [history, setHistory] = useState<HostelContractHistoryRow[]>([]);
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [search, setSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");

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
      const [historyRes, studentList] = await Promise.all([
        HostelContractHistoryApi.getHostelContractHistory({
          page: currentPage,
          limit: 10,
          search: search.trim() || undefined,
          student_id: selectedStudentId || undefined,
          sortBy,
          sortOrder,
        }),
        HostelContractHistoryApi.getStudents().catch(() => []),
      ]);

      setHistory(historyRes.data);
      setTotal(historyRes.meta.total);
      setTotalPages(historyRes.meta.totalPages);
      setStudents(studentList);
    } catch (err: any) {
      setError(err.message || "Failed to retrieve hostel contract history.");
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    search,
    selectedStudentId,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset to page 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedStudentId]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortBy(field);
      setSortOrder("ASC");
    }
  };

  const handleDelete = async (id: string) => {
    const result = await showDeleteConfirm("Are you sure you want to delete this contract history row?");
    if (!result.isConfirmed) {
      return false;
    }
    showLoading("Deleting...", "Please wait");
    try {
      await HostelContractHistoryApi.deleteHostelContractHistory(id);
      closeLoading();
      await showSuccess("Deleted Successfully", "Record has been removed successfully.");
      await loadData();
      return true;
    } catch (err: any) {
      closeLoading();
      showError("Delete Failed", err.message || "Failed to delete contract history row.");
      return false;
    }
  };

  return {
    history,
    students,
    isLoading,
    error,
    search,
    setSearch,
    selectedStudentId,
    setSelectedStudentId,
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
