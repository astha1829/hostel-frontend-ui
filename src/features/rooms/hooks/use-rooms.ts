import { useState, useEffect, useMemo } from "react";
import { RoomsApi } from "../api";
import { HostelRoom } from "../types";
import { HostelApi } from "../../hostels/api";
import { HostelFloor } from "../../hostel-floors/types";
import { Hostel } from "../../hostels/types";

export const useRooms = () => {
  const [rooms, setRooms] = useState<HostelRoom[]>([]);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [floors, setFloors] = useState<HostelFloor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [search, setSearch] = useState("");
  const [selectedHostelId, setSelectedHostelId] = useState("");
  const [selectedFloorId, setSelectedFloorId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [roomsList, hostelsList, floorsList] = await Promise.all([
        RoomsApi.getRooms(),
        HostelApi.getHostels({ limit: 100 }),
        RoomsApi.getFloorsList(),
      ]);
      setRooms(roomsList);
      setHostels(hostelsList.data);
      setFloors(floorsList);
    } catch (err: any) {
      setError(err.message || "Failed to retrieve rooms information.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered rooms computed property
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesHostel = !selectedHostelId || room.hostel_id === selectedHostelId;
      const matchesFloor = !selectedFloorId || room.hostel_floor_id === selectedFloorId;
      const matchesStatus = !selectedStatus || room.status?.toLowerCase() === selectedStatus.toLowerCase();
      
      const searchLower = search.toLowerCase();
      const matchesSearch = !search || 
        room.room_no.toLowerCase().includes(searchLower) ||
        room.room_type?.toLowerCase().includes(searchLower) ||
        room.hostel?.hostel_name?.toLowerCase().includes(searchLower);

      return matchesHostel && matchesFloor && matchesStatus && matchesSearch;
    });
  }, [rooms, search, selectedHostelId, selectedFloorId, selectedStatus]);

  // Filter floor options for dropdown selection based on selected hostel
  const filteredFloors = useMemo(() => {
    if (!selectedHostelId) return floors;
    return floors.filter((f) => f.hostel_id === selectedHostelId);
  }, [floors, selectedHostelId]);

  return {
    rooms: filteredRooms,
    allRoomsRaw: rooms,
    hostels,
    floors: filteredFloors,
    isLoading,
    error,
    search,
    setSearch,
    selectedHostelId,
    setSelectedHostelId: (id: string) => {
      setSelectedHostelId(id);
      setSelectedFloorId(""); // Reset floor selection when hostel changes
    },
    selectedFloorId,
    setSelectedFloorId,
    selectedStatus,
    setSelectedStatus,
    reload: loadData,
  };
};
