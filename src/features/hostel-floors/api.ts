import { http } from "@/lib/http";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { PaginatedResponse } from "@/types/api";
import {
  HostelFloor,
  HostelFloorQueryParams,
  CreateHostelFloorPayload,
  UpdateHostelFloorPayload,
} from "./types";

export const HostelFloorsApi = {
  /**
   * Fetch all hostel floors matching search or query filters.
   */
  getHostelFloors: async (
    params?: HostelFloorQueryParams
  ): Promise<PaginatedResponse<HostelFloor>> => {
    return await http.get<PaginatedResponse<HostelFloor>>(
      API_ENDPOINTS.HOSTEL_FLOORS.LIST,
      { params: params as any }
    );
  },

  /**
   * Fetch single hostel floor by database UUID.
   */
  getHostelFloorById: async (id: string): Promise<HostelFloor> => {
    return await http.get<HostelFloor>(
      API_ENDPOINTS.HOSTEL_FLOORS.DETAIL(id)
    );
  },

  /**
   * Create a new hostel floor record.
   */
  createHostelFloor: async (
    payload: CreateHostelFloorPayload
  ): Promise<HostelFloor> => {
    return await http.post<HostelFloor>(
      API_ENDPOINTS.HOSTEL_FLOORS.LIST,
      payload
    );
  },

  /**
   * Update hostel floor metadata.
   */
  updateHostelFloor: async (
    id: string,
    payload: UpdateHostelFloorPayload
  ): Promise<HostelFloor> => {
    return await http.patch<HostelFloor>(
      API_ENDPOINTS.HOSTEL_FLOORS.UPDATE(id),
      payload
    );
  },

  /**
   * Delete a hostel floor by UUID.
   */
  deleteHostelFloor: async (id: string): Promise<{ message: string }> => {
    return await http.delete<{ message: string }>(
      `${API_ENDPOINTS.HOSTEL_FLOORS.LIST}/${id}`
    );
  },
};
