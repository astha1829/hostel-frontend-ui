import { http } from "@/lib/http";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { PaginatedResponse } from "@/types/api";
import { HostelFloor } from "../hostel-floors/types";
import {
  HostelRoom,
  CreateHostelRoomPayload,
  UpdateHostelRoomPayload,
  HostelRoomQueryParams,
} from "./types";

export const RoomsApi = {
  /**
   * Fetches all rooms globally by fetching floors (which contain loaded nested rooms)
   * and flattening them on the client for full datagrid operations.
   */
  getRooms: async (): Promise<HostelRoom[]> => {
    const floorsRes = await http.get<PaginatedResponse<HostelFloor>>(
      API_ENDPOINTS.HOSTEL_FLOORS.LIST,
      { params: { limit: 100 } }
    );
    
    const rooms: HostelRoom[] = [];
    floorsRes.data.forEach((floor) => {
      if (floor.rooms) {
        floor.rooms.forEach((room) => {
          rooms.push({
            ...room,
            rent: Number(room.rent),
            floor: {
              id: floor.id,
              floor_no: floor.floor_no,
              room_number_series: floor.room_number_series,
              idx: floor.idx,
            } as any,
            hostel: floor.hostel,
          });
        });
      }
    });
    
    // Sort rooms by room number naturally
    return rooms.sort((a, b) => {
      const numA = parseInt(a.room_no, 10);
      const numB = parseInt(b.room_no, 10);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.room_no.localeCompare(b.room_no);
    });
  },

  /**
   * Helper to retrieve all floors for form selection.
   */
  getFloorsList: async (): Promise<HostelFloor[]> => {
    const res = await http.get<PaginatedResponse<HostelFloor>>(
      API_ENDPOINTS.HOSTEL_FLOORS.LIST,
      { params: { limit: 100 } }
    );
    return res.data;
  },

  /**
   * Fetches room details by dynamic database UUID.
   */
  getRoomById: async (id: string): Promise<HostelRoom> => {
    return await http.get<HostelRoom>(API_ENDPOINTS.HOSTEL_ROOMS.DETAIL(id));
  },

  /**
   * Registers a new room under a specific floor level.
   */
  createRoom: async (
    floorId: string,
    payload: CreateHostelRoomPayload
  ): Promise<HostelRoom> => {
    return await http.post<HostelRoom>(
      API_ENDPOINTS.HOSTEL_ROOMS.CREATE(floorId),
      payload
    );
  },

  /**
   * Updates room details.
   */
  updateRoom: async (
    id: string,
    payload: UpdateHostelRoomPayload
  ): Promise<HostelRoom> => {
    return await http.patch<HostelRoom>(
      API_ENDPOINTS.HOSTEL_ROOMS.UPDATE(id),
      payload
    );
  },

  /**
   * Deletes a room by UUID.
   */
  deleteRoom: async (id: string): Promise<{ message: string }> => {
    return await http.delete<{ message: string }>(
      API_ENDPOINTS.HOSTEL_ROOMS.DELETE(id)
    );
  },
};
