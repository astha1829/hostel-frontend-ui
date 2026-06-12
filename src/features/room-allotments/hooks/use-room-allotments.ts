import { useState, useEffect, useCallback } from "react";
import { RoomAllotmentsApi } from "../api";
import { RoomAllotment } from "../types";
import { Hostel } from "../../hostels/types";
import { Student } from "../../students/types";
import { showDeleteConfirm, showSuccess, showError, showLoading, closeLoading } from "@/utils/swal";

export const useRoomAllotments = () => {
  const [allotments, setAllotments] = useState<RoomAllotment[]>([]);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [selectedHostelId, setSelectedHostelId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

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
      const [allotmentsRes, hostelsList, studentsList] = await Promise.all([
        RoomAllotmentsApi.getRoomAllotments({
          page: currentPage,
          limit: 10,
          search: search || undefined,
          hostel_id: selectedHostelId || undefined,
          student_id: selectedStudentId || undefined,
          status: selectedStatus || undefined,
          sortBy,
          sortOrder,
        }),
        RoomAllotmentsApi.getHostelsList().catch(() => []),
        RoomAllotmentsApi.getStudentsList().catch(() => []),
      ]);

      setAllotments(allotmentsRes.data);
      setTotal(allotmentsRes.meta.total);
      setTotalPages(allotmentsRes.meta.totalPages);
      setHostels(hostelsList);
      setStudents(studentsList);
    } catch (err: any) {
      setError(err.message || "Failed to load room allotments.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, search, selectedHostelId, selectedStudentId, selectedStatus, sortBy, sortOrder]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedHostelId, selectedStudentId, selectedStatus]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortBy(field);
      setSortOrder("ASC");
    }
  };

  const handleDelete = async (id: string) => {
    const result = await showDeleteConfirm("Are you sure you want to delete this room allotment?");
    if (!result.isConfirmed) {
      return;
    }
    showLoading("Deleting allotment...", "Please wait");
    try {
      await RoomAllotmentsApi.deleteRoomAllotment(id);
      closeLoading();
      await showSuccess("Deleted Successfully", "Record has been removed successfully.");
      await loadData();
    } catch (err: any) {
      closeLoading();
      showError("Delete Failed", err.message || "Failed to delete room allotment.");
    }
  };

  return {
    allotments,
    hostels,
    students,
    isLoading,
    error,
    search,
    setSearch,
    selectedHostelId,
    setSelectedHostelId,
    selectedStudentId,
    setSelectedStudentId,
    selectedStatus,
    setSelectedStatus,
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
