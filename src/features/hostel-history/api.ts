import { http } from "@/lib/http";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { PaginatedResponse } from "@/types/api";
import {
  HostelHistoryRow,
  CreateHostelHistoryPayload,
  UpdateHostelHistoryPayload,
  HostelOption,
} from "./types";

export const HostelHistoryApi = {
  /**
   * Fetch stay history entries for a specific room allotment
   */
  getHostelHistoryByRoomAllotment: async (
    roomAllotmentId: string
  ): Promise<PaginatedResponse<HostelHistoryRow>> => {
    return await http.get<PaginatedResponse<HostelHistoryRow>>(
      API_ENDPOINTS.HOSTEL_HISTORY.LIST,
      { params: { room_allotment_id: roomAllotmentId, limit: 1000 } }
    );
  },

  /**
   * Create a new stay history entry
   */
  createHostelHistory: async (
    payload: CreateHostelHistoryPayload
  ): Promise<HostelHistoryRow> => {
    return await http.post<HostelHistoryRow>(
      API_ENDPOINTS.HOSTEL_HISTORY.CREATE,
      payload
    );
  },

  /**
   * Update an existing stay history entry
   */
  updateHostelHistory: async (
    id: string,
    payload: UpdateHostelHistoryPayload
  ): Promise<HostelHistoryRow> => {
    return await http.patch<HostelHistoryRow>(
      API_ENDPOINTS.HOSTEL_HISTORY.UPDATE(id),
      payload
    );
  },

  /**
   * Delete a stay history entry by ID
   */
  deleteHostelHistory: async (id: string): Promise<{ message: string }> => {
    return await http.delete<{ message: string }>(
      API_ENDPOINTS.HOSTEL_HISTORY.DELETE(id)
    );
  },

  /**
   * Helper to retrieve list of hostels for dropdown selects
   */
  getHostels: async (): Promise<HostelOption[]> => {
    const res = await http.get<PaginatedResponse<HostelOption>>(
      API_ENDPOINTS.HOSTELS.LIST,
      { params: { limit: 100 } }
    );
    return res.data;
  },
};
