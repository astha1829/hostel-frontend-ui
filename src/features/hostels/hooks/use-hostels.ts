import { useState, useEffect, useCallback } from "react";
import { http } from "@/lib/http";
import { PaginatedResponse } from "@/types/api";
import { Hostel, HostelStatus, HostelFloor } from "../types";
import { HostelApi } from "../api";
import { showDeleteConfirm, showDeleteSuccess, showDeleteError, showLoading, closeLoading } from "@/utils/swal";

export function useHostels() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Directory Stats State
  const [stats, setStats] = useState({
    totalHostels: 0,
    activeHostels: 0,
    totalFloors: 0,
    totalRooms: 0,
    isLoading: true,
  });

  // Filters State
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedZone, setSelectedZone] = useState<string>("all");

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
      const [totalRes, activeRes, floorsRes] = await Promise.all([
        HostelApi.getHostels({ limit: 1 }),
        HostelApi.getHostels({ status: "active", limit: 1 }),
        http.get<PaginatedResponse<HostelFloor>>("/hostel-floors", {
          params: { limit: 1000 },
        }),
      ]);

      const totalH = totalRes.meta?.total || 0;
      const activeH = activeRes.meta?.total || 0;
      const floorsList = floorsRes.data || [];
      const totalF = floorsList.length;
      const totalR = floorsList.reduce((sum, floor) => sum + (floor.rooms?.length || 0), 0);

      setStats({
        totalHostels: totalH,
        activeHostels: activeH,
        totalFloors: totalF,
        totalRooms: totalR,
        isLoading: false,
      });
    } catch (err) {
      console.error("Failed to load hostel summary stats:", err);
      setStats((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const fetchHostels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams: any = {
        page: currentPage,
        limit,
      };

      if (debouncedSearch.trim()) {
        queryParams.search = debouncedSearch.trim();
      }
      if (selectedStatus !== "all") {
        queryParams.status = selectedStatus;
      }
      if (selectedZone !== "all") {
        queryParams.zone = selectedZone;
      }

      const res = await HostelApi.getHostels(queryParams);
      
      if (res && res.data) {
        setHostels(res.data);
        if (res.meta) {
          setTotalPages(res.meta.totalPages || 1);
          setTotal(res.meta.total || 0);
        }
      } else {
        throw new Error("Invalid response envelope returned from backend API.");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred while loading hostels.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, debouncedSearch, selectedStatus, selectedZone]);

  useEffect(() => {
    fetchHostels();
    fetchStats();
  }, [fetchHostels, fetchStats]);

  const handleStatusChange = useCallback((status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  }, []);

  const handleZoneChange = useCallback((zone: string) => {
    setSelectedZone(zone);
    setCurrentPage(1);
  }, []);

  const handleReload = useCallback(() => {
    fetchHostels();
    fetchStats();
  }, [fetchHostels, fetchStats]);

  const handleDelete = async (id: string) => {
    const result = await showDeleteConfirm();
    if (!result.isConfirmed) return;

    showLoading("Deleting...", "Please wait");
    try {
      await HostelApi.deleteHostel(id);
      closeLoading();
      await showDeleteSuccess();
      fetchHostels();
      fetchStats();
    } catch (err: any) {
      closeLoading();
      await showDeleteError();
    }
  };

  return {
    hostels,
    isLoading,
    error,
    stats,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus: handleStatusChange,
    selectedZone,
    setSelectedZone: handleZoneChange,
    currentPage,
    setCurrentPage,
    totalPages,
    total,
    handleDelete,
    reload: handleReload,
  };
}
