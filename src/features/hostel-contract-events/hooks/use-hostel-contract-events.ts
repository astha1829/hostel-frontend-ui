import { useState, useEffect, useCallback } from "react";
import { HostelContractEventsApi } from "../api";
import { HostelContractEvent, StudentSummary } from "../types";
import { showDeleteConfirm, showSuccess, showError, showLoading, closeLoading } from "@/utils/swal";

export const useHostelContractEvents = () => {
  const [events, setEvents] = useState<HostelContractEvent[]>([]);
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [search, setSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedActionType, setSelectedActionType] = useState("");
  const [selectedEventStatus, setSelectedEventStatus] = useState("");

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
      const [eventsRes, studentList] = await Promise.all([
        HostelContractEventsApi.getHostelContractEvents({
          page: currentPage,
          limit: 10,
          search: search.trim() || undefined,
          student_id: selectedStudentId || undefined,
          action_type: selectedActionType || undefined,
          event_status: selectedEventStatus || undefined,
          sortBy,
          sortOrder,
        }),
        HostelContractEventsApi.getStudents().catch(() => []),
      ]);

      setEvents(eventsRes.data);
      setTotal(eventsRes.meta.total);
      setTotalPages(eventsRes.meta.totalPages);
      setStudents(studentList);
    } catch (err: any) {
      setError(err.message || "Failed to retrieve hostel contract events.");
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    search,
    selectedStudentId,
    selectedActionType,
    selectedEventStatus,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset to page 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedStudentId, selectedActionType, selectedEventStatus]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortBy(field);
      setSortOrder("ASC");
    }
  };

  const handleDelete = async (id: string) => {
    const result = await showDeleteConfirm("Are you sure you want to delete this contract event entry?");
    if (!result.isConfirmed) {
      return;
    }
    showLoading("Deleting...", "Please wait");
    try {
      await HostelContractEventsApi.deleteHostelContractEvent(id);
      closeLoading();
      await showSuccess("Deleted Successfully", "Record has been removed successfully.");
      await loadData();
    } catch (err: any) {
      closeLoading();
      showError("Delete Failed", err.message || "Failed to delete contract event.");
    }
  };

  return {
    events,
    students,
    isLoading,
    error,
    search,
    setSearch,
    selectedStudentId,
    setSelectedStudentId,
    selectedActionType,
    setSelectedActionType,
    selectedEventStatus,
    setSelectedEventStatus,
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
