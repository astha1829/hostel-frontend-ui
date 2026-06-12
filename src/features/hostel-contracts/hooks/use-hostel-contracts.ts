import { useState, useEffect, useCallback } from "react";
import { HostelContractsApi } from "../api";
import { HostelContract, HostelContractQueryParams } from "../types";
import { Hostel } from "../../hostels/types";
import { Student } from "../../students/types";
import { showDeleteConfirm, showSuccess, showError, showLoading, closeLoading } from "@/utils/swal";

export const useHostelContracts = () => {
  const [contracts, setContracts] = useState<HostelContract[]>([]);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [search, setSearch] = useState("");
  const [selectedHostelId, setSelectedHostelId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedConfirmStatus, setSelectedConfirmStatus] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Sorting states
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  // Load select options
  useEffect(() => {
    const loadOptions = async () => {
      setIsLoadingOptions(true);
      try {
        const [hostelsList, studentsList] = await Promise.all([
          HostelContractsApi.getHostelsList(),
          HostelContractsApi.getStudentsList(),
        ]);
        setHostels(hostelsList);
        setStudents(studentsList);
      } catch (err: any) {
        console.error("Failed to load options: ", err);
      } finally {
        setIsLoadingOptions(false);
      }
    };
    loadOptions();
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams: HostelContractQueryParams = {
        page: currentPage,
        limit,
        search: search.trim() || undefined,
        hostel_id: selectedHostelId || undefined,
        student_id: selectedStudentId || undefined,
        status: selectedStatus || undefined,
        confirm_status: selectedConfirmStatus || undefined,
        sortBy,
        sortOrder,
      };

      const res = await HostelContractsApi.getHostelContracts(queryParams);
      setContracts(res.data);
      setTotal(res.meta.total);
      setTotalPages(res.meta.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to retrieve hostel contracts.");
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    limit,
    search,
    selectedHostelId,
    selectedStudentId,
    selectedStatus,
    selectedConfirmStatus,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedHostelId, selectedStudentId, selectedStatus, selectedConfirmStatus]);

  const handleDelete = async (id: string) => {
    const result = await showDeleteConfirm("Are you sure you want to delete this hostel contract?");
    if (!result.isConfirmed) return;

    showLoading("Deleting contract...", "Please wait");
    try {
      await HostelContractsApi.deleteHostelContract(id);
      closeLoading();
      await showSuccess("Deleted Successfully", "Record has been removed successfully.");
      loadData();
    } catch (err: any) {
      closeLoading();
      showError("Delete Failed", err.message || "Failed to delete hostel contract.");
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(field);
      setSortOrder("ASC");
    }
  };

  return {
    contracts,
    hostels,
    students,
    isLoading: isLoading || isLoadingOptions,
    error,
    search,
    setSearch,
    selectedHostelId,
    setSelectedHostelId,
    selectedStudentId,
    setSelectedStudentId,
    selectedStatus,
    setSelectedStatus,
    selectedConfirmStatus,
    setSelectedConfirmStatus,
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
