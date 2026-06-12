import { useState, useEffect, useCallback } from "react";
import { HostelFloor } from "../types";
import { HostelFloorsApi } from "../api";
import { HostelApi } from "../../hostels/api";
import { Hostel } from "../../hostels/types";
import { showDeleteConfirm, showSuccess, showError, showLoading, closeLoading } from "@/utils/swal";

export function useHostelFloors() {
  const [floors, setFloors] = useState<HostelFloor[]>([]);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Directory Stats State
  const [stats, setStats] = useState({
    totalFloors: 0,
    uniqueSeries: 0,
    totalRooms: 0,
    hostelsCovered: 0,
    isLoading: true,
  });

  // Filters State
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [selectedHostelId, setSelectedHostelId] = useState<string>("all");

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset page to 1 on new search query
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await HostelFloorsApi.getHostelFloors({ limit: 1000 });
      const floorsList = res.data || [];
      
      const totalF = floorsList.length;
      const uniqueS = new Set(floorsList.map(f => f.room_number_series).filter(Boolean)).size;
      const totalR = floorsList.reduce((sum, f) => sum + (f.rooms?.length || 0), 0);
      const hostelsC = new Set(floorsList.map(f => f.hostel_id).filter(Boolean)).size;

      setStats({
        totalFloors: totalF,
        uniqueSeries: uniqueS,
        totalRooms: totalR,
        hostelsCovered: hostelsC,
        isLoading: false,
      });
    } catch (err) {
      console.error("Failed to load hostel floors summary stats:", err);
      setStats((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Fetch all hostels for dropdown filter
  const fetchHostelsList = useCallback(async () => {
    try {
      const res = await HostelApi.getHostels({ limit: 100 });
      if (res && res.data) {
        setHostels(res.data);
      }
    } catch (err) {
      console.error("Failed to load hostels list for filter dropdown:", err);
    }
  }, []);

  const fetchFloors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams: any = {
        page: currentPage,
        limit,
        sortBy: "floor_no",
        sortOrder: "ASC",
      };

      if (debouncedSearch.trim()) {
        queryParams.search = debouncedSearch.trim();
      }
      if (selectedHostelId !== "all") {
        queryParams.hostel_id = selectedHostelId;
      }

      const res = await HostelFloorsApi.getHostelFloors(queryParams);
      
      if (res && res.data) {
        setFloors(res.data);
        if (res.meta) {
          setTotalPages(res.meta.totalPages || 1);
          setTotal(res.meta.total || 0);
        }
      } else {
        throw new Error("Invalid response envelope returned from backend API.");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred while loading floors.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, debouncedSearch, selectedHostelId]);

  useEffect(() => {
    fetchHostelsList();
  }, [fetchHostelsList]);

  useEffect(() => {
    fetchFloors();
    fetchStats();
  }, [fetchFloors, fetchStats]);

  const handleHostelChange = useCallback((hostelId: string) => {
    setSelectedHostelId(hostelId);
    setCurrentPage(1);
  }, []);

  const handleReload = useCallback(() => {
    fetchFloors();
    fetchStats();
  }, [fetchFloors, fetchStats]);

  const handleDelete = async (id: string) => {
    const result = await showDeleteConfirm("This will delete all associated rooms and allotments.");
    if (!result.isConfirmed) return;

    showLoading("Deleting floor...", "Please wait");
    try {
      await HostelFloorsApi.deleteHostelFloor(id);
      closeLoading();
      await showSuccess("Deleted Successfully", "Record has been removed successfully.");
      fetchFloors();
      fetchStats();
    } catch (err: any) {
      closeLoading();
      showError("Delete Failed", err.message || "Failed to delete hostel floor.");
    }
  };

  return {
    floors,
    hostels,
    isLoading,
    error,
    stats,
    searchTerm,
    setSearchTerm,
    selectedHostelId,
    setSelectedHostelId: handleHostelChange,
    currentPage,
    setCurrentPage,
    totalPages,
    total,
    handleDelete,
    reload: handleReload,
  };
}
